import { z } from 'zod'

export const slugPattern = '^[a-z0-9]+(-[a-z0-9]+)*$'
export const reservedProjectSlugs: readonly string[] = ['new']

export const projectSlugSchema = z
	.string()
	.max(80)
	.regex(new RegExp(slugPattern))
	.refine((slug) => !reservedProjectSlugs.includes(slug), 'This slug is reserved')
