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
			title: 'A launch film and sixty cutdowns in one sprint',
			metric: '11M views earned',
			theme: 'orange',
			rotation: 'minus-two',
			offset: 'none',
		},
		{
			client: 'Kessler Tools',
			title: 'A product site rebuilt around how buyers actually search',
			metric: '41% more qualified enquiries',
			theme: 'blue',
			rotation: 'plus-two',
			offset: 'large',
		},
	],
	[
		{
			client: 'Halden Clinics',
			title: 'A booking flow rebuilt in five weeks',
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
			title: 'A reel format that ran for nine months straight',
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
		<SectionHeading title="Success stories" title-class="max-w-[12ch]">
			<p class="section-intro">Six engagements, same method, different starting points. Scroll on.</p>
		</SectionHeading>

		<div class="case-list">
			<div v-for="(pair, index) in casePairs" :key="index" class="case-pair">
				<CaseStudyCard v-for="item in pair" :key="item.client" v-bind="item" />
			</div>
		</div>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.work {
	@apply w-full pb-section;
}

.case-list {
	@apply mt-8 flex flex-col gap-6 py-2 pr-2 pl-2 md:mt-12 md:gap-8 md:pr-6 xl:mt-14 xl:gap-10;
}

.case-pair {
	@apply grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:gap-8;
}
</style>
