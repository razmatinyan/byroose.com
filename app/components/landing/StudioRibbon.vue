<script setup lang="ts">
import { useId } from "vue";
import { ribbonPaintOrder, ribbonSegments } from "@/lib/ribbon-path";

const shadeIdPrefix = useId();
const shadedSegments = ribbonSegments.filter(
   ({ crossing }) => crossing !== undefined,
);

function shadeId(segmentId: string) {
   return `${shadeIdPrefix}-${segmentId}`;
}

function segmentStroke(segmentId: string, crossing?: number) {
   if (crossing === undefined) return undefined;

   return { stroke: `url(#${shadeId(segmentId)})` };
}
</script>

<template>
   <svg
      class="studio-ribbon"
      data-studio-ribbon
      aria-hidden="true"
      focusable="false"
   >
      <defs>
         <linearGradient
            v-for="segment in shadedSegments"
            :id="shadeId(segment.id)"
            :key="segment.id"
            :data-studio-ribbon-shade="segment.id"
            gradientUnits="userSpaceOnUse"
         >
            <stop class="studio-ribbon-stop" offset="0" />
            <stop class="studio-ribbon-stop-shade" offset="0.35" />
            <stop class="studio-ribbon-stop-shade" offset="0.65" />
            <stop class="studio-ribbon-stop" offset="1" />
         </linearGradient>
      </defs>

      <path
         v-for="segment in ribbonPaintOrder"
         :key="segment.id"
         class="studio-ribbon-segment"
         :data-studio-ribbon-segment="segment.id"
         :style="segmentStroke(segment.id, segment.crossing)"
      />
   </svg>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.studio-ribbon {
   @apply pointer-events-none absolute inset-0 -z-10 size-full overflow-visible select-none;
}

.studio-ribbon-segment {
   fill: none;
   stroke: var(--color-ribbon);
   stroke-linecap: round;
   stroke-linejoin: round;
   stroke-width: clamp(4.5rem, 13vw, 15rem);
   visibility: hidden;
}

.studio-ribbon-stop {
   stop-color: var(--color-ribbon);
}

.studio-ribbon-stop-shade {
   stop-color: var(--color-ribbon-shade);
}

@media (prefers-reduced-motion: reduce) {
   .studio-ribbon-segment {
      visibility: visible;
   }
}
</style>
