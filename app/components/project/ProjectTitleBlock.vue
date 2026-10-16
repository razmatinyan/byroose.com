<script setup lang="ts">
import type { ProjectTitleBlock } from "@/lib/projects";

const { block } = defineProps<{
   block: ProjectTitleBlock;
}>();
</script>

<template>
   <h2 class="title-block">{{ block.title }}</h2>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.title-block {
   @apply m-0 text-display font-bold tracking-[-0.05em] text-balance text-center text-foreground;
}
</style>
