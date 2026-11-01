<script setup lang="ts">
import {
	computed,
	defineAsyncComponent,
	shallowRef,
	useTemplateRef,
} from "vue";
import ProjectCard from "@/components/cards/ProjectCard.vue";
import type { ProjectImage } from "@/components/cards/ProjectCard.vue";
import { appIcons } from "@/lib/icons";
import { projectCategoryServices } from "@/lib/projects";
import type { ProjectCategory, ProjectService } from "@/lib/projects";
import WorkFilters from "./WorkFilters.vue";
import type { WorkFilterOption } from "./WorkFilters.vue";

const TrailingTooltip = defineAsyncComponent(
	() => import("@/components/shared/TrailingTooltip.vue"),
);

type WorkFilter = "all" | ProjectService;

interface Project {
	categories: readonly ProjectCategory[];
	href?: string;
	image: ProjectImage;
	imageAlt: string;
	name: string;
	video?: string;
}

const filters: readonly WorkFilterOption<WorkFilter>[] = [
	{ id: "all", label: "All" },
	{ id: "ai-content", label: "AI Content" },
	{ id: "website-development", label: "Website Development" },
];

const projects: readonly Project[] = [
	{
		categories: ["Reel", "Video", "Image"],
		href: "/work/ugc-creator",
		image: {
			height: 1440,
			src: "/images/work/ugc-creator/cover.jpg",
			width: 2560,
		},
		imageAlt:
			"The AI UGC creator getting ready in a yellow sweatshirt, wide-leg jeans, and a brown suede bag",
		name: "UGC Creator",
		video: "/images/work/ugc-creator/cover.mp4",
	},
	{
		categories: ["Web Development", "UI/UX Design"],
		href: "/work/sygen",
		image: { height: 1440, src: "/images/work/sygen/cover.jpg", width: 2560 },
		imageAlt:
			"Sygen home page on a desktop monitor, turning the brand color #2F5BEA into brand, neutral, and status scales",
		name: "Sygen",
	},
	{
		categories: ["Reel", "Video", "Image"],
		href: "/work/cartoon",
		image: {
			height: 1440,
			src: "/images/work/cartoon/cover.jpg",
			width: 2560,
		},
		imageAlt:
			"The cartoon character in a grey knit sweater, leopard print cargo pants, yellow sneakers, and a black crossbody bag",
		name: "Cartoon",
		video: "/images/work/cartoon/cover.mp4",
	},
];

const tooltipLabel = "View Project";

const sectionRoot = useTemplateRef<HTMLElement>("sectionRoot");
const selectedFilter = shallowRef<WorkFilter>("all");
const shownFilter = shallowRef<WorkFilter>("all");
const { swapProjects } = useWorkProjectsMotion(sectionRoot);
const {
	active: tooltipActive,
	hide: hideTooltip,
	shouldLoad: shouldLoadTooltip,
	show: showTooltip,
	size: tooltipSize,
} = useTrailingTooltip();

const shownCount = computed(
	() => projects.filter((project) => isShown(project)).length,
);
const shownStatus = computed(() =>
	shownCount.value === 1
		? "Showing 1 project"
		: `Showing ${shownCount.value} projects`,
);

function isShown({ categories }: Project) {
	if (shownFilter.value === "all") return true;

	return categories.some(
		(category) => projectCategoryServices[category] === shownFilter.value,
	);
}

async function selectFilter(filter: WorkFilter) {
	if (filter === selectedFilter.value) return;

	selectedFilter.value = filter;
	await swapProjects(() => {
		shownFilter.value = filter;
	});
}

function activateTooltip() {
	showTooltip("", tooltipLabel, "compact");
}
</script>

<template>
	<section ref="sectionRoot" class="work-projects section-gutter">
		<h2 class="sr-only">Projects</h2>
		<WorkFilters
			:options="filters"
			:selected="selectedFilter"
			:count="shownCount"
			@select="selectFilter"
		/>
		<p class="sr-only" aria-live="polite">{{ shownStatus }}</p>
		<ul class="work-projects-grid">
			<li
				v-for="project in projects"
				v-show="isShown(project)"
				:key="project.name"
				data-work-project-item
			>
				<ProjectCard
					v-bind="project"
					@activate="activateTooltip"
					@deactivate="hideTooltip"
				/>
			</li>
		</ul>

		<TrailingTooltip
			v-if="shouldLoadTooltip"
			:active="tooltipActive"
			:icon="appIcons.arrowUpRight"
			:size="tooltipSize"
			:label="tooltipLabel"
		/>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.work-projects {
	@apply relative z-10 rounded-t-[clamp(1.5rem,3vw,3rem)] bg-canvas-shade py-section text-canvas-shade-foreground;
}

.work-projects-grid {
	@apply m-0 mt-12 grid list-none gap-x-4 gap-y-12 p-0 md:mt-16 md:grid-cols-2 md:gap-x-5 md:gap-y-16 xl:mt-20 xl:gap-y-20;
}
</style>
