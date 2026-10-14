<script setup lang="ts">
import BlogPage from "@/components/blog/BlogPage.vue";
import { pageSeo } from "@/lib/page-seo";

usePageSeo(pageSeo.blog);
</script>

<template>
   <BlogPage />
</template>
