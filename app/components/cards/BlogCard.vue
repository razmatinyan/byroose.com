<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { NuxtLink } from '#components'
import { Card } from '@/components/ui/card'
import { surfaceTones } from '@/lib/surfaces'
import { cn, formatPublishDate } from '@/lib/utils'

type BlogCardTone = 'green' | 'pink' | 'yellow'

const {
	category,
	class: className,
	href,
	image,
	publishedAt,
	title,
	tone = 'pink',
} = defineProps<{
	category: string
	class?: HTMLAttributes['class']
	href: string
	image: string
	publishedAt: string
	title: string
	tone?: BlogCardTone
}>()

const publishedLabel = computed(() => formatPublishDate(publishedAt))
</script>

<template>
	<Card
		:as="NuxtLink"
		:to="href"
		variant="plain"
		:class="cn('blog-card', surfaceTones[tone], className)"
	>
		<div class="blog-card-media">
			<NuxtImg
				class="blog-card-image"
				:src="image"
				alt=""
				width="1456"
				height="816"
				sizes="sm:768px md:1024px lg:640px xl:768px 2xl:1024px"
				densities="x1"
				loading="lazy"
				draggable="false"
			/>
		</div>

		<div class="blog-card-body">
			<h3 class="blog-card-title">{{ title }}</h3>
			<div class="blog-card-meta">
				<span class="blog-card-category">{{ category }}</span>
				<time class="blog-card-date" :datetime="publishedAt">{{ publishedLabel }}</time>
			</div>
		</div>
	</Card>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.blog-card {
	@apply flex h-full flex-col gap-5 rounded-2xl p-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:gap-6;
}

.blog-card-media {
	@apply aspect-4/3 overflow-hidden rounded-xl;
}

.blog-card-image {
	@apply size-full object-cover select-none;
}

.blog-card-body {
	@apply flex flex-1 flex-col gap-6 px-1.5 pb-1.5 md:gap-8;
}

.blog-card-title {
	@apply m-0 text-xl leading-tight font-semibold tracking-[-0.03em] text-pretty md:text-lg lg:text-2xl;
}

.blog-card-meta {
	@apply mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm md:text-xs xl:text-sm;
}

.blog-card-category {
	@apply rounded-full bg-current/10 px-3 py-1.5 font-medium xl:px-3.5;
}

.blog-card-date {
	@apply font-medium whitespace-nowrap;
}
</style>
