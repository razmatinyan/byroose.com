<script setup lang="ts">
import { useTemplateRef } from "vue";

const {
   animated = true,
   color = "currentColor",
   delay = 0,
   drawn = true,
   duration = 1.2,
   strokeWidth = 24,
} = defineProps<{
   animated?: boolean;
   color?: string;
   delay?: number;
   drawn?: boolean;
   duration?: number;
   strokeWidth?: number;
}>();

const path = useTemplateRef<SVGPathElement>("path");

useWaveUnderlineMotion(path, {
   animated: () => animated,
   delay: () => delay,
   drawn: () => drawn,
   duration: () => duration,
});
</script>

<template>
   <svg
      class="wave-underline"
      viewBox="0 0 700 65"
      aria-hidden="true"
      focusable="false"
   >
      <path
         ref="path"
         class="wave-underline-path"
         :class="{
            'wave-underline-path-static': !animated,
            'wave-underline-path-undrawn': !drawn,
         }"
         d="M 0 29 C 26 43 44 43 70 29 S 114 15 140 29 S 184 43 210 29 S 254 15 280 29 S 324 43 350 29 S 394 15 420 29 S 464 43 490 29 S 534 15 560 29 S 604 43 630 29 S 674 15 700 29"
         :stroke="color"
         :stroke-width="strokeWidth"
      />
   </svg>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.wave-underline {
   @apply block h-auto w-full overflow-visible;
}

.wave-underline-path {
   fill: none;
   stroke-linecap: butt;
   stroke-linejoin: round;
   visibility: hidden;
}

.wave-underline-path-static:not(.wave-underline-path-undrawn) {
   visibility: visible;
}

@media (prefers-reduced-motion: reduce) {
   .wave-underline-path:not(.wave-underline-path-undrawn) {
      visibility: visible;
   }
}
</style>
