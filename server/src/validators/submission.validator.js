const { z } = require('zod');

const createSubmissionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid competition ID format'),
  }),
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().max(2000).optional(),
    mediaUrl: z.string().url('Media URL must be a valid URL'),
    thumbnailUrl: z.string().url('Thumbnail URL must be a valid URL').optional(),
  }),
});

module.exports = {
  createSubmissionSchema,
};
