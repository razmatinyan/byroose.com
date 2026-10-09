<script setup lang="ts">
import { defineAsyncComponent, useTemplateRef } from "vue";
import DrawnLine from "@/components/shared/DrawnLine.vue";
import { aboutTeamLine } from "@/lib/about-line-path";
import { appIcons } from "@/lib/icons";
import AboutTeamMember from "./AboutTeamMember.vue";
import type {
	AboutMemberPortrait,
	AboutMemberSocial,
} from "./AboutTeamMember.vue";
import AboutTitle from "./AboutTitle.vue";
import type { AboutTitleLine } from "./AboutTitle.vue";

const TrailingTooltip = defineAsyncComponent(
	() => import("@/components/shared/TrailingTooltip.vue"),
);

const titleLines: readonly AboutTitleLine[] = [
	{ text: "Who stands" },
	{ text: "behind byroose", underlined: "behind" },
];

const tooltipLabel = "More Info";

interface TeamMember {
	bio: readonly string[];
	name: string;
	portrait?: AboutMemberPortrait;
	role: string;
	socials: readonly AboutMemberSocial[];
}

const members: readonly TeamMember[] = [
	{
		bio: [
			"Ruzan started byroose to bring AI content creation and web development into one connected practice, so brands stop juggling separate teams for what they say and where they say it.",
			"Ruzan leads the creative direction on every project, from the first idea to the final cut, and makes sure each piece of content earns its place in front of the audience it was built for.",
		],
		name: "Ruzan Darbinyan",
		portrait: {
			alt: "Ruzan Darbinyan kicking one leg high beside a lamppost on a sunny street corner",
			height: 1536,
			src: "/images/founder.jpg",
			width: 2048,
		},
		role: "Founder & Creative Director",
		socials: [
			{
				href: "https://www.linkedin.com/in/ruzan-darbinian-b38855232/",
				icon: appIcons.linkedin,
				label: "LinkedIn",
			},
			{
				href: "https://www.instagram.com/withroose_/",
				icon: appIcons.instagram,
				label: "Instagram",
			},
		],
	},
	{
		bio: [
			"Razmik co-founded byroose and builds the websites that turn attention into enquiries. Every site starts with a clear structure, loads fast, and stays easy to grow.",
			"Razmik owns the technical side of each project, from the first prototype to launch, so the content and the code ship as one experience instead of two handoffs.",
		],
		name: "Razmik Matinyan",
		role: "Co-Founder & Senior Web Developer",
		socials: [
			{
				href: "https://www.linkedin.com/in/razmatinyan/",
				icon: appIcons.linkedin,
				label: "LinkedIn",
			},
			{
				href: "https://www.instagram.com/razo.codes/",
				icon: appIcons.instagram,
				label: "Instagram",
			},
			{
				href: "https://github.com/razmatinyan",
				icon: appIcons.github,
				label: "GitHub",
			},
		],
	},
];

const teamRoot = useTemplateRef<HTMLElement>("teamRoot");
const { titleRevealed } = useAboutSectionMotion(teamRoot);
const {
	active: tooltipActive,
	hide: hideTooltip,
	shouldLoad: shouldLoadTooltip,
	show: showTooltip,
} = useTrailingTooltip();
useDrawnLineMotion(teamRoot, aboutTeamLine);

function activateTooltip() {
	showTooltip();
}
</script>

<template>
	<section ref="teamRoot" class="about-team section-gutter">
		<DrawnLine class="about-team-line" />

		<AboutTitle :drawn="titleRevealed" :lines="titleLines" />

		<div class="about-team-members">
			<AboutTeamMember
				v-for="member in members"
				:key="member.name"
				class="about-team-member"
				:bio="member.bio"
				:name="member.name"
				:portrait="member.portrait"
				:role="member.role"
				:socials="member.socials"
				@activate="activateTooltip"
				@deactivate="hideTooltip"
			/>
		</div>

		<TrailingTooltip
			v-if="shouldLoadTooltip"
			:active="tooltipActive"
			:icon="appIcons.arrowUpRight"
			:label="tooltipLabel"
		/>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-team {
	@apply relative z-10 rounded-t-[clamp(1.5rem,3vw,3rem)] bg-canvas-shade py-section text-canvas-shade-foreground;
	--about-member-width: clamp(16rem, 34vw, 32rem);
}

.about-team-line {
	@apply inset-0 size-full overflow-hidden text-ribbon;
}

.about-team-members {
	@apply mt-16 flex flex-col gap-16 md:mt-20;
}

.about-team-member {
	@apply max-w-md md:max-w-none md:w-(--about-member-width);
}

.about-team-member:first-child {
	@apply self-end;
}

.about-team-member:last-child {
	@apply self-start;
}

@media (min-width: 48rem) {
	.about-team-member:last-child {
		margin-top: calc(var(--about-member-width) * -0.45);
	}
}
</style>
