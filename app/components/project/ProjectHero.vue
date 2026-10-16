<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { ProjectCategory } from "@/lib/projects";
import type { SplitTextResult } from "@/lib/split-text";
import LiveLink from "@/components/shared/LiveLink.vue";

const { name, description, categories, liveUrl } = defineProps<{
   name: string;
   description: string;
   categories: readonly ProjectCategory[];
   liveUrl?: string;
}>();

const titleWords = computed(() =>
   name.split(" ").map((word) => ({ chars: [...word], word })),
);

const heroRoot = useTemplateRef<HTMLElement>("heroRoot");
const title = useTemplateRef<HTMLElement>("title");
const descriptionSplit = shallowRef<SplitTextResult>();
const { revealed } = useListingHeroMotion(heroRoot, descriptionSplit, { drift: false });

useFitText(title, { maxScale: 1 });

function setDescriptionSplit(parts: SplitTextResult) {
   descriptionSplit.value = parts;
}
</script>

<template>
   <section
      ref="heroRoot"
      class="project-hero section-gutter"
      :data-listing-hero-revealed="revealed || undefined"
   >
      <div class="project-hero-content">
         <div class="project-hero-title">
            <h1 class="sr-only">{{ name }}</h1>
            <div ref="title" class="project-hero-title-text" data-listing-hero-reveal aria-hidden="true">
               <span class="project-hero-title-mask" data-listing-hero-title-mask>
                  <span class="project-hero-title-line">
                     <template v-for="({ chars, word }, index) in titleWords" :key="index">
                        <template v-if="index">{{ " " }}</template>
                        <span class="project-hero-title-word"
                           ><span
                              v-for="(char, charIndex) in chars"
                              :key="charIndex"
                              class="project-hero-title-char"
                              data-listing-hero-title-char
                              >{{ char }}</span
                           ></span
                        >
                     </template>
                  </span>
               </span>
            </div>
         </div>

         <div class="project-hero-meta" data-listing-hero-reveal>
            <section v-if="categories.length" class="project-hero-services" aria-labelledby="project-services-title">
               <h2 id="project-services-title" class="project-hero-services-title">
                  <span class="project-hero-line-mask" data-listing-hero-mask>
                     <span class="project-hero-line" data-listing-hero-rise>Services</span>
                  </span>
               </h2>
               <ul class="project-hero-services-list">
                  <li v-for="category in categories" :key="category">
                     <span class="project-hero-line-mask" data-listing-hero-mask>
                        <span class="project-hero-line" data-listing-hero-rise>{{ category }}</span>
                     </span>
                  </li>
               </ul>
            </section>

            <div v-if="liveUrl" class="project-hero-live" data-listing-hero-mask>
               <LiveLink :href="liveUrl" data-listing-hero-rise />
            </div>
         </div>

         <SplitText
            class="project-hero-description"
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
@reference "../../assets/css/tailwind.css";

.project-hero {
   @apply relative grid pt-10 pb-16 sm:pb-20;
   min-height: calc(100svh - 4.75rem - var(--project-hero-peek));
   --project-hero-peek: clamp(3rem, 9svh, 6rem);
}

.project-hero-content {
   @apply @container grid grid-rows-[auto_1fr] gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-x-16;
}

.project-hero-title {
   @apply col-span-full min-w-0 text-center;
}

.project-hero-title-text {
   @apply inline-block w-max pe-[0.05em] leading-[0.76] font-bold tracking-[-0.05em];
   font-size: calc(23.71cqi * var(--fit-text-scale, 1));
   margin-block: -0.2em 0.2em;
}

.project-hero-title-mask,
.project-hero-title-line {
   @apply block;
}

.project-hero-title-mask {
   padding-block: 0.2em;
}

.project-hero-title-line {
   @apply whitespace-nowrap;
}

.project-hero-title-word,
.project-hero-title-char {
   @apply inline-block;
}

.project-hero-meta {
   @apply order-last flex flex-col gap-10 self-end sm:flex-row sm:items-end sm:gap-16 lg:order-none;
}

.project-hero-services {
   @apply flex min-w-0 flex-col items-start gap-4;
}

.project-hero-services-title {
   @apply text-xl font-semibold tracking-[-0.04em] md:text-2xl;
}

.project-hero-services-list {
   @apply flex flex-col gap-0.5 text-2xl leading-tight font-medium tracking-[-0.05em] md:text-3xl;
}

.project-hero-line-mask,
.project-hero-line {
   @apply block;
}

.project-hero-line-mask {
   margin-block: -0.12em -0.18em;
   padding-block: 0.12em 0.18em;
}

.project-hero-live {
   @apply flex min-w-0 sm:flex-1 sm:justify-center;
}

.project-hero-description {
   @apply m-0 w-full max-w-[20em] self-end text-2xl leading-[0.95] font-semibold tracking-[-0.04em] text-pretty md:text-4xl lg:col-start-2 xl:text-5xl;
}

.project-hero-description:has(> :deep(.split-text-line-mask)) {
   @apply flex flex-col;
}

.project-hero-description :deep(.split-text-line),
.project-hero-description :deep(.split-text-line-mask) {
   display: block;
}

.project-hero-description :deep(.split-text-line-mask) {
   margin-block: -0.12em -0.18em;
   padding-block: 0.12em 0.18em;
}

.project-hero:not([data-listing-hero-revealed]) [data-listing-hero-reveal] {
   visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
   .project-hero:not([data-listing-hero-revealed]) [data-listing-hero-reveal] {
      visibility: inherit;
   }
}
</style>
