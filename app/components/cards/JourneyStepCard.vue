<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import MediaPlaceholder from '@/components/shared/MediaPlaceholder.vue'
import SplitText from '@/components/shared/SplitText.vue'
import type { SplitTextResult } from '@/lib/split-text'

type Theme = 'blue' | 'orange' | 'white'

const {
	body,
	class: className,
	number,
	theme = 'white',
	title,
	visual,
} = defineProps<{
	body: string
	class?: HTMLAttributes['class']
	number: string
	theme?: Theme
	title: string
	visual: string
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
		<div class="journey-step-head" data-journey-step-head>
			<span
				:class="
					cn(
						'journey-step-number',
						theme === 'white' ? 'bg-background' : 'bg-card',
					)
				"
				data-journey-step-number
			>
				{{ number }}
			</span>
			<SplitText
				class="journey-step-title"
				as="h3"
				mask="lines"
				:text="title"
				type="lines"
				@split="emit('titleSplit', $event)"
			/>
		</div>

		<div class="journey-step-media" data-journey-step-media>
			<MediaPlaceholder
				:label="visual"
				:class="
					cn(
						'journey-step-visual',
						theme === 'blue' && 'pattern-blue',
						theme === 'orange' && 'pattern-orange',
					)
				"
				:label-class="theme === 'white' ? undefined : 'text-current opacity-90'"
			/>
		</div>

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
	</Card>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.journey-step {
	@apply grid size-full grid-rows-[auto_minmax(0,1fr)_auto] gap-6 overflow-hidden rounded-2xl p-6 md:grid-cols-2 md:grid-rows-[1fr_auto] md:gap-x-12 md:p-10 xl:p-14;
}

.journey-step-head {
	@apply flex flex-col items-start gap-4 md:col-start-1 md:row-start-1 md:gap-6;
}

.journey-step-number {
	@apply rounded-md px-2.5 py-1 text-base font-medium text-foreground tabular-nums;
}

.journey-step-title {
	@apply m-0 text-step font-bold tracking-[-0.05em];
}

.journey-step-media {
	@apply min-h-0 md:col-start-2 md:row-span-2 md:row-start-1 md:self-center;
}

.journey-step-visual {
	@apply size-full rounded-2xl md:aspect-16/11 md:h-auto;
}

.journey-step-copy {
	@apply m-0 max-w-[32ch] text-xl leading-[1.05] font-medium tracking-[-0.025em] sm:text-2xl md:col-start-1 md:row-start-2 xl:text-3xl;
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
	padding-block: 0.12em 0.2em;
}
</style>
