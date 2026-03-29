import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().min(1, 'Description is required').max(500),
  techStack: z.array(z.string()).min(1, 'Add at least one technology'),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  coverImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0),
})

export type ProjectFormValues = z.infer<typeof projectSchema>
