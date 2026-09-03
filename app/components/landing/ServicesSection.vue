<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import MediaPlaceholder from '@/components/shared/MediaPlaceholder.vue'
import { Button } from '@/components/ui/button'
import { appIcons } from '@/lib/icons'

interface ClientStory {
	quote: string
	name: string
	role: string
}

interface Service {
	title: string
	body: string
	visual: string
}

const storyData: ClientStory[] = [
	{
		quote:
			'“For years our site failed to show the work properly. Six weeks after relaunch we booked €180k in new business and get two or three qualified enquiries a week.”',
		name: 'Andrew Tynes',
		role: 'Owner, Mammoth Murals',
	},
	{
		quote:
			'“They rewrote our positioning in a fortnight. The sales team stopped explaining what we do and started closing.”',
		name: 'Ilse Warner',
		role: 'CMO, Nova Dairy',
	},
	{
		quote:
			'“Content output tripled without a single off-brand post going live. The review loop is the part nobody else offered.”',
		name: 'Tomas Brekke',
		role: 'Founder, Vestlund',
	},
]

const servicesData: Service[] = [
	{
		title: 'Content creation',
		body:
			'Studio and AI-assisted production: video, photo, editorial and design, planned as a quarterly slate instead of one-off requests.',
		visual: 'content grid',
	},
	{
		title: 'SM marketing',
		body:
			'Paid and organic social run as one system. Creative testing weekly, budget decisions monthly, a single dashboard you can read in a minute.',
		visual: 'campaign dashboard',
	},
	{
		title: 'Brand strategy',
		body:
			'Positioning, naming and messaging built from customer interviews and market data, not a mood board. A story your whole team can repeat.',
		visual: 'brand board',
	},
	{
		title: 'Web development',
		body:
			'Design and build in the same sprint. Headless CMS, clean analytics, accessibility that passes audit, a handover your team can maintain.',
		visual: 'product screenshot',
	},
]

const selectedStory = shallowRef(0)
const selectedService = shallowRef(2)

const activeStory = computed(() => storyData[selectedStory.value]!)
const activeService = computed(() => servicesData[selectedService.value]!)
const storyCounter = computed(
	() => `${String(selectedStory.value + 1).padStart(2, '0')}/${String(storyData.length).padStart(2, '0')}`,
)

function showPreviousStory() {
	selectedStory.value = (selectedStory.value - 1 + storyData.length) % storyData.length
}

function showNextStory() {
	selectedStory.value = (selectedStory.value + 1) % storyData.length
}
</script>

<template>
	<section id="services" class="services section-gutter">
		<h2 class="section-title services-title">What we can help with</h2>

		<div class="services-layout">
			<article class="client-story">
				<div class="client-story-controls">
					<div class="client-story-arrows">
						<Button variant="ghost" size="icon-sm" aria-label="Previous client story" @click="showPreviousStory">
							<Icon :name="appIcons.arrowLeft" class="size-4.5" />
						</Button>
						<Button variant="ghost" size="icon-sm" aria-label="Next client story" @click="showNextStory">
							<Icon :name="appIcons.arrowRight" class="size-4.5" />
						</Button>
					</div>
					<span class="client-story-counter">{{ storyCounter }}</span>
				</div>

				<span class="eyebrow client-story-eyebrow">(Real client stories)</span>
				<p class="client-story-quote">{{ activeStory.quote }}</p>

				<div class="client-story-person">
					<MediaPlaceholder class="client-story-avatar" aria-hidden="true" />
					<div>
						<div class="client-story-name">{{ activeStory.name }}</div>
						<div class="client-story-role">{{ activeStory.role }}</div>
					</div>
				</div>
			</article>

			<div class="service-picker">
				<div class="service-picker-list">
					<button
						v-for="(service, index) in servicesData"
						:key="service.title"
						class="service-picker-option"
						type="button"
						:aria-pressed="index === selectedService"
						@click="selectedService = index"
					>
						{{ service.title }}
					</button>
				</div>
				<p class="service-picker-description">{{ activeService.body }}</p>
			</div>

			<MediaPlaceholder class="service-visual" :label="activeService.visual" />
		</div>
	</section>
</template>
