<script setup lang="ts">
import { NuxtLink } from "#components";
import SplitText from "@/components/shared/SplitText.vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import type { SplitTextResult } from "@/lib/split-text";

const emit = defineEmits<{
	descriptionSplit: [parts: SplitTextResult];
	titleSplit: [parts: SplitTextResult];
}>();

const heroTitle =
	"Scrolled past? Make AI content that turns views into new clients.";
const heroDescription =
	"Most brands post more and get noticed less. We pair AI content creation with web development, so your visuals get seen and your site turns that attention into enquiries.";
const heroActionLabel = "Start a project";

const heroImages = [
	{
		id: "hero-one",
		preload: true,
		removed: true,
		rotation: 0,
		src: "/images/hero/1.png",
	},
	{
		id: "hero-two",
		preload: false,
		removed: true,
		rotation: 0,
		src: "/images/hero/2.png",
	},
	{
		id: "hero-three",
		preload: false,
		removed: true,
		rotation: -3,
		src: "/images/hero/3.png",
	},
	{
		id: "hero-four",
		preload: false,
		removed: true,
		rotation: 2,
		src: "/images/hero/4.png",
	},
	{
		id: "hero-five",
		preload: false,
		removed: true,
		rotation: -1.5,
		src: "/images/hero/5.png",
	},
	{
		id: "hero-six",
		preload: false,
		removed: true,
		rotation: 2.5,
		src: "/images/hero/6.png",
	},
	{
		id: "hero-seven",
		preload: true,
		removed: false,
		rotation: -1.5,
		src: "/images/hero/3.png",
	},
	{
		id: "hero-eight",
		preload: false,
		removed: false,
		rotation: 2,
		src: "/images/hero/2.png",
	},
	{
		id: "hero-nine",
		preload: false,
		removed: false,
		rotation: -3,
		src: "/images/hero/5.png",
	},
	{
		id: "hero-ten",
		preload: false,
		removed: false,
		rotation: 2,
		src: "/images/hero/1.png",
	},
] as const;

function handleTitleSplit(parts: SplitTextResult) {
	emit("titleSplit", parts);
}

function handleDescriptionSplit(parts: SplitTextResult) {
	emit("descriptionSplit", parts);
}
</script>

<template>
	<section id="top" data-home-hero-scroll class="hero section-gutter">
		<div class="hero-intro">
			<SplitText
				class="hero-title"
				data-home-intro-title
				as="h1"
				mask="lines"
				:text="heroTitle"
				type="lines"
				@split="handleTitleSplit"
			/>

			<div class="hero-copy">
				<SplitText
					class="hero-description"
					data-home-intro-copy
					as="p"
					mask="lines"
					:text="heroDescription"
					type="lines"
					@split="handleDescriptionSplit"
				/>

				<div data-home-intro-copy data-home-intro-action-mask>
					<span data-home-intro-action class="hero-action-inner">
						<Button
							:as="NuxtLink"
							to="/contact"
							variant="dark"
							size="cta-lg"
						>
							{{ heroActionLabel }}
							<template #icon>
								<ButtonIcon />
							</template>
						</Button>
					</span>
				</div>
			</div>
		</div>

		<div data-home-intro-media-grid class="hero-media-grid">
			<article
				v-for="image in heroImages"
				:key="image.id"
				data-home-intro-card
				class="hero-media-card"
				:class="{ 'hero-media-card-remove': image.removed }"
				:data-home-intro-card-remove="image.removed ? '' : undefined"
				:data-home-intro-card-rotation="image.rotation"
				:data-home-hero-scroll-card="
					image.id === 'hero-nine' ? '' : undefined
				"
			>
				<NuxtImg
					class="hero-media-image"
					:src="image.src"
					alt=""
					width="1456"
					height="816"
					sizes="sm:768px lg:1024px xl:1280px 2xl:1536px"
					densities="x1"
					loading="eager"
					:preload="image.preload"
					draggable="false"
				/>
			</article>
		</div>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.hero {
	--hero-card-height: calc(
		(100vw - 2 * var(--spacing-page) - 0.5rem) / 2 * 0.75
	);
	@apply relative grid w-full grid-rows-[minmax(0,1fr)_auto] pt-4 pb-4 sm:pt-6 sm:pb-6;
	min-height: calc(100svh - 5rem + var(--hero-card-height) / 2 - 2.5rem);
}

.hero-intro {
	@apply grid min-h-0 content-start gap-8 pt-6 pb-10 sm:pt-8 sm:pb-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-12 lg:pt-10;
}

.hero-title {
	@apply m-0 leading-[0.82] font-bold tracking-[-0.05em] lg:col-start-2 lg:row-start-1;
	font-size: calc((100vw - 2 * var(--spacing-page)) / 7.6);
	margin-top: -0.22em;
	max-width: 7.4em;
}

.hero-copy {
	@apply flex max-w-md flex-col items-start gap-6 lg:col-start-1 lg:row-start-1 lg:max-w-none lg:pt-3;
}

.hero-description {
	@apply m-0 text-xl leading-tight font-semibold tracking-[-0.04em] text-balance text-foreground;
}

.hero-title :deep(.split-text-line),
.hero-title :deep(.split-text-line-mask),
.hero-description :deep(.split-text-line),
.hero-description :deep(.split-text-line-mask) {
	display: block;
}

.hero-title :deep(.split-text-line),
.hero-description :deep(.split-text-line) {
	will-change: transform;
}

.hero-title :deep(.split-text-line-mask) {
	margin-bottom: -0.44em;
	padding-block: 0.22em;
}

.hero-description :deep(.split-text-line-mask) {
	margin-bottom: -0.2em;
	padding-bottom: 0.2em;
}

.hero-action-inner {
	@apply block;
	will-change: transform;
}

.hero-media-grid {
	@apply relative grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4;
}

.hero-media-card {
	@apply relative aspect-4/3 overflow-hidden rounded-md bg-muted;
	transform-origin: center;
}

.hero-media-card-remove {
	@apply absolute top-0 left-1/2 w-[calc((100%-0.5rem)/2)] -translate-x-1/2 sm:w-[calc((100%-0.75rem)/2)] lg:w-[calc((100%-2.25rem)/4)];
}

.hero-media-card:not(.hero-media-card-remove) {
	transform: scale(1.08) rotate(var(--hero-card-rotation, 0deg));
}

.hero-media-card[data-home-intro-card-rotation="-3"] {
	--hero-card-rotation: -3deg;
}

.hero-media-card[data-home-intro-card-rotation="2"] {
	--hero-card-rotation: 2deg;
}

.hero-media-card[data-home-intro-card-rotation="-1.5"] {
	--hero-card-rotation: -1.5deg;
}

.hero-media-card[data-home-intro-card-rotation="2.5"] {
	--hero-card-rotation: 2.5deg;
}

@media (min-width: 64rem) {
	.hero-title {
		font-size: var(--text-hero);
		max-width: 7.25em;
	}

	.hero-description {
		@apply text-wrap;
		font-size: clamp(1.0625rem, 1.7vw, 1.75rem);
		max-width: 13.4em;
	}

	.hero {
		--hero-card-height: calc(
			(100vw - 2 * var(--spacing-page) - 2.25rem) / 4 * 0.75
		);
	}
}

.hero-media-image {
	@apply absolute inset-0 size-full object-cover;
}
</style>
