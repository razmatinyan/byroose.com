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

<style scoped>
@reference '../../../assets/css/tailwind.css';

.button-icon {
	@apply grid size-11 shrink-0 place-items-center rounded-action-icon bg-card text-foreground;
}

.button-icon-sm {
	@apply size-9;
}

.button-icon-dark {
	@apply bg-foreground text-background;
}

.button-icon-soft {
	@apply bg-brand-cream text-foreground;
}
</style>
