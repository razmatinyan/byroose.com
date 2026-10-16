<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";

const { description, titleWords } = defineProps<{
   description: string;
   titleWords: readonly string[];
}>();

const title = computed(() => titleWords.join(" "));
const titleWordChars = computed(() =>
   titleWords.map((word) => ({ chars: [...word], word })),
);

const heroRoot = useTemplateRef<HTMLElement>("heroRoot");
const heroTitle = useTemplateRef<HTMLElement>("heroTitle");
const descriptionSplit = shallowRef<SplitTextResult>();
const { revealed } = useListingHeroMotion(heroRoot, descriptionSplit);
useFitText(heroTitle);

function setDescriptionSplit(parts: SplitTextResult) {
   descriptionSplit.value = parts;
}
</script>

<template>
   <section
      ref="heroRoot"
      class="listing-hero section-gutter"
      :data-listing-hero-revealed="revealed || undefined"
   >
      <div class="listing-hero-content" data-listing-hero-content>
         <h1 class="sr-only">{{ title }}</h1>
         <div
            ref="heroTitle"
            class="listing-hero-title"
            data-listing-hero-reveal
            aria-hidden="true"
         >
            <span class="listing-hero-title-mask" data-listing-hero-title-mask>
               <span class="listing-hero-title-line">
                  <template
                     v-for="({ chars, word }, index) in titleWordChars"
                     :key="word"
                  >
                     <template v-if="index">{{ " " }}</template>
                     <span class="listing-hero-title-word"
                        ><span
                           v-for="(char, charIndex) in chars"
                           :key="charIndex"
                           class="listing-hero-title-char"
                           data-listing-hero-title-char
                           >{{ char }}</span
                        ></span
                     >
                  </template>
               </span>
            </span>
         </div>
         <SplitText
            class="listing-hero-description"
            data-listing-hero-reveal
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

.listing-hero {
   @apply relative grid pt-10 pb-16 sm:pb-20;
   min-height: calc(100svh - 4.75rem - var(--listing-hero-peek));
   --listing-hero-peek: clamp(3rem, 9svh, 6rem);
}

.listing-hero-content {
   @apply @container grid grid-rows-[auto_1fr] gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-x-16;
}

.listing-hero-title {
   --listing-hero-title-size: 23.71cqi;
   @apply col-span-full w-max self-start pe-[0.05em] leading-[0.76] font-bold tracking-[-0.05em];
   font-size: calc(
      var(--listing-hero-title-size) * var(--fit-text-scale, 1)
   );
   margin-block: -0.2em 0.2em;
}

.listing-hero-title-mask,
.listing-hero-title-line {
   @apply block;
}

.listing-hero-title-mask {
   margin-bottom: -0.4em;
   padding-block: 0.2em;
}

.listing-hero-title-line {
   @apply whitespace-nowrap;
}

.listing-hero-title-word,
.listing-hero-title-char {
   @apply inline-block;
}

.listing-hero-description {
   @apply m-0 max-w-[20em] self-end text-2xl lg:col-start-2 leading-[0.95] font-semibold tracking-[-0.04em] text-pretty md:text-4xl xl:text-5xl;
}

.listing-hero-description:has(> :deep(.split-text-line-mask)) {
   @apply flex flex-col;
}

.listing-hero-description :deep(.split-text-line),
.listing-hero-description :deep(.split-text-line-mask) {
   display: block;
}

.listing-hero-description :deep(.split-text-line-mask) {
   margin-block: -0.12em -0.18em;
   padding-block: 0.12em 0.18em;
}

.listing-hero:not([data-listing-hero-revealed]) [data-listing-hero-reveal] {
   visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
   .listing-hero:not([data-listing-hero-revealed]) [data-listing-hero-reveal] {
      visibility: inherit;
   }
}
</style>
