<script setup lang="ts">
import { useId } from "vue";
import { ribbonPaintOrder, ribbonSegments } from "@/lib/ribbon-path";
import type { RibbonSegment } from "@/lib/ribbon-path";

const shadeIdPrefix = useId();
const shadedSegments = ribbonSegments.filter(
   ({ layer }) => layer === "under",
);

function shadeId(segmentId: string) {
   return `${shadeIdPrefix}-${segmentId}`;
}

function segmentStroke(segment: RibbonSegment) {
   if (segment.layer !== "under") return undefined;

   return { stroke: `url(#${shadeId(segment.id)})` };
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
         :style="segmentStroke(segment)"
      />
   </svg>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.studio-ribbon {
   --studio-ribbon-lift: 15vw;

   @apply pointer-events-none absolute inset-x-0 -z-10 size-full overflow-visible select-none;
   top: calc(var(--studio-ribbon-lift) * -1);
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

@media (max-width: 63.999rem) {
   .studio-ribbon {
      display: none;
   }
}
</style>
