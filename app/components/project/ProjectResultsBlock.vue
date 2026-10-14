<script setup lang="ts">
import { computed, useId } from "vue";
import type { ProjectResultsBlock } from "@/lib/projects";
import { surfaceTones } from "@/lib/surfaces";
import { cn } from "@/lib/utils";

const { block } = defineProps<{
   block: ProjectResultsBlock;
}>();

const titleId = useId();
const valueTone = computed(() => surfaceTones[block.tone ?? "primary"]);
</script>

<template>
   <section class="results-block" :aria-labelledby="titleId">
      <h2 :id="titleId" class="results-block-title">Results</h2>
      <dl class="results-block-items">
         <div v-for="result in block.results" :key="result.label" class="results-block-item">
            <dt class="results-block-label">{{ result.label }}</dt>
            <dd :class="cn('results-block-value', valueTone)">{{ result.value }}</dd>
         </div>
      </dl>
   </section>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.results-block {
   @apply grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16;
}

.results-block-title {
   @apply text-4xl leading-none font-bold tracking-[-0.05em] md:text-5xl;
}

.results-block-items {
   @apply flex flex-wrap items-start gap-x-10 gap-y-8;
}

.results-block-item {
   @apply flex min-w-0 flex-col-reverse items-start gap-3;
}

.results-block-value {
   @apply m-0 max-w-full rounded-lg px-3 py-1.5 text-5xl leading-none font-extrabold tracking-[-0.05em] md:text-6xl;
}

.results-block-label {
   @apply w-[14ch] pb-[0.1em] text-lg leading-[1.05] font-semibold tracking-[-0.02em] md:text-xl;
}
</style>
