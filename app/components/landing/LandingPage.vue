<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue'
import type { SplitTextResult } from '@/lib/split-text'
import BlogSection from './BlogSection.vue'
import BrandGrid from './BrandGrid.vue'
import ContactSection from './ContactSection.vue'
import CoursesSection from './CoursesSection.vue'
import FaqSection from './FaqSection.vue'
import HeroSection from './HeroSection.vue'
import JourneySection from './JourneySection.vue'
import ReviewsSection from './ReviewsSection.vue'
import ServicesSection from './ServicesSection.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import StudioSection from './StudioSection.vue'
import WorkSection from './WorkSection.vue'

type LandingMotionMode = 'playful' | 'subtle' | 'off'

const { motion = 'playful' } = defineProps<{
	motion?: LandingMotionMode
}>()

const motionClass = computed(() => `motion--${motion}`)
const landingRoot = useTemplateRef<HTMLElement>('landingRoot')
const titleSplit = shallowRef<SplitTextResult>()
const { introState } = useHomeIntroMotion(landingRoot, titleSplit)

function setTitleSplit(parts: SplitTextResult) {
	titleSplit.value = parts
}
</script>

<template>
	<div
		ref="landingRoot"
		class="landing-page"
		:class="motionClass"
		:data-home-intro-state="introState"
	>
		<div data-home-intro-backdrop class="home-intro-backdrop" aria-hidden="true" />
		<SiteHeader data-home-intro-header />
		<main>
			<HeroSection @title-split="setTitleSplit" />
			<StudioSection />
			<BrandGrid />
			<WorkSection />
			<ServicesSection />
			<JourneySection />
			<!-- <ReviewsSection /> -->
			<CoursesSection />
			<BlogSection />
			<FaqSection />
			<ContactSection />
		</main>
		<SiteFooter />
	</div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.landing-page {
	@apply overflow-x-clip bg-background;
}

.home-intro-backdrop {
	@apply pointer-events-auto fixed inset-0 z-50 bg-background;
	transform-origin: bottom center;
	will-change: transform;
}

.landing-page:not([data-home-intro-state='complete'])
	:deep([data-home-intro-header]),
.landing-page:not([data-home-intro-state='complete'])
	:deep([data-home-intro-title]),
.landing-page:not([data-home-intro-state='complete'])
	:deep([data-home-intro-card]) {
	visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
	.home-intro-backdrop,
	.landing-page :deep([data-home-intro-card-remove]) {
		display: none;
	}

	.landing-page:not([data-home-intro-state='complete'])
		:deep([data-home-intro-header]),
	.landing-page:not([data-home-intro-state='complete'])
		:deep([data-home-intro-title]),
	.landing-page:not([data-home-intro-state='complete'])
		:deep([data-home-intro-card]) {
		visibility: inherit;
	}
}
</style>
