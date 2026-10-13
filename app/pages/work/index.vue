<script setup lang="ts">
import WorkPage from "@/components/work/WorkPage.vue";

const title = "Our work | AI content and website projects by byroose";
const description =
   "Browse byroose projects: reels, video, and AI imagery alongside websites designed and coded from scratch. Filter by AI content or website development.";

useSeoMeta({
   description,
   ogDescription: description,
   ogTitle: title,
   title,
});
</script>

<template>
   <WorkPage />
</template>
