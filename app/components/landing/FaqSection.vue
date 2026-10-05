<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue'
import SplitText from '@/components/shared/SplitText.vue'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { appIcons } from '@/lib/icons'
import type { SplitTextResult } from '@/lib/split-text'

const faqTitle = 'Frequently Asked Questions'

const faqs = [
	{
		id: 'start',
		question: 'How fast can you start?',
		answer:
			'Kickoff happens within ten working days of a signed scope. Before that, we run a short discovery call to agree on goals, audience, and what success looks like, so the first sprint starts from a clear brief. If the brief is already tight and your assets are ready, a sprint can start sooner.',
	},
	{
		id: 'in-house',
		question: 'Do you work with in-house teams?',
		answer:
			'Most of the time. We plug into your stand-ups, work inside the tools your team already uses, and keep decisions visible in one shared channel instead of a long email chain. When the work is done, we hand over everything we built with documentation, so your team can run it without waiting on us.',
	},
	{
		id: 'ai-content',
		question: 'What does the AI content actually mean?',
		answer:
			'A model tuned on your voice and your look, producing visuals, video and reels inside a human review loop. Every asset passes through an editor who checks it against your brand, fixes what the model gets wrong, and decides whether it ships. Nothing publishes without that sign-off.',
	},
	{
		id: 'single-service',
		question: 'Can we buy one service on its own?',
		answer:
			'Yes. AI content creation and web development are sold separately, and plenty of clients start with one. They compound when the site and the content are built to the same brief: the imagery is made for the layouts it lives in, and the pages are designed around the content you will actually publish.',
	},
	{
		id: 'reporting',
		question: 'How do you report results?',
		answer:
			'One dashboard, weekly written readouts, and a monthly decision meeting. The readouts explain what moved and why in plain language rather than a wall of charts. In the monthly meeting we agree on what to double down on and drop the formats that are not working.',
	},
	{
		id: 'commitment',
		question: 'Is there a minimum commitment?',
		answer:
			'Ninety days on retainers, so there is enough runway to test, learn, and act on what the numbers show. After that it is month to month. Fixed-scope work, such as a website build, is quoted as a project and runs to its agreed scope and timeline.',
	},
]

const faqRoot = useTemplateRef<HTMLElement>('faqRoot')
const openItem = shallowRef<string>()
const titleSplit = shallowRef<SplitTextResult>()
const answerSplits = shallowRef<(SplitTextResult | undefined)[]>(
	faqs.map(() => undefined),
)
const openIndex = computed(() =>
	faqs.findIndex(faq => faq.id === openItem.value),
)

useFaqMotion(faqRoot, { answerSplits, openIndex, titleSplit })

function setTitleSplit(parts: SplitTextResult) {
	titleSplit.value = parts
}

function setAnswerSplit(index: number, parts: SplitTextResult) {
	answerSplits.value = answerSplits.value.with(index, parts)
}
</script>

<template>
	<section id="faq" ref="faqRoot" class="faq section-gutter">
		<SplitText
			class="section-title faq-title"
			as="h2"
			auto-split
			mask="lines"
			:text="faqTitle"
			type="lines,words"
			data-faq-title
			@split="setTitleSplit"
		/>

		<Accordion
			v-model="openItem"
			class="faq-list"
			type="single"
			collapsible
			data-faq-list
		>
			<AccordionItem
				v-for="(faq, index) in faqs"
				:key="faq.id"
				class="faq-item border-b-0"
				:value="faq.id"
				data-faq-item
			>
				<AccordionTrigger class="faq-trigger">
					<span class="faq-mask">
						<span class="faq-question" data-faq-rise>{{ faq.question }}</span>
					</span>
					<template #icon>
						<span class="faq-mask faq-icon-mask" aria-hidden="true">
							<span class="faq-icon" data-faq-rise>
								<Icon :name="appIcons.minus" class="faq-icon-bar" />
								<Icon
									:name="appIcons.minus"
									class="faq-icon-bar faq-icon-cross"
									data-faq-icon-cross
								/>
							</span>
						</span>
					</template>
				</AccordionTrigger>
				<AccordionContent class="faq-answer-body" force-mount data-faq-content>
					<SplitText
						class="faq-answer"
						as="p"
						auto-split
						mask="lines"
						:text="faq.answer"
						type="lines,words"
						@split="setAnswerSplit(index, $event)"
					/>
				</AccordionContent>
				<span class="faq-divider" data-faq-divider aria-hidden="true" />
			</AccordionItem>
		</Accordion>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.faq {
	@apply grid w-full grid-cols-1 items-start gap-10 pb-section md:gap-14 lg:grid-cols-[5fr_7fr] lg:gap-12;
}

.faq-title {
	@apply -mt-[0.16em] text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.86];
}

.faq-title :deep(.split-text-line),
.faq-title :deep(.split-text-line-mask),
.faq-answer :deep(.split-text-line),
.faq-answer :deep(.split-text-line-mask) {
	display: block;
}

.faq-title :deep(.split-text-line),
.faq-answer :deep(.split-text-line) {
	white-space: nowrap;
}

.faq-title :deep(.split-text-line-mask) {
	margin-block: 0 -0.36em;
	padding-block: 0.16em 0.2em;
}

.faq-answer :deep(.split-text-line-mask) {
	margin-block: -0.12em -0.2em;
	padding-block: 0.12em 0.2em;
}

.faq-title :deep(.split-text-word),
.faq-answer :deep(.split-text-word) {
	display: inline-block;
}

.faq-title :deep(.split-text-line) {
	visibility: hidden;
}

.faq-item {
	@apply relative;
}

.faq-item :deep(.faq-trigger) {
	@apply gap-8 rounded-none py-7 text-xl font-medium tracking-[-0.03em] hover:no-underline md:py-9 md:text-2xl xl:py-11 xl:text-3xl;
}

.faq-mask {
	@apply -my-[0.15em] block overflow-hidden py-[0.15em];
}

.faq-icon-mask {
	@apply shrink-0;
}

.faq-question,
.faq-icon {
	@apply block;
	visibility: hidden;
}

.faq-icon {
	@apply grid size-6 place-items-center md:size-7 xl:size-8;
}

.faq-icon-bar {
	@apply col-start-1 row-start-1 size-full;
}

.faq-icon-cross {
	transform: rotate(90deg);
}

.faq-list :deep([data-faq-content]) {
	animation: none;
	height: 0;
	overflow: hidden;
	visibility: hidden;
}

.faq-list :deep([data-faq-content][data-state='open']) {
	height: auto;
	visibility: visible;
}

.faq-list :deep(.faq-answer-body) {
	@apply pt-0 pb-9 md:pb-11 xl:pb-14;
}

.faq-answer {
	@apply m-0 max-w-[44ch] text-lg leading-[1.2] font-medium tracking-[-0.02em] text-pretty text-muted-foreground md:text-xl xl:text-2xl;
}

.faq-divider {
	@apply absolute inset-x-0 bottom-0 h-px bg-border;
	visibility: hidden;
}

.faq-item:last-child .faq-divider {
	@apply hidden;
}
</style>
