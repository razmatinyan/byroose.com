import { existsSync } from 'node:fs'
import { defineConfig } from 'drizzle-kit'

if (existsSync('.env')) {
	process.loadEnvFile()
}

export default defineConfig({
	dialect: 'postgresql',
	schema: './server/database/schema.ts',
	out: './server/database/migrations',
	casing: 'snake_case',
	dbCredentials: {
		url: process.env.NUXT_DATABASE_URL ?? '',
	},
})
