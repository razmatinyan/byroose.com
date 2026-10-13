<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import ImageCycle from "@/components/shared/ImageCycle.vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { ServicesAnchor } from "@/lib/services-anchors";
import { servicesOfferImageSizes } from "@/lib/services-hero";
import type { ServicesImage } from "@/lib/services-hero";
import type { SplitTextResult } from "@/lib/split-text";

export interface ServicesOfferBlock {
   description: string;
   flight?: boolean;
   images?: readonly ServicesImage[];
   title: string;
   tone:
      | "blue-tint"
      | "green-tint"
      | "orange-deep"
      | "pink-tint"
      | "violet-deep"
      | "yellow-deep";
}

const {
   anchor,
   blocks,
   description,
   surface = "light",
   title,
} = defineProps<{
   anchor: ServicesAnchor;
   blocks: readonly ServicesOfferBlock[];
   description: string;
   surface?: "dark" | "light";
   title: string;
}>();

const toneClasses = {
   "blue-tint": "bg-brand-blue-tint",
   "green-tint": "bg-brand-green-tint",
   "orange-deep": "bg-brand-orange-deep",
   "pink-tint": "bg-brand-pink-tint",
   "violet-deep": "bg-brand-violet-deep",
   "yellow-deep": "bg-brand-yellow-deep",
} satisfies Record<ServicesOfferBlock["tone"], string>;

const offerRoot = useTemplateRef<HTMLElement>("offerRoot");
const textSplits = shallowRef<(SplitTextResult | undefined)[]>(
   Array.from({ length: 2 + blocks.length * 2 }, () => undefined),
);

useServicesRevealMotion(offerRoot, textSplits);

function setTextSplit(index: number, parts: SplitTextResult) {
   textSplits.value = textSplits.value.map((entry, entryIndex) =>
      entryIndex === index ? parts : entry,
   );
}
</script>

<template>
   <section
      :id="anchor"
      ref="offerRoot"
      class="services-offer"
      :data-surface="surface"
   >
      <div
         v-if="surface === 'dark'"
         class="services-offer-backdrop"
         data-services-reveal-backdrop
         data-header-surface="dark"
         aria-hidden="true"
      />
      <div class="services-offer-intro section-gutter">
         <SplitText
            class="services-offer-title"
            data-services-reveal-text
            as="h2"
            mask="lines"
            :text="title"
            type="lines"
            @split="setTextSplit(0, $event)"
         />
         <SplitText
            class="services-offer-description"
            data-services-reveal-text
            as="p"
            mask="lines"
            :text="description"
            type="lines"
            @split="setTextSplit(1, $event)"
         />
      </div>

      <div class="services-offer-blocks section-gutter">
         <article
            v-for="(block, index) in blocks"
            :key="block.title"
            class="services-offer-block"
            :class="toneClasses[block.tone]"
         >
            <div class="services-offer-copy">
               <div>
                  <SplitText
                     class="services-offer-block-title section-title"
                     data-services-reveal-text
                     as="h3"
                     mask="lines"
                     :text="block.title"
                     type="lines"
                     @split="setTextSplit(2 + index * 2, $event)"
                  />
                  <SplitText
                     class="services-offer-block-description"
                     data-services-reveal-text
                     as="p"
                     mask="lines"
                     :text="block.description"
                     type="lines"
                     @split="setTextSplit(3 + index * 2, $event)"
                  />
               </div>
            </div>

            <div
               class="services-offer-media"
               :data-services-flight-target="block.flight || undefined"
            >
               <ImageCycle
                  v-if="block.images"
                  class="services-offer-cycle"
                  :images="block.images"
                  :sizes="servicesOfferImageSizes"
                  densities="x1"
               />
            </div>
         </article>
      </div>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.services-offer {
   @apply pb-section text-foreground;
}

.services-offer[data-surface="dark"] {
   @apply relative text-background;
}

.services-offer-backdrop {
   @apply absolute inset-x-0 -bottom-px -z-10 bg-foreground;
   top: calc(var(--services-reveal-backdrop-lead, 0) * -100svh);
}

.services-offer-intro {
   @apply flex flex-col pt-section pb-[clamp(3rem,6vw,6rem)];
}

.services-offer[data-surface="light"] .services-offer-intro {
   @apply relative z-10 bg-background;
}

.services-offer-title {
   @apply m-0 text-service font-bold tracking-[-0.045em] text-balance;
}

.services-offer-description {
   @apply m-0 mt-4 w-full text-2xl leading-[0.9] font-semibold tracking-[-0.04em] text-pretty md:mt-8 md:w-2/3 md:self-end md:text-4xl xl:mt-12 xl:text-6xl;
}

.services-offer[data-surface="dark"] .services-offer-title,
.services-offer[data-surface="dark"] .services-offer-description {
   @apply mix-blend-difference;
}

.services-offer-blocks {
   @apply flex flex-col gap-3;
}

.services-offer-block {
   @apply grid gap-8 rounded-[clamp(1.5rem,3vw,3rem)] p-[clamp(1rem,2.5vw,2rem)] md:grid-cols-2 md:gap-12;
}

.services-offer-copy {
   @apply md:py-2 md:pl-2;
}

.services-offer-block-title {
   @apply leading-[0.88] text-balance;
}

.services-offer-block-description {
   @apply m-0 mt-8 max-w-[34ch] text-lg leading-[1.15] font-semibold tracking-[-0.02em] text-brand-subtle md:mt-12 md:text-xl;
}

.services-offer[data-surface="dark"] .services-offer-block-description {
   @apply text-background/75;
}

.services-offer-media {
   @apply relative aspect-4/3 w-full overflow-hidden rounded-2xl;
}

.services-offer-cycle {
   @apply absolute inset-0;
}

.services-offer :deep(.split-text-line),
.services-offer :deep(.split-text-line-mask) {
   display: block;
}

.services-offer :deep(.split-text-line-mask) {
   margin-block: -0.12em -0.18em;
   padding-block: 0.12em 0.18em;
}

.services-offer :deep(.split-text-line) {
   visibility: hidden;
}
</style>
