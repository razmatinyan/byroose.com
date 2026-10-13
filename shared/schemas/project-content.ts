import { z } from 'zod'

export const textBlockAligns = ['left', 'center', 'right'] as const
export const gridBlockColumns = [2, 3] as const

export type TextBlockAlign = (typeof textBlockAligns)[number]
export type GridBlockColumns = (typeof gridBlockColumns)[number]

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

export const projectBlockSchema = z.discriminatedUnion('type', [
	textBlockSchema,
	mediaBlockSchema,
	gridBlockSchema,
])

export const projectContentSchema = z.object({
	version: z.literal(1),
	blocks: z.array(projectBlockSchema).max(100),
})

export const projectResultSchema = z.object({
	label: z.string().trim().min(1).max(80),
	value: z.string().trim().min(1).max(20),
})

export type ProjectBlock = z.infer<typeof projectBlockSchema>
export type ProjectContent = z.infer<typeof projectContentSchema>
export type ProjectResult = z.infer<typeof projectResultSchema>
