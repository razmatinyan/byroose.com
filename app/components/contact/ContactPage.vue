<script setup lang="ts">
import { shallowRef } from "vue";
import ContactHero from "@/components/contact/ContactHero.vue";
import FaqSection from "@/components/shared/FaqSection.vue";

const heroRevealed = shallowRef(false);

useSchemaOrg([defineWebPage({ "@type": "ContactPage" })]);

function releaseFaqReveal() {
   heroRevealed.value = true;
}
</script>

<template>
   <div class="contact-page">
      <ContactHero @revealed="releaseFaqReveal" />
      <FaqSection :reveal-ready="heroRevealed" :structured-data="false" />
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.contact-page {
   @apply overflow-x-clip;
}
</style>
