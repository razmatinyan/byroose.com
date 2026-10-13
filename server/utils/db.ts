import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import type { H3Event } from 'h3'

export function useDb(event: H3Event) {
	const { databaseUrl } = useRuntimeConfig(event)

	if (!databaseUrl) {
		throw new Error('NUXT_DATABASE_URL is not set')
	}

	return drizzle({ client: neon(databaseUrl), casing: 'snake_case' })
}
