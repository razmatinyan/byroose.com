import { z } from 'zod'

export const mediaContentTypes = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/avif',
	'image/gif',
	'video/mp4',
	'video/webm',
] as const

export type MediaContentType = (typeof mediaContentTypes)[number]
export type MediaKind = 'image' | 'video'

const imageMaxBytes = 25 * 1024 * 1024
const videoMaxBytes = 200 * 1024 * 1024

export const mediaTypes: Readonly<
	Record<MediaContentType, { kind: MediaKind; extension: string; maxBytes: number }>
> = {
	'image/jpeg': { kind: 'image', extension: 'jpg', maxBytes: imageMaxBytes },
	'image/png': { kind: 'image', extension: 'png', maxBytes: imageMaxBytes },
	'image/webp': { kind: 'image', extension: 'webp', maxBytes: imageMaxBytes },
	'image/avif': { kind: 'image', extension: 'avif', maxBytes: imageMaxBytes },
	'image/gif': { kind: 'image', extension: 'gif', maxBytes: imageMaxBytes },
	'video/mp4': { kind: 'video', extension: 'mp4', maxBytes: videoMaxBytes },
	'video/webm': { kind: 'video', extension: 'webm', maxBytes: videoMaxBytes },
}

export function mediaAcceptFor(kinds: readonly MediaKind[]) {
	return mediaContentTypes.filter((type) => kinds.includes(mediaTypes[type].kind)).join(',')
}

export function isMediaContentType(value: string): value is MediaContentType {
	return mediaContentTypes.some((type) => type === value)
}

export const mediaUploadRequestSchema = z
	.object({
		contentType: z.enum(mediaContentTypes),
		size: z.int().positive(),
	})
	.refine(({ contentType, size }) => size <= mediaTypes[contentType].maxBytes, {
		message: 'File is too large',
		path: ['size'],
	})

export const mediaAssetCreateSchema = z.object({
	key: z.string().regex(/^media\/[0-9a-f-]{36}\.(jpg|png|webp|avif|gif|mp4|webm)$/),
	width: z.int().positive().max(20000),
	height: z.int().positive().max(20000),
	durationSeconds: z.number().positive().max(36000).nullable(),
})

export interface MediaAsset {
	id: string
	key: string
	kind: MediaKind
	width: number
	height: number
	durationSeconds: number | null
}
