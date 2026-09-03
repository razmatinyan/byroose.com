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
					<ButtonIcon />
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
				class="hero-card tilt-card tilt-plus-three"
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
				class="hero-card tilt-card tilt-plus-four"
				label="shoot / behind the scenes"
			/>
		</div>
	</section>
</template>
