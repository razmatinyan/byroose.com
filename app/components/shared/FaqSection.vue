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

const { revealReady = true, structuredData = true } = defineProps<{
	revealReady?: boolean
	structuredData?: boolean
}>()

const faqTitle = 'Frequently Asked Questions'

const faqs = [
	{
		id: 'ai-agency',
		question: 'What does an AI content agency do?',
		answer:
			'An AI content agency creates marketing content, such as videos, UGC ads, reels, and product photos, using AI tools. At byroose, people direct and edit everything AI generates, and we also build the website the content sends people to.',
	},
	{
		id: 'quality',
		question: 'Is AI-generated content good enough for my brand?',
		answer:
			'Yes, when people direct it. AI gives us speed and volume, and our creative director and editors check every asset so it looks like your brand and is worth stopping for.',
	},
	{
		id: 'start',
		question: 'How fast can we start?',
		answer:
			'Usually within a couple of weeks. We begin with a discovery call about your brand, your audience, and your goals, then get to work.',
	},
	{
		id: 'in-house',
		question: 'Can you work with our in-house marketing team?',
		answer:
			"Yes. Many clients keep their own social media or development team and use us for the stage they're missing. We plug into your brief and your tools, and we hand over everything we make.",
	},
	{
		id: 'single-service',
		question: 'Can I hire you just for AI content, or just for web development?',
		answer:
			"Yes. But the biggest results come when both are built to the same brief, because that's where most funnels leak. If you start with one, we'll tell you honestly whether the other half is holding you back.",
	},
	{
		id: 'cost',
		question: 'How much does an AI content and web development agency cost?',
		answer:
			"It depends on the scope: how much content you need each month, how big the website is, and whether we do both. Tell us about your project and we'll send an exact quote.",
	},
	{
		id: 'reporting',
		question: 'How do you measure and report results?',
		answer:
			"One monthly report that follows the whole funnel: which content stopped people, how many came to the website, and how many became leads. Plus what we're keeping, what we're cutting, and why.",
	},
	{
		id: 'commitment',
		question: 'Why is there a 90-day minimum?',
		answer:
			'Because a marketing funnel needs time to learn. The first month sets the baseline, the second tests what works, and by the third you can see which posts bring which leads.',
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

useFaqMotion(faqRoot, {
	answerSplits,
	openIndex,
	revealReady: () => revealReady,
	titleSplit,
})

if (structuredData) {
	useSchemaOrg([
		defineWebPage({ '@type': 'FAQPage' }),
		...faqs.map(faq =>
			defineQuestion({ name: faq.question, acceptedAnswer: faq.answer }),
		),
	])
}

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
					<span class="sr-only">{{ faq.question }}</span>
					<span class="faq-mask" aria-hidden="true">
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
