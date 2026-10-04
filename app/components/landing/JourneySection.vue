<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import JourneyStepCard from '@/components/cards/JourneyStepCard.vue'
import SplitText from '@/components/shared/SplitText.vue'
import type { SplitTextResult } from '@/lib/split-text'

const journeyTitle = 'Working process'

const journeySteps = [
	{
		number: '01',
		title: 'Diagnose',
		body:
			'Two weeks of interviews, analytics and a teardown of your current site and content. You get a written diagnosis: what your audience actually responds to, where the site loses them, and the three things worth fixing first.',
		visual: 'workshop board',
		theme: 'white' as const,
	},
	{
		number: '02',
		title: 'Build',
		body:
			'Design, copy, site and content assets produced in one sprint cadence. Weekly demos, no dark period. Everything ships behind measurement so we know what moved.',
		visual: 'sprint board',
		theme: 'blue' as const,
	},
	{
		number: '03',
		title: 'Scale',
		body:
			'The formats that earn attention get made again, the rest get dropped, monthly. Content volume goes up through the AI pipeline while a human editor holds the line on quality.',
		visual: 'growth chart',
		theme: 'orange' as const,
	},
]

const journeyRoot = useTemplateRef<HTMLElement>('journeyRoot')
const titleSplit = shallowRef<SplitTextResult>()

useFitText(() =>
	journeyRoot.value?.querySelector<HTMLElement>('[data-journey-title]'),
)
useJourneyMotion(journeyRoot, { titleSplit })

function setTitleSplit(parts: SplitTextResult) {
	titleSplit.value = parts
}
</script>

<template>
	<section id="journey" ref="journeyRoot" class="journey">
		<div class="journey-heading section-gutter">
			<SplitText
				class="journey-title"
				as="h2"
				data-journey-title
				:text="journeyTitle"
				type="words,chars"
				@split="setTitleSplit"
			/>
		</div>

		<JourneyStepCard
			v-for="(step, index) in journeySteps"
			:key="step.number"
			v-bind="step"
			:class="index === 0 && 'journey-step-first'"
		/>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.journey {
	@apply w-full pt-4 pb-section md:pt-8;
}

.journey-heading {
	container-type: inline-size;
}

.journey-title {
	--journey-title-size: 11.2cqi;
	@apply m-0 w-max pe-[0.05em] leading-[0.86] font-bold tracking-[-0.05em] whitespace-nowrap uppercase;
	font-size: calc(var(--journey-title-size) * var(--fit-text-scale, 1));
}

.journey-title :deep(.split-text-word),
.journey-title :deep(.split-text-char) {
	display: inline-block;
}

.journey-title :deep(.split-text-char) {
	visibility: hidden;
}
</style>
