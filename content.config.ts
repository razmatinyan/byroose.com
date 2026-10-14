import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
	collections: {
		blog: defineCollection({
			type: 'page',
			source: 'blog/*.md',
			schema: z.object({
				date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
				category: z.enum(['AI content creation', 'Web development']),
				cover: z.object({
					src: z.string(),
					width: z.number(),
					height: z.number(),
					alt: z.string(),
				}),
				author: z
					.object({
						name: z.string(),
						role: z.string().optional(),
						image: z.string().optional(),
					})
					.optional(),
				draft: z.boolean().default(false),
			}),
		}),
	},
})
