<script setup lang="ts">
import AboutPage from "@/components/about/AboutPage.vue";

const title = "About byroose | AI content creation and web development";
const description =
   "Meet the team behind byroose, a creative agency that pairs AI content creation with web development so brands get seen, trusted, and chosen.";

useSeoMeta({
   description,
   ogDescription: description,
   ogTitle: title,
   title,
});
</script>

<template>
   <AboutPage />
</template>
