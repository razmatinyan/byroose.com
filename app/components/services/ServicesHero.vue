<script setup lang="ts">
import { useTemplateRef } from "vue";
import ImageCycle from "@/components/shared/ImageCycle.vue";

interface HeroImage {
   height: number;
   src: string;
   width: number;
}

interface HeroTitleLine {
   images?: readonly HeroImage[];
   lead: string;
   trail?: string;
}

const websiteImages: readonly HeroImage[] = [
   { height: 816, src: "/images/hero/1.png", width: 1456 },
   { height: 816, src: "/images/hero/2.png", width: 1456 },
   { height: 816, src: "/images/hero/3.png", width: 1456 },
   { height: 816, src: "/images/hero/4.png", width: 1456 },
];

const titleLines: readonly HeroTitleLine[] = [
   { lead: "We create" },
   { lead: "AI Content and" },
   { images: websiteImages, lead: "", trail: "Websites" },
];

function lineText({ lead, trail = "" }: HeroTitleLine) {
   return `${lead}${trail}`;
}

const titleLabel = titleLines.map(lineText).join(" ");

const heroRoot = useTemplateRef<HTMLElement>("heroRoot");
const { revealed } = useServicesHeroMotion(heroRoot);
</script>

<template>
   <section
      ref="heroRoot"
      class="services-hero section-gutter"
      :data-services-hero-revealed="revealed || undefined"
   >
      <div class="services-hero-content" data-services-hero-content>
         <h1 class="services-hero-title" data-services-hero-reveal>
            <span class="sr-only">{{ titleLabel }}</span>
            <span aria-hidden="true">
               <span
                  v-for="line in titleLines"
                  :key="lineText(line)"
                  class="services-hero-title-mask"
                  data-services-hero-title-mask
               >
                  <span
                     class="services-hero-title-line"
                     data-services-hero-title-line
                     >{{ line.lead
                     }}<span
                        v-if="line.images"
                        class="services-hero-media"
                        data-services-hero-media
                        ><ImageCycle
                           class="services-hero-media-image"
                           data-services-hero-media-image
                           :images="line.images"
                           loading="eager"
                           sizes="sm:448px" /></span
                     >{{ line.trail }}</span
                  >
               </span>
            </span>
         </h1>
      </div>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.services-hero {
   @apply relative grid place-items-center pb-16 sm:pb-20;
   min-height: calc(100svh - 4.75rem - var(--services-hero-peek));
   --services-hero-peek: clamp(3rem, 9svh, 6rem);
}

.services-hero-content {
   @apply text-center;
}

.services-hero-title {
   @apply m-0 font-bold tracking-[-0.05em];
   font-size: clamp(2rem, 11vw, 12rem);
   line-height: 0.88;
   margin-top: -0.2em;
   --services-hero-media-height: 0.8em;
   --services-hero-media-width: calc(var(--services-hero-media-height) * 16 / 9);
}

.services-hero-title-mask,
.services-hero-title-line {
   @apply block;
}

.services-hero-title-mask {
   margin-bottom: -0.4em;
   padding-block: 0.2em;
}

.services-hero-title-line {
   @apply whitespace-nowrap;
}

.services-hero-media {
   @apply relative inline-block overflow-hidden rounded-[0.06em] bg-muted;
   height: var(--services-hero-media-height);
   margin-inline-end: calc(0.12em * var(--services-hero-media-open));
   vertical-align: -0.06em;
   width: calc(
      var(--services-hero-media-width) * var(--services-hero-media-open)
   );
   --services-hero-media-open: 1;
}

.services-hero-media > .services-hero-media-image {
   @apply absolute top-0 left-1/2 h-full -translate-x-1/2;
   width: var(--services-hero-media-width);
}

.services-hero:not([data-services-hero-revealed]) [data-services-hero-reveal] {
   visibility: hidden;
}

.services-hero:not([data-services-hero-revealed]) [data-services-hero-media] {
   --services-hero-media-open: 0;
}

@media (prefers-reduced-motion: reduce) {
   .services-hero:not([data-services-hero-revealed])
      [data-services-hero-reveal] {
      visibility: inherit;
   }

   .services-hero:not([data-services-hero-revealed])
      [data-services-hero-media] {
      --services-hero-media-open: 1;
   }
}
</style>
