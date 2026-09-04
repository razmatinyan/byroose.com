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
