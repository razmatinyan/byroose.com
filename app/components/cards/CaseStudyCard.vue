<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import MediaPlaceholder from '@/components/shared/MediaPlaceholder.vue'

type Theme = 'blue' | 'orange' | 'pink' | 'white'
type Rotation = 'minus-three' | 'minus-two' | 'plus-three' | 'plus-two'
type Offset = 'none' | 'small' | 'medium' | 'large' | 'extra-large'

const {
	class: className,
	client,
	metric,
	offset = 'none',
	rotation = 'minus-two',
	theme = 'white',
	title,
} = defineProps<{
	class?: HTMLAttributes['class']
	client: string
	metric: string
	offset?: Offset
	rotation?: Rotation
	theme?: Theme
	title: string
}>()

const surfaceClasses: Record<Theme, string> = {
	blue: 'surface-blue',
	orange: 'surface-orange',
	pink: 'surface-pink',
	white: 'surface-card',
}

const patternClasses: Record<Theme, string> = {
	blue: 'pattern-blue',
	orange: 'pattern-orange',
	pink: 'pattern-pink',
	white: '',
}
</script>

<template>
	<Card
		as="article"
		variant="plain"
		:class="cn(
			'case-card tilt-card',
			surfaceClasses[theme],
			`tilt-${rotation}`,
			offset !== 'none' && `case-offset-${offset}`,
			className,
		)"
	>
		<MediaPlaceholder
			label="case photo"
			:class="cn('case-card-image', patternClasses[theme])"
			label-class="text-current opacity-50"
		/>
		<div class="case-card-copy">
			<span class="case-card-client">{{ client }}</span>
			<p class="case-card-title">{{ title }}</p>
			<p class="case-card-metric">{{ metric }}</p>
		</div>
	</Card>
</template>
