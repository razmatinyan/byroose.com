<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";

const titleLines = ["Our", "work"];
const title = titleLines.join(" ");
const description =
   "Reels that stop the scroll. Visuals directed like a shoot. Websites designed and coded from scratch. The proof is in our projects.";

const heroRoot = useTemplateRef<HTMLElement>("heroRoot");
const descriptionSplit = shallowRef<SplitTextResult>();
const { revealed } = useWorkHeroMotion(heroRoot, descriptionSplit);

function setDescriptionSplit(parts: SplitTextResult) {
   descriptionSplit.value = parts;
}
</script>

<template>
   <section
      ref="heroRoot"
      class="work-hero section-gutter"
      :data-work-hero-revealed="revealed || undefined"
   >
      <div class="work-hero-content" data-work-hero-content>
         <h1 class="sr-only">{{ title }}</h1>
         <div
            class="work-hero-title"
            data-work-hero-reveal
            aria-hidden="true"
         >
            <span
               v-for="line in titleLines"
               :key="line"
               class="work-hero-title-mask"
               data-work-hero-title-mask
            >
               <span class="work-hero-title-line" data-work-hero-title-line>{{
                  line
               }}</span>
            </span>
         </div>
         <SplitText
            class="work-hero-description"
            data-work-hero-reveal
            as="p"
            mask="lines"
            :text="description"
            type="lines"
            @split="setDescriptionSplit"
         />
      </div>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.work-hero {
   @apply relative grid pt-10 pb-16 sm:pb-20;
   min-height: calc(100svh - 4.75rem - var(--work-hero-peek));
   --work-hero-peek: clamp(3rem, 9svh, 6rem);
}

.work-hero-content {
   @apply grid grid-rows-[auto_1fr] gap-10 sm:gap-14 lg:grid-cols-[auto_minmax(0,1fr)] lg:grid-rows-1 lg:gap-x-16;
}

.work-hero-title {
   @apply self-start leading-[0.76] font-bold tracking-[-0.05em];
   font-size: min(34vw, 18rem);
   margin-block: -0.2em 0.2em;
}

.work-hero-title-mask,
.work-hero-title-line {
   @apply block;
}

.work-hero-title-mask {
   margin-bottom: -0.4em;
   padding-block: 0.2em;
}

.work-hero-title-line {
   @apply whitespace-nowrap;
}

.work-hero-description {
   @apply m-0 max-w-[20em] self-end text-2xl leading-[0.95] font-semibold tracking-[-0.04em] text-pretty md:text-4xl xl:text-5xl;
}

.work-hero-description :deep(.split-text-line),
.work-hero-description :deep(.split-text-line-mask) {
   display: block;
}

.work-hero-description :deep(.split-text-line-mask) {
   margin-block: -0.12em -0.18em;
   padding-block: 0.12em 0.18em;
}

.work-hero:not([data-work-hero-revealed]) [data-work-hero-reveal] {
   visibility: hidden;
}

@media (min-width: 64rem) {
   .work-hero-title {
      font-size: min(19vw, 22rem);
   }
}

@media (prefers-reduced-motion: reduce) {
   .work-hero:not([data-work-hero-revealed]) [data-work-hero-reveal] {
      visibility: inherit;
   }
}
</style>
