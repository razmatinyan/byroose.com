<script setup lang="ts">
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
	{
		question: 'How fast can you start?',
		answer:
			'Kickoff within ten working days of a signed scope. Sprints can start sooner if the brief is tight.',
	},
	{
		question: 'Do you work with in-house teams?',
		answer:
			'Most of the time. We plug into your stand-ups, use your tools, and hand over everything we build with documentation.',
	},
	{
		question: 'What does the AI content actually mean?',
		answer:
			'A model tuned on your voice, offers and proof points, running inside a human review loop. Nothing publishes without an editor signing off.',
	},
	{
		question: 'Can we buy one service on its own?',
		answer:
			'Yes. Content, marketing, brand and web are sold separately, though they compound when run together.',
	},
	{
		question: 'How do you report results?',
		answer:
			'One dashboard, weekly written readouts, and a monthly decision meeting where we cut what is not paying.',
	},
	{
		question: 'Is there a minimum commitment?',
		answer:
			'Ninety days on retainers, so there is enough runway to learn something. After that it is month to month.',
	},
]
</script>

<template>
	<section id="faq" class="faq section-gutter">
		<div>
			<h2 class="section-title faq-title">Questions, answered.</h2>
			<p class="faq-intro">
				Anything else, mail <a class="text-primary hover:text-foreground" href="mailto:hello@byroose.com">hello@byroose.com</a>
				and you get a human reply the same day.
			</p>
		</div>

		<Accordion class="border-y border-border" type="single" collapsible default-value="faq-0">
			<AccordionItem
				v-for="(faq, index) in faqs"
				:key="faq.question"
				class="border-b border-border last:border-b-0"
				:value="`faq-${index}`"
			>
				<AccordionTrigger class="items-center rounded-none py-5.5 text-lg font-semibold tracking-[-0.02em] hover:no-underline sm:text-xl">
					{{ faq.question }}
				</AccordionTrigger>
				<AccordionContent class="max-w-[56ch] pb-5.5 text-lg leading-relaxed text-muted-foreground">
					{{ faq.answer }}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.faq {
	@apply grid w-full grid-cols-1 items-start gap-8 pb-section lg:grid-cols-2 lg:gap-16;
}

.faq-title {
	@apply max-w-[10ch];
}

.faq-intro {
	@apply mt-5 mb-0 max-w-[32ch] text-base leading-normal text-muted-foreground;
}
</style>
