import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tone = z.enum(['red', 'orange', 'yellow', 'pink', 'green', 'blue', 'purple', 'gray']);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    summary: z.string(),
    tags: z.array(z.object({ label: z.string(), tone: tone.default('gray') })).default([]),
    cover: z.string(),
    coverAlt: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    archive: z.boolean().default(false),
    year: z.string().optional(),
    // Set when the case study is written in this repo; otherwise `href` is used.
    migrated: z.boolean().default(false),
    href: z.string().optional(),
    external: z.boolean().default(false),
    meta: z
      .object({ role: z.string(), launched: z.string(), audience: z.string(), whenLabel: z.string().default('Launched') })
      .optional(),
    link: z.object({ label: z.string(), href: z.string() }).optional(),
    next: z.string().optional(),
  }),
});

export const collections = { projects };
