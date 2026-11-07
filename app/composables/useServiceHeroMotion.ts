import { onMounted, onScopeDispose, readonly, shallowRef, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { until } from "@vueuse/core";
import type { SplitTextResult } from "@/lib/split-text";
import {
   addWordReveal,
   lineRevealDuration,
   lineRevealEase,
   lineRevealStagger,
   titleLineRevealStagger,
   wordRevealOffset,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;

const actionSelector = "[data-service-hero-action]";
const descriptionStart = 0.3;

export function useServiceHeroMotion(
   scope: MotionScope,
   titleSplit: SplitSource,
   descriptionSplit: SplitSource,
) {
   const { createMatchMedia, gsap } = useGsap();
   const { waitForReveal } = usePageTransition();
   const revealed = shallowRef(false);
   let disposed = false;

   onScopeDispose(() => {
      disposed = true;
   });

   function reveal(
      titleLines: HTMLElement[],
      descriptionLines: HTMLElement[],
      actions: HTMLElement[],
   ) {
      const animated = [...titleLines, ...descriptionLines, ...actions];
      gsap.set(animated, { visibility: "hidden", yPercent: wordRevealOffset });
      revealed.value = true;

      const timeline = gsap.timeline({
         onComplete: () => {
            gsap.set(animated, { clearProps: "transform" });
         },
      });
      addWordReveal(timeline, titleLines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         stagger: titleLineRevealStagger,
      });
      addWordReveal(timeline, descriptionLines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         position: descriptionStart,
         stagger: lineRevealStagger,
      });
      addWordReveal(timeline, actions, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         position: descriptionStart + descriptionLines.length * lineRevealStagger,
      });
   }

   onMounted(async () => {
      const [title, description] = await Promise.all([
         until(() => toValue(titleSplit)).not.toBeUndefined(),
         until(() => toValue(descriptionSplit)).not.toBeUndefined(),
         waitForReveal(),
      ]);
      const root = toValue(scope);
      if (disposed || !root) return;

      const actions = Array.from(
         root.querySelectorAll<HTMLElement>(actionSelector),
      );

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion || revealed.value) {
               revealed.value = true;
               return;
            }

            reveal(title?.lines ?? [], description?.lines ?? [], actions);
         },
         scope,
      );
   });

   return { revealed: readonly(revealed) };
}
