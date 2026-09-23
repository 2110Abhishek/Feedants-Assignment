const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const Review = require('../models/Review');
const { calculateLifecycle, getCompetitionAction } = require('../utils/lifecycle');
const { AppError } = require('../utils/errors');

const getCompetitionById = async (competitionId, user = null) => {
  const competition = await Competition.findById(competitionId);
  if (!competition) {
    throw new AppError('Competition not found', 404, 'COMPETITION_NOT_FOUND');
  }

  // Derive dynamic lifecycle and spots remaining
  const lifecycle = calculateLifecycle(competition);
  const spotsRemaining = Math.max(0, competition.capacity - competition.registeredCount);

  // User state
  let userState = {
    isAuthenticated: !!user,
    isRegistered: false,
    registrationId: null,
    registrationStatus: null,
    submissionStatus: null,
    submissionId: null,
  };

  if (user) {
    const registration = await Registration.findOne({
      competitionId: competition._id,
      userId: user._id,
    });

    if (registration) {
      userState.isRegistered = registration.status === 'REGISTERED';
      userState.registrationId = registration._id;
      userState.registrationStatus = registration.status;

      const submission = await Submission.findOne({
        competitionId: competition._id,
        userId: user._id,
      });

      if (submission) {
        userState.submissionStatus = submission.status;
        userState.submissionId = submission._id;
      }
    }
  }

  // Derive CTA action for frontend convenience
  const cta = getCompetitionAction({
    lifecycle,
    isRegistered: userState.isRegistered,
    spotsRemaining,
    submissionStatus: userState.submissionStatus,
  });

  return {
    competition: {
      id: competition._id,
      title: competition.title,
      slug: competition.slug,
      category: competition.category,
      mode: competition.mode,
      description: competition.description,
      winnerCertificate: competition.winnerCertificate,
      prizePool: competition.prizePool,
      entryFee: competition.entryFee,
      currency: competition.currency,
      capacity: competition.capacity,
      registeredCount: competition.registeredCount,
      spotsRemaining,
      lifecycle,
      registrationStartAt: competition.registrationStartAt,
      registrationEndAt: competition.registrationEndAt,
      submissionStartAt: competition.submissionStartAt,
      submissionEndAt: competition.submissionEndAt,
      resultDate: competition.resultDate,
      judge: competition.judge,
      previousWinners: competition.previousWinners,
      judgingParameters: competition.judgingParameters,
      rules: competition.rules,
      rewards: competition.rewards,
      createdAt: competition.createdAt,
      updatedAt: competition.updatedAt,
    },
    userState: {
      ...userState,
      cta,
    },
  };
};

const listCompetitions = async (query = {}) => {
  const { category, status, limit = 20, page = 1 } = query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;

  const competitions = await Competition.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return competitions.map((comp) => ({
    id: comp._id,
    title: comp.title,
    category: comp.category,
    prizePool: comp.prizePool,
    entryFee: comp.entryFee,
    currency: comp.currency,
    capacity: comp.capacity,
    registeredCount: comp.registeredCount,
    spotsRemaining: Math.max(0, comp.capacity - comp.registeredCount),
    lifecycle: calculateLifecycle(comp),
    registrationEndAt: comp.registrationEndAt,
    submissionEndAt: comp.submissionEndAt,
    judge: comp.judge,
    winnerCertificate: comp.winnerCertificate,
  }));
};

const getCompetitionResults = async (competitionId) => {
  const competition = await Competition.findById(competitionId);
  if (!competition) {
    throw new AppError('Competition not found', 404, 'COMPETITION_NOT_FOUND');
  }

  return {
    competitionId: competition._id,
    title: competition.title,
    results: (competition.previousWinners || []).map((w) => ({
      position: w.position,
      name: w.name,
      imageUrl: w.imageUrl,
      videoUrl: w.videoUrl,
      prize: competition.rewards.find((r) => r.position === w.position)?.amount || 0,
    })),
  };
};

const getCompetitionReviews = async (competitionId) => {
  const reviews = await Review.find({ competitionId })
    .populate('userId', 'name profileImageUrl')
    .sort({ createdAt: -1 })
    .limit(20);

  return reviews.map((r) => ({
    id: r._id,
    user: {
      name: r.userId ? r.userId.name : 'Participant',
      profileImageUrl: r.userId ? r.userId.profileImageUrl : null,
    },
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
  }));
};

module.exports = {
  getCompetitionById,
  listCompetitions,
  getCompetitionResults,
  getCompetitionReviews,
};
