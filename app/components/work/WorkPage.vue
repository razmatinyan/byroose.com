<script setup lang="ts">
import WorkHero from "./WorkHero.vue";
import WorkProjectsSection from "./WorkProjectsSection.vue";
</script>

<template>
   <div class="work-page">
      <WorkHero />
      <WorkProjectsSection />
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.work-page {
   @apply relative overflow-x-clip;
}
</style>
