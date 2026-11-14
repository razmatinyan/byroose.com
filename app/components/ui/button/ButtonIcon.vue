<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import BrandLogomark from '@/components/shared/BrandLogomark.vue'
import { cn } from '@/lib/utils'

const {
	class: className,
	icon,
	size = 'default',
	tone = 'plain',
} = defineProps<{
	class?: HTMLAttributes['class']
	icon?: string
	size?: 'default' | 'sm'
	tone?: 'plain' | 'light' | 'dark' | 'soft'
}>()

const glyphSize = computed(() => (size === 'sm' ? 'size-4' : 'size-5'))
const logomarkSize = computed(() => (size === 'sm' ? 'size-3' : 'size-4'))
</script>

<template>
	<span
		aria-hidden="true"
		:class="
			cn(
				'button-icon',
				tone !== 'plain' && 'button-icon-tile',
				tone !== 'plain' && size === 'sm' && 'button-icon-sm',
				tone === 'plain' && 'button-icon-plain',
				tone === 'dark' && 'button-icon-dark',
				tone === 'soft' && 'button-icon-soft',
				className,
			)
		"
	>
		<slot>
			<span class="button-icon-glyph" data-rollover-glyph>
				<Icon v-if="icon" :name="icon" :class="glyphSize" />
				<BrandLogomark v-else :class="logomarkSize" />
			</span>
			<span class="button-icon-glyph" data-rollover-glyph-copy>
				<Icon v-if="icon" :name="icon" :class="glyphSize" />
				<BrandLogomark v-else :class="logomarkSize" />
			</span>
		</slot>
	</span>
</template>

<style scoped>
@reference '../../../assets/css/tailwind.css';

.button-icon {
	@apply grid shrink-0 place-items-center;
}

.button-icon-tile {
	@apply size-11 overflow-hidden rounded-action-icon bg-card text-foreground;
}

.button-icon-glyph {
	@apply col-start-1 row-start-1 grid place-items-center;
}

.button-icon-glyph[data-rollover-glyph] {
	transform-origin: 100% 0;
}

.button-icon-glyph[data-rollover-glyph-copy] {
	transform: scale(0);
	transform-origin: 0 100%;
}

.button-icon-sm {
	@apply size-9;
}

.button-icon-plain {
	@apply text-current;
}

.button-icon-dark {
	@apply bg-foreground text-background;
}

.button-icon-soft {
	@apply bg-brand-cream text-foreground;
}
</style>
