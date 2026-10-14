<script setup lang="ts">
import WorkPage from "@/components/work/WorkPage.vue";
import { pageSeo } from "@/lib/page-seo";

usePageSeo(pageSeo.work);
</script>

<template>
   <WorkPage />
</template>
