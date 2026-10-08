<script setup lang="ts">
import { computed } from "vue";
import WaveUnderline from "@/components/shared/WaveUnderline.vue";

export interface AboutTitleLine {
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
   lines.map(({ text, underlined = "" }) => {
      const start = underlined ? text.indexOf(underlined) : -1;
      if (start < 0) return { segments: [{ text, underlined: false }], text };

      const segments = [
         { text: text.slice(0, start), underlined: false },
         { text: underlined, underlined: true },
         { text: text.slice(start + underlined.length), underlined: false },
      ];

      return { segments: segments.filter((segment) => segment.text), text };
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
               <template v-for="segment in line.segments" :key="segment.text">
                  <span v-if="segment.underlined" class="about-title-underlined"
                     >{{ segment.text
                     }}<WaveUnderline
                        class="about-title-wave"
                        :color="underlineColor"
                        :drawn="drawn"
                  /></span>
                  <template v-else>{{ segment.text }}</template>
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

.about-title-underlined {
   @apply relative inline-block;
}

.about-title-wave {
   @apply absolute top-full left-0 -mt-[0.04em];
}
</style>
