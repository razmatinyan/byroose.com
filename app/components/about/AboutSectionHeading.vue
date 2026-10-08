<script setup lang="ts">
import ImageCycle from "@/components/shared/ImageCycle.vue";
import AboutMediaFrame from "./AboutMediaFrame.vue";
import AboutTitle from "./AboutTitle.vue";
import type { AboutTitleLine } from "./AboutTitle.vue";

interface HeadingImage {
   height: number;
   src: string;
   width: number;
}

const { drawn = false, images, lines, underlineColor } = defineProps<{
   drawn?: boolean;
   images: readonly HeadingImage[];
   lines: readonly AboutTitleLine[];
   underlineColor?: string;
}>();
</script>

<template>
   <div class="about-heading">
      <AboutTitle
         :drawn="drawn"
         :lines="lines"
         :underline-color="underlineColor"
      />
      <AboutMediaFrame class="about-heading-media">
         <ImageCycle :images="images" sizes="sm:640px" />
      </AboutMediaFrame>
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-heading {
   @apply flex flex-col gap-12 md:flex-row md:items-center md:justify-between md:gap-8;
}

.about-heading-media {
   @apply aspect-5/6 w-[min(100%,20rem)] shrink-0 self-end md:self-auto md:w-[clamp(12rem,24vw,24rem)];
}
</style>
