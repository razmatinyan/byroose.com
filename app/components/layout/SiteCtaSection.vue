<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import { NuxtLink } from "#components";
import SplitText from "@/components/shared/SplitText.vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import type { SplitTextResult } from "@/lib/split-text";

const titleLines = ["Have an idea?", "Let's build it."];
const title = titleLines.join(" ");
const contactRoute = "/contact";
const actionLabel = "Start a project";

const ctaRoot = useTemplateRef<HTMLElement>("ctaRoot");
const ctaCanvas = useTemplateRef<HTMLCanvasElement>("ctaCanvas");
const titleSplits = shallowRef<(SplitTextResult | undefined)[]>(
   titleLines.map(() => undefined),
);

useSiteCtaMotion(ctaRoot, titleSplits);
const { ready: backgroundReady } = useSiteCtaBackground(ctaRoot, ctaCanvas);

function setTitleSplit(index: number, parts: SplitTextResult) {
   titleSplits.value = titleSplits.value.map((entry, entryIndex) =>
      entryIndex === index ? parts : entry,
   );
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
   @apply m-0 text-display font-bold tracking-[-0.05em];
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
   @apply mt-16 overflow-x-visible overflow-y-clip md:mt-24;
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
