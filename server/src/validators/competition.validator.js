const { z } = require('zod');

const competitionIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid competition ID format'),
  }),
});

const createCompetitionSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    category: z.string().default('Dance'),
    mode: z.enum(['SINGLE_WIN', 'MULTI_WIN']).default('MULTI_WIN'),
    description: z.string().min(10),
    winnerCertificate: z.boolean().default(true),
    prizePool: z.number().nonnegative(),
    entryFee: z.number().nonnegative(),
    currency: z.string().default('INR'),
    capacity: z.number().int().positive(),
    registrationStartAt: z.string().datetime(),
    registrationEndAt: z.string().datetime(),
    submissionStartAt: z.string().datetime(),
    submissionEndAt: z.string().datetime(),
    resultDate: z.string().datetime(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'COMPLETED']).default('PUBLISHED'),
    judge: z.object({
      name: z.string(),
      designation: z.string(),
      experienceYears: z.number(),
      profileImageUrl: z.string().url(),
      introVideoUrl: z.string().url().optional(),
    }),
    judgingParameters: z.array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        weight: z.number(),
      })
    ).optional(),
    rules: z.array(
      z.object({
        title: z.string().optional(),
        description: z.string(),
      })
    ).optional(),
    rewards: z.array(
      z.object({
        position: z.number(),
        amount: z.number(),
        title: z.string().optional(),
      })
    ).optional(),
    previousWinners: z.array(
      z.object({
        name: z.string(),
        position: z.number(),
        imageUrl: z.string().url(),
        videoUrl: z.string().url().optional(),
      })
    ).optional(),
  }),
});

module.exports = {
  competitionIdParamSchema,
  createCompetitionSchema,
};
