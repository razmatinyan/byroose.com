<script setup lang="ts">
import { useMediaQuery, useSwipe, useWindowSize } from "@vueuse/core";
import { computed, nextTick, onScopeDispose, ref, useTemplateRef, watch } from "vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { whenImageLoaded } from "@/composables/useImagesLoaded";
import { appIcons } from "@/lib/icons";
import type { ProjectImage } from "@/lib/projects";

interface ViewerLayer {
   id: number;
   image: ProjectImage;
   ready: boolean;
}

const { images } = defineProps<{
   images: readonly ProjectImage[];
}>();

const index = defineModel<number>("index");

const resizeDuration = 0.7;
const resizeEase = "power3.inOut";
const fadeDuration = 0.45;
const fadeEase = "power2.out";
const imageSizes = "sm:1024px md:1536px xl:2560px";
const reservedSpace = {
   compact: { block: 32, inline: 32 },
   wide: { block: 48, inline: 48 },
} as const;
const stillMotion =
   "motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none";
const contentClass = `inset-0 top-0 left-0 block h-svh w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-transparent p-0 shadow-none sm:max-w-none ${stillMotion}`;
const overlayClass = `bg-foreground/90 ${stillMotion}`;

const stage = useTemplateRef<HTMLElement>("stage");
const frame = useTemplateRef<HTMLElement>("frame");
const layers = ref<ViewerLayer[]>([]);
const { height: viewportHeight, width: viewportWidth } = useWindowSize();
const isWide = useMediaQuery("(min-width: 768px)");
const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
const { gsap } = useGsap();
const { lock } = useSmoothScroll();
let releaseScroll: (() => void) | null = null;
let returnFocusTarget: HTMLElement | null = null;
let nextLayerId = 0;

const open = computed({
   get: () => index.value !== undefined,
   set: (isOpen) => {
      if (!isOpen) index.value = undefined;
   },
});
const current = computed(() => (index.value === undefined ? undefined : images[index.value]));
const hasSiblings = computed(() => images.length > 1);
const title = computed(() =>
   index.value === undefined ? "" : `Image ${index.value + 1} of ${images.length}`,
);
const counter = computed(() =>
   index.value === undefined ? "" : `${index.value + 1} / ${images.length}`,
);
const neighbors = computed(() => {
   if (index.value === undefined || !hasSiblings.value) return [];

   const count = images.length;
   return [images[(index.value + 1) % count], images[(index.value - 1 + count) % count]].filter(
      (image): image is ProjectImage => Boolean(image),
   );
});

function fitSize({ height, width }: ProjectImage) {
   const space = isWide.value ? reservedSpace.wide : reservedSpace.compact;
   const scale = Math.min(
      1,
      (viewportWidth.value - space.inline) / width,
      (viewportHeight.value - space.block) / height,
   );

   return { height: Math.round(height * scale), width: Math.round(width * scale) };
}

function resizeFrame(image: ProjectImage, animate: boolean) {
   const element = frame.value;
   if (!element) return;

   const size = fitSize(image);
   if (!animate || prefersReducedMotion.value) {
      gsap.killTweensOf(element);
      gsap.set(element, size);
      return;
   }

   gsap.to(element, { ...size, duration: resizeDuration, ease: resizeEase, overwrite: "auto" });
}

function hasLayer(id: number) {
   return layers.value.some((layer) => layer.id === id);
}

async function showImage(image: ProjectImage, animate: boolean) {
   const id = nextLayerId++;
   const layer = { id, image, ready: false };
   layers.value = animate && layers.value.length ? [...layers.value, layer] : [layer];

   await nextTick();
   const element = frame.value?.querySelector(`[data-viewer-layer="${id}"]`);
   if (!(element instanceof HTMLImageElement)) return;

   await whenImageLoaded(element);
   if (!hasLayer(id)) return;

   layers.value = layers.value.map((item) => (item.id === id ? { ...item, ready: true } : item));
   const keepFromLayer = () => {
      layers.value = layers.value.filter((item) => item.id >= id);
   };

   if (!animate || prefersReducedMotion.value) return keepFromLayer();

   gsap.fromTo(
      element,
      { opacity: 0 },
      { duration: fadeDuration, ease: fadeEase, onComplete: keepFromLayer, opacity: 1 },
   );
}

function step(offset: number) {
   if (index.value === undefined || !hasSiblings.value) return;

   index.value = (index.value + offset + images.length) % images.length;
}

function handleKeydown(event: KeyboardEvent) {
   if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
   }

   if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
   }
}

function focusDialog(event: Event) {
   event.preventDefault();
   if (document.activeElement instanceof HTMLElement) returnFocusTarget = document.activeElement;
   if (event.target instanceof HTMLElement) {
      event.target.focus({ preventScroll: true });
   }
}

function returnFocus(event: Event) {
   event.preventDefault();
   returnFocusTarget?.focus({ preventScroll: true });
   returnFocusTarget = null;
}

function unlockScroll() {
   releaseScroll?.();
   releaseScroll = null;
}

useSwipe(stage, {
   onSwipeEnd: (_, direction) => {
      if (direction === "left") step(1);
      if (direction === "right") step(-1);
   },
});

watch(
   index,
   async (next, previous) => {
      if (next === undefined) return unlockScroll();

      releaseScroll ??= lock();
      const image = images[next];
      if (!image) return;

      await nextTick();
      const animate = previous !== undefined;
      resizeFrame(image, animate);
      await showImage(image, animate);
   },
   { flush: "post" },
);

watch([viewportWidth, viewportHeight, isWide], () => {
   if (current.value) resizeFrame(current.value, false);
});

onScopeDispose(unlockScroll);
</script>

<template>
   <Dialog v-model:open="open">
      <DialogContent
         :class="contentClass"
         :overlay-class="overlayClass"
         :show-close-button="false"
         data-lenis-prevent
         @keydown="handleKeydown"
         @open-auto-focus="focusDialog"
         @close-auto-focus="returnFocus"
      >
         <DialogTitle class="sr-only">{{ title }}</DialogTitle>
         <DialogDescription class="sr-only">{{ current?.alt }}</DialogDescription>

         <div ref="stage" class="image-viewer-stage" @click.self="open = false">
            <div ref="frame" class="image-viewer-frame">
               <NuxtImg
                  v-for="layer in layers"
                  :key="layer.id"
                  :data-viewer-layer="layer.id"
                  :data-ready="layer.ready"
                  class="image-viewer-image"
                  :src="layer.image.src"
                  alt=""
                  :width="layer.image.width"
                  :height="layer.image.height"
                  :sizes="imageSizes"
                  densities="x1"
                  loading="eager"
                  draggable="false"
               />
            </div>
         </div>

         <DialogClose as-child>
            <Button
               class="image-viewer-close"
               variant="light"
               size="cta-icon"
               :bounce-on-hover="true"
               aria-label="Close"
            >
               <template #icon>
                  <ButtonIcon :icon="appIcons.close" />
               </template>
            </Button>
         </DialogClose>

         <template v-if="hasSiblings">
            <Button
               class="image-viewer-nav image-viewer-previous"
               variant="light"
               size="cta-icon"
               :bounce-on-hover="true"
               aria-label="Previous image"
               @click="step(-1)"
            >
               <template #icon>
                  <ButtonIcon :icon="appIcons.arrowLeft" />
               </template>
            </Button>
            <Button
               class="image-viewer-nav image-viewer-next"
               variant="light"
               size="cta-icon"
               :bounce-on-hover="true"
               aria-label="Next image"
               @click="step(1)"
            >
               <template #icon>
                  <ButtonIcon :icon="appIcons.arrowRight" />
               </template>
            </Button>
            <p class="image-viewer-counter" aria-hidden="true">{{ counter }}</p>
         </template>

         <span class="image-viewer-preload" aria-hidden="true">
            <NuxtImg
               v-for="image in neighbors"
               :key="image.src"
               :src="image.src"
               alt=""
               :width="image.width"
               :height="image.height"
               :sizes="imageSizes"
               densities="x1"
               loading="eager"
            />
         </span>
      </DialogContent>
   </Dialog>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.image-viewer-stage {
   @apply absolute inset-0 grid place-items-center;
}

.image-viewer-frame {
   @apply relative overflow-hidden rounded-lg bg-foreground shadow-2xl;
}

.image-viewer-image {
   @apply absolute inset-0 size-full object-cover select-none;
}

.image-viewer-image[data-ready="false"] {
   @apply opacity-0;
}

.image-viewer-close {
   @apply absolute top-4 right-4 z-10 md:top-6 md:right-6;
}

.image-viewer-nav {
   @apply absolute bottom-6 z-10 md:bottom-auto md:top-[calc(50%-1.625rem)];
}

.image-viewer-previous {
   @apply left-4 md:left-6;
}

.image-viewer-next {
   @apply right-4 md:right-6;
}

.image-viewer-counter {
   @apply pointer-events-none absolute bottom-6 left-1/2 z-10 m-0 flex h-13 -translate-x-1/2 items-center rounded-full bg-foreground/70 px-5 text-lg font-semibold tracking-[-0.02em] text-background tabular-nums;
}

.image-viewer-preload {
   @apply hidden;
}
</style>
