<script setup lang="ts">
import CourseCard from '@/components/cards/CourseCard.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'

const courses = [
	{
		title: 'AI content, no slop',
		length: '3 weeks · online',
		price: '€690',
		body:
			'Set up a voice-trained pipeline with a human review loop. Prompts, guardrails, editing standards and the publishing checklist.',
		theme: 'orange' as const,
		visual: 'pipeline diagram',
	},
	{
		title: 'Reels that hold',
		length: '4 weeks · live',
		price: '€890',
		body:
			'Hooks, pacing and edit rhythm for short video. Build a format library your team can shoot and cut without waiting on an agency.',
		theme: 'white' as const,
		visual: 'storyboard frames',
	},
	{
		title: 'Art direction for AI',
		length: '2 days · on site',
		price: '€1,400',
		body:
			'Direct image and video models toward one consistent look. Reference building, prompt structure and the taste calls that keep output on brand.',
		theme: 'blue' as const,
		visual: 'reference board',
	},
]
</script>

<template>
	<section id="courses" class="courses section-gutter">
		<SectionHeading title="Our courses" title-class="max-w-[12ch]">
			<p class="section-intro">The same AI content playbooks we run for clients, taught to your team.</p>
		</SectionHeading>

		<div class="courses-grid">
			<CourseCard v-for="course in courses" :key="course.title" v-bind="course" />
		</div>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.courses {
	@apply w-full pb-section;
}

.courses-grid {
	@apply mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 xl:mt-14 xl:grid-cols-3 xl:gap-6;
}
</style>
