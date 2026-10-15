<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import ReasonCard from '@/components/cards/ReasonCard.vue'
import SplitText from '@/components/shared/SplitText.vue'
import type { SplitTextResult } from '@/lib/split-text'
import type { SurfaceTone } from '@/lib/surfaces'

interface Reason {
	body: string
	number: string
	title: string
	tone: SurfaceTone
}

const whyTitle = 'Why Choose Us'
const whyIntro =
	"Two services, one team, and a process you can watch every week. Here's what changes when byroose makes your content and your site."
const whyOutro =
	"Still comparing agencies? Tell us what you're building and we'll show you how these six play out for your brand."

const reasons: Reason[] = [
	{
		number: '01',
		title: 'One team for content and code',
		body:
			'Your AI content and your website come from the same people, so the visuals, the voice, and the pages finally match.',
		tone: 'primary',
	},
	{
		number: '02',
		title: 'A human edits every asset',
		body:
			'The AI pipeline gives us volume. An editor reviews every visual, video, and reel before it reaches your audience.',
		tone: 'dark',
	},
	{
		number: '03',
		title: 'Built to be measured',
		body:
			'Everything ships behind clean analytics, so you can see what moved and decide what to make next.',
		tone: 'yellow',
	},
	{
		number: '04',
		title: 'Weekly demos, no dark periods',
		body:
			'You see progress every week instead of one big reveal at the end, so feedback lands while it is still easy to act on.',
		tone: 'blue',
	},
	{
		number: '05',
		title: 'A site your team can run',
		body:
			'A headless CMS, accessibility that passes audit, and a handover your team can maintain without calling us.',
		tone: 'pink',
	},
	{
		number: '06',
		title: 'Planned, not one-off',
		body:
			'Content is planned as a quarterly slate around your goals, instead of a stream of last-minute requests.',
		tone: 'green',
	},
]

const whyRoot = useTemplateRef<HTMLElement>('whyRoot')
const titleSplit = shallowRef<SplitTextResult>()
const noteSplits = shallowRef<(SplitTextResult | undefined)[]>(
	[whyIntro, whyOutro].map(() => undefined),
)
const cardTitleSplits = shallowRef<(SplitTextResult | undefined)[]>(
	reasons.map(() => undefined),
)
const cardBodySplits = shallowRef<(SplitTextResult | undefined)[]>(
	reasons.map(() => undefined),
)
const outroRow = { '--why-outro-row': reasons.length + 1 }

useFitText(() => whyRoot.value?.querySelector<HTMLElement>('[data-why-title]'))
useWhyChooseMotion(whyRoot, {
	cardBodySplits,
	cardTitleSplits,
	noteSplits,
	titleSplit,
})

function setTitleSplit(parts: SplitTextResult) {
	titleSplit.value = parts
}

function setNoteSplit(index: number, parts: SplitTextResult) {
	noteSplits.value = noteSplits.value.with(index, parts)
}

function setCardTitleSplit(index: number, parts: SplitTextResult) {
	cardTitleSplits.value = cardTitleSplits.value.with(index, parts)
}

function setCardBodySplit(index: number, parts: SplitTextResult) {
	cardBodySplits.value = cardBodySplits.value.with(index, parts)
}

function reasonPlacement(index: number) {
	return {
		'--reason-column': (index % 2) + 1,
		'--reason-row': index + 1,
	}
}
</script>

<template>
	<section id="why-choose-us" ref="whyRoot" class="why">
		<div class="why-heading section-gutter">
			<SplitText
				class="why-title"
				as="h2"
				data-why-title
				:text="whyTitle"
				type="words,chars"
				@split="setTitleSplit"
			/>
		</div>

		<div class="why-grid section-gutter">
			<SplitText
				class="why-note why-intro"
				as="p"
				auto-split
				mask="lines"
				data-why-note
				:text="whyIntro"
				type="lines"
				@split="setNoteSplit(0, $event)"
			/>
			<div
				v-for="(reason, index) in reasons"
				:key="reason.number"
				class="why-reason"
				data-reason
				:style="reasonPlacement(index)"
			>
				<ReasonCard
					v-bind="reason"
					@title-split="setCardTitleSplit(index, $event)"
					@body-split="setCardBodySplit(index, $event)"
				/>
			</div>
			<div class="why-outro" :style="outroRow">
				<SplitText
					class="why-note"
					as="p"
					auto-split
					mask="lines"
					data-why-note
					:text="whyOutro"
					type="lines"
					@split="setNoteSplit(1, $event)"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.why {
	@apply w-full pt-section pb-section;
}

.why-heading {
	container-type: inline-size;
}

.why-title {
	--why-title-size: 15cqi;
	@apply m-0 w-max pe-[0.05em] leading-[0.86] font-bold tracking-[-0.05em] whitespace-nowrap;
	font-size: calc(var(--why-title-size) * var(--fit-text-scale, 1));
}

.why-title :deep(.split-text-word),
.why-title :deep(.split-text-char) {
	display: inline-block;
}

.why-title :deep(.split-text-char) {
	visibility: hidden;
}

.why-grid {
	@apply mt-12 grid grid-cols-1 gap-4 md:mt-20 md:auto-rows-fr md:grid-cols-2 md:gap-5 xl:mt-24;
}

.why-note {
	@apply m-0 max-w-[30ch] text-2xl leading-[1.05] font-semibold tracking-[-0.04em] xl:text-4xl;
}

.why-intro {
	@apply mb-6 md:col-start-2 md:row-start-1 md:mb-0 md:self-start;
}

.why-outro {
	@apply mt-6 md:col-start-1 md:row-[var(--why-outro-row)] md:mt-0 md:flex md:items-end;
}

.why-reason {
	@apply md:col-[var(--reason-column)] md:row-[var(--reason-row)/span_2];
}

.why-note :deep(.split-text-line),
.why-note :deep(.split-text-line-mask) {
	display: block;
}

.why-note :deep(.split-text-line) {
	visibility: hidden;
	white-space: nowrap;
}

.why-note :deep(.split-text-line-mask) {
	margin-block: -0.12em -0.2em;
	padding-block: 0.12em 0.2em;
}

@media (prefers-reduced-motion: reduce) {
	.why-title :deep(.split-text-char),
	.why-note :deep(.split-text-line) {
		visibility: inherit;
	}
}
</style>
