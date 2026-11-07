<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import ArrowLink from "@/components/shared/ArrowLink.vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";

export interface ServiceStoryBlock {
   title: string;
   description: string;
   link?: { label: string; to: string };
   offset: "start" | "middle";
}

const { blocks } = defineProps<{
   blocks: readonly ServiceStoryBlock[];
}>();

const sectionRoot = useTemplateRef<HTMLElement>("sectionRoot");
const titleSplits = shallowRef<(SplitTextResult | undefined)[]>(
   blocks.map(() => undefined),
);
const descriptionSplits = shallowRef<(SplitTextResult | undefined)[]>(
   blocks.map(() => undefined),
);

useServiceStoryMotion(sectionRoot, { descriptionSplits, titleSplits });

function setTitleSplit(index: number, parts: SplitTextResult) {
   titleSplits.value = titleSplits.value.with(index, parts);
}

function setDescriptionSplit(index: number, parts: SplitTextResult) {
   descriptionSplits.value = descriptionSplits.value.with(index, parts);
}
</script>

<template>
   <section ref="sectionRoot" class="service-story section-gutter">
      <article
         v-for="(block, index) in blocks"
         :key="block.title"
         class="service-story-block"
         :data-offset="block.offset"
         data-service-story-block
      >
         <SplitText
            class="service-story-title"
            as="h2"
            mask="lines"
            :text="block.title"
            type="lines"
            @split="setTitleSplit(index, $event)"
         />
         <SplitText
            class="service-story-description"
            as="p"
            mask="lines"
            :text="block.description"
            type="lines"
            @split="setDescriptionSplit(index, $event)"
         />
         <div v-if="block.link" class="service-story-link-mask">
            <div class="service-story-link" data-service-story-link>
               <ArrowLink :to="block.link.to" :label="block.link.label" />
            </div>
         </div>
      </article>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.service-story {
   @apply flex flex-col gap-28 py-section md:gap-40 xl:gap-48;
   padding-top: calc(var(--spacing-section) * 2);
}

.service-story-block {
   @apply flex max-w-3xl flex-col items-start;
}

@media (min-width: 64rem) {
   .service-story-block[data-offset="start"] {
      margin-left: 12%;
   }

   .service-story-block[data-offset="middle"] {
      margin-left: 55%;
      max-width: 40%;
   }
}

.service-story-title {
   @apply m-0 text-section leading-[0.95] font-bold tracking-[-0.045em] text-balance;
}

.service-story-title :deep(.split-text-line),
.service-story-title :deep(.split-text-line-mask) {
   display: block;
}

.service-story-title :deep(.split-text-line-mask) {
   margin-bottom: -0.3em;
   padding-block: 0.12em 0.18em;
}

.service-story-title :deep(.split-text-line) {
   visibility: hidden;
}

.service-story-description {
   @apply m-0 mt-8 max-w-[40ch] text-xl leading-tight font-semibold tracking-[-0.03em] text-foreground md:mt-10 md:text-2xl;
}

.service-story-description :deep(.split-text-line),
.service-story-description :deep(.split-text-line-mask) {
   display: block;
}

.service-story-description :deep(.split-text-line-mask) {
   margin-bottom: -0.3em;
   padding-block: 0.1em 0.2em;
}

.service-story-description :deep(.split-text-line),
.service-story-link {
   visibility: hidden;
}

.service-story-link-mask {
   @apply mt-10 overflow-hidden p-1 md:mt-12;
}

.service-story-link :deep(.arrow-link) {
   @apply w-fit max-w-full;
}
</style>
