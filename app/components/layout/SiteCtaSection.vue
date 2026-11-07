<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import { NuxtLink } from "#components";
import SplitText from "@/components/shared/SplitText.vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import { siteCtaFor } from "@/lib/site-cta";
import type { SplitTextResult } from "@/lib/split-text";

const route = useRoute();
const { description, titleLines } = siteCtaFor(route.path);
const title = titleLines.join(" ");
const contactRoute = "/contact";
const actionLabel = "Start a project";

const ctaRoot = useTemplateRef<HTMLElement>("ctaRoot");
const ctaCanvas = useTemplateRef<HTMLCanvasElement>("ctaCanvas");
const titleSplits = shallowRef<(SplitTextResult | undefined)[]>(
   titleLines.map(() => undefined),
);
const descriptionSplit = shallowRef<SplitTextResult>();

useSiteCtaMotion(ctaRoot, titleSplits, () =>
   description ? descriptionSplit.value : null,
);
useFitText(
   () => ctaRoot.value?.querySelector<HTMLElement>("[data-site-cta-title]"),
   { maxScale: 1 },
);
const { ready: backgroundReady } = useSiteCtaBackground(ctaRoot, ctaCanvas);

function setTitleSplit(index: number, parts: SplitTextResult) {
   titleSplits.value = titleSplits.value.map((entry, entryIndex) =>
      entryIndex === index ? parts : entry,
   );
}

function setDescriptionSplit(parts: SplitTextResult) {
   descriptionSplit.value = parts;
}
</script>

<template>
   <section
      ref="ctaRoot"
      class="site-cta section-gutter"
      data-header-surface="dark"
   >
      <canvas
         ref="ctaCanvas"
         class="site-cta-canvas"
         :data-ready="backgroundReady || undefined"
         aria-hidden="true"
      />
      <h2 class="site-cta-title" data-site-cta-title>
         <span class="sr-only">{{ title }}</span>
         <span aria-hidden="true">
            <SplitText
               v-for="(line, index) in titleLines"
               :key="line"
               class="site-cta-title-line"
               aria="none"
               mask="words"
               :text="line"
               type="words"
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
               variant="light"
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
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-cta {
   @apply relative isolate flex min-h-svh flex-col items-center justify-center bg-foreground py-section text-center text-background;
}

.site-cta-canvas {
   @apply pointer-events-none absolute inset-0 -z-10 size-full opacity-0 transition-opacity duration-1000 motion-reduce:transition-none;
}

.site-cta-canvas[data-ready] {
   @apply opacity-100;
}

.site-cta-title {
   @apply m-0 w-max max-w-none leading-[0.9] font-bold tracking-[-0.05em];
   font-size: calc(clamp(1.75rem, 8.6vw, 9.5rem) * var(--fit-text-scale, 1));
}

.site-cta-description {
   @apply m-0 mt-8 max-w-[38ch] text-xl leading-tight font-medium tracking-[-0.03em] text-balance text-background/70 md:mt-10 md:text-2xl xl:text-3xl;
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

.site-cta-title :deep(.split-text-word),
.site-cta-title :deep(.split-text-word-mask) {
   display: inline-block;
}

.site-cta-title :deep(.split-text-word-mask) {
   margin-block: -0.12em -0.18em;
   padding-block: 0.12em 0.18em;
}

.site-cta-title :deep(.split-text-word) {
   visibility: hidden;
}

.site-cta-action-mask {
   @apply mt-12 overflow-x-visible overflow-y-clip md:mt-16;
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
</style>
