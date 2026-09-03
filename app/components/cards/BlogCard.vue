<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

type Variant = 'blue' | 'orange' | 'photo' | 'pink' | 'white'

const {
	category,
	class: className,
	description,
	duration,
	featured = false,
	href = '#blog',
	title,
	variant = 'white',
	wide = false,
} = defineProps<{
	category?: string
	class?: HTMLAttributes['class']
	description?: string
	duration?: string
	featured?: boolean
	href?: string
	title: string
	variant?: Variant
	wide?: boolean
}>()

const surfaceClasses: Record<Variant, string> = {
	blue: 'surface-blue',
	orange: 'surface-orange',
	photo: 'media-placeholder',
	pink: 'surface-pink',
	white: 'surface-card',
}
</script>

<template>
	<Card
		as="a"
		variant="plain"
		:href="href"
		:class="cn(
			'blog-card tilt-card hover:text-current',
			surfaceClasses[variant],
			featured && 'blog-card-featured',
			wide && 'blog-card-wide',
			variant === 'photo' && 'blog-card-photo',
			className,
		)"
	>
		<div v-if="featured" class="blog-card-meta">
			<span class="text-brand-cream">{{ category ?? 'Featured' }}</span>
			<span class="text-white/65">{{ duration }}</span>
		</div>
		<span
			v-else-if="category"
			:class="cn(
				'blog-card-category',
				variant === 'white' && 'text-brand-soft opacity-100',
				variant === 'pink' && 'opacity-60',
			)"
		>
			{{ category }}
		</span>

		<div>
			<h3
				:class="cn(
					'blog-card-title',
					featured && 'blog-card-title-featured',
					!featured && !wide && 'blog-card-title-small',
				)"
			>
				{{ title }}
			</h3>
			<p v-if="description" class="blog-card-description">{{ description }}</p>
		</div>
	</Card>
</template>
