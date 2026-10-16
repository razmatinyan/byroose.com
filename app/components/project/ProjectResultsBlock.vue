<script setup lang="ts">
import { computed } from "vue";
import type { ProjectResultsBlock } from "@/lib/projects";
import { surfaceTones } from "@/lib/surfaces";
import { cn } from "@/lib/utils";

const { block } = defineProps<{
   block: ProjectResultsBlock;
}>();

const valueTone = computed(() => surfaceTones[block.tone ?? "primary"]);
const columns = computed(() => (block.results.length > 2 ? 3 : 2));
</script>

<template>
   <dl class="results-block" :data-columns="columns">
      <div v-for="result in block.results" :key="result.label" class="results-block-item">
         <dt class="results-block-label">{{ result.label }}</dt>
         <dd :class="cn('results-block-value', valueTone)">{{ result.value }}</dd>
      </div>
   </dl>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.results-block {
   @apply m-0 grid grid-cols-1 gap-x-4 gap-y-14 md:grid-cols-2;
}

.results-block[data-columns="3"] {
   @apply lg:grid-cols-3;
}

.results-block-item {
   @apply flex min-w-0 flex-col-reverse items-center gap-6 text-center;
}

.results-block-value {
   @apply m-0 max-w-full rounded-lg px-[0.2em] py-[0.1em] leading-none font-extrabold tracking-[-0.05em];
   font-size: clamp(3.5rem, 6.5vw, 7.5rem);
}

.results-block-label {
   @apply max-w-[16ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance md:text-5xl;
}
</style>
