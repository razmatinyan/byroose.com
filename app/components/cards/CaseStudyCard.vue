<script setup lang="ts">
import { shallowRef } from "vue";
import type { HTMLAttributes } from "vue";
import { Card } from "@/components/ui/card";
import HoverVideo from "@/components/shared/HoverVideo.vue";
import ArrowLink from "@/components/shared/ArrowLink.vue";
import LiveLink from "@/components/shared/LiveLink.vue";
import { surfaceTones } from "@/lib/surfaces";
import type { SurfaceTone } from "@/lib/surfaces";
import type { ProjectCategory } from "@/lib/projects";
import { cn } from "@/lib/utils";

const {
	categories = [],
	class: className,
	client,
	description,
	href,
	image,
	imageAlt,
	imageScale,
	liveUrl,
	results,
	revealTones = ["yellow", "primary"],
	serviceLink,
	title,
	tone = "primary",
	video,
} = defineProps<{
	categories?: readonly ProjectCategory[];
	class?: HTMLAttributes["class"];
	client: string;
	description: string;
	href?: string;
	image: string;
	imageAlt: string;
	imageScale?: number;
	liveUrl?: string;
	results?: readonly { label: string; value: string }[];
	revealTones?: readonly SurfaceTone[];
	serviceLink?: { label: string; to: string };
	title?: string;
	tone?: SurfaceTone;
	video?: string;
}>();

const emit = defineEmits<{
	activate: [];
	deactivate: [];
	liveActivate: [];
	liveDeactivate: [];
}>();

const hovered = shallowRef(false);

function activate() {
	hovered.value = true;
	emit("activate");
}

function deactivate() {
	hovered.value = false;
	emit("deactivate");
}
</script>

<template>
	<Card
		as="article"
		variant="plain"
		data-work-case
		:class="cn('case', className)"
		@pointerenter="activate"
		@pointerleave="deactivate"
	>
		<NuxtLink v-if="href" :to="href" class="case-link">
			<span class="sr-only">{{ client }}</span>
		</NuxtLink>

		<div class="case-media">
			<span
				v-for="revealTone in revealTones"
				:key="revealTone"
				data-work-case-layer
				aria-hidden="true"
				:class="cn('case-layer', surfaceTones[revealTone])"
			/>

			<div data-work-case-layer class="case-image-layer">
				<span class="case-image-zoom">
					<span
						data-work-case-image
						:data-work-case-image-scale="imageScale"
						class="case-image"
					>
						<NuxtImg
							class="case-image-media"
							:src="image"
							:alt="imageAlt"
							width="1456"
							height="816"
							sizes="sm:896px md:1024px lg:768px xl:1024px 2xl:1536px"
							densities="x1"
							loading="lazy"
							draggable="false"
						/>
						<HoverVideo
							v-if="video"
							class="case-image-media"
							:src="video"
							:active="hovered"
						/>
					</span>
				</span>
			</div>
		</div>

		<div class="case-body">
			<div class="case-line">
				<h3 data-work-case-reveal class="case-title">{{ title ?? client }}</h3>
			</div>

			<div class="case-line mt-4">
				<p data-work-case-reveal class="case-description">
					{{ description }}
				</p>
			</div>

			<div v-if="liveUrl" class="case-line case-live">
				<div data-work-case-reveal>
					<LiveLink :href="liveUrl" />
				</div>
			</div>

			<div v-if="serviceLink" class="case-line case-live">
				<div data-work-case-reveal>
					<ArrowLink :to="serviceLink.to" :label="serviceLink.label" />
				</div>
			</div>

			<div v-if="categories.length" class="case-line case-services">
				<ul data-work-case-reveal class="case-service-list" aria-label="Services">
					<li
						v-for="category in categories"
						:key="category"
						class="case-service"
					>
						{{ category }}
					</li>
				</ul>
			</div>

			<div v-if="results?.length" class="case-results">
				<div
					v-for="result in results"
					:key="result.label"
					class="case-result"
				>
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
	@apply relative grid cursor-pointer grid-cols-1 items-start gap-8 rounded-xl md:grid-cols-[3fr_2fr] md:gap-12 xl:gap-20;
}

.case:has(.case-link:focus-visible) {
	@apply ring-3 ring-ring/50;
}

.case-link {
	@apply absolute inset-0 z-1 rounded-xl outline-none;
}

.case-live {
	@apply relative z-2 -m-1 mt-7 p-1;
}

.case-live :deep(.arrow-link) {
	@apply w-fit max-w-full;
}

.case-media {
	@apply relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted;
	clip-path: inset(0 round var(--radius-xl));
}

.case-layer,
.case-image-layer {
	@apply pointer-events-none absolute -inset-px;
	border-radius: inherit;
}

.case-layer {
	transform: scale(0);
}

.case-image-zoom {
	@apply absolute inset-0 block;
}

@media (hover: hover) {
	.case-image-zoom {
		scale: 1.06;
		transition: scale 0.8s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.case:hover .case-image-zoom,
	.case:has(.case-link:focus-visible) .case-image-zoom {
		scale: 1;
	}
}

@media (prefers-reduced-motion: reduce) {
	.case-image-zoom {
		transition: none;
	}
}

.case-image {
	@apply absolute inset-0 block size-full;
}

.case-image-media {
	@apply absolute inset-0 size-full select-none object-cover;
}

.case-body {
	@apply flex min-w-0 flex-col md:self-stretch;
}

.case-line {
	@apply overflow-hidden;
}

.case-title {
	@apply m-0 pb-[0.12em] text-4xl leading-[0.95] font-semibold tracking-[-0.045em] text-balance md:text-5xl xl:text-6xl;
}

.case-description {
	@apply m-0 max-w-[36ch] text-xl leading-tight font-medium tracking-[-0.03em] text-brand-subtle md:text-2xl;
}

.case-services {
	@apply mt-7;
}

.case-service-list {
	@apply m-0 flex list-none flex-wrap gap-2.5 p-0 md:gap-3;
}

.case-service {
	@apply rounded-full bg-foreground/8 px-6 py-3.5 text-xl leading-none font-semibold tracking-[-0.03em] md:text-2xl;
}

.case-results {
	@apply mt-10 flex flex-wrap gap-x-10 gap-y-8 md:mt-auto md:pt-14 xl:gap-x-8 2xl:gap-x-10;
}

.case-result {
	@apply min-w-0;
}

.case-result-value {
	@apply m-0 inline-block rounded-lg px-3 py-1.5 text-5xl leading-none font-extrabold tracking-[-0.05em] md:text-6xl xl:text-5xl 2xl:text-6xl;
}

.case-result-label {
	@apply m-0 max-w-[18ch] pb-[0.1em] text-lg leading-[1.05] font-semibold tracking-[-0.02em] md:text-xl xl:text-lg 2xl:text-xl;
}
</style>
