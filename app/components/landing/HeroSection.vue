<script setup lang="ts">
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";

const emit = defineEmits<{
   titleSplit: [parts: SplitTextResult];
}>();

const heroTitle = "Make noise. Make sense. Make money.";

const heroImages = [
   {
      id: "hero-one",
      preload: true,
      removed: true,
      rotation: 0,
      src: "/images/hero/1.png",
   },
   {
      id: "hero-two",
      preload: false,
      removed: true,
      rotation: 0,
      src: "/images/hero/2.png",
   },
   {
      id: "hero-three",
      preload: false,
      removed: true,
      rotation: -3,
      src: "/images/hero/3.png",
   },
   {
      id: "hero-four",
      preload: false,
      removed: true,
      rotation: 2,
      src: "/images/hero/4.png",
   },
   {
      id: "hero-five",
      preload: false,
      removed: true,
      rotation: -1.5,
      src: "/images/hero/5.png",
   },
   {
      id: "hero-six",
      preload: false,
      removed: true,
      rotation: 2.5,
      src: "/images/hero/6.png",
   },
   {
      id: "hero-seven",
      preload: true,
      removed: false,
      rotation: -1.5,
      src: "/images/hero/3.png",
   },
   {
      id: "hero-eight",
      preload: false,
      removed: false,
      rotation: 2,
      src: "/images/hero/2.png",
   },
   {
      id: "hero-nine",
      preload: false,
      removed: false,
      rotation: -3,
      src: "/images/hero/5.png",
   },
   {
      id: "hero-ten",
      preload: false,
      removed: false,
      rotation: 2,
      src: "/images/hero/1.png",
   },
] as const;

function handleTitleSplit(parts: SplitTextResult) {
   emit("titleSplit", parts);
}
</script>

<template>
   <section id="top" class="hero section-gutter">
      <div class="hero-intro">
         <SplitText
            class="hero-title"
            data-home-intro-title
            as="h1"
            mask="lines"
            :text="heroTitle"
            type="lines"
            @split="handleTitleSplit"
         />
      </div>

      <div data-home-intro-media-grid class="hero-media-grid">
         <article
            v-for="image in heroImages"
            :key="image.id"
            data-home-intro-card
            class="hero-media-card"
            :class="{ 'hero-media-card-remove': image.removed }"
            :data-home-intro-card-remove="image.removed ? '' : undefined"
            :data-home-intro-card-rotation="image.rotation"
         >
            <NuxtImg
               class="hero-media-image"
               :src="image.src"
               alt=""
               width="1456"
               height="816"
               sizes="640px"
               loading="eager"
               :preload="image.preload"
               draggable="false"
            />
         </article>
      </div>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.hero {
   @apply grid w-full grid-rows-[minmax(0,1fr)_auto] pt-4 pb-4 sm:pt-6 sm:pb-6;
   min-height: calc(100svh - 5rem);
}

.hero-intro {
   @apply flex min-h-0 items-center justify-center py-10 sm:py-14;
}

.hero-title {
   @apply m-0 w-full text-center font-bold tracking-[-0.045em];
   font-size: clamp(1.75rem, 6.8vw, 7.25rem);
   line-height: 0.99;
   max-width: min(100%, 13.5em);
}

.hero-title :deep(.split-text-line),
.hero-title :deep(.split-text-line-mask) {
   display: block;
}

.hero-title :deep(.split-text-line) {
   will-change: transform;
}

.hero-media-grid {
   @apply relative grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4;
}

.hero-media-card {
   @apply relative aspect-4/3 overflow-hidden rounded-md bg-muted;
   transform-origin: center;
}

.hero-media-card-remove {
   @apply absolute top-0 left-1/2 w-[calc((100%_-_0.5rem)/2)] -translate-x-1/2 sm:w-[calc((100%_-_0.75rem)/2)] lg:w-[calc((100%_-_2.25rem)/4)];
}

.hero-media-card:not(.hero-media-card-remove) {
   transform: scale(1.08) rotate(var(--hero-card-rotation, 0deg));
}

.hero-media-card[data-home-intro-card-rotation="-3"] {
   --hero-card-rotation: -3deg;
}

.hero-media-card[data-home-intro-card-rotation="2"] {
   --hero-card-rotation: 2deg;
}

.hero-media-card[data-home-intro-card-rotation="-1.5"] {
   --hero-card-rotation: -1.5deg;
}

.hero-media-card[data-home-intro-card-rotation="2.5"] {
   --hero-card-rotation: 2.5deg;
}

.hero-media-image {
   @apply absolute inset-0 size-full object-cover;
}
</style>
