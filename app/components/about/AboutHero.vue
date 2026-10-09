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
const trailImages = [1, 2, 3, 4, 5, 6, 7].map(
   (index) => `/images/work/${index}.png`,
);
const trailSlots = [0, 1].flatMap((round) =>
   trailImages.map((src) => ({ id: `${round}-${src}`, src })),
);

const heroRoot = useTemplateRef<HTMLElement>("heroRoot");
const descriptionSplit = shallowRef<SplitTextResult>();
const { revealed } = useAboutHeroMotion(heroRoot, descriptionSplit);
const { armed: trailArmed } = useAboutHeroTrail(heroRoot);

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
      <div
         v-if="trailArmed"
         class="about-hero-trail"
         data-about-hero-trail
         aria-hidden="true"
      >
         <span
            v-for="slot in trailSlots"
            :key="slot.id"
            class="about-hero-trail-item"
            data-about-hero-trail-item
         >
            <NuxtImg
               class="about-hero-trail-image"
               :src="slot.src"
               alt=""
               width="1080"
               height="1440"
               sizes="sm:448px"
               loading="eager"
               draggable="false"
            />
         </span>
      </div>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-hero {
   @apply relative grid place-items-center pb-16 sm:pb-20;
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

.about-hero-trail {
   @apply pointer-events-none absolute inset-0 select-none;
}

.about-hero-trail-item {
   @apply invisible absolute top-0 left-0 block aspect-[3/4] overflow-hidden rounded-xl;
   width: clamp(9rem, 15vw, 16rem);
}

.about-hero-trail-image {
   @apply size-full object-cover;
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
