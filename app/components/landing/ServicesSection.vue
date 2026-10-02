<script setup lang="ts">
import { defineAsyncComponent, shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";

const TrailingTooltip = defineAsyncComponent(
	() => import("@/components/shared/TrailingTooltip.vue"),
);

interface Service {
	description: string;
	image: string;
	title: string;
}

const introLines = ["What can we do", "for You?"];
const introTitle = introLines.join(" ");
const servicesRoute = "/services";
const tooltipText = "More Details";

const servicesData: Service[] = [
	{
		description:
			"Visuals, video, reels and site imagery produced through an AI pipeline with a human editor on every asset. Planned as a quarterly slate instead of one-off requests.",
		image: "/images/hero/5.png",
		title: "AI Content Creation",
	},
	{
		description:
			"Design and build in the same sprint. Headless CMS, clean analytics, accessibility that passes audit, a handover your team can maintain.",
		image: "/images/hero/6.png",
		title: "Website Development",
	},
];

const servicesRoot = useTemplateRef<HTMLElement>("servicesRoot");
const introSplits = shallowRef<(SplitTextResult | undefined)[]>(
	introLines.map(() => undefined),
);
const titleSplits = shallowRef<(SplitTextResult | undefined)[]>(
	servicesData.map(() => undefined),
);
const descriptionSplits = shallowRef<(SplitTextResult | undefined)[]>(
	servicesData.map(() => undefined),
);
const {
	active: tooltipActive,
	hide: hideTooltip,
	image: tooltipImage,
	label: tooltipLabel,
	shouldLoad: shouldLoadTooltip,
	show: showTooltip,
	size: tooltipSize,
} = useTrailingTooltip();

useServicesMotion(servicesRoot, {
	descriptionSplits,
	introSplits,
	titleSplits,
});

function withSplit(
	splits: (SplitTextResult | undefined)[],
	index: number,
	parts: SplitTextResult,
) {
	return splits.map((entry, entryIndex) =>
		entryIndex === index ? parts : entry,
	);
}

function setIntroSplit(index: number, parts: SplitTextResult) {
	introSplits.value = withSplit(introSplits.value, index, parts);
}

function setTitleSplit(index: number, parts: SplitTextResult) {
	titleSplits.value = withSplit(titleSplits.value, index, parts);
}

function setDescriptionSplit(index: number, parts: SplitTextResult) {
	descriptionSplits.value = withSplit(descriptionSplits.value, index, parts);
}
</script>

<template>
	<section id="services" ref="servicesRoot" class="services">
		<div class="services-intro section-gutter" data-services-intro>
			<h2 class="section-title services-intro-title">
				<span class="sr-only">{{ introTitle }}</span>
				<span aria-hidden="true">
					<SplitText
						v-for="(line, index) in introLines"
						:key="line"
						class="services-intro-line"
						aria="none"
						:text="line"
						@split="setIntroSplit(index, $event)"
					/>
				</span>
			</h2>
		</div>

		<article
			v-for="(service, index) in servicesData"
			:key="service.title"
			class="service-panel"
			data-service-panel
		>
			<div class="service-content" data-service-content>
				<SplitText
					class="service-title"
					as="h3"
					data-service-title
					mask="words"
					:text="service.title"
					@split="setTitleSplit(index, $event)"
				/>

				<SplitText
					class="service-description"
					as="p"
					auto-split
					mask="lines"
					:text="service.description"
					type="lines,words"
					@split="setDescriptionSplit(index, $event)"
				/>

				<div class="service-media-frame" data-service-media-frame>
					<div class="service-media-exit" data-service-media-exit>
						<NuxtLink
							class="service-media"
							data-service-media
							:to="servicesRoute"
							:aria-label="`More details about ${service.title}`"
							@pointerenter="showTooltip(service.image, tooltipText, 'compact')"
							@pointerleave="hideTooltip"
						>
							<NuxtImg
								class="service-image"
								data-service-image
								:src="service.image"
								alt=""
								width="1456"
								height="816"
								sizes="sm:1024px md:1280px lg:1536px"
								densities="x1"
								loading="lazy"
								draggable="false"
							/>
						</NuxtLink>
					</div>
				</div>
			</div>
		</article>

		<TrailingTooltip
			v-if="shouldLoadTooltip"
			:active="tooltipActive"
			:image="tooltipImage"
			:label="tooltipLabel"
			:size="tooltipSize"
		/>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.services {
	@apply w-full pb-section;
}

.services-intro {
	@apply flex min-h-svh items-center justify-center;
}

.services-intro-title {
	@apply text-center leading-[0.95] select-none;
	font-size: clamp(3rem, 10vw, 12rem);
}

.services-intro-line {
	@apply block whitespace-nowrap;
}

.services-intro-title :deep(.split-text-word) {
	display: inline-block;
	visibility: hidden;
}

.service-panel {
	@apply relative px-[clamp(1rem,2vw,1.5rem)] pt-section;
	padding-bottom: calc(var(--service-runway, 0) * 100svh);
}

.service-content {
	@apply relative flex flex-col items-center gap-5 text-center md:gap-7;
}

.service-title {
	@apply m-0 w-full text-left text-service font-bold tracking-[-0.045em] text-balance;
}

.service-description {
	@apply m-0 mt-4 w-full text-left md:mt-8 md:w-2/3 md:self-end xl:mt-12 text-2xl leading-[1.05] font-semibold tracking-[-0.04em] text-pretty text-foreground md:text-4xl xl:text-5xl;
}

.service-title :deep(.split-text-word),
.service-title :deep(.split-text-word-mask) {
	display: inline-block;
}

.service-description :deep(.split-text-line),
.service-description :deep(.split-text-line-mask) {
	display: block;
}

.service-description :deep(.split-text-line) {
	white-space: nowrap;
}

.service-description :deep(.split-text-line-mask) {
	margin-block: -0.12em;
	padding-block: 0.12em;
}

.service-description :deep(.split-text-word) {
	display: inline-block;
}

.service-title :deep(.split-text-word),
.service-description :deep(.split-text-line) {
	visibility: hidden;
}

.service-media-frame {
	@apply mt-3 w-full;
}

.service-media-exit {
	@apply origin-top;
}

.service-media {
	@apply block aspect-[1456/816] w-full origin-bottom overflow-hidden rounded-2xl bg-muted;
}

.service-image {
	@apply pointer-events-none size-full object-cover select-none;
}
</style>
