<script setup lang="ts">
import { useElementVisibility, useMediaQuery } from "@vueuse/core";
import { computed, shallowRef, useTemplateRef, watch } from "vue";
import { NuxtLink } from "#components";
import { getProjectCoverImage } from "@/lib/projects";
import type { Project } from "@/lib/projects";

const { project, duplicate = false } = defineProps<{
   project: Project;
   duplicate?: boolean;
}>();

const card = useTemplateRef<InstanceType<typeof NuxtLink>>("card");
const video = useTemplateRef<HTMLVideoElement>("video");
const visible = useElementVisibility(() => card.value?.$el, {
   rootMargin: "50% 50%",
});
const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
const playing = shallowRef(false);

const image = computed(() => getProjectCoverImage(project));
const videoSource = computed(() =>
   project.cover.kind === "video" ? project.cover.src : null,
);
const label = computed(() => `View the ${project.name} project`);

function play(element: HTMLVideoElement, src: string) {
   if (element.getAttribute("src") !== src) element.src = src;
   element.play().catch(() => {
      playing.value = false;
   });
}

watch(
   [visible, prefersReducedMotion, video],
   ([isVisible, reduceMotion, element]) => {
      const src = videoSource.value;
      if (!element || !src) return;

      if (isVisible && !reduceMotion) play(element, src);
      else element.pause();
   },
);
</script>

<template>
   <NuxtLink
      ref="card"
      class="project-marquee-card"
      :to="`/work/${project.slug}`"
      :aria-label="label"
      :aria-hidden="duplicate || undefined"
      :tabindex="duplicate ? -1 : undefined"
   >
      <NuxtImg
         :src="image.src"
         alt=""
         :width="image.width"
         :height="image.height"
         sizes="sm:768px md:768px lg:1024px xl:1024px 2xl:1536px"
         densities="x1"
         loading="lazy"
         class="project-marquee-media"
      />
      <video
         v-if="videoSource"
         ref="video"
         class="project-marquee-media project-marquee-video"
         :data-playing="playing || undefined"
         aria-hidden="true"
         preload="none"
         muted
         loop
         playsinline
         disablepictureinpicture
         @playing="playing = true"
         @pause="playing = false"
      />
   </NuxtLink>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.project-marquee-card {
   @apply relative block aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50;
}

.project-marquee-media {
   @apply absolute inset-0 size-full object-cover;
}

.project-marquee-video {
   @apply opacity-0;
   transition: opacity 0.4s ease-out;
}

.project-marquee-video[data-playing] {
   @apply opacity-100;
}
</style>
