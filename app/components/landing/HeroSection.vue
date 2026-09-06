<script setup lang="ts">
import StatCard from '@/components/cards/StatCard.vue'
import MediaPlaceholder from '@/components/shared/MediaPlaceholder.vue'
import { Button, ButtonIcon } from '@/components/ui/button'
</script>

<template>
	<section id="top" class="hero section-gutter">
		<div class="hero-intro">
			<h1 class="hero-title">Make noise. Make sense. Make money.</h1>
			<div class="hero-copy">
				<p class="hero-description">
					byroose is a creative agency for brands that are tired of shouting into the void.
					Strategy, marketing, web and AI content under one roof.
				</p>
				<Button as="a" href="#contact" size="cta-lg">
					Get a plan
					<template #icon>
						<ButtonIcon />
					</template>
				</Button>
			</div>
		</div>

		<div class="hero-grid">
			<StatCard
				number="18M+"
				label="Views earned"
				caption="Organic and paid, last twelve months."
				rotation="minus-four"
			/>

			<MediaPlaceholder
				class="hero-media tilt-card tilt-plus-three"
				label="shoot / behind the scenes"
			/>

			<StatCard
				number="64"
				label="Brands built"
				caption="From first positioning line to full launch."
				rotation="minus-two"
				tone="blue"
			/>

			<MediaPlaceholder
				class="hero-media tilt-card tilt-plus-four"
				label="shoot / behind the scenes"
			/>
		</div>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.hero {
	@apply w-full pt-12 md:pt-16 xl:pt-24;
}

.hero-intro {
	@apply flex flex-wrap items-end justify-between gap-8;
}

.hero-title {
	@apply m-0 max-w-[15ch] text-hero font-bold tracking-[-0.045em];
}

.hero-copy {
	@apply max-w-md pb-2.5 lg:max-w-sm;
}

.hero-description {
	@apply mt-0 mb-5 text-base leading-relaxed text-muted-foreground sm:text-xl;
}

.hero-grid {
	@apply mt-32 grid grid-cols-1 items-stretch gap-3 sm:mt-40 sm:grid-cols-2 sm:gap-4 lg:mt-48 lg:grid-cols-4 xl:gap-6;
}

.hero-media {
	@apply min-h-80 overflow-hidden rounded-2xl md:min-h-96 xl:min-h-108;
}
</style>
