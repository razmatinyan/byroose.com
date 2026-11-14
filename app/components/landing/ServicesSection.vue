<script setup lang="ts">
import { defineAsyncComponent, shallowRef, useTemplateRef } from "vue";
import ArrowLink from "@/components/shared/ArrowLink.vue";
import ImageCycle from "@/components/shared/ImageCycle.vue";
import SplitText from "@/components/shared/SplitText.vue";
import BrandLogomark from "@/components/shared/BrandLogomark.vue";
import { servicePagePaths } from "@/lib/services-anchors";
import type { ServicePagePath } from "@/lib/services-anchors";
import { servicesHeroImages } from "@/lib/services-hero";
import type { ServicesImage } from "@/lib/services-hero";
import type { SplitTextResult } from "@/lib/split-text";

const TrailingTooltip = defineAsyncComponent(
	() => import("@/components/shared/TrailingTooltip.vue"),
);

interface Service {
	path: ServicePagePath;
	description: string;
	linkLabel: string;
	surface: "canvas" | "dark";
	titleImages: readonly ServicesImage[];
	titleLead: string;
	titleTrail: string;
}

const introLines = ["AI Content and", "Website Services"];
const introTitle = introLines.join(" ");

const servicesData: Service[] = [
	{
		path: servicePagePaths.aiContent,
		description:
			"Content people stop for. AI videos, reels, UGC ads, and AI product photography, directed and edited by humans.",
		linkLabel: "See AI content creation services",
		surface: "canvas",
		titleImages: servicesHeroImages,
		titleLead: "AI Content ",
		titleTrail: "Creation",
	},
	{
		path: servicePagePaths.web,
		description:
			"A website that feels like the post they just tapped. From conversion-focused landing pages to full websites and custom web platforms, designed around your content.",
		linkLabel: "See web development services",
		surface: "dark",
		titleImages: [
			{ height: 1620, src: "/images/work/3.png", width: 1080 },
			{ height: 1919, src: "/images/work/6.png", width: 1080 },
			{ height: 1919, src: "/images/work/7.png", width: 1080 },
		],
		titleLead: "Website ",
		titleTrail: "Development",
	},
];

const titleInsetSizes = "sm:448px";

function serviceTitle({ titleLead, titleTrail }: Service) {
	return `${titleLead}${titleTrail}`;
}

function showServiceTooltip(service: Service) {
	showTooltip("", `More about ${serviceTitle(service)}`, "compact");
}

const servicesRoot = useTemplateRef<HTMLElement>("servicesRoot");
const introSplits = shallowRef<(SplitTextResult | undefined)[]>(
	introLines.map(() => undefined),
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
					<span
						v-for="(line, index) in introLines"
						:key="line"
						class="services-intro-line"
					>
						<SplitText
							aria="none"
							:text="line"
							@split="setIntroSplit(index, $event)"
						/>
					</span>
				</span>
			</h2>
		</div>

		<article
			v-for="(service, index) in servicesData"
			:key="service.path"
			class="service-panel"
			:class="{ 'service-panel-dark': service.surface === 'dark' }"
			data-service-panel
			:data-service-surface="service.surface"
		>
			<div
				class="service-card"
				data-service-card
				:data-header-surface="service.surface === 'dark' ? 'dark' : undefined"
			>
				<div
					v-if="service.surface === 'dark'"
					class="service-curve"
					data-service-curve
					data-header-surface="dark"
					aria-hidden="true"
				/>
				<div class="service-content" data-service-content>
					<h3 class="service-title" data-service-title>
						<span class="service-title-text">{{ service.titleLead }}</span
						><span
							class="service-title-inset"
							data-service-title-inset
							aria-hidden="true"
							><span
								class="service-title-inset-content"
								data-service-title-inset-content
								><ImageCycle
									class="service-title-images"
									:images="service.titleImages"
									:sizes="titleInsetSizes" /></span></span
						><span class="service-title-text">{{ service.titleTrail }}</span>
					</h3>

					<NuxtLink
						class="service-link inset-arrow-link"
						data-service-link
						:to="service.path"
						:aria-label="service.linkLabel"
						@click="hideTooltip"
						@pointerenter="showServiceTooltip(service)"
						@pointerleave="hideTooltip"
					>
						<span class="service-link-surface inset-arrow-surface">
							<span class="service-link-content" data-service-link-content>
								<BrandLogomark class="inset-arrow-icon" />
							</span>
						</span>
					</NuxtLink>

					<SplitText
						class="service-description"
						as="p"
						auto-split
						mask="lines"
						:text="service.description"
						type="lines,words"
						@split="setDescriptionSplit(index, $event)"
					/>

					<div class="service-route-link-mask">
						<div class="service-route-link" data-service-rise>
							<ArrowLink :to="service.path" :label="service.linkLabel" />
						</div>
					</div>
				</div>
			</div>
		</article>

		<TrailingTooltip
			v-if="shouldLoadTooltip"
			:active="tooltipActive"
			mark
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
	font-size: clamp(2.25rem, 10vw, 12rem);
}

.services-intro-line {
	@apply block whitespace-nowrap;
}

.services-intro-title :deep(.split-text-word) {
	display: inline-block;
	visibility: hidden;
}

.service-panel {
	@apply relative;
}

.service-card {
	@apply relative px-[clamp(1rem,2vw,1.5rem)] pt-section;
	padding-bottom: max(
		var(--spacing-section),
		calc(var(--service-runway, 0) * 100svh)
	);
	transform-origin: 50% 0;
}

.service-panel-dark .service-card {
	@apply bg-foreground;
}

.service-panel-dark .service-title,
.service-panel-dark .service-description {
	@apply text-background;
}

.service-panel-dark .service-title-text,
.service-panel-dark .service-description {
	@apply mix-blend-difference;
}

.service-panel-dark {
	@apply z-[1];
}

.service-curve {
	@apply absolute top-full -left-1/4 -mt-px h-[clamp(4rem,10vw,10rem)] w-[150%] origin-top bg-foreground;
	--service-curve-depth: clamp(4rem, 10vw, 10rem);
	border-radius: 0 0 50% 50% / 0 0 var(--service-curve-depth)
		var(--service-curve-depth);
	transform: scaleY(0);
}

.service-content {
	@apply relative flex flex-col items-center gap-5 text-center md:grid md:grid-cols-3 md:items-start md:gap-x-0 md:gap-y-7;
}

.service-title {
	@apply relative m-0 w-full text-left text-service font-semibold tracking-[-0.045em] text-balance md:col-span-3;
	--service-title-inset-height: 0.8em;
	--service-title-inset-width: calc(
		var(--service-title-inset-height) * 16 / 9
	);
}

.service-title-inset {
	@apply relative inline-block overflow-hidden rounded-[0.06em];
	height: var(--service-title-inset-height);
	margin-inline-end: calc(0.12em * var(--service-title-inset-open));
	vertical-align: -0.06em;
	width: calc(
		var(--service-title-inset-width) * var(--service-title-inset-open)
	);
	--service-title-inset-open: 0;
}

.service-title-inset-content {
	@apply absolute top-0 left-1/2 h-full -translate-x-1/2;
	width: var(--service-title-inset-width);
}

.service-title-images {
	@apply size-full;
}

.service-link {
	@apply relative hidden shrink-0 rounded-[7.5%] md:col-start-1 md:mt-8 md:ml-[0.5em] md:block md:aspect-square md:self-stretch md:justify-self-start md:text-4xl xl:mt-12 xl:text-5xl 2xl:text-6xl;
	--service-link-open: 0;
}

.service-link:focus-visible {
	--service-link-open: 1;
}

.service-link-surface {
	@apply absolute inset-0 overflow-hidden rounded-[inherit];
	clip-path: inset(
		0 calc((1 - var(--service-link-open)) * 100%) 0 0 round 7.5%
	);
}

.service-panel-dark .service-link-surface {
	@apply bg-background/10;
}

.service-link-content {
	@apply grid size-full place-items-center p-[17.5%];
}

.service-description {
	@apply m-0 mt-4 w-full text-left md:col-span-2 md:col-start-2 md:mt-8 xl:mt-12 text-2xl leading-[0.9] font-medium tracking-[-0.04em] text-pretty text-foreground md:text-4xl xl:text-5xl 2xl:text-6xl;
}

.service-route-link-mask {
	@apply mt-6 w-full overflow-hidden p-1 md:col-span-2 md:col-start-2 md:mt-4;
}

.service-route-link {
	@apply text-left text-foreground;
	visibility: hidden;
}

.service-panel-dark .service-route-link {
	@apply text-background mix-blend-difference;
}

.service-route-link :deep(.arrow-link) {
	@apply w-fit max-w-full;
}

.service-description :deep(.split-text-line),
.service-description :deep(.split-text-line-mask) {
	display: block;
}

.service-description :deep(.split-text-line) {
	white-space: nowrap;
}

.service-description :deep(.split-text-line-mask) {
	margin-block: -0.12em -0.18em;
	padding-block: 0.12em 0.18em;
}

.service-description :deep(.split-text-word) {
	display: inline-block;
}

.service-description :deep(.split-text-line) {
	visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
	.service-link {
		--service-link-open: 1;
	}

	.service-title-inset {
		--service-title-inset-open: 1;
	}
}
</style>
