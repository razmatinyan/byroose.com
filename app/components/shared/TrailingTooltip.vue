<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";

const {
   active = false,
   image,
   label = "See Full Project",
} = defineProps<{
   active?: boolean;
   image: string;
   label?: string;
}>();

const tooltip = useTemplateRef<HTMLElement>("tooltip");
const { createMatchMedia, gsap } = useGsap();

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
</script>

<template>
   <Teleport to="#teleports">
      <div
         ref="tooltip"
         class="trailing-tooltip"
         :data-active="active"
         aria-hidden="true"
      >
         <NuxtImg
            v-if="image"
            class="trailing-tooltip-image"
            :src="image"
            alt=""
            width="96"
            height="96"
            sizes="tooltip:96px"
            loading="eager"
            draggable="false"
         />
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

.trailing-tooltip-image {
   @apply size-26 shrink-0 object-cover;
   border-radius: calc(1.2rem - 0.5rem);
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
