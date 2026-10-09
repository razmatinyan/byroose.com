<script setup lang="ts">
import DrawnLine from "@/components/shared/DrawnLine.vue";
</script>

<template>
	<DrawnLine class="work-line" />
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.work-line {
	@apply top-0 h-full overflow-visible text-foreground opacity-3;
	left: calc(var(--spacing-page) * -1);
	width: calc(100% + var(--spacing-page) * 2);
}
</style>
