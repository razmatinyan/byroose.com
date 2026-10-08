<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import AboutSectionHeading from "./AboutSectionHeading.vue";
import AboutStatement from "./AboutStatement.vue";
import type { AboutTitleLine } from "./AboutTitle.vue";
import type { SplitTextResult } from "@/lib/split-text";

const titleLines: readonly AboutTitleLine[] = [
   { text: "Why brands" },
   { text: "choose byroose", underlined: "choose" },
];

const headingImages = [
   { height: 1919, src: "/images/work/5.png", width: 1080 },
   { height: 1919, src: "/images/work/6.png", width: 1080 },
   { height: 1919, src: "/images/work/7.png", width: 1080 },
   { height: 1919, src: "/images/work/1.png", width: 1080 },
] as const;

const statement =
   "The content and the website come from one team. An AI pipeline keeps the output fast, a human editor checks every asset, and the site turns that attention into enquiries you can measure.";

const brandsRoot = useTemplateRef<HTMLElement>("brandsRoot");
const statementSplit = shallowRef<SplitTextResult>();
const { titleRevealed } = useAboutSectionMotion(brandsRoot, {
   textSplits: () => [statementSplit.value],
});

function setStatementSplit(parts: SplitTextResult) {
   statementSplit.value = parts;
}
</script>

<template>
   <section ref="brandsRoot" class="about-brands section-gutter">
      <AboutSectionHeading
         :drawn="titleRevealed"
         :images="headingImages"
         :lines="titleLines"
      />

      <AboutStatement :text="statement" @split="setStatementSplit" />
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-brands {
   @apply pb-section;
}
</style>
