import { z } from 'zod'

export const slugPattern = '^[a-z0-9]+(-[a-z0-9]+)*$'
export const reservedProjectSlugs: readonly string[] = ['new']

const maxSlugLength = 80

export const projectSlugSchema = z
	.string()
	.max(maxSlugLength)
	.regex(new RegExp(slugPattern))
	.refine((slug) => !reservedProjectSlugs.includes(slug), 'This slug is reserved')

function trimToWord(slug: string) {
	if (slug.length <= maxSlugLength) return slug

	const cut = slug.slice(0, maxSlugLength)
	const lastHyphen = cut.lastIndexOf('-')
	return lastHyphen > 0 ? cut.slice(0, lastHyphen) : cut
}

export function slugify(value: string) {
	const slug = value
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replaceAll('&', ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')

	return trimToWord(slug)
}

export function projectSlugFromName(name: string) {
	const slug = slugify(name)
	return reservedProjectSlugs.includes(slug) ? `${slug}-project` : slug
}
