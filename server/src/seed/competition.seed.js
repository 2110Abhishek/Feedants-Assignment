const mongoose = require('mongoose');
const config = require('../config/env');
const User = require('../models/User');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Review = require('../models/Review');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(config.MONGODB_URI);
    console.log('[Seed] Connected.');

    // Clear existing collections
    await User.deleteMany({});
    await Competition.deleteMany({});
    await Registration.deleteMany({});
    await Review.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // 1. Create Admin User
    const adminPasswordHash = await User.hashPassword('admin123');
    const admin = await User.create({
      name: 'Feedants Admin',
      email: 'admin@feedants.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    });
    console.log('[Seed] Admin user created (admin@feedants.com / admin123)');

    // 2. Create Demo User (Abhishek - Registered as in reference screenshot)
    const userPasswordHash = await User.hashPassword('password123');
    const demoUser = await User.create({
      name: 'Abhishek',
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      role: 'USER',
      profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    });
    console.log('[Seed] Demo user created (user@example.com / password123)');

    // 3. Create Second Demo User (Riya - Not yet registered for testing registration flow)
    const guestUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      passwordHash: userPasswordHash,
      role: 'USER',
      profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    });
    console.log('[Seed] Second test user created (priya@example.com / password123)');

    // 4. Create Feedants Classical Dance Competition
    // Set dynamic timestamps matching screenshot countdown (~1 day, 6 hours, 28 mins)
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    const HOUR = 60 * 60 * 1000;
    const MINUTE = 60 * 1000;

    const registrationStartAt = new Date(now - 2 * DAY);
    const registrationEndAt = new Date(now + 1 * DAY + 6 * HOUR + 28 * MINUTE + 32 * 1000);
    const submissionStartAt = new Date(now - 12 * HOUR);
    const submissionEndAt = new Date(now + 20 * DAY);
    const resultDate = new Date(now + 25 * DAY);

    const competition = await Competition.create({
      title: 'Feedants Classical Dance',
      slug: 'feedants-classical-dance-2026',
      category: 'Dance',
      mode: 'MULTI_WIN',
      description:
        'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
      winnerCertificate: true,
      prizePool: 1500,
      entryFee: 99,
      currency: 'INR',
      capacity: 20,
      registeredCount: 1, // 1 registered (Abhishek), leaving 19 spots
      registrationStartAt,
      registrationEndAt,
      submissionStartAt,
      submissionEndAt,
      resultDate,
      status: 'PUBLISHED',
      judge: {
        name: 'Manju Dubey',
        designation: 'Professional Kathak Dancer',
        experienceYears: 12,
        profileImageUrl: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=300&q=80',
        introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      },
      judgingParameters: [
        { name: 'Technique', description: 'Accuracy of footwork, rhythm, and body posture', weight: 30 },
        { name: 'Expression', description: 'Abhinaya, facial expressions, and emotional conveyance', weight: 25 },
        { name: 'Creativity', description: 'Choreography, uniqueness, and artistic interpretation', weight: 25 },
        { name: 'Presentation', description: 'Costume, stage presence, and overall aesthetic appeal', weight: 20 },
      ],
      rules: [
        { title: 'Age Limit', description: 'Participant must be at least 12 years old' },
        { title: 'Authenticity', description: 'Video must be original and unedited performance' },
        { title: 'Single Entry', description: 'Only one submission is allowed per registered participant' },
        { title: 'Deadline', description: 'Submission must be uploaded before deadline' },
        { title: 'Attire', description: 'Proper classical dance attire and ghungroos are encouraged' },
      ],
      rewards: [
        { position: 1, amount: 550, title: '1st Winner' },
        { position: 2, amount: 300, title: '2nd Winner' },
        { position: 3, amount: 240, title: '3rd Winner' },
        { position: 4, amount: 200, title: '4th Winner' },
        { position: 5, amount: 130, title: '5th Winner' },
        { position: 6, amount: 80, title: '6th Winner' },
      ],
      previousWinners: [
        {
          name: 'Riya Shah',
          position: 1,
          imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        },
        {
          name: 'Aarav Mehta',
          position: 1,
          imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        },
        {
          name: 'Neha Verma',
          position: 2,
          imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        },
        {
          name: 'Ishita Chopra',
          position: 3,
          imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        },
      ],
      createdBy: admin._id,
    });
    console.log(`[Seed] Competition created: "${competition.title}" (ID: ${competition._id})`);

    // 5. Register Demo User Abhishek (Matches reference screenshot where user is already registered)
    await Registration.create({
      competitionId: competition._id,
      userId: demoUser._id,
      status: 'REGISTERED',
      entryFee: 99,
      paymentStatus: 'PAID',
      paymentReference: 'MOCK_SEED_RAZORPAY_101',
      registeredAt: new Date(now - 1 * DAY),
    });
    console.log(`[Seed] User Abhishek registered for competition.`);

    // 6. Add sample reviews
    await Review.create([
      {
        competitionId: competition._id,
        userId: demoUser._id,
        rating: 5,
        comment: 'Incredible platform for dancers! The judging was completely transparent and timely.',
      },
      {
        competitionId: competition._id,
        userId: guestUser._id,
        rating: 5,
        comment: 'Great exposure and lovely community. Feedants certificate was verified and official.',
      },
    ]);
    console.log('[Seed] Participant reviews created.');

    console.log('\n=========================================');
    console.log('SEED COMPLETED SUCCESSFULLY!');
    console.log('Competition ID:', competition._id.toString());
    console.log('Registered User: user@example.com / password123');
    console.log('Unregistered User: priya@example.com / password123');
    console.log('Admin User: admin@feedants.com / admin123');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
