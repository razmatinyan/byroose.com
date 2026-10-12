<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, useTemplateRef } from "vue";
import ProjectCard from "@/components/cards/ProjectCard.vue";
import type { ProjectImage } from "@/components/cards/ProjectCard.vue";
import { appIcons } from "@/lib/icons";
import WorkFilters from "./WorkFilters.vue";
import type { WorkFilterOption } from "./WorkFilters.vue";

const TrailingTooltip = defineAsyncComponent(
   () => import("@/components/shared/TrailingTooltip.vue"),
);

type WorkService = "ai-content" | "website-development";
type WorkFilter = "all" | WorkService;
type ProjectCategory =
   | "Development"
   | "E-commerce"
   | "Imagery"
   | "Reels"
   | "Video"
   | "Web Design";

interface Project {
   categories: readonly ProjectCategory[];
   image: ProjectImage;
   imageAlt: string;
   name: string;
}

const categoryServices: Record<ProjectCategory, WorkService> = {
   Development: "website-development",
   "E-commerce": "website-development",
   Imagery: "ai-content",
   Reels: "ai-content",
   Video: "ai-content",
   "Web Design": "website-development",
};

const filters: readonly WorkFilterOption<WorkFilter>[] = [
   { id: "all", label: "All" },
   { id: "ai-content", label: "AI Content" },
   { id: "website-development", label: "Website Development" },
];

const wideImage = { height: 816, width: 1456 } as const;
const tallImage = { height: 1919, width: 1080 } as const;

const projects: readonly Project[] = [
   {
      categories: ["Reels", "Video"],
      image: { ...wideImage, src: "/images/hero/1.png" },
      imageAlt: "Nova Dairy project visual",
      name: "Nova Dairy",
   },
   {
      categories: ["Web Design", "Development"],
      image: { ...wideImage, src: "/images/hero/2.png" },
      imageAlt: "Kessler Tools project visual",
      name: "Kessler Tools",
   },
   {
      categories: ["Imagery", "Reels"],
      image: { ...tallImage, src: "/images/work/1.png" },
      imageAlt: "Lumen Skincare project visual",
      name: "Lumen Skincare",
   },
   {
      categories: ["Web Design", "Development"],
      image: { ...wideImage, src: "/images/hero/3.png" },
      imageAlt: "Halden Clinics project visual",
      name: "Halden Clinics",
   },
   {
      categories: ["Web Design", "E-commerce", "Imagery"],
      image: { ...wideImage, src: "/images/hero/4.png" },
      imageAlt: "Marrow and Co project visual",
      name: "Marrow & Co",
   },
   {
      categories: ["Video", "Imagery"],
      image: { ...wideImage, src: "/images/hero/6.png" },
      imageAlt: "Atlas Running project visual",
      name: "Atlas Running",
   },
   {
      categories: ["E-commerce", "Development"],
      image: { ...wideImage, src: "/images/hero/5.png" },
      imageAlt: "Fieldnote Coffee project visual",
      name: "Fieldnote Coffee",
   },
   {
      categories: ["Reels"],
      image: { ...tallImage, src: "/images/work/5.png" },
      imageAlt: "Orbit Studio project visual",
      name: "Orbit Studio",
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
} = useTrailingTooltip();

const shownCount = computed(
   () => projects.filter((project) => isShown(project)).length,
);
const shownSummary = computed(() =>
   shownCount.value === 1 ? "1 project" : `${shownCount.value} projects`,
);
const shownStatus = computed(() =>
   shownCount.value === 1 ? "Showing 1 project" : `Showing ${shownCount.value} projects`,
);

function isShown({ categories }: Project) {
   if (shownFilter.value === "all") return true;

   return categories.some(
      (category) => categoryServices[category] === shownFilter.value,
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
   showTooltip("", tooltipLabel);
}
</script>

<template>
   <section ref="sectionRoot" class="work-projects section-gutter">
      <h2 class="sr-only">Projects</h2>
      <WorkFilters
         :options="filters"
         :selected="selectedFilter"
         :summary="shownSummary"
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
