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
							: 'text-current opacity-90',
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
			:label-class="theme === 'white' ? undefined : 'text-current opacity-90'"
		/>
	</Card>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.journey-step {
	@apply grid w-full grid-cols-1 items-center gap-8 px-page py-10 md:grid-cols-2 md:gap-12 md:py-14 xl:gap-16 xl:py-18;
}

.journey-step-first {
	@apply mt-8 md:mt-14;
}

.journey-step-number {
	@apply block text-step font-bold tracking-[-0.06em];
}

.journey-step-title {
	@apply mt-4 mb-0 text-3xl leading-none font-bold tracking-[-0.035em] lg:text-4xl xl:text-5xl;
}

.journey-step-copy {
	@apply mt-4 mb-0 max-w-[46ch] text-base leading-relaxed sm:text-lg;
}

.journey-step-visual {
	@apply aspect-16/11 rounded-2xl;
}
</style>
