<script setup lang="ts">
import { computed } from 'vue'
import BlogSection from './BlogSection.vue'
import BrandMarquee from './BrandMarquee.vue'
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
</script>

<template>
	<div class="landing-page" :class="motionClass">
		<SiteHeader />
		<main>
			<HeroSection />
			<StudioSection />
			<BrandMarquee />
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
