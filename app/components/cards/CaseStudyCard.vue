<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { Card } from "@/components/ui/card"
import { surfaceTones } from "@/lib/surfaces"
import type { SurfaceTone } from "@/lib/surfaces"
import { cn } from "@/lib/utils"

const {
	class: className,
	client,
	description,
	image,
	imageAlt,
	results,
	revealTones = ["primary", "yellow", "blue", "green"],
	tone = "primary",
} = defineProps<{
	class?: HTMLAttributes["class"]
	client: string
	description: string
	image: string
	imageAlt: string
	results: readonly { label: string, value: string }[]
	revealTones?: readonly SurfaceTone[]
	tone?: SurfaceTone
}>()

const emit = defineEmits<{
	activate: []
	deactivate: []
}>()
</script>

<template>
	<Card
		as="article"
		variant="plain"
		data-work-case
		:class="cn('case', className)"
		@pointerenter="emit('activate')"
		@pointerleave="emit('deactivate')"
	>
		<div class="case-media">
			<span
				v-for="revealTone in revealTones"
				:key="revealTone"
				data-work-case-layer
				aria-hidden="true"
				:class="cn('case-layer', surfaceTones[revealTone])"
			/>

			<div data-work-case-layer class="case-image-layer">
				<NuxtImg
					data-work-case-image
					class="case-image"
					:src="image"
					:alt="imageAlt"
					width="1456"
					height="816"
					sizes="sm:896px md:1024px lg:768px xl:1024px 2xl:1536px"
					densities="x1"
					loading="lazy"
					draggable="false"
				/>
			</div>
		</div>

		<div class="case-body">
			<div class="case-line">
				<h3 data-work-case-reveal class="case-title">{{ client }}</h3>
			</div>

			<div class="case-line mt-4">
				<p data-work-case-reveal class="case-description">
					{{ description }}
				</p>
			</div>

			<div class="case-results">
				<div v-for="result in results" :key="result.label" class="case-result">
					<div class="case-line">
						<p
							data-work-case-reveal
							:class="cn('case-result-value', surfaceTones[tone])"
						>
							{{ result.value }}
						</p>
					</div>

					<div class="case-line mt-3">
						<p data-work-case-reveal class="case-result-label">
							{{ result.label }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</Card>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.case {
	@apply grid cursor-pointer grid-cols-1 items-start gap-8 md:grid-cols-[3fr_2fr] md:gap-12 xl:gap-20;
}

.case-media {
	@apply relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted;
	clip-path: inset(0 round var(--radius-2xl));
}

.case-layer,
.case-image-layer {
	@apply pointer-events-none absolute -inset-px;
	border-radius: inherit;
}

.case-layer {
	transform: scale(0);
}

.case-image {
	@apply absolute inset-0 size-full select-none object-cover;
}

.case-body {
	@apply flex min-w-0 flex-col md:self-stretch;
}

.case-line {
	@apply overflow-hidden;
}

.case-title {
	@apply m-0 pb-[0.12em] text-5xl leading-none font-bold tracking-[-0.045em] md:text-6xl xl:text-[5rem];
}

.case-description {
	@apply m-0 max-w-[36ch] text-xl leading-tight font-medium tracking-[-0.03em] text-brand-subtle md:text-2xl;
}

.case-results {
	@apply mt-10 flex flex-wrap gap-x-10 gap-y-8 md:mt-auto md:pt-14;
}

.case-result {
	@apply min-w-0;
}

.case-result-value {
	@apply m-0 inline-block rounded-lg px-3 py-1.5 text-5xl leading-none font-extrabold tracking-[-0.05em] md:text-6xl;
}

.case-result-label {
	@apply m-0 max-w-[14ch] text-lg leading-tight font-semibold tracking-[-0.02em] md:text-xl;
}
</style>
