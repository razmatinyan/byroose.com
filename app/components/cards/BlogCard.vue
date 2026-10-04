<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { NuxtLink } from '#components'
import { Card } from '@/components/ui/card'
import SplitText from '@/components/shared/SplitText.vue'
import type { SplitTextResult } from '@/lib/split-text'
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

const emit = defineEmits<{
	titleSplit: [parts: SplitTextResult]
}>()

const publishedLabel = computed(() => formatPublishDate(publishedAt))
</script>

<template>
	<Card
		:as="NuxtLink"
		:to="href"
		variant="plain"
		data-blog-card
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
			<SplitText
				class="blog-card-title"
				as="h3"
				auto-split
				mask="lines"
				:text="title"
				type="lines,words"
				@split="emit('titleSplit', $event)"
			/>
			<div class="blog-card-meta-mask">
				<div class="blog-card-meta" data-blog-card-meta>
					<span class="blog-card-category">{{ category }}</span>
					<time class="blog-card-date" :datetime="publishedAt">{{ publishedLabel }}</time>
				</div>
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
	@apply m-0 text-2xl leading-[1.05] font-semibold tracking-[-0.045em] md:text-xl lg:text-3xl xl:text-4xl;
}

.blog-card-title :deep(.split-text-line),
.blog-card-title :deep(.split-text-line-mask) {
	display: block;
}

.blog-card-title :deep(.split-text-word) {
	display: inline-block;
}

.blog-card-title :deep(.split-text-line) {
	visibility: hidden;
	white-space: nowrap;
}

.blog-card-title :deep(.split-text-line-mask) {
	margin-block: -0.12em -0.2em;
	margin-inline-end: -0.15em;
	padding-block: 0.12em 0.2em;
	padding-inline-end: 0.15em;
}

.blog-card-meta-mask {
	@apply mt-auto overflow-clip;
}

.blog-card-meta {
	@apply flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm tracking-[-0.02em] md:text-xs xl:text-sm;
}

.blog-card-category {
	@apply rounded-full bg-current/10 px-3 py-1.5 font-medium xl:px-3.5;
}

.blog-card-date {
	@apply font-medium whitespace-nowrap;
}
</style>
