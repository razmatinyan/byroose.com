<script setup lang="ts">
import { defineAsyncComponent, shallowRef, useTemplateRef } from "vue";
import CaseStudyCard from "@/components/cards/CaseStudyCard.vue";
import MoreWorksPanel from "./MoreWorksPanel.vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";
import type { SurfaceTone } from "@/lib/surfaces";

const TrailingTooltip = defineAsyncComponent(
	() => import("@/components/shared/TrailingTooltip.vue"),
);

interface CaseStudy {
	client: string;
	description: string;
	image: string;
	imageAlt: string;
	results: readonly { label: string; value: string }[];
	revealTones: readonly SurfaceTone[];
}

const workTitle = "What we've done";

const caseStudies: CaseStudy[] = [
	{
		client: "Nova Dairy",
		description:
			"A launch film and sixty cutdowns produced in one sprint, cut for every placement the brand actually buys.",
		image: "/images/hero/1.png",
		imageAlt: "Nova Dairy project visual",
		results: [
			{ label: "Views earned across the launch", value: "11M" },
			{ label: "Cutdowns delivered in one sprint", value: "60" },
		],
		revealTones: ["blue", "green", "yellow", "primary"],
	},
	{
		client: "Kessler Tools",
		description:
			"A product site rebuilt around how buyers actually search, from the category pages down to the specs they compare.",
		image: "/images/hero/2.png",
		imageAlt: "Kessler Tools project visual",
		results: [
			{ label: "More qualified enquiries", value: "41%" },
			{ label: "Organic traffic to category pages", value: "3.2x" },
		],
		revealTones: ["pink", "primary", "blue", "yellow"],
	},
	{
		client: "Halden Clinics",
		description:
			"A booking flow rebuilt in five weeks, with the questions patients could not answer taken out of the way.",
		image: "/images/hero/3.png",
		imageAlt: "Halden Clinics project visual",
		results: [
			{ label: "Increase in completed bookings", value: "+38%" },
			{ label: "From brief to a live booking flow", value: "5 wks" },
		],
		revealTones: ["green", "yellow", "primary", "pink"],
	},
	{
		client: "Marrow & Co",
		description:
			"One landing page rebuilt around a single offer, with the proof moved above the decision.",
		image: "/images/hero/4.png",
		imageAlt: "Marrow and Co project visual",
		results: [
			{ label: "Conversion rate, up from 3.1%", value: "4.7%" },
			{ label: "Lower bounce rate on the offer page", value: "-24%" },
		],
		revealTones: ["yellow", "blue", "pink", "green"],
	},
];

const workRoot = useTemplateRef<HTMLElement>("workRoot");
const titleSplit = shallowRef<SplitTextResult>();
const {
	active: tooltipActive,
	hide: deactivateTooltip,
	image: tooltipImage,
	label: tooltipLabel,
	shouldLoad: shouldLoadTooltip,
	show: showTooltip,
	size: tooltipSize,
} = useTrailingTooltip();

useWorkMotion(workRoot, { titleSplit });

function setTitleSplit(parts: SplitTextResult) {
	titleSplit.value = parts;
}

function activateTooltip(item: CaseStudy) {
	showTooltip(item.image);
}

function activatePanelTooltip(image: string, label: string) {
	showTooltip(image, label, "compact");
}
</script>

<template>
	<section id="work" ref="workRoot" class="work">
		<div class="work-content section-gutter">
			<SplitText
				class="section-title split-title work-title"
				as="h2"
				mask="chars"
				:text="workTitle"
				type="words,chars"
				@split="setTitleSplit"
			/>

			<div class="case-list" data-work-case-list>
				<CaseStudyCard
					v-for="item in caseStudies"
					:key="item.client"
					v-bind="item"
					@activate="activateTooltip(item)"
					@deactivate="deactivateTooltip"
				/>
			</div>
		</div>

		<MoreWorksPanel
			@activate="activatePanelTooltip"
			@deactivate="deactivateTooltip"
		/>

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

.work {
	@apply w-full pb-section;
}

.work-content {
	@apply pb-section;
}

.work-title {
	@apply text-center whitespace-nowrap;
	font-size: clamp(2rem, 11.6vw, 13rem);
	word-spacing: 0.15em;
}

.case-list {
	@apply mt-16 flex flex-col gap-20 md:mt-20 md:gap-28 xl:mt-24 xl:gap-32;
}
</style>
