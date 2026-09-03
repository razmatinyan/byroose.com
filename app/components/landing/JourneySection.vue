<script setup lang="ts">
import JourneyStepCard from '@/components/cards/JourneyStepCard.vue'

const journeySteps = [
	{
		number: '01',
		title: 'Diagnose',
		body:
			'Two weeks of interviews, analytics and competitor teardown. You get a written diagnosis: where demand actually comes from, what the money is doing, and the three things worth fixing first.',
		visual: 'workshop board',
		theme: 'white' as const,
	},
	{
		number: '02',
		title: 'Build',
		body:
			'Design, copy, site and campaign assets produced in one sprint cadence. Weekly demos, no dark period. Everything ships behind measurement so we know what moved.',
		visual: 'sprint board',
		theme: 'blue' as const,
	},
	{
		number: '03',
		title: 'Scale',
		body:
			'The winners get budget, the losers get cut, monthly. Content volume goes up through the AI pipeline while a human editor holds the line on quality.',
		visual: 'growth chart',
		theme: 'orange' as const,
	},
]
</script>

<template>
	<section id="journey" class="journey">
		<div class="section-gutter">
			<h2 class="journey-title">Project journey</h2>
		</div>

		<JourneyStepCard
			v-for="(step, index) in journeySteps"
			:key="step.number"
			v-bind="step"
			:class="index === 0 && 'journey-step-first'"
		/>
	</section>
</template>
