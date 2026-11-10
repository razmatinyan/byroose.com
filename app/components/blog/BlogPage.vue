<script setup lang="ts">
import type { BlogCategoryPage } from "@/lib/blog-categories";
import BlogArticlesSection from "./BlogArticlesSection.vue";
import BlogHero from "./BlogHero.vue";

const belowFoldHydrationArea = { rootMargin: "100% 0px" };

const { categoryPage } = defineProps<{
   categoryPage?: BlogCategoryPage;
}>();
</script>

<template>
   <div class="blog-page">
      <BlogHero
         v-if="categoryPage"
         :title-words="categoryPage.titleWords"
         :title-size="categoryPage.titleSize"
         :description="categoryPage.description"
      />
      <BlogHero v-else />
      <BlogArticlesSection :category="categoryPage?.category" />
      <LazySharedPricingSection
         class="py-section"
         :clear-curve="false"
         :hydrate-on-visible="belowFoldHydrationArea"
      />
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.blog-page {
   @apply relative overflow-x-clip;
}
</style>
