<script setup lang="ts">
import ServicesPage from "@/components/services/ServicesPage.vue";
import { pageSeo } from "@/lib/page-seo";

usePageSeo(pageSeo.services);
</script>

<template>
   <ServicesPage />
</template>
