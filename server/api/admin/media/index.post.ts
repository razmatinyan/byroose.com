import { isMediaContentType, mediaAssetCreateSchema, mediaTypes } from '#shared/schemas/media'
import type { MediaAsset } from '#shared/schemas/media'
import { mediaAssets } from '../../../database/schema'

export default defineEventHandler(async (event): Promise<MediaAsset> => {
	await requireUserSession(event)
	const { key, width, height, durationSeconds } = await readValidatedBody(event, mediaAssetCreateSchema.parse)

	const stored = await findMediaObject(event, key)

	if (!stored || !isMediaContentType(stored.contentType) || stored.size > mediaTypes[stored.contentType].maxBytes) {
		throw createError({ statusCode: 422, statusMessage: 'Uploaded file was not found or is not allowed' })
	}

	const kind = mediaTypes[stored.contentType].kind
	const [asset] = await useDb(event)
		.insert(mediaAssets)
		.values({
			key,
			kind,
			contentType: stored.contentType,
			size: stored.size,
			width,
			height,
			durationSeconds: kind === 'video' ? durationSeconds : null,
		})
		.onConflictDoNothing({ target: mediaAssets.key })
		.returning({
			id: mediaAssets.id,
			key: mediaAssets.key,
			kind: mediaAssets.kind,
			width: mediaAssets.width,
			height: mediaAssets.height,
			durationSeconds: mediaAssets.durationSeconds,
		})

	if (!asset) {
		throw createError({ statusCode: 409, statusMessage: 'This file is already registered' })
	}

	return asset
})
