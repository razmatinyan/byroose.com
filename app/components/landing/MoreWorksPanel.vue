<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";
import { shallowRef, useTemplateRef, watch } from "vue";
import { NuxtLink } from "#components";
import SplitText from "@/components/shared/SplitText.vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import type { RolloverTones } from "@/components/ui/button";
import type { SplitTextResult } from "@/lib/split-text";

interface MoreWorksImage {
   height: number;
   src: string;
}

const emit = defineEmits<{
   activate: [image: string, label: string];
   deactivate: [];
}>();

const worksRoute = "/works";
const titleStart = "View";
const titleEnd = "work";
const actionLabel = "Explore Projects";
const imageInterval = 750;
const actionRolloverTones: RolloverTones = ["primary", "green", "pink"];

const moreWorksImages: readonly MoreWorksImage[] = [
   { height: 1919, src: "/images/work/1.png" },
   { height: 1919, src: "/images/work/2.png" },
   { height: 1620, src: "/images/work/3.png" },
   { height: 1919, src: "/images/work/4.png" },
   { height: 1919, src: "/images/work/5.png" },
   { height: 1919, src: "/images/work/6.png" },
   { height: 1919, src: "/images/work/7.png" },
];

const track = useTemplateRef<HTMLElement>("track");
const panel = useTemplateRef<HTMLElement>("panel");
const media = useTemplateRef<HTMLElement>("media");
const startWord = useTemplateRef<HTMLElement>("startWord");
const endWord = useTemplateRef<HTMLElement>("endWord");
const startSplit = shallowRef<SplitTextResult>();
const endSplit = shallowRef<SplitTextResult>();
const activeImage = shallowRef(0);
const previewing = shallowRef(false);

const { cycling } = useMoreWorksMotion(track, {
   endSplit,
   endWord,
   media,
   panel,
   startSplit,
   startWord,
});

const { pause, resume } = useIntervalFn(showNextImage, imageInterval, {
   immediate: false,
});

watch(cycling, (active) => {
   if (active) resume();
   else pause();
});

watch(activeImage, () => {
   if (previewing.value) showPreview();
});

function showNextImage() {
   activeImage.value = (activeImage.value + 1) % moreWorksImages.length;
}

function showPreview() {
   const image = moreWorksImages[activeImage.value];
   if (!image) return;

   previewing.value = true;
   emit("activate", image.src, actionLabel);
}

function hidePreview() {
   previewing.value = false;
   emit("deactivate");
}

function setStartSplit(parts: SplitTextResult) {
   startSplit.value = parts;
}

function setEndSplit(parts: SplitTextResult) {
   endSplit.value = parts;
}

function openWorks(event: MouseEvent) {
   if (event.target instanceof Element && event.target.closest("a")) return;

   return navigateTo(worksRoute);
}
</script>

<template>
   <div ref="track" class="more-works-track" data-work-more>
      <div
         ref="panel"
         class="more-works"
         data-work-more-panel
         @click="openWorks"
         @pointerenter="showPreview"
         @pointerleave="hidePreview"
      >
         <div class="more-works-stage">
            <div ref="media" class="more-works-media" aria-hidden="true">
               <NuxtImg
                  v-for="(image, index) in moreWorksImages"
                  :key="image.src"
                  class="more-works-image"
                  :data-active="index === activeImage"
                  :src="image.src"
                  alt=""
                  width="1080"
                  :height="image.height"
                  sizes="sm:448px"
                  loading="lazy"
                  draggable="false"
               />
            </div>

            <h3 class="more-works-title">
               <span class="sr-only">{{ titleStart }} {{ titleEnd }}</span>
               <span
                  ref="startWord"
                  class="more-works-word more-works-word-start"
                  aria-hidden="true"
               >
                  <SplitText
                     aria="none"
                     :text="titleStart"
                     type="chars"
                     @split="setStartSplit"
                  />
               </span>
               <span
                  ref="endWord"
                  class="more-works-word more-works-word-end"
                  aria-hidden="true"
               >
                  <SplitText
                     aria="none"
                     :text="titleEnd"
                     type="chars"
                     @split="setEndSplit"
                  />
               </span>
            </h3>
         </div>

         <div class="more-works-action">
            <Button
               :as="NuxtLink"
               :to="worksRoute"
               variant="cream"
               size="cta-lg"
               :rollover-tones="actionRolloverTones"
               @pointerenter="hidePreview"
               @pointerleave="showPreview"
            >
               {{ actionLabel }}
               <template #icon>
                  <ButtonIcon tone="dark" />
               </template>
            </Button>
         </div>
      </div>
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.more-works-track {
   @apply pointer-events-none relative z-10;
   margin-top: calc(var(--more-works-runway, 0) * 50svh);
}

.more-works {
   @apply pointer-events-auto flex min-h-svh cursor-pointer flex-col bg-foreground px-page text-background;
   --more-works-image: clamp(5rem, 17vw, 18rem);
}

.more-works-stage {
   @apply grid flex-1 place-items-center;
}

.more-works-media,
.more-works-title {
   @apply col-start-1 row-start-1;
}

.more-works-media {
   @apply relative aspect-3/4 overflow-hidden rounded-xl bg-brand-subtle;
   width: var(--more-works-image);
}

.more-works-image {
   @apply absolute inset-0 size-full select-none object-cover opacity-0;
}

.more-works-image[data-active="true"] {
   @apply opacity-100;
}

.more-works-title {
   @apply relative z-10 m-0 grid w-full items-center leading-none font-bold tracking-[-0.045em] whitespace-nowrap uppercase;
   grid-template-columns: 1fr calc(var(--more-works-image) * 0.76) 1fr;
   font-size: clamp(2.75rem, 11vw, 13rem);
}

.more-works-word {
   @apply inline-block;
}

.more-works-word-start {
   @apply col-start-1 justify-self-end;
}

.more-works-word-end {
   @apply col-start-3 justify-self-start;
}

.more-works-action {
   @apply flex justify-center pb-12 md:pb-16;
}
</style>
