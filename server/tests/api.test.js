const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const config = require('../src/config/env');
const app = require('../src/app');
const User = require('../src/models/User');
const Competition = require('../src/models/Competition');
const Registration = require('../src/models/Registration');
const Submission = require('../src/models/Submission');

// Helper to make test HTTP calls using Node native fetch
let serverInstance;
let baseUrl;

test.before(async () => {
  await mongoose.connect(config.MONGODB_URI);
  await new Promise((resolve) => {
    serverInstance = app.listen(0, () => {
      const port = serverInstance.address().port;
      baseUrl = `http://127.0.0.1:${port}/api/v1`;
      resolve();
    });
  });
});

test.after(async () => {
  await mongoose.disconnect();
  if (serverInstance) {
    await new Promise((resolve) => serverInstance.close(resolve));
  }
});

test('API Test Suite', async (t) => {
  let authToken;
  let testUser;
  let testComp;

  await t.test('1. Auth - Register & Login', async () => {
    // Register
    const email = `test_api_${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'API Tester',
        email,
        password: 'password123',
      }),
    });
    const regJson = await regRes.json();
    assert.strictEqual(regRes.status, 201);
    assert.strictEqual(regJson.success, true);
    assert.ok(regJson.data.accessToken);

    authToken = regJson.data.accessToken;
    testUser = regJson.data.user;

    // Login with bad password
    const badLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'wrong' }),
    });
    assert.strictEqual(badLoginRes.status, 401);

    // Get Me
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const meJson = await meRes.json();
    assert.strictEqual(meRes.status, 200);
    assert.strictEqual(meJson.data.user.email, email);
  });

  await t.test('2. Competition - Details, Lifecycle, and Guest view', async () => {
    const now = Date.now();
    testComp = await Competition.create({
      title: 'Integration Test Classical Dance',
      slug: `int-test-dance-${Date.now()}`,
      category: 'Dance',
      mode: 'MULTI_WIN',
      description: 'Test competition description',
      prizePool: 1500,
      entryFee: 99,
      capacity: 5,
      registeredCount: 0,
      registrationStartAt: new Date(now - 3600 * 1000),
      registrationEndAt: new Date(now + 86400 * 1000),
      submissionStartAt: new Date(now - 1800 * 1000),
      submissionEndAt: new Date(now + 86400 * 2 * 1000),
      resultDate: new Date(now + 86400 * 5 * 1000),
      status: 'PUBLISHED',
      judge: {
        name: 'Manju Dubey',
        designation: 'Professional Kathak Dancer',
        experienceYears: 12,
        profileImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      },
    });

    // Guest request (No Auth Header)
    const guestRes = await fetch(`${baseUrl}/competitions/${testComp._id}`);
    const guestJson = await guestRes.json();
    assert.strictEqual(guestRes.status, 200);
    assert.strictEqual(guestJson.data.competition.title, 'Integration Test Classical Dance');
    assert.strictEqual(guestJson.data.userState.isAuthenticated, false);
    assert.strictEqual(guestJson.data.userState.isRegistered, false);
    assert.strictEqual(guestJson.data.competition.spotsRemaining, 5);
    assert.strictEqual(guestJson.data.competition.lifecycle, 'REGISTRATION_OPEN');

    // Authenticated request
    const authRes = await fetch(`${baseUrl}/competitions/${testComp._id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const authJson = await authRes.json();
    assert.strictEqual(authRes.status, 200);
    assert.strictEqual(authJson.data.userState.isAuthenticated, true);
    assert.strictEqual(authJson.data.userState.isRegistered, false);
    assert.strictEqual(authJson.data.userState.cta.action, 'REGISTER');
  });

  await t.test('3. Registration - Slot booking, Duplicate Prevention', async () => {
    // Unauthenticated registration fails
    const noAuthReg = await fetch(`${baseUrl}/competitions/${testComp._id}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    assert.strictEqual(noAuthReg.status, 401);

    // Authenticated registration succeeds
    const regRes = await fetch(`${baseUrl}/competitions/${testComp._id}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ mockPaymentSuccess: true }),
    });
    const regJson = await regRes.json();
    assert.strictEqual(regRes.status, 201);
    assert.strictEqual(regJson.data.status, 'REGISTERED');
    assert.strictEqual(regJson.data.spotsRemaining, 4);

    // Duplicate registration rejected with 409 ALREADY_REGISTERED
    const dupRes = await fetch(`${baseUrl}/competitions/${testComp._id}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({}),
    });
    const dupJson = await dupRes.json();
    assert.strictEqual(dupRes.status, 409);
    assert.strictEqual(dupJson.error.code, 'ALREADY_REGISTERED');

    // Check user state updated
    const stateRes = await fetch(`${baseUrl}/competitions/${testComp._id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const stateJson = await stateRes.json();
    assert.strictEqual(stateJson.data.userState.isRegistered, true);
  });

  await t.test('4. Submissions - Upload and Fetch', async () => {
    const subRes = await fetch(`${baseUrl}/competitions/${testComp._id}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: 'My Classical Kathak Performance',
        description: 'Choreographed piece showcasing teental nritta',
        mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      }),
    });
    const subJson = await subRes.json();
    assert.strictEqual(subRes.status, 201);
    assert.strictEqual(subJson.data.submission.status, 'SUBMITTED');

    // Fetch my submission
    const getSubRes = await fetch(`${baseUrl}/competitions/${testComp._id}/submissions/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const getSubJson = await getSubRes.json();
    assert.strictEqual(getSubRes.status, 200);
    assert.strictEqual(getSubJson.data.submission.title, 'My Classical Kathak Performance');
  });

  await t.test('5. System - Server Time', async () => {
    const timeRes = await fetch(`${baseUrl}/system/time`);
    const timeJson = await timeRes.json();
    assert.strictEqual(timeRes.status, 200);
    assert.ok(timeJson.data.serverTime);
  });
});
