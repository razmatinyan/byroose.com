<script setup lang="ts">
import { computed, shallowRef, useTemplateRef, watch } from "vue";
import {
   useElementVisibility,
   useIntervalFn,
   usePreferredReducedMotion,
} from "@vueuse/core";

interface CycleImage {
   height: number;
   src: string;
   width: number;
}

const {
   images,
   interval = 750,
   sizes,
} = defineProps<{
   images: readonly CycleImage[];
   interval?: number;
   sizes: string;
}>();

const root = useTemplateRef<HTMLElement>("root");
const activeIndex = shallowRef(0);
const visible = useElementVisibility(root);
const motionPreference = usePreferredReducedMotion();
const cycling = computed(
   () =>
      visible.value &&
      motionPreference.value !== "reduce" &&
      images.length > 1,
);

const { pause, resume } = useIntervalFn(showNextImage, () => interval, {
   immediate: false,
});

watch(cycling, (active) => {
   if (active) resume();
   else pause();
});

function showNextImage() {
   activeIndex.value = (activeIndex.value + 1) % images.length;
}
</script>

<template>
   <div ref="root" class="image-cycle" aria-hidden="true">
      <NuxtImg
         v-for="(image, index) in images"
         :key="image.src"
         class="image-cycle-image"
         :data-active="index === activeIndex"
         :src="image.src"
         alt=""
         :width="image.width"
         :height="image.height"
         :sizes="sizes"
         loading="lazy"
         draggable="false"
      />
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.image-cycle {
   @apply relative;
}

.image-cycle-image {
   @apply absolute inset-0 size-full object-cover opacity-0 select-none;
}

.image-cycle-image[data-active="true"] {
   @apply opacity-100;
}
</style>
