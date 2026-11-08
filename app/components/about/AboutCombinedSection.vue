<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import AboutStatement from "./AboutStatement.vue";
import type { SplitTextResult } from "@/lib/split-text";

const title = "Why we combined AI content creation and web development";
const statements = [
   {
      id: "gap",
      text: "Most brands hire one agency for social media content and another for the website. The two never sit in the same room, so the reel promises one thing and the landing page says another. Attention leaks out in the gap.",
   },
   {
      id: "system",
      text: "forrrow closes that gap. We make the AI content that stops the scroll and build the website it sends people to, as one system with one brief. When a post performs, we already know which page it needs. When a page converts, we know what content to make more of.",
   },
] as const;

const combinedRoot = useTemplateRef<HTMLElement>("combinedRoot");
const titleSplit = shallowRef<SplitTextResult>();
const statementSplits = shallowRef<(SplitTextResult | undefined)[]>(
   statements.map(() => undefined),
);

useAboutSectionMotion(combinedRoot, {
   textSplits: statementSplits,
   titleSplit,
});

function setTitleSplit(parts: SplitTextResult) {
   titleSplit.value = parts;
}

function setStatementSplit(index: number, parts: SplitTextResult) {
   statementSplits.value = statementSplits.value.with(index, parts);
}
</script>

<template>
   <section ref="combinedRoot" class="about-combined section-gutter">
      <SplitText
         class="about-combined-title"
         data-about-title
         as="h2"
         mask="lines"
         :text="title"
         type="lines"
         @split="setTitleSplit"
      />
      <AboutStatement
         v-for="(statement, index) in statements"
         :key="statement.id"
         class="about-combined-statement"
         :text="statement.text"
         @split="setStatementSplit(index, $event)"
      />
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-combined {
   @apply py-section;
}

.about-combined-title {
   @apply m-0 mx-auto max-w-[14em] text-center font-bold tracking-[-0.05em] text-balance;
   font-size: clamp(2.25rem, 5.5vw, 5.5rem);
   line-height: 0.88;
}

.about-combined-title :deep(.split-text-line),
.about-combined-title :deep(.split-text-line-mask) {
   display: block;
}

.about-combined-title :deep(.split-text-line-mask) {
   margin-bottom: -0.4em;
   padding-block: 0.2em;
}

.about-combined .about-combined-statement {
   @apply mx-auto w-auto max-w-[26em] text-left text-xl md:text-2xl xl:text-3xl;
}

.about-combined .about-combined-statement:first-of-type {
   @apply mt-14 md:mt-20 xl:mt-24;
}

.about-combined .about-combined-statement + .about-combined-statement {
   @apply mt-6 md:mt-8;
}
</style>
