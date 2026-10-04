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
		image: '/images/hero/1.png',
		action: 'Explore the diagnosis',
		theme: 'white' as const,
	},
	{
		number: '02',
		title: 'Build',
		body:
			'Design, copy, site and content assets produced in one sprint cadence. Weekly demos, no dark period. Everything ships behind measurement so we know what moved.',
		image: '/images/hero/5.png',
		action: 'See what we build',
		theme: 'blue' as const,
	},
	{
		number: '03',
		title: 'Scale',
		body:
			'The formats that earn attention get made again, the rest get dropped, monthly. Content volume goes up through the AI pipeline while a human editor holds the line on quality.',
		image: '/images/hero/2.png',
		action: 'See how we scale',
		theme: 'orange' as const,
	},
]

const journeyRoot = useTemplateRef<HTMLElement>('journeyRoot')
const titleSplit = shallowRef<SplitTextResult>()
const stepTitleSplits = shallowRef<(SplitTextResult | undefined)[]>(
	journeySteps.map(() => undefined),
)
const stepBodySplits = shallowRef<(SplitTextResult | undefined)[]>(
	journeySteps.map(() => undefined),
)

useFitText(() =>
	journeyRoot.value?.querySelector<HTMLElement>('[data-journey-title]'),
)
useJourneyMotion(journeyRoot, { stepBodySplits, stepTitleSplits, titleSplit })

function setTitleSplit(parts: SplitTextResult) {
	titleSplit.value = parts
}

function setStepTitleSplit(index: number, parts: SplitTextResult) {
	stepTitleSplits.value = stepTitleSplits.value.with(index, parts)
}

function setStepBodySplit(index: number, parts: SplitTextResult) {
	stepBodySplits.value = stepBodySplits.value.with(index, parts)
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

		<div class="journey-steps">
			<div
				v-for="(step, index) in journeySteps"
				:key="step.number"
				class="journey-slide"
				data-journey-slide
			>
				<div class="journey-slide-frame" data-journey-slide-frame>
					<JourneyStepCard
						v-bind="step"
						data-journey-slide-card
						@title-split="setStepTitleSplit(index, $event)"
						@body-split="setStepBodySplit(index, $event)"
					/>
				</div>
			</div>
		</div>
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

.journey-steps {
	@apply mt-8 md:mt-14;
}

.journey-slide {
	@apply relative h-svh;
}

.journey-slide-frame {
	@apply size-full p-[clamp(1rem,2vw,1.5rem)] perspective-distant;
}
</style>
