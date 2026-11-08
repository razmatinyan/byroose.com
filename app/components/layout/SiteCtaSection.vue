<script setup lang="ts">
import {
   computed,
   defineAsyncComponent,
   shallowRef,
   useTemplateRef,
} from "vue";
import { NuxtLink } from "#components";
import ProjectMarqueeCard from "@/components/cards/ProjectMarqueeCard.vue";
import SplitText from "@/components/shared/SplitText.vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { appIcons } from "@/lib/icons";
import { siteCtaFor } from "@/lib/site-cta";
import type { SplitTextResult } from "@/lib/split-text";

const TrailingTooltip = defineAsyncComponent(
   () => import("@/components/shared/TrailingTooltip.vue"),
);

const minimumMarqueeCards = 4;
const marqueeCopies = ["primary", "duplicate"] as const;

const route = useRoute();
const { description, titleLines, titleScale = 1 } = siteCtaFor(route.path);
const title = titleLines.join(" ");
const contactRoute = "/contact";
const actionLabel = "Start a project";
const tooltipLabel = "View Project";

const ctaRoot = useTemplateRef<HTMLElement>("ctaRoot");
const marquee = useTemplateRef<HTMLElement>("marquee");
const marqueeTrack = useTemplateRef<HTMLElement>("marqueeTrack");
const titleSplits = shallowRef<(SplitTextResult | undefined)[]>(
   titleLines.map(() => undefined),
);
const descriptionSplit = shallowRef<SplitTextResult>();

const marqueeProjects = computed(() => {
   const shown = projects.filter(
      ({ slug }) => route.path !== `/work/${slug}`,
   );
   if (!shown.length) return [];

   const cycles = Math.ceil(minimumMarqueeCards / shown.length);
   return Array.from({ length: cycles }, (_, cycle) =>
      shown.map((project) => ({
         key: `${project.slug}-${cycle}`,
         project,
         repeated: cycle > 0,
      })),
   ).flat();
});

const {
   active: tooltipActive,
   hide: hideTooltip,
   shouldLoad: shouldLoadTooltip,
   show: showTooltip,
   size: tooltipSize,
} = useTrailingTooltip();

useSiteCtaMotion(ctaRoot, titleSplits, () =>
   description ? descriptionSplit.value : null,
);
useFitText(
   () => ctaRoot.value?.querySelector<HTMLElement>("[data-site-cta-title]"),
   { fill: titleScale, maxScale: 1 },
);
useProjectMarquee(
   marquee,
   marqueeTrack,
   () => marqueeProjects.value.length * marqueeCopies.length,
);

function setTitleSplit(index: number, parts: SplitTextResult) {
   titleSplits.value = titleSplits.value.map((entry, entryIndex) =>
      entryIndex === index ? parts : entry,
   );
}

function showCardTooltip() {
   showTooltip("", tooltipLabel, "compact");
}

function setDescriptionSplit(parts: SplitTextResult) {
   descriptionSplit.value = parts;
}
</script>

<template>
   <section
      ref="ctaRoot"
      class="site-cta"
      :style="{ '--site-cta-title-scale': titleScale }"
   >
      <div class="site-cta-copy">
         <h2 class="site-cta-title" data-site-cta-title>
            <span class="sr-only">{{ title }}</span>
            <span aria-hidden="true">
               <SplitText
                  v-for="(line, index) in titleLines"
                  :key="line"
                  class="site-cta-title-line"
                  aria="none"
                  mask="lines"
                  :text="line"
                  type="lines"
                  @split="setTitleSplit(index, $event)"
               />
            </span>
         </h2>
         <SplitText
            v-if="description"
            class="site-cta-description"
            as="p"
            mask="lines"
            :text="description"
            type="lines"
            @split="setDescriptionSplit"
         />
         <div class="site-cta-action-mask">
            <span class="site-cta-action-rise" data-site-cta-action>
               <Button
                  class="site-cta-action"
                  :as="NuxtLink"
                  :to="contactRoute"
                  variant="default"
                  size="cta-lg"
                  :bounce-on-hover="true"
               >
                  {{ actionLabel }}
                  <template #icon>
                     <ButtonIcon :icon="appIcons.arrowRight" />
                  </template>
               </Button>
            </span>
         </div>
      </div>
      <nav
         v-if="marqueeProjects.length"
         ref="marquee"
         class="site-cta-marquee"
         aria-label="Our projects"
      >
         <div ref="marqueeTrack" class="site-cta-marquee-track">
            <div
               v-for="copy in marqueeCopies"
               :key="copy"
               class="site-cta-marquee-group"
            >
               <ProjectMarqueeCard
                  v-for="item in marqueeProjects"
                  :key="item.key"
                  class="site-cta-marquee-card"
                  :project="item.project"
                  :duplicate="copy === 'duplicate' || item.repeated"
                  @pointerenter="showCardTooltip"
                  @pointerleave="hideTooltip"
               />
            </div>
         </div>
      </nav>
      <TrailingTooltip
         v-if="shouldLoadTooltip"
         :active="tooltipActive"
         :icon="appIcons.arrowRight"
         :size="tooltipSize"
         :label="tooltipLabel"
      />
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-cta {
   @apply relative grid min-h-svh grid-cols-1 bg-background text-foreground lg:grid-cols-2;
}

.site-cta-copy {
   @apply flex min-w-0 flex-col items-start justify-center px-page pt-section pb-12 text-left lg:py-section lg:pr-12;
}

.site-cta-title {
   @apply m-0 w-max max-w-none leading-[0.9] font-bold tracking-[-0.05em];
   font-size: calc(
      clamp(1.75rem, 8.6vw, 9.5rem) * var(--site-cta-title-scale, 1) *
         var(--fit-text-scale, 1)
   );
}

.site-cta-description {
   @apply m-0 mt-8 max-w-[38ch] text-xl leading-tight font-medium tracking-[-0.03em] text-balance text-foreground/60 md:mt-10 md:text-2xl;
}

.site-cta-description :deep(.split-text-line),
.site-cta-description :deep(.split-text-line-mask) {
   display: block;
}

.site-cta-description :deep(.split-text-line) {
   visibility: hidden;
}

.site-cta-title-line {
   @apply block whitespace-nowrap;
}

.site-cta-title :deep(.split-text-line),
.site-cta-title :deep(.split-text-line-mask) {
   display: block;
}

.site-cta-title :deep(.split-text-line-mask) {
   margin: -0.12em -0.12em -0.18em;
   padding: 0.12em 0.12em 0.18em;
}

.site-cta-title :deep(.split-text-line) {
   visibility: hidden;
}

.site-cta-action-mask {
   @apply mt-10 -ml-2 overflow-x-visible overflow-y-clip md:mt-12;
   padding: 0.5rem;
}

.site-cta-action-rise {
   @apply block;
   visibility: hidden;
}

.site-cta-action {
   gap: 0.6em;
   min-height: 2.6em;
   padding-inline: 1.1em;
   font-size: clamp(1.25rem, 2.2vw, 2rem);
}

.site-cta-action :deep(.button-icon),
.site-cta-action :deep(.button-icon svg) {
   width: 1em;
   height: 1em;
}

.site-cta-marquee {
   @apply relative min-w-0 overflow-hidden pb-section lg:pb-0;
}

.site-cta-marquee-track {
   @apply flex w-max flex-row will-change-transform lg:absolute lg:inset-x-0 lg:top-0 lg:w-auto lg:flex-col lg:pr-page;
}

.site-cta-marquee-group {
   @apply flex flex-row gap-4 pr-4 lg:flex-col lg:gap-6 lg:pr-0 lg:pb-6;
}

.site-cta-marquee-card {
   @apply w-[78vw] sm:w-[48vw] lg:w-full;
}

@media (prefers-reduced-motion: reduce) {
   .site-cta-marquee {
      @apply overflow-x-auto lg:overflow-hidden;
   }
}
</style>
