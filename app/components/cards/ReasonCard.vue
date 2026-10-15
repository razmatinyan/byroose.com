<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Card } from '@/components/ui/card'
import SplitText from '@/components/shared/SplitText.vue'
import type { SplitTextResult } from '@/lib/split-text'
import { surfaceTones } from '@/lib/surfaces'
import type { SurfaceTone } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

const {
	body,
	class: className,
	number,
	title,
	tone = 'primary',
} = defineProps<{
	body: string
	class?: HTMLAttributes['class']
	number: string
	title: string
	tone?: SurfaceTone
}>()

const emit = defineEmits<{
	bodySplit: [parts: SplitTextResult]
	titleSplit: [parts: SplitTextResult]
}>()
</script>

<template>
	<Card
		as="article"
		variant="plain"
		data-reason-card
		:class="cn('reason-card', surfaceTones[tone], className)"
	>
		<p class="reason-card-number" aria-hidden="true">
			<span class="reason-card-number-text" data-reason-card-number>
				{{ number }}
			</span>
		</p>
		<div class="reason-card-text">
			<SplitText
				class="reason-card-title"
				as="h3"
				mask="words"
				:text="title"
				type="words"
				@split="emit('titleSplit', $event)"
			/>
			<SplitText
				class="reason-card-body"
				as="p"
				auto-split
				mask="lines"
				:text="body"
				type="lines"
				@split="emit('bodySplit', $event)"
			/>
		</div>
	</Card>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.reason-card {
	@apply flex size-full min-h-72 flex-col justify-between gap-10 rounded-2xl p-6 md:min-h-96 md:p-10 xl:min-h-112 xl:p-12;
}

.reason-card-number {
	@apply m-0 overflow-clip text-6xl leading-none font-bold tracking-[-0.05em] text-current/30 tabular-nums md:text-7xl xl:text-8xl;
	margin-block: -0.12em;
	padding-block: 0.12em;
}

.reason-card-number-text {
	@apply inline-block;
	visibility: hidden;
}

.reason-card-text {
	@apply flex flex-col gap-4 md:gap-5;
}

.reason-card-title {
	@apply m-0 text-3xl leading-[0.95] font-bold tracking-[-0.045em] text-balance md:text-4xl xl:text-5xl;
}

.reason-card-body {
	@apply m-0 max-w-[34ch] text-lg leading-[1.2] font-medium tracking-[-0.03em] md:text-xl xl:text-2xl;
}

.reason-card-title :deep(.split-text-word),
.reason-card-title :deep(.split-text-word-mask) {
	display: inline-block;
}

.reason-card-title :deep(.split-text-word) {
	visibility: hidden;
}

.reason-card-title :deep(.split-text-word-mask) {
	margin-block: -0.15em;
	padding-block: 0.15em;
}

.reason-card-body :deep(.split-text-line),
.reason-card-body :deep(.split-text-line-mask) {
	display: block;
}

.reason-card-body :deep(.split-text-line) {
	visibility: hidden;
	white-space: nowrap;
}

.reason-card-body :deep(.split-text-line-mask) {
	margin-block: -0.12em -0.2em;
	padding-block: 0.12em 0.2em;
}

@media (prefers-reduced-motion: reduce) {
	.reason-card-number-text,
	.reason-card-title :deep(.split-text-word),
	.reason-card-body :deep(.split-text-line) {
		visibility: inherit;
	}
}
</style>
