<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { appIcons } from '@/lib/icons'
import { cn } from '@/lib/utils'

const {
	class: className,
	icon = appIcons.arrowRight,
	size = 'default',
	tone = 'light',
} = defineProps<{
	class?: HTMLAttributes['class']
	icon?: string
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
		<slot>
			<Icon :name="icon" :class="size === 'sm' ? 'size-4' : 'size-5'" />
		</slot>
	</span>
</template>
