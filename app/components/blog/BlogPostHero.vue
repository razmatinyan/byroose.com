<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";

const { title, cover } = defineProps<{
   title: string;
   cover: { src: string; width: number; height: number; alt: string };
}>();

const titleSplit = shallowRef<SplitTextResult>();
const coverFrame = useTemplateRef<HTMLElement>("coverFrame");
const { revealed } = useBlogPostHeroMotion(titleSplit, coverFrame);

function setTitleSplit(parts: SplitTextResult) {
   titleSplit.value = parts;
}
</script>

<template>
   <div class="post-hero" :data-post-hero-revealed="revealed || undefined">
      <header class="post-hero-header section-gutter">
         <SplitText
            as="h1"
            class="post-hero-title"
            data-post-hero-reveal
            :text="title"
            type="words"
            mask="words"
            @split="setTitleSplit"
         />
      </header>

      <div class="section-gutter">
         <div ref="coverFrame" class="post-hero-cover" data-post-hero-reveal>
            <NuxtImg
               :src="cover.src"
               :alt="cover.alt"
               :width="cover.width"
               :height="cover.height"
               sizes="100vw"
               densities="x1"
               loading="eager"
               fetchpriority="high"
               class="post-hero-image"
            />
         </div>
      </div>
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.post-hero-header {
   @apply grid place-items-center py-16 text-center;
   min-height: calc(100svh - 4.75rem - var(--post-hero-peek));
   --post-hero-peek: clamp(4rem, 14svh, 9rem);
}

.post-hero-title {
   @apply max-w-[16em] text-5xl leading-[1.02] font-semibold tracking-[-0.045em] text-balance md:text-7xl xl:text-8xl;
}

.post-hero-title :deep(.split-text-word),
.post-hero-title :deep(.split-text-word-mask) {
   display: inline-block;
}

.post-hero-title :deep(.split-text-word-mask) {
   margin-block: -0.12em -0.2em;
   padding-block: 0.12em 0.2em;
}

.post-hero-cover {
   @apply overflow-hidden rounded-lg;
}

.post-hero-image {
   @apply block h-auto w-full;
}

.post-hero:not([data-post-hero-revealed]) [data-post-hero-reveal] {
   visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
   .post-hero:not([data-post-hero-revealed]) [data-post-hero-reveal] {
      visibility: inherit;
   }
}
</style>
