import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { SplitTextResult } from "@/lib/split-text";
import { addWordReveal, wordRevealStart } from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitListSource = MaybeRefOrGetter<
   readonly (SplitTextResult | undefined)[]
>;

const selectors = {
   action: "[data-site-cta-action]",
   title: "[data-site-cta-title]",
} as const;

const titleWordStagger = 0.12;

export function useSiteCtaMotion(
   scope: MotionScope,
   titleSplits: SplitListSource,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let initialized = false;

   async function initialize(words: HTMLElement[]) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const ScrollTrigger = await loadPlugin("ScrollTrigger");
      const root = toValue(scope);
      if (!ScrollTrigger || !root || disposed) return;

      const title = root.querySelector<HTMLElement>(selectors.title) ?? root;
      const actions = Array.from(
         root.querySelectorAll<HTMLElement>(selectors.action),
      );

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               const shown = [...words, ...actions];
               if (shown.length) gsap.set(shown, { visibility: "inherit" });
               return;
            }

            const timeline = gsap.timeline({
               scrollTrigger: {
                  once: true,
                  start: wordRevealStart,
                  trigger: title,
               },
            });

            addWordReveal(timeline, words, { stagger: titleWordStagger });
            addWordReveal(timeline, actions, {
               position: words.length * titleWordStagger,
            });
         },
         scope,
      );

      await refresh();
   }

   watch(
      () => toValue(titleSplits),
      (splits) => {
         if (splits.includes(undefined)) return;

         return initialize(splits.flatMap((parts) => parts?.words ?? []));
      },
      { flush: "post", immediate: true },
   );

   onScopeDispose(() => {
      disposed = true;
   });
}
