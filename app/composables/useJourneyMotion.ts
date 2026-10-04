import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { SplitTextResult } from "@/lib/split-text";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;

interface JourneyMotionTargets {
   titleSplit: SplitSource;
}

const selectors = {
   title: "[data-journey-title]",
} as const;

const refreshPriority = -2;
const titleRevealStart = "top bottom";
const titleRevealEnd = "bottom 55%";
const titleCharFrom = {
   rotation: -24,
   scale: 0,
   transformOrigin: "50% 0%",
   yPercent: -110,
};
const titleCharStagger = 0.08;
const titleCharEase = "power3.out";

export function useJourneyMotion(
   scope: MotionScope,
   { titleSplit }: JourneyMotionTargets,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let initialized = false;

   function spawnTitleChars(chars: HTMLElement[], trigger: HTMLElement) {
      if (!chars.length) return;

      gsap
         .timeline({
            scrollTrigger: {
               end: titleRevealEnd,
               refreshPriority,
               scrub: true,
               start: titleRevealStart,
               trigger,
            },
         })
         .set(chars, { visibility: "inherit" }, 0)
         .fromTo(
            chars,
            titleCharFrom,
            {
               ease: titleCharEase,
               rotation: 0,
               scale: 1,
               stagger: titleCharStagger,
               yPercent: 0,
            },
            0,
         );
   }

   function showTitleChars(chars: HTMLElement[]) {
      if (!chars.length) return;

      gsap.set(chars, {
         clearProps: "transform",
         visibility: "inherit",
      });
   }

   async function initialize(titleChars: HTMLElement[]) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const ScrollTrigger = await loadPlugin("ScrollTrigger");
      if (!ScrollTrigger || disposed) return;

      const title = toValue(scope)?.querySelector<HTMLElement>(selectors.title);
      if (!title) return;

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               showTitleChars(titleChars);
               return;
            }

            spawnTitleChars(titleChars, title);
         },
         scope,
      );

      await refresh();
   }

   watch(
      () => toValue(titleSplit),
      (parts) => {
         if (parts === undefined) return;

         return initialize(parts?.chars ?? []);
      },
      { flush: "post", immediate: true },
   );

   onScopeDispose(() => {
      disposed = true;
   });
}
