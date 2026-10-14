<script setup lang="ts">
import { NuxtLink } from "#components";
import { Button, ButtonIcon } from "@/components/ui/button";

const { title, path, cover } = defineProps<{
   title: string;
   path: string;
   cover: { src: string; width: number; height: number; alt: string };
}>();
</script>

<template>
   <section class="next-post section-gutter" aria-labelledby="next-post-title">
      <NuxtImg
         :src="cover.src"
         :alt="cover.alt"
         :width="cover.width"
         :height="cover.height"
         sizes="sm:640px md:768px lg:768px xl:1024px"
         densities="x1"
         loading="lazy"
         class="next-post-image"
      />
      <div class="next-post-panel">
         <p class="next-post-label">Next article</p>
         <h2 id="next-post-title" class="next-post-title">{{ title }}</h2>
         <Button :as="NuxtLink" :to="path" size="cta-sm" variant="dark">
            Read the article
            <template #icon>
               <ButtonIcon size="sm" />
            </template>
         </Button>
      </div>
   </section>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.next-post {
   @apply grid gap-3 pb-25 md:grid-cols-2;
}

.next-post-image {
   @apply aspect-4/3 h-full w-full rounded-lg object-cover md:aspect-auto md:min-h-104;
}

.next-post-panel {
   @apply flex flex-col items-center justify-center gap-5 rounded-lg bg-canvas-shade px-6 py-14 text-center;
}

.next-post-label {
   @apply text-sm font-medium text-muted-foreground;
}

.next-post-title {
   @apply max-w-[16em] text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance md:text-4xl;
}
</style>
