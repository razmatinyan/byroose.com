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
