<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";

const statement =
   "Buy AI content, web development, or both. Either way, your AI content and your website are made by the same team, to the same brief, so nothing leaks between social media and sales.";

const statementRoot = useTemplateRef<HTMLElement>("statementRoot");
const statementSplit = shallowRef<SplitTextResult>();
useServicesStatementMotion(statementRoot, statementSplit);

function setStatementSplit(parts: SplitTextResult) {
   statementSplit.value = parts;
}
</script>

<template>
   <section ref="statementRoot" class="services-statement section-gutter">
      <SplitText
         class="services-statement-text"
         data-services-statement-text
         as="p"
         mask="lines"
         :text="statement"
         type="lines,words"
         @split="setStatementSplit"
      />
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.services-statement {
   @apply relative z-10 rounded-t-[clamp(1.5rem,3vw,3rem)] bg-canvas-shade py-section text-canvas-shade-foreground;
}

.services-statement-text {
   @apply m-0 text-3xl leading-[0.95] font-semibold tracking-[-0.04em] text-pretty md:text-5xl xl:text-6xl;
}

.services-statement-text :deep(.split-text-line),
.services-statement-text :deep(.split-text-line-mask) {
   display: block;
}

.services-statement-text :deep(.split-text-line-mask) {
   margin-block: -0.12em -0.18em;
   padding-block: 0.12em 0.18em;
}

.services-statement-text :deep(.split-text-word) {
   display: inline-block;
}

.services-statement-text :deep(.split-text-line) {
   visibility: hidden;
}
</style>
