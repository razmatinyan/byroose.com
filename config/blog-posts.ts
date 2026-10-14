import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export interface PublishedPost {
	path: string
	date: string
}

const blogDirectory = join(import.meta.dirname, '..', 'content', 'blog')

function frontmatterOf(source: string) {
	return source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
}

function isDraft(frontmatter: string) {
	return /^draft:\s*true\s*$/m.test(frontmatter)
}

function dateOf(frontmatter: string) {
	return frontmatter.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m)?.[1] ?? ''
}

export function listPublishedPosts(): PublishedPost[] {
	if (!existsSync(blogDirectory)) return []

	const files = readdirSync(blogDirectory, { withFileTypes: true }).filter(
		(entry) => entry.isFile() && entry.name.endsWith('.md'),
	)

	return files.flatMap((file) => {
		const frontmatter = frontmatterOf(readFileSync(join(blogDirectory, file.name), 'utf8'))
		if (isDraft(frontmatter)) return []

		return [{ path: `/blog/${file.name.replace(/\.md$/, '')}`, date: dateOf(frontmatter) }]
	})
}
