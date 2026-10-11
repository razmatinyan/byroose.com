<script setup lang="ts">
import { defineAsyncComponent, useTemplateRef } from "vue";
import { appIcons } from "@/lib/icons";
import { servicesHeroImages } from "@/lib/services-hero";

const TrailingTooltip = defineAsyncComponent(
   () => import("@/components/shared/TrailingTooltip.vue"),
);

interface HeroTitleLine {
   inset?: "link" | "media";
   lead: string;
   trail?: string;
}

const titleLines: readonly HeroTitleLine[] = [
   { inset: "link", lead: "We ", trail: "create" },
   { lead: "AI Content and" },
   { inset: "media", lead: "", trail: "Websites" },
];

const aboutLabel = "About";
const [poster] = servicesHeroImages;

function lineText({ lead, trail = "" }: HeroTitleLine) {
   return `${lead}${trail}`;
}

const titleLabel = titleLines.map(lineText).join(" ");

const heroRoot = useTemplateRef<HTMLElement>("heroRoot");
const { revealed } = useServicesHeroMotion(heroRoot);
const {
   active: tooltipActive,
   hide: hideTooltip,
   shouldLoad: shouldLoadTooltip,
   show: showTooltip,
} = useTrailingTooltip();

function showAboutTooltip() {
   showTooltip();
}
</script>

<template>
   <section
      ref="heroRoot"
      class="services-hero section-gutter"
      :data-services-hero-revealed="revealed || undefined"
   >
      <div class="services-hero-content" data-services-hero-content>
         <div class="services-hero-title" data-services-hero-reveal>
            <h1 class="sr-only">{{ titleLabel }}</h1>
            <span
               v-for="line in titleLines"
               :key="lineText(line)"
               class="services-hero-title-mask"
               data-services-hero-title-mask
            >
               <span
                  class="services-hero-title-line"
                  data-services-hero-title-line
                  ><span aria-hidden="true">{{ line.lead }}</span
                  ><NuxtLink
                     v-if="line.inset === 'link'"
                     class="services-hero-inset services-hero-link"
                     data-services-hero-inset
                     to="/about"
                     :aria-label="aboutLabel"
                     @click="hideTooltip"
                     @pointerenter="showAboutTooltip"
                     @pointerleave="hideTooltip"
                     ><span
                        class="services-hero-inset-content services-hero-link-content"
                        data-services-hero-inset-content
                        ><Icon
                           class="services-hero-link-icon"
                           :name="appIcons.arrowUpRight"
                           aria-hidden="true" /></span></NuxtLink
                  ><span
                     v-else-if="line.inset === 'media'"
                     class="services-hero-inset services-hero-media"
                     data-services-hero-inset
                     data-services-flight-origin
                     aria-hidden="true"
                     ><NuxtImg
                        v-if="poster"
                        class="services-hero-inset-content services-hero-poster"
                        data-services-hero-inset-content
                        :src="poster.src"
                        alt=""
                        :width="poster.width"
                        :height="poster.height"
                        sizes="sm:448px"
                        loading="eager"
                        draggable="false" /></span
                  ><span aria-hidden="true">{{ line.trail }}</span></span
               >
            </span>
         </div>
      </div>

      <TrailingTooltip
         v-if="shouldLoadTooltip"
         :active="tooltipActive"
         :icon="appIcons.arrowUpRight"
         :label="aboutLabel"
      />
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
   @apply font-bold tracking-[-0.05em];
   font-size: clamp(2rem, 11vw, 12rem);
   line-height: 0.88;
   margin-top: -0.2em;
   --services-hero-inset-height: 0.8em;
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

.services-hero-inset {
   @apply relative inline-block overflow-hidden rounded-[0.06em];
   height: var(--services-hero-inset-height);
   margin-inline-end: calc(0.12em * var(--services-hero-inset-open));
   vertical-align: -0.06em;
   width: calc(
      var(--services-hero-inset-width) * var(--services-hero-inset-open)
   );
   --services-hero-inset-open: 1;
}

.services-hero-inset > .services-hero-inset-content {
   @apply absolute top-0 left-1/2 h-full -translate-x-1/2;
   width: var(--services-hero-inset-width);
}

.services-hero-media {
   --services-hero-inset-width: calc(
      var(--services-hero-inset-height) * 16 / 9
   );
}

.services-hero-poster {
   @apply hidden object-cover select-none motion-reduce:block;
}

.services-hero-link {
   @apply bg-canvas-shade text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50;
   --services-hero-inset-width: var(--services-hero-inset-height);
}

.services-hero-link-content {
   @apply grid place-items-center p-[0.14em];
}

.services-hero-link-icon {
   @apply block size-full scale-[2];
}

.services-hero:not([data-services-hero-revealed]) [data-services-hero-reveal] {
   visibility: hidden;
}

.services-hero:not([data-services-hero-revealed]) [data-services-hero-inset] {
   --services-hero-inset-open: 0;
}

@media (prefers-reduced-motion: reduce) {
   .services-hero:not([data-services-hero-revealed])
      [data-services-hero-reveal] {
      visibility: inherit;
   }

   .services-hero:not([data-services-hero-revealed])
      [data-services-hero-inset] {
      --services-hero-inset-open: 1;
   }
}
</style>
