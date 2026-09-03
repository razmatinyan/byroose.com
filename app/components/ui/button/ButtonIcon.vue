<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const {
	class: className,
	size = 'default',
	tone = 'light',
} = defineProps<{
	class?: HTMLAttributes['class']
	size?: 'default' | 'sm'
	tone?: 'light' | 'dark' | 'soft'
}>()
</script>

<template>
	<span
		aria-hidden="true"
		:class="cn(
			'button-icon',
			size === 'sm' && 'button-icon-sm',
			tone === 'dark' && 'button-icon-dark',
			tone === 'soft' && 'button-icon-soft',
			className,
		)"
	>
		<slot>→</slot>
	</span>
</template>
