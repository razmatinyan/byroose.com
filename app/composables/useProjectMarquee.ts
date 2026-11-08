import { useElementVisibility, useEventListener } from "@vueuse/core";
import { onMounted, shallowRef, watch } from "vue";
import type { ShallowRef } from "vue";

const secondsPerCard = 5;
const hoverEaseDuration = 0.6;

export function useProjectMarquee(
   viewport: Readonly<ShallowRef<HTMLElement | null>>,
   track: Readonly<ShallowRef<HTMLElement | null>>,
   cardCount: () => number,
) {
   const { createMatchMedia, gsap } = useGsap();
   const visible = useElementVisibility(viewport, { rootMargin: "25% 0px" });
   const loop = shallowRef<gsap.core.Tween | null>(null);
   const held = shallowRef(false);

   function syncPlayback() {
      const tween = loop.value;
      if (!tween) return;

      if (visible.value) tween.play();
      else tween.pause();
   }

   function ease(timeScale: number) {
      const tween = loop.value;
      if (!tween) return;

      gsap.to(tween, {
         duration: hoverEaseDuration,
         ease: "power2.out",
         overwrite: true,
         timeScale,
      });
   }

   function hold() {
      held.value = true;
      ease(0);
   }

   function release() {
      held.value = false;
      ease(1);
   }

   function releaseOnFocusOut(event: FocusEvent) {
      const next = event.relatedTarget;
      if (next instanceof Node && viewport.value?.contains(next)) return;
      release();
   }

   onMounted(() => {
      const element = track.value;
      if (!element) return;

      createMatchMedia(
         {
            desktop: "(min-width: 64rem)",
            motion: "(prefers-reduced-motion: no-preference)",
         },
         (context) => {
            if (!context.conditions?.motion) return;

            const axis = context.conditions?.desktop ? "yPercent" : "xPercent";
            const tween = gsap.fromTo(
               element,
               { [axis]: 0 },
               {
                  [axis]: -50,
                  duration: (cardCount() / 2) * secondsPerCard,
                  ease: "none",
                  paused: true,
                  repeat: -1,
               },
            );
            tween.timeScale(held.value ? 0 : 1);
            loop.value = tween;
            syncPlayback();

            return () => {
               loop.value = null;
            };
         },
      );
   });

   watch(visible, syncPlayback);

   useEventListener(viewport, "pointerenter", hold);
   useEventListener(viewport, "pointerleave", release);
   useEventListener(viewport, "focusin", hold);
   useEventListener(viewport, "focusout", releaseOnFocusOut);
}
