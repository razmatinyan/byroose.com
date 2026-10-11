<script setup lang="ts">
import { computed } from "vue";
import ImageCycle from "@/components/shared/ImageCycle.vue";
import WaveUnderline from "@/components/shared/WaveUnderline.vue";

export interface AboutTitleImage {
   height: number;
   src: string;
   width: number;
}

export interface AboutTitleLine {
   images?: readonly AboutTitleImage[];
   text: string;
   underlined?: string;
}

const {
   as = "h2",
   drawn = false,
   lines,
   size = "section",
   underlineColor = "var(--color-primary)",
} = defineProps<{
   as?: "h1" | "h2";
   drawn?: boolean;
   lines: readonly AboutTitleLine[];
   size?: "display" | "section";
   underlineColor?: string;
}>();

const label = computed(() => lines.map((line) => line.text).join(" "));
const segmentedLines = computed(() =>
   lines.map(({ images, text, underlined = "" }) => {
      const start = underlined ? text.indexOf(underlined) : -1;
      if (start < 0)
         return { images, segments: [{ text, underlined: false }], text };

      const segments = [
         { text: text.slice(0, start), underlined: false },
         { text: underlined, underlined: true },
         { text: text.slice(start + underlined.length), underlined: false },
      ];

      return {
         images,
         segments: segments.filter((segment) => segment.text),
         text,
      };
   }),
);
</script>

<template>
   <component
      :is="as"
      class="about-title"
      :class="`about-title-${size}`"
      data-about-title
   >
      <span class="sr-only">{{ label }}</span>
      <span aria-hidden="true">
         <span
            v-for="line in segmentedLines"
            :key="line.text"
            class="about-title-mask"
            data-about-title-mask
         >
            <span class="about-title-line" data-about-title-line>
               <span
                  v-if="line.images"
                  class="about-title-inset"
                  data-about-title-inset
                  ><ImageCycle
                     class="about-title-inset-content"
                     data-about-title-inset-content
                     :images="line.images"
                     loading="eager"
                     sizes="sm:448px"
               /></span>
               <template v-for="segment in line.segments" :key="segment.text">
                  <span v-if="segment.underlined" class="about-title-underlined"
                     >{{ segment.text
                     }}<WaveUnderline
                        class="about-title-wave"
                        :color="underlineColor"
                        :drawn="drawn"
                  /></span>
                  <span v-else class="about-title-text" data-about-title-text>{{
                     segment.text
                  }}</span>
               </template>
            </span>
         </span>
      </span>
   </component>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-title {
   @apply m-0 font-bold tracking-[-0.05em];
   line-height: 0.88;
   margin-top: -0.2em;
}

.about-title-display {
   font-size: clamp(3.5rem, 11vw, 12rem);
}

.about-title-section {
   font-size: clamp(2.75rem, 8vw, 8.5rem);
}

.about-title-mask,
.about-title-line {
   @apply block;
}

.about-title-mask {
   margin-bottom: -0.4em;
   padding-block: 0.2em;
}

.about-title-line {
   @apply whitespace-nowrap;
}

.about-title-inset {
   @apply relative inline-block overflow-hidden rounded-[0.06em];
   height: 0.8em;
   margin-inline-end: calc(0.12em * var(--about-title-inset-open));
   vertical-align: -0.06em;
   width: calc(var(--about-title-inset-width) * var(--about-title-inset-open));
   --about-title-inset-open: 1;
   --about-title-inset-width: calc(0.8em * 16 / 9);
}

.about-title-inset > .about-title-inset-content {
   @apply absolute top-0 left-1/2 h-full -translate-x-1/2;
   width: var(--about-title-inset-width);
}

.about-title-underlined {
   @apply relative inline-block;
}

.about-title-wave {
   @apply absolute top-full left-0 -mt-[0.04em];
}
</style>
