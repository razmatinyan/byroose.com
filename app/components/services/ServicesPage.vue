<script setup lang="ts">
import { servicePagePaths, servicesAnchors } from "@/lib/services-anchors";
import ServicesHero from "./ServicesHero.vue";
import ServicesOfferSection from "./ServicesOfferSection.vue";
import ServicesStatementSection from "./ServicesStatementSection.vue";

const belowFoldHydrationArea = { rootMargin: "100% 0px" };

const services = [
   {
      anchor: servicesAnchors.aiContent,
      description:
         "Content people stop for. AI videos, reels, UGC ads, and AI product photography, directed and edited by humans.",
      linkLabel: "See AI content creation services",
      linkTo: servicePagePaths.aiContent,
      surface: "light",
      title: "AI Content Creation",
   },
   {
      anchor: servicesAnchors.web,
      description:
         "A website that feels like the post they just tapped. From conversion-focused landing pages to full websites and custom web platforms, designed around your content.",
      linkLabel: "See web development services",
      linkTo: servicePagePaths.web,
      surface: "dark",
      title: "Website Development",
   },
] as const;
</script>

<template>
   <div class="services-page">
      <ServicesHero />
      <ServicesStatementSection />
      <ServicesOfferSection
         v-for="service in services"
         :key="service.anchor"
         v-bind="service"
      />
      <LazySharedPricingSection
         class="pb-section"
         default-category="combined"
         :hydrate-on-visible="belowFoldHydrationArea"
      />
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.services-page {
   @apply relative overflow-x-clip;
}
</style>
