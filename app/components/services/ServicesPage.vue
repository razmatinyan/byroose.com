<script setup lang="ts">
import ServicesHero from "./ServicesHero.vue";
import ServicesStatementSection from "./ServicesStatementSection.vue";
</script>

<template>
   <div class="services-page">
      <ServicesHero />
      <ServicesStatementSection />
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.services-page {
   @apply overflow-x-clip;
}
</style>
