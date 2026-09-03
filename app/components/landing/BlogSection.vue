<script setup lang="ts">
import BlogCard from '@/components/cards/BlogCard.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'
import { Button, ButtonIcon } from '@/components/ui/button'

const articles = [
	{
		title: 'The attribution report your agency does not want you to read',
		category: 'Featured',
		duration: '8 min',
		description:
			'Why last-click keeps rewarding the wrong channel, and the three-column model we use instead.',
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
		title: 'Naming is a maths problem',
		category: 'Brand',
		variant: 'white' as const,
	},
	{
		title: 'Ship the site in five weeks',
		category: 'Web',
		variant: 'pink' as const,
	},
	{
		title: 'Field notes: two weeks inside a retail launch',
		variant: 'photo' as const,
		wide: true,
	},
	{
		title: 'The four numbers we put on every weekly readout',
		category: 'Marketing',
		variant: 'white' as const,
		wide: true,
	},
]
</script>

<template>
	<section id="blog" class="blog section-gutter">
		<SectionHeading title="From the blog" title-class="blog-title">
			<Button as="a" href="#blog" variant="outline" size="cta-lg">
				All articles
				<ButtonIcon tone="dark" />
			</Button>
		</SectionHeading>

		<div class="blog-grid">
			<BlogCard v-for="article in articles" :key="article.title" v-bind="article" />
		</div>
	</section>
</template>
