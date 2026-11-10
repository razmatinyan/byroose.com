import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

export interface PageLastmod {
	loc: string
	lastmod: string
}

const rootDirectory = join(import.meta.dirname, '..')

const blogListingSources = ['app/components/blog', 'app/lib/blog-articles.ts', 'app/lib/blog-categories.ts']

const staticPageSources: Record<string, readonly string[]> = {
	'/': ['app/pages/index.vue', 'app/components/landing', 'app/lib/site.ts'],
	'/about': ['app/pages/about.vue', 'app/components/about'],
	'/services': ['app/pages/services/index.vue', 'app/components/services'],
	'/work': ['app/pages/work/index.vue', 'app/components/work', 'app/data/projects'],
	'/blog': ['app/pages/blog/index.vue', ...blogListingSources],
	'/blog/ai-content': ['app/pages/blog/ai-content.vue', ...blogListingSources],
	'/blog/web-development': ['app/pages/blog/web-development.vue', ...blogListingSources],
	'/contact': ['app/pages/contact.vue', 'app/components/contact'],
	'/privacy': ['app/pages/privacy.vue', 'app/components/legal', 'content/legal/privacy.md'],
}

function lastCommitDate(sources: readonly string[]) {
	try {
		return execFileSync('git', ['log', '-1', '--format=%cs', '--', ...sources], {
			cwd: rootDirectory,
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		}).trim()
	}
	catch {
		return ''
	}
}

function projectPageSources() {
	const workDirectory = join(rootDirectory, 'app', 'pages', 'work')
	if (!existsSync(workDirectory)) return {}

	const slugs = readdirSync(workDirectory)
		.filter((file) => file.endsWith('.vue') && file !== 'index.vue')
		.map((file) => file.replace(/\.vue$/, ''))

	return Object.fromEntries(
		slugs.map((slug) => [
			`/work/${slug}`,
			[`app/pages/work/${slug}.vue`, `app/data/projects/${slug}.ts`, `public/images/work/${slug}`],
		]),
	)
}

export function listPageLastmods(): PageLastmod[] {
	const sources = { ...staticPageSources, ...projectPageSources() }

	return Object.entries(sources).flatMap(([loc, paths]) => {
		const lastmod = lastCommitDate(paths)
		return lastmod ? [{ loc, lastmod }] : []
	})
}
