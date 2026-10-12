<script setup lang="ts">
import {
   computed,
   defineAsyncComponent,
   shallowRef,
   useTemplateRef,
} from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import WaveUnderline from "@/components/shared/WaveUnderline.vue";
import { appIcons } from "@/lib/icons";
import { servicesAnchors, servicesSectionPath } from "@/lib/services-anchors";
import type { ServicesAnchor } from "@/lib/services-anchors";
import type { SplitTextResult } from "@/lib/split-text";

const TrailingTooltip = defineAsyncComponent(
   () => import("@/components/shared/TrailingTooltip.vue"),
);

interface Service {
   anchor: ServicesAnchor;
   description: string;
   image: string;
   surface: "canvas" | "dark";
   title: string;
}

const introLines = ["What can we do", "for"];
const introUnderlinedWord = "You?";
const introPhrases = [...introLines, introUnderlinedWord];
const introTitle = introPhrases.join(" ");
const lastIntroLineIndex = introLines.length - 1;
const tooltipText = "More Details";

const servicesData: Service[] = [
   {
      anchor: servicesAnchors.aiContent,
      description:
         "Visuals, video, reels and site imagery produced through an AI pipeline with a human editor on every asset. Planned as a quarterly slate instead of one-off requests.",
      image: "/images/hero/5.png",
      surface: "canvas",
      title: "AI Content Creation",
   },
   {
      anchor: servicesAnchors.web,
      description:
         "Design and build in the same sprint. Headless CMS, clean analytics, accessibility that passes audit, a handover your team can maintain.",
      image: "/images/hero/6.png",
      surface: "dark",
      title: "Website Development",
   },
];

const tooltipPreload = servicesData.map((service) => service.image);

const servicesRoot = useTemplateRef<HTMLElement>("servicesRoot");
const introSplits = shallowRef<(SplitTextResult | undefined)[]>(
   introPhrases.map(() => undefined),
);
const descriptionSplits = shallowRef<(SplitTextResult | undefined)[]>(
   servicesData.map(() => undefined),
);
const {
   active: tooltipActive,
   hide: hideTooltip,
   image: tooltipImage,
   label: tooltipLabel,
   shouldLoad: shouldLoadTooltip,
   show: showTooltip,
   size: tooltipSize,
} = useTrailingTooltip();

const tooltipIcon = computed(() =>
   tooltipImage.value ? undefined : appIcons.arrowUpRight,
);

const { introRevealed } = useServicesMotion(servicesRoot, {
   descriptionSplits,
   introSplits,
});

function withSplit(
   splits: (SplitTextResult | undefined)[],
   index: number,
   parts: SplitTextResult,
) {
   return splits.map((entry, entryIndex) =>
      entryIndex === index ? parts : entry,
   );
}

function setIntroSplit(index: number, parts: SplitTextResult) {
   introSplits.value = withSplit(introSplits.value, index, parts);
}

function setDescriptionSplit(index: number, parts: SplitTextResult) {
   descriptionSplits.value = withSplit(descriptionSplits.value, index, parts);
}
</script>

<template>
   <section id="services" ref="servicesRoot" class="services">
      <div class="services-intro section-gutter" data-services-intro>
         <h2 class="section-title services-intro-title">
            <span class="sr-only">{{ introTitle }}</span>
            <span aria-hidden="true">
               <span
                  v-for="(line, index) in introLines"
                  :key="line"
                  class="services-intro-line"
               >
                  <SplitText
                     aria="none"
                     :text="line"
                     @split="setIntroSplit(index, $event)"
                  />
                  <span
                     v-if="index === lastIntroLineIndex"
                     class="services-intro-underlined"
                  >
                     <SplitText
                        aria="none"
                        :text="introUnderlinedWord"
                        @split="setIntroSplit(introLines.length, $event)"
                     />
                     <WaveUnderline
                        class="services-intro-wave"
                        color="var(--color-primary)"
                        :drawn="introRevealed"
                     />
                  </span>
               </span>
            </span>
         </h2>
      </div>

      <article
         v-for="(service, index) in servicesData"
         :key="service.title"
         class="service-panel"
         :class="{ 'service-panel-dark': service.surface === 'dark' }"
         data-service-panel
      >
         <div
            v-if="service.surface === 'dark'"
            class="service-backdrop"
            data-service-backdrop
            aria-hidden="true"
         >
            <div
               class="service-backdrop-surface"
               data-service-backdrop-surface
               data-header-surface="dark"
            />
            <div
               class="service-backdrop-curve"
               data-service-backdrop-curve
               data-header-surface="dark"
            />
         </div>
         <div class="service-content" data-service-content>
            <h3 class="service-title" data-service-title>
               {{ service.title }}
            </h3>

            <NuxtLink
               class="service-link inset-arrow-link"
               data-service-link
               :to="servicesSectionPath(service.anchor)"
               :aria-label="`Explore ${service.title}`"
               @click="hideTooltip"
               @pointerenter="showTooltip('', tooltipText, 'compact')"
               @pointerleave="hideTooltip"
            >
               <span class="service-link-surface inset-arrow-surface">
                  <span
                     class="service-link-content"
                     data-service-link-content
                  >
                     <Icon
                        class="inset-arrow-icon"
                        :name="appIcons.arrowUpRight"
                        aria-hidden="true"
                     />
                  </span>
               </span>
            </NuxtLink>

            <SplitText
               class="service-description"
               as="p"
               auto-split
               mask="lines"
               :text="service.description"
               type="lines,words"
               @split="setDescriptionSplit(index, $event)"
            />

            <div class="service-media-frame" data-service-media-frame>
               <div class="service-media-exit" data-service-media-exit>
                  <NuxtLink
                     class="service-media"
                     data-service-media
                     :to="servicesSectionPath(service.anchor)"
                     :aria-label="`More details about ${service.title}`"
                     @pointerenter="
                        showTooltip(service.image, tooltipText, 'compact')
                     "
                     @pointerleave="hideTooltip"
                  >
                     <NuxtImg
                        class="service-image"
                        data-service-image
                        :src="service.image"
                        alt=""
                        width="1456"
                        height="816"
                        sizes="sm:1024px md:1280px lg:1536px"
                        densities="x1"
                        loading="lazy"
                        draggable="false"
                     />
                  </NuxtLink>
               </div>
            </div>
         </div>
      </article>

      <TrailingTooltip
         v-if="shouldLoadTooltip"
         :active="tooltipActive"
         :icon="tooltipIcon"
         :image="tooltipImage"
         :label="tooltipLabel"
         :preload="tooltipPreload"
         :size="tooltipSize"
      />
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.services {
   @apply w-full pb-section;
}

.services-intro {
   @apply flex min-h-svh items-center justify-center;
}

.services-intro-title {
   @apply text-center leading-[0.95] select-none;
   font-size: clamp(3rem, 10vw, 12rem);
}

.services-intro-line {
   @apply block whitespace-nowrap;
}

.services-intro-underlined {
   @apply relative ml-[0.25em] inline-block;
}

.services-intro-wave {
   @apply absolute top-full left-0 -mt-[0.04em];
}

.services-intro-title :deep(.split-text-word) {
   display: inline-block;
   visibility: hidden;
}

.service-panel {
   @apply relative px-[clamp(1rem,2vw,1.5rem)] pt-section;
   padding-bottom: calc(var(--service-runway, 0) * 100svh);
}

.service-panel-dark .service-title,
.service-panel-dark .service-description {
   @apply text-background mix-blend-difference;
}

.service-backdrop {
   @apply absolute inset-x-0 bottom-0 -z-10;
   top: calc(var(--service-backdrop-lead, 0) * -100svh);
}

.service-backdrop-surface {
   @apply absolute inset-0 bg-foreground;
}

.service-backdrop-curve {
   @apply absolute top-full -left-1/4 -mt-px h-[clamp(4rem,10vw,10rem)] w-[150%] origin-top bg-foreground;
   border-radius: 0 0 50% 50% / 0 0 100% 100%;
   transform: scaleY(0);
}

.service-content {
   @apply relative flex flex-col items-center gap-5 text-center md:grid md:grid-cols-3 md:items-start md:gap-x-0 md:gap-y-7;
}

.service-title {
   @apply m-0 w-full text-left text-service font-bold tracking-[-0.045em] text-balance md:col-span-3;
}

.service-link {
   @apply relative mt-4 block size-[3.06em] shrink-0 self-start rounded-[7.5%] text-2xl md:col-start-1 md:mt-8 md:ml-[0.5em] md:size-auto md:aspect-square md:self-stretch md:justify-self-start md:text-4xl xl:mt-12 xl:text-6xl;
   --service-link-open: 0;
}

.service-link:focus-visible {
   --service-link-open: 1;
}

.service-link-surface {
   @apply absolute inset-0 overflow-hidden rounded-[inherit];
   clip-path: inset(
      0 calc((1 - var(--service-link-open)) * 100%) 0 0 round 7.5%
   );
}

.service-link-content {
   @apply grid size-full place-items-center p-[17.5%];
}

.service-description {
   @apply m-0 mt-4 w-full text-left md:col-span-2 md:col-start-2 md:mt-8 xl:mt-12 text-2xl leading-[0.9] font-semibold tracking-[-0.04em] text-pretty text-foreground md:text-4xl xl:text-6xl;
}

.service-description :deep(.split-text-line),
.service-description :deep(.split-text-line-mask) {
   display: block;
}

.service-description :deep(.split-text-line) {
   white-space: nowrap;
}

.service-description :deep(.split-text-line-mask) {
   margin-block: -0.12em -0.18em;
   padding-block: 0.12em 0.18em;
}

.service-description :deep(.split-text-word) {
   display: inline-block;
}

.service-description :deep(.split-text-line) {
   visibility: hidden;
}

.service-media-frame {
   @apply mt-3 w-full md:col-span-3;
}

@media (prefers-reduced-motion: reduce) {
   .service-link {
      --service-link-open: 1;
   }
}

.service-media-exit {
   @apply origin-top;
}

.service-media {
   @apply block aspect-[1456/816] w-full origin-bottom overflow-hidden rounded-2xl bg-muted;
}

.service-image {
   @apply pointer-events-none size-full object-cover select-none;
}
</style>
