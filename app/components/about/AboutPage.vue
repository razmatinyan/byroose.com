<script setup lang="ts">
import AboutBrandsSection from "./AboutBrandsSection.vue";
import AboutCtaSection from "./AboutCtaSection.vue";
import AboutHero from "./AboutHero.vue";
import AboutTeamSection from "./AboutTeamSection.vue";
import AboutTrustSection from "./AboutTrustSection.vue";
</script>

<template>
   <div class="about-page">
      <AboutHero />
      <AboutTeamSection />
      <AboutTrustSection />
      <AboutBrandsSection />
      <AboutCtaSection />
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-page {
   @apply overflow-x-clip;
}
</style>
