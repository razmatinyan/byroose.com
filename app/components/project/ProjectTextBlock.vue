<script setup lang="ts">
import type { ProjectTextBlock } from "@/lib/projects";

const { block } = defineProps<{
   block: ProjectTextBlock;
}>();
</script>

<template>
   <div class="text-block" :data-align="block.align ?? 'left'">
      <div class="text-block-content">
         <h2 v-if="block.title" class="text-block-title">{{ block.title }}</h2>
         <div v-if="block.paragraphs.length" class="text-block-body">
            <p v-for="(paragraph, index) in block.paragraphs" :key="index">{{ paragraph }}</p>
         </div>
      </div>
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.text-block {
   @apply flex flex-col;
}

.text-block[data-align="center"] {
   @apply items-center;
}

.text-block[data-align="right"] {
   @apply items-end lg:grid lg:grid-cols-2 lg:gap-x-16;
}

.text-block[data-align="right"] .text-block-content {
   @apply lg:col-start-2;
}

.text-block-content {
   @apply flex w-full max-w-3xl flex-col gap-6;
}

.text-block-title {
   @apply text-2xl leading-snug font-medium tracking-[-0.02em] text-foreground md:text-3xl;
}

.text-block-body {
   @apply flex flex-col gap-[1lh] text-xl leading-snug font-medium tracking-[-0.01em] text-brand-soft md:text-2xl;
}
</style>
