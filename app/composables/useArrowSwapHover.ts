import { onMounted } from "vue";
import { unrefElement } from "@vueuse/core";
import type { MaybeComputedElementRef } from "@vueuse/core";

const glyphSelector = "[data-arrow-swap-glyph]";
const glyphCopySelector = "[data-arrow-swap-glyph-copy]";
const hoverScale = 1.08;
const swapDuration = 0.7;
const swapEase = "power4.inOut";
const glyphRest = { xPercent: 0, yPercent: 0 };
const glyphExit = { xPercent: 200, yPercent: -150 };
const glyphEntry = { xPercent: -200, yPercent: 150 };

export function useArrowSwapHover(target: MaybeComputedElementRef) {
   const { createMatchMedia, gsap } = useGsap();

   onMounted(() => {
      createMatchMedia(
         {
            hover: "(hover: hover)",
            motion: "(prefers-reduced-motion: no-preference)",
         },
         (context) => {
            const element = unrefElement(target);
            if (!(element instanceof HTMLElement)) return;

            const glyph = element.querySelector<HTMLElement>(glyphSelector);
            const glyphCopy =
               element.querySelector<HTMLElement>(glyphCopySelector);
            const motion = Boolean(context.conditions?.motion);
            const scales = motion && Boolean(context.conditions?.hover);
            const tween = {
               duration: motion ? swapDuration : 0,
               ease: swapEase,
               overwrite: "auto" as const,
            };
            let active = false;
            let pointerInside = false;
            let focusVisible = false;

            if (glyph && glyphCopy) {
               gsap.set(glyph, { ...glyphRest, x: 0, y: 0 });
               gsap.set(glyphCopy, { ...glyphEntry, x: 0, y: 0 });
            }

            const settle = (next: boolean) => {
               if (next === active) return;

               active = next;

               if (scales) {
                  gsap.to(element, {
                     ...tween,
                     force3D: false,
                     scale: next ? hoverScale : 1,
                  });
               }

               if (glyph && glyphCopy) {
                  gsap.to(glyph, { ...tween, ...(next ? glyphExit : glyphRest) });
                  gsap.to(glyphCopy, {
                     ...tween,
                     ...(next ? glyphRest : glyphEntry),
                  });
               }
            };

            const sync = () => settle(pointerInside || focusVisible);

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

               const targets = [element, glyph, glyphCopy].filter(
                  (entry): entry is HTMLElement => entry instanceof HTMLElement,
               );
               gsap.killTweensOf(targets);
               gsap.set(targets, { clearProps: "transform" });
            };
         },
         () => unrefElement(target),
      );
   });
}
