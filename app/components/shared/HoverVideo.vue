<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { shallowRef, useTemplateRef, watch } from "vue";

const { src, active = false } = defineProps<{
   src: string;
   active?: boolean;
}>();

const video = useTemplateRef<HTMLVideoElement>("video");
const playing = shallowRef(false);
const hoverPointer = useMediaQuery("(hover: hover)");
const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

function play() {
   const element = video.value;
   if (!element || !hoverPointer.value || prefersReducedMotion.value) return;

   if (element.getAttribute("src") !== src) element.src = src;
   element.play().catch(stop);
}

function stop() {
   const element = video.value;
   playing.value = false;
   if (!element) return;

   element.pause();
   if (element.readyState > 0) element.currentTime = 0;
}

function markPlaying() {
   if (active) playing.value = true;
}

watch(
   () => active,
   (isActive) => {
      if (isActive) play();
      else stop();
   },
);
</script>

<template>
   <video
      ref="video"
      class="hover-video"
      :data-playing="playing || undefined"
      aria-hidden="true"
      preload="none"
      muted
      loop
      playsinline
      disablepictureinpicture
      @playing="markPlaying"
   />
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.hover-video {
   @apply pointer-events-none opacity-0;
}

.hover-video[data-playing] {
   @apply opacity-100;
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
   .hover-video {
      transition: opacity 0.4s ease-out;
   }
}
</style>
