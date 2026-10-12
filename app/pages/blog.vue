<script setup lang="ts">
import BlogPage from "@/components/blog/BlogPage.vue";

const title = "Our blog | AI content and web development insights";
const description =
   "Read practical byroose articles about AI content creation, web development, and turning audience attention into action.";

useSeoMeta({
   description,
   ogDescription: description,
   ogTitle: title,
   title,
});
</script>

<template>
   <BlogPage />
</template>
