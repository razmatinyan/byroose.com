<script setup lang="ts">
import { defineAsyncComponent, shallowRef, useTemplateRef } from "vue";
import ArrowLink from "@/components/shared/ArrowLink.vue";
import SplitText from "@/components/shared/SplitText.vue";
import { appIcons } from "@/lib/icons";
import type { ServicesAnchor } from "@/lib/services-anchors";
import type { SplitTextResult } from "@/lib/split-text";

const {
	anchor,
	description,
	linkLabel,
	linkTo,
	surface = "light",
	title,
} = defineProps<{
	anchor: ServicesAnchor;
	description: string;
	linkLabel: string;
	linkTo: string;
	surface?: "dark" | "light";
	title: string;
}>();

const TrailingTooltip = defineAsyncComponent(
	() => import("@/components/shared/TrailingTooltip.vue"),
);

const offerRoot = useTemplateRef<HTMLElement>("offerRoot");
const textSplits = shallowRef<(SplitTextResult | undefined)[]>([
	undefined,
	undefined,
]);

const {
	active: tooltipActive,
	hide: hideTooltip,
	label: tooltipLabel,
	shouldLoad: shouldLoadTooltip,
	show: showTooltip,
	size: tooltipSize,
} = useTrailingTooltip();

useServicesRevealMotion(offerRoot, textSplits);

function showServiceTooltip() {
	showTooltip("", `More about ${title}`, "compact");
}

function setTextSplit(index: number, parts: SplitTextResult) {
	textSplits.value = textSplits.value.with(index, parts);
}
</script>

<template>
	<section
		:id="anchor"
		ref="offerRoot"
		class="services-offer"
		:data-surface="surface"
	>
		<div
			v-if="surface === 'dark'"
			class="services-offer-backdrop"
			data-services-reveal-backdrop
			data-header-surface="dark"
			aria-hidden="true"
		/>
		<div class="services-offer-intro section-gutter">
			<SplitText
				class="services-offer-title"
				data-services-reveal-text
				as="h2"
				mask="lines"
				:text="title"
				type="lines"
				@split="setTextSplit(0, $event)"
			/>
			<NuxtLink
				class="services-offer-inset inset-arrow-link"
				data-services-reveal-inset
				:to="linkTo"
				:aria-label="linkLabel"
				@click="hideTooltip"
				@pointerenter="showServiceTooltip"
				@pointerleave="hideTooltip"
			>
				<span class="services-offer-inset-surface inset-arrow-surface">
					<span
						class="services-offer-inset-content"
						data-services-reveal-inset-content
					>
						<Icon
							class="inset-arrow-icon"
							:name="appIcons.arrowUpRight"
							aria-hidden="true"
						/>
					</span>
				</span>
			</NuxtLink>
			<SplitText
				class="services-offer-description"
				data-services-reveal-text
				as="p"
				mask="lines"
				:text="description"
				type="lines"
				@split="setTextSplit(1, $event)"
			/>
			<div class="services-offer-link-mask">
				<div class="services-offer-link" data-services-reveal-rise>
					<ArrowLink :to="linkTo" :label="linkLabel" />
				</div>
			</div>
		</div>

		<TrailingTooltip
			v-if="shouldLoadTooltip"
			:active="tooltipActive"
			:icon="appIcons.arrowUpRight"
			:label="tooltipLabel"
			:size="tooltipSize"
		/>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.services-offer {
	@apply pb-section text-foreground;
}

.services-offer[data-surface="light"] {
	padding-bottom: calc(var(--spacing-section) * 2);
}

.services-offer[data-surface="dark"] {
	@apply relative text-background;
}

.services-offer-backdrop {
	@apply absolute inset-x-0 -bottom-px -z-10 bg-foreground;
	top: calc(var(--services-reveal-backdrop-lead, 0) * -100svh);
}

.services-offer-intro {
	@apply grid grid-cols-1 justify-items-start pt-section md:grid-cols-3;
}

.services-offer[data-surface="light"] .services-offer-intro {
	@apply relative z-10 bg-background;
}

.services-offer-title {
	@apply m-0 text-service font-bold tracking-[-0.045em] text-balance md:col-span-3;
}

.services-offer-inset {
	@apply relative hidden shrink-0 rounded-[7.5%] md:col-start-1 md:mt-8 md:ml-[0.5em] md:block md:aspect-square md:self-stretch md:text-4xl xl:mt-12 xl:text-5xl 2xl:text-6xl;
	--services-offer-inset-open: 0;
}

.services-offer-inset:focus-visible {
	--services-offer-inset-open: 1;
}

.services-offer-inset-surface {
	@apply absolute inset-0 overflow-hidden rounded-[inherit];
	clip-path: inset(
		0 calc((1 - var(--services-offer-inset-open)) * 100%) 0 0 round 7.5%
	);
}

.services-offer-inset-content {
	@apply grid size-full place-items-center p-[17.5%];
}

.services-offer-description {
	@apply m-0 mt-4 w-full text-2xl leading-[0.9] font-semibold tracking-[-0.04em] text-pretty md:col-span-2 md:col-start-2 md:mt-8 md:text-4xl xl:mt-12 xl:text-5xl 2xl:text-6xl;
}

.services-offer[data-surface="dark"] .services-offer-title,
.services-offer[data-surface="dark"] .services-offer-description {
	@apply mix-blend-difference;
}

.services-offer-link-mask {
	@apply mt-10 overflow-hidden p-1 md:col-span-2 md:col-start-2 md:mt-14;
}

.services-offer-link {
	visibility: hidden;
}

.services-offer-link :deep(.arrow-link) {
	@apply w-fit max-w-full;
}

.services-offer :deep(.split-text-line),
.services-offer :deep(.split-text-line-mask) {
	display: block;
}

.services-offer :deep(.split-text-line-mask) {
	margin-block: -0.12em -0.18em;
	padding-block: 0.12em 0.18em;
}

.services-offer :deep(.split-text-line) {
	visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
	.services-offer-inset {
		--services-offer-inset-open: 1;
	}
}
</style>
