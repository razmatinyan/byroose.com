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
			label-class="text-current opacity-85"
		/>
		<div class="case-card-copy">
			<span class="case-card-client">{{ client }}</span>
			<p class="case-card-title">{{ title }}</p>
			<p class="case-card-metric">{{ metric }}</p>
		</div>
	</Card>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.case-card {
	@apply rounded-3xl p-3.5;
}

.case-card-image {
	@apply aspect-16/10 rounded-xl;
}

.case-card-copy {
	@apply px-1.5 pt-4 pb-1.5;
}

.case-card-client {
	@apply text-sm font-semibold;
}

.case-card-title {
	@apply mt-2 mb-0 text-xl leading-tight font-semibold tracking-[-0.02em];
}

.case-card-metric {
	@apply mt-2 mb-0 text-sm opacity-90;
}

@media (min-width: 40rem) {
	.case-offset-small {
		@apply mt-4;
	}

	.case-offset-medium {
		@apply mt-10;
	}

	.case-offset-large {
		@apply mt-14;
	}

	.case-offset-extra-large {
		@apply mt-16;
	}
}
</style>
