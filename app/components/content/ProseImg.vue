<script setup lang="ts">
const { src, alt = "", width, height } = defineProps<{
   src: string;
   alt?: string;
   width?: string | number;
   height?: string | number;
}>();
</script>

<template>
   <NuxtImg
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      sizes="sm:640px md:768px lg:896px"
      densities="x1"
      loading="lazy"
      class="article-image"
   />
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.article-image {
   @apply my-12 block h-auto w-full rounded-lg;
}
</style>
