<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";

export interface ProcessStep {
   number: string;
   title: string;
   image: string;
   body: string;
}

const {
   title,
   steps,
   uppercase = true,
   titleReveal = "chars",
} = defineProps<{
   title: string;
   steps: readonly ProcessStep[];
   uppercase?: boolean;
   titleReveal?: "chars" | "words";
}>();

const journeyRoot = useTemplateRef<HTMLElement>("journeyRoot");
const titleSplit = shallowRef<SplitTextResult>();
const stepTitleSplits = shallowRef<(SplitTextResult | undefined)[]>(
   steps.map(() => undefined),
);
const stepBodySplits = shallowRef<(SplitTextResult | undefined)[]>(
   steps.map(() => undefined),
);

useFitText(() =>
   journeyRoot.value?.querySelector<HTMLElement>("[data-journey-title]"),
);
useJourneyMotion(journeyRoot, { stepBodySplits, stepTitleSplits, titleSplit });

function setTitleSplit(parts: SplitTextResult) {
   titleSplit.value = parts;
}

function setStepTitleSplit(index: number, parts: SplitTextResult) {
   stepTitleSplits.value = stepTitleSplits.value.with(index, parts);
}

function setStepBodySplit(index: number, parts: SplitTextResult) {
   stepBodySplits.value = stepBodySplits.value.with(index, parts);
}
</script>

<template>
   <section ref="journeyRoot" class="journey">
      <div class="journey-heading section-gutter">
         <SplitText
            class="journey-title"
            :class="{ uppercase, 'split-title': titleReveal === 'chars' }"
            as="h2"
            data-journey-title
            :data-title-reveal="titleReveal"
            :mask="titleReveal"
            :text="title"
            :type="titleReveal === 'chars' ? 'words,chars' : 'words'"
            @split="setTitleSplit"
         />
      </div>

      <div class="journey-panel">
         <ol class="journey-steps">
            <li
               v-for="(step, index) in steps"
               :key="step.title"
               class="journey-step"
               data-journey-step
            >
               <div class="journey-step-copy section-gutter">
                  <p class="journey-step-label">
                     Step
                     <span class="journey-step-dot" aria-hidden="true" />
                     {{ step.number }}
                  </p>
                  <div class="journey-step-text">
                     <SplitText
                        class="split-title journey-step-title"
                        as="h3"
                        mask="chars"
                        :text="step.title"
                        type="words,chars"
                        @split="setStepTitleSplit(index, $event)"
                     />
                     <SplitText
                        class="journey-step-body"
                        as="p"
                        mask="lines"
                        :text="step.body"
                        type="lines"
                        @split="setStepBodySplit(index, $event)"
                     />
                  </div>
               </div>
               <div class="journey-step-media">
                  <NuxtImg
                     class="journey-step-image"
                     :src="step.image"
                     alt=""
                     width="1456"
                     height="816"
                     sizes="sm:768px md:896px xl:1024px"
                     densities="x1"
                     loading="lazy"
                     draggable="false"
                  />
               </div>
            </li>
         </ol>
      </div>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.journey {
   @apply w-full pb-section;
   padding-top: calc(var(--spacing-section) * 2.5);
}

.journey-heading {
   container-type: inline-size;
}

.journey-title {
   --journey-title-size: 11.2cqi;
   --split-title-tracking: -0.05em;
   @apply m-0 w-max pe-[0.05em] leading-[0.86] font-bold whitespace-nowrap;
   font-size: calc(var(--journey-title-size) * var(--fit-text-scale, 1));
}

.journey-title :deep(.split-text-char-mask),
.journey-title :deep(.split-text-word-mask) {
   margin-block: -0.25em;
   padding-block: 0.25em;
}

.journey-title[data-title-reveal="words"] {
   @apply tracking-[-0.05em];
}

.journey-title[data-title-reveal="words"] :deep(.split-text-word),
.journey-title[data-title-reveal="words"] :deep(.split-text-word-mask) {
   display: inline-block;
}

.journey-title[data-title-reveal="words"] :deep(.split-text-word) {
   visibility: hidden;
}

.journey-panel {
   @apply mt-16 bg-canvas-shade text-canvas-shade-foreground md:mt-24 xl:mt-32;
}

.journey-steps {
   @apply m-0 list-none p-0;
}

.journey-step {
   @apply grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)];
}

.journey-step-copy {
   @apply grid min-w-0 content-start gap-y-5 py-8 md:grid-cols-[8rem_minmax(0,1fr)] md:py-10 xl:grid-cols-[11rem_minmax(0,1fr)] xl:py-12;
}

.journey-step + .journey-step .journey-step-copy {
   @apply md:border-t md:border-current/10;
}

.journey-step-label {
   @apply m-0 flex items-center gap-2 self-start text-xs leading-none font-medium tracking-[0.08em] text-current/70 md:pt-3 xl:pt-4;
}

.journey-step-dot {
   @apply size-1 rounded-full bg-current;
}

.journey-step-text {
   @apply flex min-w-0 flex-col items-start;
}

.journey-step-media {
   @apply aspect-16/10 w-full self-stretch overflow-hidden;
}

.journey-step-image {
   @apply size-full object-cover select-none;
}

.journey-step-title {
   --split-title-tracking: -0.045em;
   @apply m-0 text-4xl leading-[0.95] font-bold text-balance md:text-5xl xl:text-6xl;
}

.journey-step-title :deep(.split-text-char-mask) {
   margin-block: -0.12em;
   padding-block: 0.12em;
}

.journey-step-body {
   @apply m-0 mt-6 max-w-[36ch] text-xl leading-tight font-semibold tracking-[-0.03em] text-current/70 md:mt-8 md:text-2xl;
}

.journey-step-body :deep(.split-text-line),
.journey-step-body :deep(.split-text-line-mask) {
   display: block;
}

.journey-step-body :deep(.split-text-line) {
   visibility: hidden;
}
</style>
