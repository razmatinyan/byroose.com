<script setup lang="ts">
import CaseStudyCard from '@/components/cards/CaseStudyCard.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'

interface CaseStudy {
	client: string
	title: string
	metric: string
	theme: 'orange' | 'blue' | 'pink' | 'white'
	rotation: 'minus-two' | 'plus-two' | 'minus-three' | 'plus-three'
	offset: 'none' | 'small' | 'medium' | 'large' | 'extra-large'
}

const casePairs: CaseStudy[][] = [
	[
		{
			client: 'Nova Dairy',
			title: 'From zero to full retail listing in eleven weeks',
			metric: '4 chains · 260 stores',
			theme: 'orange',
			rotation: 'minus-two',
			offset: 'none',
		},
		{
			client: 'Kessler Tools',
			title: 'Cut cost per lead by 41% and doubled deal size',
			metric: '€1.2M pipeline added',
			theme: 'blue',
			rotation: 'plus-two',
			offset: 'large',
		},
	],
	[
		{
			client: 'Halden Clinics',
			title: 'A rebrand that filled the calendar six weeks out',
			metric: '+38% bookings',
			theme: 'pink',
			rotation: 'plus-two',
			offset: 'medium',
		},
		{
			client: 'Marrow & Co',
			title: 'One landing page rebuilt, conversion up by half',
			metric: '3.1% → 4.7% CVR',
			theme: 'white',
			rotation: 'minus-three',
			offset: 'none',
		},
	],
	[
		{
			client: 'Vestlund',
			title: 'Forty assets a month, produced by four people',
			metric: '62% cheaper per asset',
			theme: 'blue',
			rotation: 'minus-three',
			offset: 'small',
		},
		{
			client: 'Piquant',
			title: 'A category story that unlocked two distributors',
			metric: '18M views earned',
			theme: 'orange',
			rotation: 'plus-three',
			offset: 'extra-large',
		},
	],
]
</script>

<template>
	<section id="work" class="work section-gutter">
		<SectionHeading title="Success stories" title-class="work-title">
			<p class="section-intro">Six engagements, same method, different starting points. Scroll on.</p>
		</SectionHeading>

		<div class="case-list">
			<div v-for="(pair, index) in casePairs" :key="index" class="case-pair">
				<CaseStudyCard v-for="item in pair" :key="item.client" v-bind="item" />
			</div>
		</div>
	</section>
</template>
