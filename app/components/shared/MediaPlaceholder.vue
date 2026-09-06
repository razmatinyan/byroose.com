<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const {
	class: className,
	label,
	labelClass,
} = defineProps<{
	class?: HTMLAttributes['class']
	label?: string
	labelClass?: HTMLAttributes['class']
}>()
</script>

<template>
	<div :class="cn('media-placeholder', className)">
		<span v-if="label" :class="cn('media-placeholder-label', labelClass)">{{ label }}</span>
	</div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.media-placeholder {
	@apply grid place-items-center bg-muted;
	background-image: repeating-linear-gradient(
		135deg,
		oklch(0.91 0.0212 79.09) 0 0.625rem,
		oklch(0.9406 0.0159 73.68) 0.625rem 1.25rem
	);
}

.media-placeholder-label {
	@apply text-xs tracking-[0.05em] text-brand-soft;
}
</style>
