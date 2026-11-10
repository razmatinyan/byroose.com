<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from "vue";
import type { SplitTextResult } from "@/lib/split-text";
import BrandGrid from "./BrandGrid.vue";
import CoursesSection from "./CoursesSection.vue";
import HeroSection from "./HeroSection.vue";
import ProcessSection from "@/components/shared/ProcessSection.vue";
import type { ProcessStep } from "@/components/shared/ProcessSection.vue";
import ReviewsSection from "./ReviewsSection.vue";
import ServicesSection from "./ServicesSection.vue";
import StudioSection from "./StudioSection.vue";
import WhyChooseSection from "./WhyChooseSection.vue";
import WorkSection from "./WorkSection.vue";

const processTitle = "Work Process";
const processDescription =
   "Content and web move through the same four stages, and each stage overlaps the next, so nothing waits on a hand-off.";
const processSteps: readonly ProcessStep[] = [
   {
      title: "Discovery",
      body: "We learn your brand, your audience, and your goals, and review your current site and content.",
   },
   {
      title: "Strategy and concept",
      body: "We map pages, offers, and calls to action to search and to your funnel, and define the hooks, formats, and visual style for your content.",
   },
   {
      title: "Design and production",
      body: "Layouts built around your content and brand, and AI-generated content that is directed and edited by humans.",
   },
   {
      title: "Launch and measure",
      body: "A fast, accessible site with tracking from day one. We follow which content brings visitors and leads, and make more of what works.",
   },
];

const landingRoot = useTemplateRef<HTMLElement>("landingRoot");
const titleSplit = shallowRef<SplitTextResult>();
const descriptionSplit = shallowRef<SplitTextResult>();
const { introState } = useHomeIntroMotion(
   landingRoot,
   titleSplit,
   descriptionSplit,
);
useHomeHeroScrollMotion(landingRoot, introState);
const belowFoldHydrationArea = { rootMargin: "100% 0px" };

function setTitleSplit(parts: SplitTextResult) {
   titleSplit.value = parts;
}

function setDescriptionSplit(parts: SplitTextResult) {
   descriptionSplit.value = parts;
}
</script>

<template>
   <div
      ref="landingRoot"
      class="landing-page"
      :data-home-intro-state="introState"
   >
      <HeroSection
         @title-split="setTitleSplit"
         @description-split="setDescriptionSplit"
      />
      <div
         data-home-hero-scroll-space
         class="home-hero-scroll-space"
         aria-hidden="true"
      />
      <!-- <StudioSection /> -->
      <!-- <BrandGrid /> -->
      <WorkSection />
      <ServicesSection />
      <LazySharedPricingSection :hydrate-on-visible="belowFoldHydrationArea" />
      <ProcessSection
         id="journey"
         :title="processTitle"
         :description="processDescription"
         :steps="processSteps"
         :uppercase="false"
      />
      <!-- <WhyChooseSection /> -->
      <!-- <ReviewsSection /> -->
      <!-- <CoursesSection /> -->
      <LazyLandingBlogSection :hydrate-on-visible="belowFoldHydrationArea" />
      <LazySharedFaqSection :hydrate-on-visible="belowFoldHydrationArea" />
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.landing-page {
   @apply overflow-x-clip;
}

.home-hero-scroll-space {
   height: 0;
}

@media (min-width: 64rem) {
   .home-hero-scroll-space {
      height: 150svh;
   }
}

.landing-page:not([data-home-intro-state="complete"])
   :deep([data-home-intro-title]),
.landing-page:not([data-home-intro-state="complete"])
   :deep([data-home-intro-copy]),
.landing-page:not([data-home-intro-state="complete"])
   :deep([data-home-intro-card]) {
   visibility: hidden;
}

@media (max-width: 63.999rem) {
   .landing-page :deep([data-home-intro-card-remove]) {
      display: none;
   }

   .landing-page
      :deep([data-home-intro-card]:not([data-home-intro-card-remove])) {
      translate: 0 2.5rem;
   }

   .landing-page:not([data-home-intro-state="complete"])
      :deep([data-home-intro-title]),
   .landing-page:not([data-home-intro-state="complete"])
      :deep([data-home-intro-copy]),
   .landing-page:not([data-home-intro-state="complete"])
      :deep([data-home-intro-card]) {
      visibility: inherit;
   }
}

@media (prefers-reduced-motion: reduce) {
   .home-hero-scroll-space {
      height: 0;
   }

   .landing-page :deep([data-home-intro-card-remove]) {
      display: none;
   }

   .landing-page:not([data-home-intro-state="complete"])
      :deep([data-home-intro-title]),
   .landing-page:not([data-home-intro-state="complete"])
      :deep([data-home-intro-copy]),
   .landing-page:not([data-home-intro-state="complete"])
      :deep([data-home-intro-card]) {
      visibility: inherit;
   }
}
</style>
