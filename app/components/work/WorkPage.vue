<script setup lang="ts">
import WorkHero from "./WorkHero.vue";
import WorkProjectsSection from "./WorkProjectsSection.vue";

const belowFoldHydrationArea = { rootMargin: "100% 0px" };
</script>

<template>
   <div class="work-page">
      <WorkHero />
      <WorkProjectsSection />
      <LazySharedPricingSection
         class="py-section"
         :clear-curve="false"
         :hydrate-on-visible="belowFoldHydrationArea"
      />
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.work-page {
   @apply relative overflow-x-clip;
}
</style>
