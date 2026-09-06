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
			<span class="text-white/90">{{ duration }}</span>
		</div>
		<span
			v-else-if="category"
			:class="cn(
				'blog-card-category',
				variant === 'white' && 'text-brand-soft',
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

<style scoped>
@reference '../../assets/css/tailwind.css';

.blog-card {
	@apply flex flex-col justify-between gap-4 rounded-3xl p-6 text-foreground;
}

.blog-card-featured {
	@apply gap-6 bg-brand-blue p-7 text-brand-blue-foreground sm:col-span-2 sm:row-span-2;
}

.blog-card-wide {
	@apply sm:col-span-2;
}

.blog-card-photo {
	@apply min-h-60 justify-end p-7;
}

.blog-card-meta {
	@apply flex justify-between text-sm font-semibold;
}

.blog-card-category {
	@apply text-sm font-semibold;
}

.blog-card-title {
	@apply m-0 max-w-[26ch] text-xl leading-tight font-semibold tracking-[-0.025em] sm:text-2xl;
}

.blog-card-title-featured {
	@apply max-w-[24ch] text-2xl leading-tight font-bold tracking-[-0.03em] md:text-3xl xl:text-4xl;
}

.blog-card-title-small {
	@apply text-lg tracking-[-0.02em] sm:text-xl;
}

.blog-card-description {
	@apply mt-3.5 mb-0 max-w-[44ch] text-base leading-normal text-white/90;
}
</style>
