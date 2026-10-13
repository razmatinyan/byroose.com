import { z } from 'zod'

export const textBlockAligns = ['left', 'center', 'right'] as const
export const gridBlockColumns = [2, 3] as const
export const resultsBlockTones = ['primary', 'blue', 'green', 'pink', 'yellow', 'dark'] as const
export const resultsBlockMaxItems = 6

export type TextBlockAlign = (typeof textBlockAligns)[number]
export type GridBlockColumns = (typeof gridBlockColumns)[number]
export type ResultsBlockTone = (typeof resultsBlockTones)[number]

const blockId = z.uuid()
const altText = z.string().trim().max(250)

const textBlockSchema = z
	.object({
		id: blockId,
		type: z.literal('text'),
		title: z.string().trim().max(200),
		body: z.string().trim().max(10000),
		align: z.enum(textBlockAligns),
	})
	.refine(({ title, body }) => title.length > 0 || body.length > 0, {
		message: 'A text block needs a subtitle or text',
	})

const mediaBlockSchema = z.object({
	id: blockId,
	type: z.literal('media'),
	assetId: z.uuid(),
	alt: altText,
})

const gridBlockSchema = z.object({
	id: blockId,
	type: z.literal('grid'),
	columns: z.union([z.literal(2), z.literal(3)]),
	items: z
		.array(z.object({ assetId: z.uuid(), alt: altText }))
		.min(2)
		.max(12),
})

export const projectResultSchema = z.object({
	label: z.string().trim().min(1).max(80),
	value: z.string().trim().min(1).max(20),
})

const resultsBlockSchema = z.object({
	id: blockId,
	type: z.literal('results'),
	tone: z.enum(resultsBlockTones),
	items: z.array(projectResultSchema).min(1).max(resultsBlockMaxItems),
})

export const projectBlockSchema = z.discriminatedUnion('type', [
	textBlockSchema,
	mediaBlockSchema,
	gridBlockSchema,
	resultsBlockSchema,
])

export const projectContentSchema = z.object({
	version: z.literal(1),
	blocks: z.array(projectBlockSchema).max(100),
})

export type ProjectBlock = z.infer<typeof projectBlockSchema>
export type ProjectContent = z.infer<typeof projectContentSchema>
export type ProjectResult = z.infer<typeof projectResultSchema>
