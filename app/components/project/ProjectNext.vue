<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from "vue";
import ArrowLink from "@/components/shared/ArrowLink.vue";
import HoverVideo from "@/components/shared/HoverVideo.vue";
import { appIcons } from "@/lib/icons";
import { getProjectCoverImage } from "@/lib/projects";
import type { Project } from "@/lib/projects";

const TrailingTooltip = defineAsyncComponent(
   () => import("@/components/shared/TrailingTooltip.vue"),
);

const { project } = defineProps<{
   project: Project;
}>();

const projectPath = `/work/${project.slug}`;
const coverImage = getProjectCoverImage(project);
const tooltipLabel = "Next Project";
const hovered = shallowRef(false);

const {
   active: tooltipActive,
   hide: hideTooltip,
   shouldLoad: shouldLoadTooltip,
   show: showTooltip,
} = useTrailingTooltip();

function activateTooltip() {
   hovered.value = true;
   showTooltip("", tooltipLabel);
}

function deactivateTooltip() {
   hovered.value = false;
   hideTooltip();
}
</script>

<template>
   <section
      class="project-next"
      :style="{ '--project-next-surface': project.surface.color }"
      :data-ink="project.surface.ink"
      :data-header-surface="project.surface.ink === 'light' ? 'dark' : undefined"
      aria-labelledby="project-next-title"
   >
      <div class="project-next-frame">
         <NuxtLink
            :to="projectPath"
            class="project-next-link"
            data-arrow-link-trigger
            @pointerenter="activateTooltip"
            @pointerleave="deactivateTooltip"
         >
            <h2 id="project-next-title" class="project-next-title">Next Project</h2>
            <span class="project-next-media">
               <NuxtImg
                  :src="coverImage.src"
                  alt=""
                  :width="coverImage.width"
                  :height="coverImage.height"
                  sizes="sm:1024px md:1024px lg:640px xl:768px 2xl:1280px"
                  densities="x1"
                  loading="lazy"
                  class="project-next-image"
               />
               <HoverVideo
                  v-if="project.cover.kind === 'video'"
                  :src="project.cover.src"
                  :active="hovered"
                  class="project-next-video"
               />
            </span>
            <ArrowLink :label="project.name" size="lg" class="project-next-name" />
         </NuxtLink>

         <span class="project-next-all">
            <ArrowLink to="/work" label="All Works" size="sm" />
         </span>
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
@reference "../../assets/css/tailwind.css";

.project-next {
   @apply mt-50 px-page py-section;
   background-color: var(--project-next-surface);
}

.project-next[data-ink="dark"] {
   @apply text-foreground;
}

.project-next[data-ink="light"] {
   @apply text-background;
}

.project-next-frame {
   @apply relative;
}

.project-next-link {
   @apply grid cursor-pointer gap-8 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:grid-cols-[9fr_11fr] md:grid-rows-[auto_1fr] md:gap-x-10 md:gap-y-12;
}

.project-next-title {
   @apply pe-40 text-3xl leading-tight font-semibold tracking-[-0.04em] md:col-start-2 md:row-start-1 md:text-4xl xl:text-5xl;
}

.project-next-media {
   @apply relative block md:col-start-1 md:row-span-2 md:row-start-1;
}

.project-next-image {
   @apply block aspect-4/3 w-full rounded-lg object-cover;
}

.project-next-video {
   @apply absolute inset-0 size-full rounded-lg object-cover;
}

.project-next-name {
   @apply md:col-start-2 md:row-start-2 md:self-end;
}

.project-next-all {
   @apply absolute top-0 right-0 z-1 flex h-[1.25em] items-center text-3xl md:text-4xl xl:text-5xl;
}
</style>
