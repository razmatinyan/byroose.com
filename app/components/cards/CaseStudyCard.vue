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
	resultLabel,
	resultValue,
	revealTones = ["primary", "yellow", "blue", "green"],
	tone = "primary",
} = defineProps<{
	class?: HTMLAttributes["class"]
	client: string
	description: string
	image: string
	imageAlt: string
	resultLabel: string
	resultValue: string
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

			<div class="case-line mt-10 md:mt-14">
				<span
					data-work-case-reveal
					:class="cn('case-result-value', surfaceTones[tone])"
				>
					{{ resultValue }}
				</span>
			</div>

			<div class="case-line mt-3">
				<p data-work-case-reveal class="case-result-label">
					{{ resultLabel }}
				</p>
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
	@apply min-w-0;
}

.case-line {
	@apply overflow-hidden;
}

.case-title {
	@apply m-0 text-3xl leading-tight font-bold tracking-[-0.03em] md:text-4xl xl:text-5xl;
}

.case-description {
	@apply m-0 max-w-[42ch] text-lg leading-snug tracking-tight text-brand-subtle md:text-xl;
}

.case-result-value {
	@apply inline-block rounded-md px-3 py-1 text-2xl leading-tight font-semibold tracking-tight md:text-3xl;
}

.case-result-label {
	@apply m-0 max-w-[24ch] text-2xl leading-tight tracking-tight font-medium md:text-3xl;
}
</style>
