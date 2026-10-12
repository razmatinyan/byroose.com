<script setup lang="ts">
import ProjectCtaSection from "@/components/shared/ProjectCtaSection.vue";
import WorkHero from "./WorkHero.vue";
import WorkProjectsSection from "./WorkProjectsSection.vue";
</script>

<template>
   <div class="work-page">
      <WorkHero />
      <WorkProjectsSection />
      <ProjectCtaSection />
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.work-page {
   @apply relative overflow-x-clip;
}
</style>
