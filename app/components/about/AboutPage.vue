<script setup lang="ts">
import { useTemplateRef } from "vue";
import DrawnLine from "@/components/shared/DrawnLine.vue";
import { aboutStoryLine } from "@/lib/about-line-path";
import AboutBrandsSection from "./AboutBrandsSection.vue";
import AboutCtaSection from "./AboutCtaSection.vue";
import AboutHero from "./AboutHero.vue";
import AboutTeamSection from "./AboutTeamSection.vue";
import AboutTrustSection from "./AboutTrustSection.vue";

const storyRoot = useTemplateRef<HTMLElement>("storyRoot");
useDrawnLineMotion(storyRoot, aboutStoryLine);
</script>

<template>
   <div class="about-page">
      <AboutHero />
      <AboutTeamSection />
      <div ref="storyRoot" class="about-story">
         <DrawnLine class="about-story-line" />
         <AboutTrustSection />
         <AboutBrandsSection data-drawn-line-anchor />
         <AboutCtaSection data-drawn-line-anchor />
      </div>
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-page {
   @apply overflow-x-clip;
}

.about-story {
   @apply relative isolate;
}

.about-story-line {
   @apply inset-0 size-full overflow-hidden text-foreground opacity-3;
}
</style>
