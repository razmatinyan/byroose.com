<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import AboutSectionHeading from "./AboutSectionHeading.vue";
import AboutStatement from "./AboutStatement.vue";
import type { AboutTitleLine } from "./AboutTitle.vue";
import type { SplitTextResult } from "@/lib/split-text";

const titleLines: readonly AboutTitleLine[] = [
   { text: "Why people" },
   { text: "trust byroose", underlined: "trust" },
];

const headingImages = [
   { height: 1919, src: "/images/work/1.png", width: 1080 },
   { height: 1919, src: "/images/work/2.png", width: 1080 },
   { height: 1620, src: "/images/work/3.png", width: 1080 },
   { height: 1919, src: "/images/work/4.png", width: 1080 },
] as const;

const statement =
   "You talk to the people doing the work, not an account layer. Every project starts with a clear hypothesis and ends with an honest readout, so you always know what worked, what didn't, and what comes next.";

const trustRoot = useTemplateRef<HTMLElement>("trustRoot");
const statementSplit = shallowRef<SplitTextResult>();
const { titleRevealed } = useAboutSectionMotion(trustRoot, {
   textSplits: () => [statementSplit.value],
});

function setStatementSplit(parts: SplitTextResult) {
   statementSplit.value = parts;
}
</script>

<template>
   <section ref="trustRoot" class="about-trust section-gutter">
      <AboutSectionHeading
         :drawn="titleRevealed"
         :images="headingImages"
         :lines="titleLines"
         underline-color="var(--color-ribbon)"
      />
      <AboutStatement :text="statement" @split="setStatementSplit" />
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-trust {
   @apply py-section;
}
</style>
