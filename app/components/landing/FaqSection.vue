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

		<Accordion class="faq-list" type="single" collapsible default-value="faq-0">
			<AccordionItem
				v-for="(faq, index) in faqs"
				:key="faq.question"
				class="faq-item"
				:value="`faq-${index}`"
			>
				<AccordionTrigger class="faq-trigger">{{ faq.question }}</AccordionTrigger>
				<AccordionContent class="faq-answer">{{ faq.answer }}</AccordionContent>
			</AccordionItem>
		</Accordion>
	</section>
</template>
