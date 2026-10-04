<script setup lang="ts">
import BlogCard from '@/components/cards/BlogCard.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'
import { appIcons } from '@/lib/icons'

const blogRoute = '/blog'

const articles = [
	{
		title: 'What we learned shipping 400 AI-generated assets',
		category: 'AI content creation',
		publishedAt: '2026-09-22',
		image: '/images/hero/3.png',
		tone: 'pink' as const,
	},
	{
		title: 'Why AI video still looks stock, and how we fix it',
		category: 'AI content creation',
		publishedAt: '2026-09-08',
		image: '/images/hero/4.png',
		tone: 'yellow' as const,
	},
	{
		title: 'How we ship a website in five weeks',
		category: 'Web development',
		publishedAt: '2026-08-25',
		image: '/images/hero/6.png',
		tone: 'green' as const,
	},
]
</script>

<template>
	<section id="blog" class="blog">
		<div class="blog-panel section-gutter">
			<SectionHeading class="items-center" title="More Than a Blog">
				<NuxtLink class="blog-link" :to="blogRoute" aria-label="Read the blog">
					<Icon :name="appIcons.arrowRight" class="size-5" aria-hidden="true" />
				</NuxtLink>
			</SectionHeading>

			<div class="blog-grid">
				<BlogCard
					v-for="article in articles"
					:key="article.title"
					v-bind="article"
					:href="blogRoute"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.blog {
	@apply w-full px-[clamp(1rem,2vw,1.5rem)] pb-section;
}

.blog-panel {
	@apply rounded-2xl bg-card py-16 text-card-foreground md:py-20 xl:py-24;
}

.blog-link {
	@apply inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:size-14;
}

.blog-grid {
	@apply mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-3 xl:mt-14 xl:gap-5;
}
</style>
