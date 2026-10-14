import { queryCollection } from '@nuxt/content/server'
import { projects } from '../../app/data/projects'
import { pageSeo } from '../../app/lib/page-seo'
import {
	siteDescription,
	siteEmail,
	siteHeadquartersLabel,
	siteName,
	siteSlogan,
	siteUrl,
} from '../../app/lib/site'

function link(name: string, path: string, description: string) {
	return `- [${name}](${new URL(path, siteUrl).href}): ${description}`
}

function section(title: string, lines: readonly string[]) {
	return lines.length ? [`## ${title}`, '', ...lines, ''] : []
}

export default defineEventHandler(async (event) => {
	setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

	const posts = await queryCollection(event, 'blog')
		.select('path', 'title', 'description', 'date', 'draft')
		.order('date', 'DESC')
		.all()

	return [
		`# ${siteName}`,
		'',
		`> ${siteDescription}`,
		'',
		`${siteName} offers two services: AI content creation and web development. AI content creation covers visuals, video, reels, and site imagery produced through an AI pipeline with human editing. Web development covers design, build, and handover. Slogan: ${siteSlogan}.`,
		'',
		...section(
			'Pages',
			Object.values(pageSeo).map((page) => link(page.name, page.path, page.description)),
		),
		...section(
			'Work',
			projects.map((project) => link(project.name, `/work/${project.slug}`, project.description)),
		),
		...section(
			'Blog',
			posts
				.filter((post) => !post.draft)
				.map((post) => link(post.title, post.path, post.description)),
		),
		...section('Contact', [`- Email: ${siteEmail}`, `- Headquarters: ${siteHeadquartersLabel}`]),
	].join('\n')
})
