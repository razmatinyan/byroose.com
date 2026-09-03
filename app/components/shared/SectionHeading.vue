<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const {
	class: className,
	title,
	titleClass,
} = defineProps<{
	class?: HTMLAttributes['class']
	title: string
	titleClass?: HTMLAttributes['class']
}>()
</script>

<template>
	<div :class="cn('section-heading-row', className)">
		<h2 :class="cn('section-title', titleClass)">{{ title }}</h2>
		<slot />
	</div>
</template>
