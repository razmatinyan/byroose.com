import { onMounted } from "vue";
import { unrefElement } from "@vueuse/core";
import type { MaybeComputedElementRef } from "@vueuse/core";
import { swapDuration } from "@/lib/swap-timing";

const lineSelector = "[data-sweep-line]";
const sweepHalfDuration = swapDuration / 2;

export function useUnderlineSweep(target: MaybeComputedElementRef) {
   const { createMatchMedia, gsap } = useGsap();

   onMounted(() => {
      createMatchMedia(
         {
            hover: "(hover: hover)",
            motion: "(prefers-reduced-motion: no-preference)",
         },
         (context) => {
            if (!context.conditions?.hover || !context.conditions?.motion) return;

            const element = unrefElement(target);
            if (!(element instanceof HTMLElement)) return;

            const line = element.querySelector<HTMLElement>(lineSelector);
            if (!line) return;

            let sweep: gsap.core.Timeline | null = null;
            let pointerInside = false;
            let focusVisible = false;
            let active = false;

            const playSweep = () => {
               if (sweep?.isActive()) return;

               sweep = gsap
                  .timeline()
                  .to(line, {
                     duration: sweepHalfDuration,
                     ease: "power2.in",
                     force3D: false,
                     scaleX: 0,
                     transformOrigin: "right center",
                  })
                  .set(line, { transformOrigin: "left center" })
                  .to(line, {
                     duration: sweepHalfDuration,
                     ease: "power2.out",
                     force3D: false,
                     scaleX: 1,
                  });
            };

            const sync = () => {
               const next = pointerInside || focusVisible;
               if (next === active) return;

               active = next;
               playSweep();
            };

            const handlePointerEnter = () => {
               pointerInside = true;
               sync();
            };

            const handlePointerLeave = () => {
               pointerInside = false;
               sync();
            };

            const handleFocus = () => {
               focusVisible = element.matches(":focus-visible");
               sync();
            };

            const handleBlur = () => {
               focusVisible = false;
               sync();
            };

            element.addEventListener("blur", handleBlur);
            element.addEventListener("focus", handleFocus);
            element.addEventListener("pointerenter", handlePointerEnter);
            element.addEventListener("pointerleave", handlePointerLeave);

            return () => {
               element.removeEventListener("blur", handleBlur);
               element.removeEventListener("focus", handleFocus);
               element.removeEventListener("pointerenter", handlePointerEnter);
               element.removeEventListener("pointerleave", handlePointerLeave);
               sweep?.kill();
               gsap.set(line, { clearProps: "transform,transformOrigin" });
            };
         },
         () => unrefElement(target),
      );
   });
}
