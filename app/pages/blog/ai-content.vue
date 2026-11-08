<script setup lang="ts">
import BlogPage from "@/components/blog/BlogPage.vue";
import { blogCategoryPages } from "@/lib/blog-categories";

const categoryPage = blogCategoryPages.aiContent;

usePageSeo(categoryPage.seo);
</script>

<template>
   <BlogPage :category-page="categoryPage" />
</template>
