<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { ButtonIcon } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import MediaPlaceholder from '@/components/shared/MediaPlaceholder.vue'

type Theme = 'blue' | 'orange' | 'white'

const {
	body,
	class: className,
	href = '#contact',
	length,
	price,
	theme = 'white',
	title,
	visual,
} = defineProps<{
	body: string
	class?: HTMLAttributes['class']
	href?: string
	length: string
	price: string
	theme?: Theme
	title: string
	visual: string
}>()

const surfaceClasses: Record<Theme, string> = {
	blue: 'surface-blue',
	orange: 'surface-orange',
	white: 'surface-card',
}
</script>

<template>
	<Card
		as="article"
		variant="plain"
		:class="cn('course-card tilt-card', surfaceClasses[theme], className)"
	>
		<div class="course-card-meta">
			<span class="course-card-kicker">{{ length }}</span>
			<strong class="course-card-price">{{ price }}</strong>
		</div>
		<MediaPlaceholder
			:label="visual"
			:class="cn(
				'course-card-visual',
				theme === 'blue' && 'pattern-blue',
				theme === 'orange' && 'pattern-orange',
			)"
			:label-class="theme === 'white' ? undefined : 'text-current opacity-90'"
		/>
		<h3 class="course-card-title">{{ title }}</h3>
		<p class="course-card-description">{{ body }}</p>
		<a class="course-card-link" :href="href">
			Join the next cohort
			<ButtonIcon :tone="theme === 'white' ? 'soft' : 'light'" size="sm" />
		</a>
	</Card>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.course-card {
	@apply flex min-h-96 flex-col gap-5 rounded-3xl p-7;
}

.course-card-meta {
	@apply flex items-baseline justify-between gap-4;
}

.course-card-kicker {
	@apply text-sm font-semibold;
}

.course-card-price {
	@apply text-lg font-bold tracking-[-0.02em];
}

.course-card-visual {
	@apply aspect-16/10 rounded-xl;
}

.course-card-title {
	@apply m-0 text-2xl leading-tight font-bold tracking-[-0.03em] xl:text-3xl;
}

.course-card-description {
	@apply m-0 text-sm leading-relaxed sm:text-base;
}

.course-card-link {
	@apply mt-auto flex items-center justify-between gap-3.5 rounded-xl py-2 pr-2 text-base font-semibold text-current hover:text-current;
}
</style>
