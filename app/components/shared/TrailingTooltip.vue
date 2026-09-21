<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import {
   nextTick,
   onMounted,
   onScopeDispose,
   ref,
   useTemplateRef,
   watch,
} from "vue";
import { stackRevealEase } from "@/lib/stack-reveal";

interface TooltipLayer {
   id: number;
   src: string;
}

const {
   active = false,
   image,
   label = "See Full Project",
} = defineProps<{
   active?: boolean;
   image: string;
   label?: string;
}>();

const swapDuration = 0.6;

const tooltip = useTemplateRef<HTMLElement>("tooltip");
const media = useTemplateRef<HTMLElement>("media");
const layers = ref<TooltipLayer[]>([]);
const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
const { createMatchMedia, gsap } = useGsap();
let nextLayerId = 0;

function keepLayersFrom(id: number) {
   layers.value = layers.value.filter((layer) => layer.id >= id);
}

async function revealLayer(id: number) {
   await nextTick();
   const element = media.value?.querySelector<HTMLElement>(
      `[data-tooltip-layer="${id}"]`,
   );
   if (!element) {
      keepLayersFrom(id);
      return;
   }

   gsap.fromTo(
      element,
      { scale: 0 },
      {
         duration: swapDuration,
         ease: stackRevealEase,
         onComplete: () => keepLayersFrom(id),
         scale: 1,
      },
   );
}

watch(
   () => [active, image] as const,
   ([isActive, nextImage], previous) => {
      if (!nextImage || nextImage === layers.value.at(-1)?.src) return;

      const id = nextLayerId++;
      const revealsOverPrevious =
         Boolean(previous?.[0]) && isActive && layers.value.length > 0;

      if (!revealsOverPrevious || prefersReducedMotion.value) {
         layers.value = [{ id, src: nextImage }];
         return;
      }

      layers.value = [...layers.value, { id, src: nextImage }];
      return revealLayer(id);
   },
   { flush: "post", immediate: true },
);

onMounted(() => {
   createMatchMedia(
      {
         finePointer: "(hover: hover) and (pointer: fine)",
         motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
         const element = tooltip.value;
         if (!element || !context.conditions?.finePointer) return;

         const gap = 2;
         const moveX = context.conditions.motion
            ? gsap.quickTo(element, "x", {
                 duration: 0.65,
                 ease: "power3.out",
                 force3D: false,
              })
            : (value: number) => {
                 gsap.set(element, { force3D: false, x: value });
              };
         const moveY = context.conditions.motion
            ? gsap.quickTo(element, "y", {
                 duration: 0.65,
                 ease: "power3.out",
                 force3D: false,
              })
            : (value: number) => {
                 gsap.set(element, { force3D: false, y: value });
              };

         const handlePointerMove = (event: PointerEvent) => {
            moveX(event.clientX + gap);
            moveY(event.clientY + gap);
         };

         window.addEventListener("pointermove", handlePointerMove, {
            passive: true,
         });

         return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            gsap.killTweensOf(element);
            gsap.set(element, { clearProps: "transform" });
         };
      },
      tooltip,
   );
});

onScopeDispose(() => {
   const element = media.value;
   if (element) gsap.killTweensOf(element.children);
});
</script>

<template>
   <Teleport to="#teleports">
      <div
         ref="tooltip"
         class="trailing-tooltip"
         :data-active="active"
         aria-hidden="true"
      >
         <span v-if="layers.length" ref="media" class="trailing-tooltip-media">
            <NuxtImg
               v-for="layer in layers"
               :key="layer.id"
               :data-tooltip-layer="layer.id"
               class="trailing-tooltip-image"
               :src="layer.src"
               alt=""
               width="96"
               height="96"
               sizes="sm:448px"
               loading="eager"
               draggable="false"
            />
         </span>
         <span class="trailing-tooltip-label">{{ label }}</span>
      </div>
   </Teleport>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.trailing-tooltip {
   @apply pointer-events-none fixed top-0 left-0 z-50 flex items-center gap-5 overflow-hidden bg-card p-2 pr-8 text-card-foreground shadow-xl;
   border-radius: 1.2rem;
   clip-path: inset(50% 100% 50% 0 round 1.2rem);
   transition: clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1);
}

.trailing-tooltip[data-active="true"] {
   clip-path: inset(0 0 0 0 round 1.2rem);
}

.trailing-tooltip-media {
   @apply relative block size-26 shrink-0 overflow-hidden;
   border-radius: calc(1.2rem - 0.5rem);
}

.trailing-tooltip-image {
   @apply absolute inset-0 size-full object-cover;
   border-radius: inherit;
}

.trailing-tooltip-label {
   @apply whitespace-nowrap text-3xl tracking-tighter leading-none font-semibold;
}

@media (prefers-reduced-motion: reduce) {
   .trailing-tooltip {
      transition: none;
   }
}
</style>
