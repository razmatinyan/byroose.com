<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import MediaPlaceholder from '@/components/shared/MediaPlaceholder.vue'

type Theme = 'blue' | 'orange' | 'white'

const {
	body,
	class: className,
	number,
	theme = 'white',
	title,
	visual,
} = defineProps<{
	body: string
	class?: HTMLAttributes['class']
	number: string
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
		:class="cn('journey-step', surfaceClasses[theme], className)"
	>
		<div>
			<span
				:class="
					cn(
						'journey-step-number',
						theme === 'white' && 'text-foreground',
						theme === 'blue' && 'text-brand-cream',
						theme === 'orange' && 'text-white',
					)
				"
			>
				{{ number }}
			</span>
			<h3 class="journey-step-title">{{ title }}</h3>
			<p
				:class="
					cn(
						'journey-step-copy',
						theme === 'white'
							? 'text-muted-foreground'
							: 'text-white/85',
					)
				"
			>
				{{ body }}
			</p>
		</div>
		<MediaPlaceholder
			:label="visual"
			:class="
				cn(
					'journey-step-visual',
					theme === 'blue' && 'pattern-blue',
					theme === 'orange' && 'pattern-orange',
				)
			"
			:label-class="theme === 'white' ? undefined : 'text-white/75'"
		/>
	</Card>
</template>
