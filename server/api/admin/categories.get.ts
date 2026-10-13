import { asc } from 'drizzle-orm'
import { categories } from '../../database/schema'

export default defineEventHandler(async (event) => {
	await requireUserSession(event)

	return useDb(event)
		.select({ id: categories.id, name: categories.name, service: categories.service })
		.from(categories)
		.orderBy(asc(categories.name))
})
