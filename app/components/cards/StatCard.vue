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
			'hero-card hero-stat-card tilt-card',
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
