<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { appIcons } from '@/lib/icons'
import { cn } from '@/lib/utils'

const {
	class: className,
	icon = appIcons.arrowUpRight,
	size = 'default',
	tone = 'plain',
} = defineProps<{
	class?: HTMLAttributes['class']
	icon?: string
	size?: 'default' | 'sm'
	tone?: 'plain' | 'light' | 'dark' | 'soft'
}>()

const glyphSize = computed(() => (size === 'sm' ? 'size-4' : 'size-5'))
const slidesHorizontally = computed(() => icon === appIcons.arrowRight)
const scalesInPlace = computed(() => icon === appIcons.close)
const glyphAxis = computed(() => {
	if (slidesHorizontally.value) return 'x'
	if (scalesInPlace.value) return 'scale'
	return undefined
})
</script>

<template>
	<span
		aria-hidden="true"
		:data-rollover-glyph-axis="glyphAxis"
		:class="
			cn(
				'button-icon',
				tone !== 'plain' && 'button-icon-tile',
				tone !== 'plain' && size === 'sm' && 'button-icon-sm',
				tone === 'plain' && 'button-icon-plain',
				slidesHorizontally && 'button-icon-slide',
				scalesInPlace && 'button-icon-scale',
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
	@apply grid shrink-0 place-items-center;
}

.button-icon-tile {
	@apply size-11 overflow-hidden rounded-action-icon bg-card text-foreground;
}

.button-icon-glyph {
	@apply col-start-1 row-start-1 grid place-items-center;
}

.button-icon-glyph[data-rollover-glyph-copy] {
	transform: translate(-300%, 300%);
}

.button-icon-slide {
	@apply overflow-hidden;
}

.button-icon-slide .button-icon-glyph[data-rollover-glyph-copy] {
	transform: translate(-100%, 0);
}

.button-icon-scale .button-icon-glyph[data-rollover-glyph-copy] {
	transform: scale(0);
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
