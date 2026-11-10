<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";

interface ApproachItem {
   description: string;
   title: string;
}

const title = "How we work with clients";
const items: readonly ApproachItem[] = [
   {
      title: "Small team, senior hands",
      description: "You work directly with the founders, not an account manager.",
   },
   {
      title: "AI for speed, humans for taste",
      description: "AI generates; people direct, edit, and approve.",
   },
   {
      title: "Numbers over opinions",
      description:
         "Every month you see what worked, what didn't, and what we're changing.",
   },
];

const approachRoot = useTemplateRef<HTMLElement>("approachRoot");
const titleSplit = shallowRef<SplitTextResult>();
useAboutApproachMotion(approachRoot, titleSplit);

function setTitleSplit(parts: SplitTextResult) {
   titleSplit.value = parts;
}
</script>

<template>
   <section ref="approachRoot" class="about-approach section-gutter">
      <SplitText
         class="about-approach-title"
         data-about-approach-title
         as="h2"
         mask="words"
         :text="title"
         type="words"
         @split="setTitleSplit"
      />

      <ul class="about-approach-list">
         <li
            v-for="item in items"
            :key="item.title"
            class="about-approach-item"
            data-about-approach-item
         >
            <div class="about-approach-mask" data-about-approach-rise-mask>
               <h3 class="about-approach-item-title" data-about-approach-rise>
                  {{ item.title }}
               </h3>
            </div>
            <div class="about-approach-mask" data-about-approach-rise-mask>
               <p
                  class="about-approach-item-description"
                  data-about-approach-rise
               >
                  {{ item.description }}
               </p>
            </div>
         </li>
      </ul>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-approach {
   @apply pb-section;
   padding-top: calc(var(--spacing-section) * 2.5);
}

.about-approach-title {
   @apply m-0 mx-auto max-w-[14em] text-center font-semibold tracking-[-0.05em] text-balance;
   font-size: clamp(2.5rem, 7vw, 7rem);
   line-height: 0.88;
}

.about-approach-title :deep(.split-text-word),
.about-approach-title :deep(.split-text-word-mask) {
   display: inline-block;
}

.about-approach-title :deep(.split-text-word-mask) {
   margin-block: -0.12em -0.18em;
   padding-block: 0.12em 0.18em;
}

.about-approach-title :deep(.split-text-word) {
   visibility: hidden;
}

.about-approach-list {
   @apply m-0 mt-24 grid list-none gap-14 p-0 md:mx-auto md:mt-36 md:max-w-[64rem] md:grid-cols-2 md:gap-x-16 md:gap-y-20 xl:mt-48 xl:max-w-[68rem] xl:gap-x-24;
}

.about-approach-item {
   @apply flex max-w-[30rem] flex-col gap-4 text-left md:gap-5;
}

.about-approach-item:nth-child(2) {
   @apply md:justify-self-end;
}

.about-approach-item:nth-child(3) {
   @apply md:col-span-2 md:justify-self-center;
}

.about-approach-mask {
   @apply block;
   margin-block: -0.12em -0.2em;
   padding-block: 0.12em 0.2em;
}

.about-approach-item-title {
   @apply m-0 text-3xl leading-[0.95] font-semibold tracking-[-0.045em] text-balance md:text-4xl xl:text-5xl;
   visibility: hidden;
}

.about-approach-item-description {
   @apply m-0 text-lg leading-snug font-medium tracking-[-0.02em] text-pretty md:text-xl xl:text-2xl;
   visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
   .about-approach-title :deep(.split-text-word),
   .about-approach-item-title,
   .about-approach-item-description {
      visibility: inherit;
   }
}
</style>
