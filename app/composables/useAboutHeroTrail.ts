import { onMounted, onScopeDispose, readonly, shallowRef, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;

interface PointerPoint {
   x: number;
   y: number;
}

const selectors = {
   item: "[data-about-hero-trail-item]",
   layer: "[data-about-hero-trail]",
} as const;

const spawnDistanceRatio = 1 / 3;
const throwMultiplier = 4;
const randomSpread = (range: number) => (Math.random() - 0.5) * range;

export function useAboutHeroTrail(scope: MotionScope) {
   const { createMatchMedia, gsap } = useGsap();
   const { waitForReveal } = usePageTransition();
   const armed = shallowRef(false);
   let disposed = false;

   function playTrailItem(
      item: HTMLElement,
      point: PointerPoint,
      delta: PointerPoint,
   ) {
      gsap.killTweensOf(item);
      gsap
         .timeline({
            onComplete: () => {
               gsap.set(item, { autoAlpha: 0 });
            },
         })
         .set(item, { autoAlpha: 1 })
         .fromTo(
            item,
            {
               scale: 1.3,
               xPercent: -50 + randomSpread(80),
               yPercent: -50 + randomSpread(10),
            },
            { duration: 0.6, ease: "elastic.out(2, 0.6)", scale: 1 },
         )
         .fromTo(
            item,
            { rotation: randomSpread(20), x: point.x, y: point.y },
            {
               duration: 1.5,
               ease: "power4.out",
               rotation: randomSpread(20),
               x: point.x + delta.x * throwMultiplier,
               y: point.y + delta.y * throwMultiplier,
            },
            "<",
         )
         .to(item, { delay: 0.1, duration: 0.3, ease: "back.in(1.5)", scale: 0 });
   }

   function trackPointer(root: HTMLElement, context: gsap.Context) {
      let previous: PointerPoint | null = null;
      let travelled = 0;
      let nextIndex = 0;

      const spawn = (point: PointerPoint, delta: PointerPoint) => {
         const layer = root.querySelector<HTMLElement>(selectors.layer);
         const items = layer
            ? Array.from(layer.querySelectorAll<HTMLElement>(selectors.item))
            : [];
         const item = items[nextIndex % items.length];
         if (!layer || !item) return;

         const bounds = layer.getBoundingClientRect();
         const origin = { x: point.x - bounds.left, y: point.y - bounds.top };
         nextIndex = (nextIndex + 1) % items.length;
         context.add(() => playTrailItem(item, origin, delta));
      };

      const handlePointerMove = (event: PointerEvent) => {
         if (event.pointerType !== "mouse") return;

         const point = { x: event.clientX, y: event.clientY };
         if (!previous) {
            previous = point;
            return;
         }

         const delta = { x: point.x - previous.x, y: point.y - previous.y };
         travelled += Math.abs(delta.x) + Math.abs(delta.y);
         previous = point;

         if (travelled <= window.innerWidth * spawnDistanceRatio) return;
         travelled = 0;
         spawn(point, delta);
      };

      const handlePointerLeave = () => {
         previous = null;
      };

      root.addEventListener("pointermove", handlePointerMove, {
         passive: true,
      });
      root.addEventListener("pointerleave", handlePointerLeave);

      return () => {
         root.removeEventListener("pointermove", handlePointerMove);
         root.removeEventListener("pointerleave", handlePointerLeave);
      };
   }

   onMounted(async () => {
      await waitForReveal();
      const root = toValue(scope);
      if (disposed || !root) return;

      createMatchMedia(
         {
            finePointer: "(hover: hover) and (pointer: fine)",
            motion: "(prefers-reduced-motion: no-preference)",
         },
         (context) => {
            const { finePointer, motion } = context.conditions ?? {};
            if (!finePointer || !motion) return;

            armed.value = true;
            const stopTracking = trackPointer(root, context);

            return () => {
               stopTracking();
               armed.value = false;
            };
         },
         scope,
      );
   });

   onScopeDispose(() => {
      disposed = true;
   });

   return { armed: readonly(armed) };
}
