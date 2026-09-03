<script setup lang="ts">
import CourseCard from '@/components/cards/CourseCard.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'

const courses = [
	{
		title: 'Social that sells',
		length: '4 weeks · live',
		price: '€890',
		body:
			'Build a creative testing loop your team can run without us. Hooks, formats, budget rules and the reporting that keeps it honest.',
		theme: 'white' as const,
		visual: 'course workbook',
	},
	{
		title: 'Brand in a room',
		length: '2 days · on site',
		price: '€1,400',
		body:
			'The positioning workshop we open every engagement with, taught to your marketing and product leads in one intense sprint.',
		theme: 'blue' as const,
		visual: 'workshop deck',
	},
	{
		title: 'AI content, no slop',
		length: '3 weeks · online',
		price: '€690',
		body:
			'Set up a voice-trained pipeline with a human review loop. Prompts, guardrails, editing standards and the publishing checklist.',
		theme: 'orange' as const,
		visual: 'pipeline diagram',
	},
]
</script>

<template>
	<section id="courses" class="courses section-gutter">
		<SectionHeading title="Our courses" title-class="courses-title">
			<p class="section-intro">The same playbooks we run for clients, taught to your team over four weeks.</p>
		</SectionHeading>

		<div class="courses-grid">
			<CourseCard v-for="course in courses" :key="course.title" v-bind="course" />
		</div>
	</section>
</template>
