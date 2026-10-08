<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import AboutTitle from "./AboutTitle.vue";
import type { AboutTitleLine } from "./AboutTitle.vue";
import type { SplitTextResult } from "@/lib/split-text";

const titleLines: readonly AboutTitleLine[] = [
   { text: "Welcome to" },
   { text: "byroose" },
];
const description =
   "A creative agency that pairs AI content creation with web development, so your brand gets seen and chosen.";

const heroRoot = useTemplateRef<HTMLElement>("heroRoot");
const descriptionSplit = shallowRef<SplitTextResult>();
const { revealed } = useAboutHeroMotion(heroRoot, descriptionSplit);

function setDescriptionSplit(parts: SplitTextResult) {
   descriptionSplit.value = parts;
}
</script>

<template>
   <section
      ref="heroRoot"
      class="about-hero section-gutter"
      :data-about-hero-revealed="revealed || undefined"
   >
      <div class="about-hero-content" data-about-hero-content>
         <AboutTitle
            as="h1"
            data-about-hero-reveal
            :lines="titleLines"
            size="display"
         />
         <SplitText
            class="about-hero-description"
            data-about-hero-reveal
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

.about-hero {
   @apply grid place-items-center pb-16 sm:pb-20;
   min-height: calc(100svh - 4.75rem - var(--about-hero-peek));
   --about-hero-peek: clamp(3rem, 9svh, 6rem);
}

.about-hero-content {
   @apply flex flex-col items-center text-center;
}

.about-hero-description {
   @apply m-0 mt-20 max-w-[36ch] text-lg leading-tight font-semibold tracking-[-0.03em] text-balance md:mt-28 md:text-xl lg:text-2xl;
}

.about-hero-description :deep(.split-text-line),
.about-hero-description :deep(.split-text-line-mask) {
   display: block;
}

.about-hero:not([data-about-hero-revealed]) [data-about-hero-reveal] {
   visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
   .about-hero:not([data-about-hero-revealed]) [data-about-hero-reveal] {
      visibility: inherit;
   }
}
</style>
