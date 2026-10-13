import { AwsClient } from 'aws4fetch'
import type { H3Event } from 'h3'

const uploadUrlLifetimeSeconds = 600

export interface MediaUpload {
	key: string
	contentType: string
	size: number
}

export interface StoredMediaObject {
	contentType: string
	size: number
}

function useMediaBucket(event: H3Event) {
	const { r2 } = useRuntimeConfig(event)

	if (!r2.accountId || !r2.accessKeyId || !r2.secretAccessKey || !r2.bucket) {
		throw new Error('NUXT_R2 configuration is incomplete')
	}

	const client = new AwsClient({
		accessKeyId: r2.accessKeyId,
		secretAccessKey: r2.secretAccessKey,
		service: 's3',
		region: 'auto',
	})
	const bucketUrl = `https://${r2.accountId}.r2.cloudflarestorage.com/${r2.bucket}`

	return {
		client,
		objectUrl: (key: string) => `${bucketUrl}/${key.split('/').map(encodeURIComponent).join('/')}`,
	}
}

export async function createMediaUploadUrl(event: H3Event, { key, contentType, size }: MediaUpload) {
	const { client, objectUrl } = useMediaBucket(event)
	const url = new URL(objectUrl(key))
	url.searchParams.set('X-Amz-Expires', String(uploadUrlLifetimeSeconds))

	const signed = await client.sign(url.toString(), {
		method: 'PUT',
		headers: {
			'Content-Type': contentType,
			'Content-Length': String(size),
		},
		aws: { signQuery: true, allHeaders: true },
	})

	return signed.url
}

export async function findMediaObject(event: H3Event, key: string): Promise<StoredMediaObject | null> {
	const { client, objectUrl } = useMediaBucket(event)
	const response = await client.fetch(objectUrl(key), { method: 'HEAD' })

	if (response.status === 404) {
		return null
	}

	if (!response.ok) {
		throw new Error(`R2 HEAD failed with status ${response.status}`)
	}

	return {
		contentType: response.headers.get('Content-Type') ?? '',
		size: Number(response.headers.get('Content-Length') ?? 0),
	}
}

export async function deleteMediaObject(event: H3Event, key: string) {
	const { client, objectUrl } = useMediaBucket(event)
	const response = await client.fetch(objectUrl(key), { method: 'DELETE' })

	if (!response.ok && response.status !== 404) {
		throw new Error(`R2 DELETE failed with status ${response.status}`)
	}
}
