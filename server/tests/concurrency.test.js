const mongoose = require('mongoose');
const assert = require('assert');
const config = require('../src/config/env');
const User = require('../src/models/User');
const Competition = require('../src/models/Competition');
const Registration = require('../src/models/Registration');
const { registerUserForCompetition } = require('../src/services/registration.service');

async function runConcurrencyTest() {
  console.log('\n======================================================');
  console.log('CRITICAL CONCURRENCY TEST: 20 USERS FOR 1 REMAINING SPOT');
  console.log('======================================================\n');

  await mongoose.connect(config.MONGODB_URI);

  // Clean up any test records
  await User.deleteMany({ email: /test_concurrent_user_/ });
  await Competition.deleteMany({ slug: 'concurrency-stress-test' });
  await Registration.deleteMany({});

  const now = new Date();
  const DAY = 24 * 3600 * 1000;

  // 1. Create a competition with capacity = 10, registeredCount = 9 (Only 1 slot left!)
  const testComp = await Competition.create({
    title: 'High Concurrency Classical Dance',
    slug: 'concurrency-stress-test',
    category: 'Dance',
    mode: 'MULTI_WIN',
    description: 'Concurrency stress testing competition with 1 slot available.',
    prizePool: 1000,
    entryFee: 99,
    capacity: 10,
    registeredCount: 9, // ONLY 1 SPOT LEFT
    registrationStartAt: new Date(now.getTime() - DAY),
    registrationEndAt: new Date(now.getTime() + DAY),
    submissionStartAt: new Date(now.getTime() + 2 * DAY),
    submissionEndAt: new Date(now.getTime() + 5 * DAY),
    resultDate: new Date(now.getTime() + 7 * DAY),
    status: 'PUBLISHED',
    judge: {
      name: 'Test Judge',
      designation: 'Master Dancer',
      experienceYears: 10,
      profileImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
  });

  console.log(`[Setup] Competition created: Capacity=${testComp.capacity}, Initial Registered=${testComp.registeredCount}, Spots Left=1`);

  // 2. Pre-create 20 distinct users
  console.log('[Setup] Pre-creating 20 distinct test users...');
  const users = [];
  const dummyPasswordHash = await User.hashPassword('testpassword123');

  for (let i = 1; i <= 20; i++) {
    const user = await User.create({
      name: `Concurrent User ${i}`,
      email: `test_concurrent_user_${i}_${Date.now()}@example.com`,
      passwordHash: dummyPasswordHash,
      role: 'USER',
    });
    users.push(user);
  }

  console.log(`[Test] Firing 20 SIMULTANEOUS registration requests via Promise.all...`);

  const results = await Promise.allSettled(
    users.map((user) => registerUserForCompetition(testComp._id, user))
  );

  let successCount = 0;
  let rejectedCount = 0;
  let fullErrors = 0;

  results.forEach((res, index) => {
    if (res.status === 'fulfilled') {
      successCount++;
      console.log(`-> User ${index + 1}: SUCCESS - Slot Acquired! Registration ID: ${res.value.registrationId}`);
    } else {
      rejectedCount++;
      const err = res.reason;
      if (err.code === 'COMPETITION_FULL') {
        fullErrors++;
      }
      console.log(`-> User ${index + 1}: REJECTED - Code: ${err.code} (${err.message})`);
    }
  });

  // 3. Inspect final state in database
  const updatedComp = await Competition.findById(testComp._id);
  const totalRegistrations = await Registration.countDocuments({ competitionId: testComp._id });

  console.log('\n----------------- VERIFICATION RESULTS -----------------');
  console.log(`Total Requests Sent:    20`);
  console.log(`Successful Bookings:    ${successCount}  (Expected: 1)`);
  console.log(`Rejected Requests:      ${rejectedCount} (Expected: 19)`);
  console.log(`COMPETITION_FULL Rejections: ${fullErrors} (Expected: 19)`);
  console.log(`Final Registered Count in DB: ${updatedComp.registeredCount} (Capacity: 10, Expected: 10)`);
  console.log(`Total Registration Documents: ${totalRegistrations} (Expected: 1)`);

  // Assertions
  assert.strictEqual(successCount, 1, 'CRITICAL FAILURE: Exactly ONE user must win the slot!');
  assert.strictEqual(rejectedCount, 19, 'CRITICAL FAILURE: Exactly 19 users must be rejected!');
  assert.strictEqual(updatedComp.registeredCount, 10, 'CRITICAL FAILURE: Competition capacity must strictly equal 10!');
  assert.ok(updatedComp.registeredCount <= testComp.capacity, 'CRITICAL FAILURE: Database allowed overselling beyond capacity!');
  assert.strictEqual(totalRegistrations, 1, 'CRITICAL FAILURE: Only one registration document should be persisted!');

  console.log('\n>>> SUCCESS: Zero Race Conditions! Atomic reservation verified. <<<\n');

  await mongoose.disconnect();
  process.exit(0);
}

runConcurrencyTest().catch((err) => {
  console.error('\n[Test Failed with Error]:', err);
  process.exit(1);
});
