<script setup lang="ts">
import AboutPage from "@/components/about/AboutPage.vue";
import { pageSeo } from "@/lib/page-seo";

usePageSeo(pageSeo.about);
</script>

<template>
   <AboutPage />
</template>
