<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";

export interface ProcessStep {
   title: string;
   body: string;
}

const {
   title,
   description,
   steps,
   uppercase = true,
   titleReveal = "chars",
} = defineProps<{
   title: string;
   description: string;
   steps: readonly ProcessStep[];
   uppercase?: boolean;
   titleReveal?: "chars" | "words";
}>();

const timelineColumns = Array.from({ length: 12 }, (_, index) =>
   String(index + 1).padStart(2, "0"),
);

const journeyRoot = useTemplateRef<HTMLElement>("journeyRoot");
const titleSplit = shallowRef<SplitTextResult>();
const descriptionSplit = shallowRef<SplitTextResult>();
const stepTitleSplits = shallowRef<(SplitTextResult | undefined)[]>(
   steps.map(() => undefined),
);
const stepBodySplits = shallowRef<(SplitTextResult | undefined)[]>(
   steps.map(() => undefined),
);

useJourneyMotion(journeyRoot, {
   descriptionSplit,
   stepBodySplits,
   stepTitleSplits,
   titleSplit,
});

function setTitleSplit(parts: SplitTextResult) {
   titleSplit.value = parts;
}

function setDescriptionSplit(parts: SplitTextResult) {
   descriptionSplit.value = parts;
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
      <div class="journey-heading section-gutter" data-journey-heading>
         <SplitText
            class="journey-title"
            :class="{ uppercase, 'split-title': titleReveal === 'chars' }"
            as="h2"
            :data-title-reveal="titleReveal"
            :mask="titleReveal"
            :text="title"
            :type="titleReveal === 'chars' ? 'words,chars' : 'words'"
            @split="setTitleSplit"
         />
         <SplitText
            class="journey-description"
            as="p"
            mask="lines"
            :text="description"
            type="lines"
            @split="setDescriptionSplit"
         />
      </div>

      <div class="journey-body section-gutter">
         <div
            class="journey-chart"
            :style="{ '--journey-step-count': steps.length }"
            aria-hidden="true"
            data-journey-chart
         >
            <div class="journey-columns">
               <span
                  v-for="column in timelineColumns"
                  :key="column"
                  class="journey-column"
               >
                  <span class="journey-column-line" data-journey-line />
                  <span class="journey-column-number" data-journey-number>
                     {{ column }}
                  </span>
               </span>
               <span
                  class="journey-column-line journey-column-line-end"
                  data-journey-line
               />
            </div>
            <div class="journey-bars">
               <span
                  v-for="(step, index) in steps"
                  :key="step.title"
                  class="journey-bar"
                  :style="{ '--journey-step-index': index }"
                  data-journey-bar
               >
                  {{ step.title }}
               </span>
            </div>
         </div>

         <ol class="journey-steps">
            <li
               v-for="(step, index) in steps"
               :key="step.title"
               class="journey-step"
               data-journey-step
            >
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
   @apply flex flex-col items-center text-center;
}

.journey-title {
   --split-title-tracking: -0.05em;
   @apply m-0 pe-[0.05em] text-hero leading-[0.9] font-semibold text-balance;
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

.journey-description {
   @apply m-0 mt-6 max-w-[44ch] text-base leading-snug font-medium text-current/70 md:mt-8 md:text-lg;
}

.journey-description :deep(.split-text-line),
.journey-description :deep(.split-text-line-mask),
.journey-step-body :deep(.split-text-line),
.journey-step-body :deep(.split-text-line-mask) {
   display: block;
}

.journey-description :deep(.split-text-line),
.journey-step-body :deep(.split-text-line) {
   visibility: hidden;
}

.journey-body {
   @apply mt-14 md:mt-20 xl:mt-24;
}

.journey-chart {
   --journey-bar-span: 60%;
   @apply relative md:[--journey-bar-span:37.5%];
}

.journey-columns {
   @apply absolute inset-0 grid grid-cols-12;
}

.journey-column {
   @apply relative;
}

.journey-column-line {
   @apply absolute inset-y-0 start-0 origin-top border-s border-dashed border-current/15;
}

.journey-column-line-end {
   @apply start-auto end-0;
}

.journey-column-number {
   @apply absolute inset-x-0 bottom-3 text-center text-[0.625rem] leading-none font-medium text-current/35 md:bottom-4 md:text-xs;
}

.journey-bars {
   @apply relative flex flex-col gap-2 pt-5 pb-12 md:gap-3 md:pt-7 md:pb-16;
}

.journey-bar {
   @apply block h-9 truncate bg-foreground px-3 text-sm leading-9 font-semibold tracking-[-0.02em] text-background md:h-11 md:px-4 md:text-base md:leading-11;
   width: var(--journey-bar-span);
   margin-inline-start: calc(
      (100% - var(--journey-bar-span)) /
         max(var(--journey-step-count) - 1, 1) * var(--journey-step-index)
   );
}

.journey-steps {
   @apply m-0 mt-12 grid list-none gap-x-8 gap-y-10 p-0 md:mt-16 md:grid-cols-2 xl:grid-cols-4;
}

.journey-step {
   @apply flex min-w-0 flex-col items-start;
}

.journey-step-title {
   --split-title-tracking: -0.045em;
   @apply m-0 text-3xl leading-[0.95] font-semibold text-balance md:text-4xl;
}

.journey-step-title :deep(.split-text-char-mask) {
   margin-block: -0.12em;
   padding-block: 0.12em;
}

.journey-step-body {
   @apply m-0 mt-4 max-w-[36ch] text-base leading-snug font-medium text-current/70 md:mt-5 md:text-lg;
}
</style>
