<script setup lang="ts">
import ServicesPage from "@/components/services/ServicesPage.vue";

const title = "Services | AI content creation and web development";
const description =
   "byroose creates AI content and builds websites in one connected practice, from visuals, videos, and reels to clear, fast sites designed to convert.";

useSeoMeta({
   description,
   ogDescription: description,
   ogTitle: title,
   title,
});
</script>

<template>
   <ServicesPage />
</template>
