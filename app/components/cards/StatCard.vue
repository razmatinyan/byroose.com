<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

const {
	caption,
	class: className,
	label,
	number,
	rotation = 'none',
	tone = 'green',
} = defineProps<{
	caption: string
	class?: HTMLAttributes['class']
	label: string
	number: string
	rotation?: 'none' | 'minus-four' | 'minus-two' | 'plus-four' | 'plus-two'
	tone?: 'blue' | 'green'
}>()
</script>

<template>
	<Card
		variant="plain"
		:class="cn(
			'stat-card tilt-card',
			tone === 'green' ? 'surface-green' : 'surface-blue',
			rotation !== 'none' && `tilt-${rotation}`,
			className,
		)"
	>
		<div>
			<strong class="hero-number">{{ number }}</strong>
			<span class="hero-label">{{ label }}</span>
		</div>
		<p class="hero-caption">{{ caption }}</p>
	</Card>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.stat-card {
	@apply flex min-h-80 flex-col justify-between overflow-hidden rounded-2xl p-6 md:min-h-96 xl:min-h-108;
}

.hero-number {
	@apply block text-5xl leading-none font-bold tracking-[-0.04em] xl:text-7xl;
}

.hero-label {
	@apply mt-3 block text-sm font-semibold opacity-90;
}

.hero-caption {
	@apply m-0 text-sm leading-snug text-current opacity-90 sm:text-base;
}
</style>
