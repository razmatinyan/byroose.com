import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { SplitTextResult } from "@/lib/split-text";
import {
   addWordReveal,
   revealMaskClip,
   wordRevealStart,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;

const selectors = {
   item: "[data-about-approach-item]",
   rise: "[data-about-approach-rise]",
   riseMask: "[data-about-approach-rise-mask]",
   title: "[data-about-approach-title]",
} as const;

const titleWordStagger = 0.08;
const itemRiseStagger = 0.12;

export function useAboutApproachMotion(
   scope: MotionScope,
   titleSplit: SplitSource,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let initialized = false;

   function revealTitle(title: HTMLElement, words: HTMLElement[]) {
      const timeline = gsap.timeline({
         scrollTrigger: { once: true, start: wordRevealStart, trigger: title },
      });

      addWordReveal(timeline, words, { stagger: titleWordStagger });
   }

   function revealItem(item: HTMLElement) {
      const rises = Array.from(
         item.querySelectorAll<HTMLElement>(selectors.rise),
      );
      const masks = Array.from(
         item.querySelectorAll<HTMLElement>(selectors.riseMask),
      );
      if (!rises.length) return;

      gsap.set(masks, { clipPath: revealMaskClip });

      const timeline = gsap.timeline({
         onComplete: () => {
            gsap.set(masks, { clearProps: "clipPath" });
         },
         scrollTrigger: { once: true, start: wordRevealStart, trigger: item },
      });

      addWordReveal(timeline, rises, { stagger: itemRiseStagger });
   }

   async function initialize(words: HTMLElement[]) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const ScrollTrigger = await loadPlugin("ScrollTrigger");
      const root = toValue(scope);
      if (!ScrollTrigger || !root || disposed) return;

      const title = root.querySelector<HTMLElement>(selectors.title);
      const items = Array.from(
         root.querySelectorAll<HTMLElement>(selectors.item),
      );
      const rises = Array.from(
         root.querySelectorAll<HTMLElement>(selectors.rise),
      );
      if (!title) return;

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               gsap.set([...words, ...rises], { visibility: "inherit" });
               return;
            }

            revealTitle(title, words);
            items.forEach(revealItem);
         },
         scope,
      );

      await refresh();
   }

   watch(
      () => toValue(titleSplit),
      (parts) => {
         if (parts) return initialize(parts.words);
      },
      { flush: "post", immediate: true },
   );

   onScopeDispose(() => {
      disposed = true;
   });
}
