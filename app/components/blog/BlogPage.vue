<script setup lang="ts">
import BlogArticlesSection from "./BlogArticlesSection.vue";
import BlogHero from "./BlogHero.vue";
</script>

<template>
   <div class="blog-page">
      <BlogHero />
      <BlogArticlesSection />
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.blog-page {
   @apply relative overflow-x-clip;
}
</style>
