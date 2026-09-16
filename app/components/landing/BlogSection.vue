<script setup lang="ts">
import BlogCard from '@/components/cards/BlogCard.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'
import { Button, ButtonIcon } from '@/components/ui/button'

const articles = [
	{
		title: 'What we learned shipping 400 AI-generated assets',
		category: 'Featured',
		duration: '8 min',
		description:
			'Where the pipeline saves real time, where it quietly costs more, and the review loop that decides which.',
		variant: 'blue' as const,
		featured: true,
	},
	{
		title: 'We fed a model 200 of our own posts. Here is what broke.',
		category: 'AI content',
		variant: 'orange' as const,
		wide: true,
	},
	{
		title: 'Why AI video still looks stock, and how we fix it',
		category: 'Video',
		variant: 'white' as const,
	},
	{
		title: 'Ship the site in five weeks',
		category: 'Web',
		variant: 'pink' as const,
	},
	{
		title: 'Field notes: two weeks inside a launch shoot',
		variant: 'photo' as const,
		wide: true,
	},
	{
		title: 'The four numbers we put on every weekly readout',
		category: 'Workflow',
		variant: 'white' as const,
		wide: true,
	},
]
</script>

<template>
	<section id="blog" class="blog section-gutter">
		<SectionHeading title="From the blog" title-class="max-w-[12ch]">
			<Button as="a" href="#blog" variant="outline" size="cta-lg">
				All articles
				<template #icon>
					<ButtonIcon tone="dark" />
				</template>
			</Button>
		</SectionHeading>

		<div class="blog-grid">
			<BlogCard v-for="article in articles" :key="article.title" v-bind="article" />
		</div>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.blog {
	@apply w-full pb-section;
}

.blog-grid {
	@apply mt-8 grid auto-rows-[minmax(13rem,auto)] grid-cols-1 gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-4 xl:mt-14 xl:gap-5;
}
</style>
