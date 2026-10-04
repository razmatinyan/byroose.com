<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import SplitText from '@/components/shared/SplitText.vue'
import type { SplitTextResult } from '@/lib/split-text'

type Theme = 'blue' | 'orange' | 'white'

const {
	body,
	class: className,
	image,
	number,
	theme = 'white',
	title,
} = defineProps<{
	body: string
	class?: HTMLAttributes['class']
	image: string
	number: string
	theme?: Theme
	title: string
}>()

const emit = defineEmits<{
	bodySplit: [parts: SplitTextResult]
	titleSplit: [parts: SplitTextResult]
}>()

const surfaceClasses: Record<Theme, string> = {
	blue: 'surface-blue',
	orange: 'surface-orange',
	white: 'surface-card',
}
</script>

<template>
	<Card
		as="article"
		variant="plain"
		:class="cn('journey-step', surfaceClasses[theme], className)"
	>
		<p
			:class="
				cn(
					'journey-step-number',
					theme === 'white' ? 'text-foreground/25' : 'text-foreground',
				)
			"
		>
			<span class="journey-step-number-text" data-journey-step-number>
				Step {{ number }}
			</span>
		</p>
		<SplitText
			class="journey-step-title"
			as="h3"
			auto-split
			mask="lines"
			:text="title"
			type="lines"
			data-journey-step-title
			@split="emit('titleSplit', $event)"
		/>
		<SplitText
			class="journey-step-copy"
			as="p"
			auto-split
			mask="lines"
			:text="body"
			type="lines,words"
			data-journey-step-copy
			@split="emit('bodySplit', $event)"
		/>

		<div class="journey-step-media" data-journey-step-media>
			<NuxtImg
				class="journey-step-image"
				:src="image"
				alt=""
				width="1456"
				height="816"
				sizes="sm:1024px md:1280px lg:1536px"
				densities="x1"
				loading="lazy"
				draggable="false"
			/>
		</div>
	</Card>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.journey-step {
	@apply grid size-full grid-rows-[auto_auto_auto_minmax(0,1fr)] content-start gap-x-12 gap-y-8 overflow-hidden rounded-2xl p-6 md:grid-cols-2 md:grid-rows-[auto_auto] md:gap-y-12 md:p-10 xl:gap-y-16 xl:p-14;
	container-type: inline-size;
}

.journey-step-title,
.journey-step-number {
	@apply m-0 min-w-0 text-[length:min(var(--text-step),20cqi)] leading-[0.85] font-bold tracking-[-0.05em] wrap-break-word md:text-[length:min(var(--text-step),9.5cqi)];
}

.journey-step-title {
	@apply row-start-1 md:col-start-1;
}

.journey-step-number {
	@apply row-start-3 overflow-clip md:col-start-2 md:row-start-1;
	margin-block: -0.12em -0.2em;
	margin-inline-end: -0.15em;
	padding-block: 0.12em 0.2em;
	padding-inline-end: 0.15em;
}

.journey-step-number-text {
	@apply inline-block tabular-nums;
	visibility: hidden;
}

.journey-step-copy {
	@apply row-start-2 m-0 max-w-[32ch] text-xl leading-[1.05] font-medium tracking-[-0.045em] sm:text-2xl md:col-start-1 md:row-start-2 xl:text-3xl;
}

.journey-step-media {
	@apply row-start-4 min-h-0 overflow-hidden rounded-2xl md:col-start-2 md:row-start-2 md:aspect-16/11;
}

.journey-step-image {
	@apply pointer-events-none size-full object-cover select-none;
}

.journey-step-title :deep(.split-text-line),
.journey-step-title :deep(.split-text-line-mask),
.journey-step-copy :deep(.split-text-line),
.journey-step-copy :deep(.split-text-line-mask) {
	display: block;
}

.journey-step-title :deep(.split-text-line),
.journey-step-copy :deep(.split-text-line) {
	visibility: hidden;
	white-space: nowrap;
}

.journey-step-title :deep(.split-text-line-mask),
.journey-step-copy :deep(.split-text-line-mask) {
	margin-block: -0.12em -0.2em;
	margin-inline-end: -0.15em;
	padding-block: 0.12em 0.2em;
	padding-inline-end: 0.15em;
}
</style>
