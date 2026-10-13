import { mediaTypes, mediaUploadRequestSchema } from '#shared/schemas/media'

export default defineEventHandler(async (event) => {
	await requireUserSession(event)
	const { contentType, size } = await readValidatedBody(event, mediaUploadRequestSchema.parse)

	const key = `media/${crypto.randomUUID()}.${mediaTypes[contentType].extension}`
	const uploadUrl = await createMediaUploadUrl(event, { key, contentType, size })

	return { key, uploadUrl }
})
