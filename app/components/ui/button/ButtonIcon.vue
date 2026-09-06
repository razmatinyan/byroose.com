<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { appIcons } from '@/lib/icons'
import { cn } from '@/lib/utils'

const {
	class: className,
	icon = appIcons.arrowUpRight,
	size = 'default',
	tone = 'light',
} = defineProps<{
	class?: HTMLAttributes['class']
	icon?: string
	size?: 'default' | 'sm'
	tone?: 'light' | 'dark' | 'soft'
}>()

const glyphSize = computed(() => (size === 'sm' ? 'size-4' : 'size-5'))
</script>

<template>
	<span
		aria-hidden="true"
		:class="
			cn(
				'button-icon',
				size === 'sm' && 'button-icon-sm',
				tone === 'dark' && 'button-icon-dark',
				tone === 'soft' && 'button-icon-soft',
				className,
			)
		"
	>
		<slot>
			<span class="button-icon-glyph" data-rollover-glyph>
				<Icon :name="icon" :class="glyphSize" />
			</span>
			<span class="button-icon-glyph" data-rollover-glyph-copy>
				<Icon :name="icon" :class="glyphSize" />
			</span>
		</slot>
	</span>
</template>

<style scoped>
@reference '../../../assets/css/tailwind.css';

.button-icon {
	@apply grid size-11 shrink-0 place-items-center overflow-hidden rounded-action-icon bg-card text-foreground;
}

.button-icon-glyph {
	@apply col-start-1 row-start-1 grid place-items-center;
}

.button-icon-glyph[data-rollover-glyph-copy] {
	transform: translate(-200%, 100%);
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
