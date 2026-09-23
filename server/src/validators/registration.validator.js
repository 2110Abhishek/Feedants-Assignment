const { z } = require('zod');

const registerCompetitionParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid competition ID format'),
  }),
  body: z.object({
    // Client may optionally pass mock payment method info, but MUST NOT specify fee or status
    paymentMethod: z.string().optional(),
    mockPaymentSuccess: z.boolean().optional().default(true),
  }),
});

module.exports = {
  registerCompetitionParamSchema,
};
