import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { addCharReveal } from "@/lib/char-reveal";
import type { SplitTextResult } from "@/lib/split-text";
import {
   addWordReveal,
   lineRevealDuration,
   lineRevealEase,
   lineRevealStagger,
   wordRevealStart,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;
type SplitListSource = MaybeRefOrGetter<
   readonly (SplitTextResult | undefined)[]
>;

interface JourneyMotionTargets {
   stepBodySplits: SplitListSource;
   stepTitleSplits: SplitListSource;
   titleSplit: SplitSource;
}

interface StepParts {
   bodyLines: HTMLElement[];
   step: HTMLElement;
   titleChars: HTMLElement[];
}

const selectors = {
   step: "[data-journey-step]",
   title: "[data-journey-title]",
} as const;

const refreshPriority = -2;
const titleRevealStart = "top 85%";
const stepCharStagger = 0.02;
const stepBodyDelay = 0.2;

export function useJourneyMotion(
   scope: MotionScope,
   { stepBodySplits, stepTitleSplits, titleSplit }: JourneyMotionTargets,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let initialized = false;

   function revealTitleChars(chars: HTMLElement[], trigger: HTMLElement) {
      const timeline = gsap.timeline({
         scrollTrigger: {
            once: true,
            refreshPriority,
            start: titleRevealStart,
            trigger,
         },
      });

      addCharReveal(timeline, chars);
   }

   function revealStep({ bodyLines, step, titleChars }: StepParts) {
      const timeline = gsap.timeline({
         scrollTrigger: {
            once: true,
            refreshPriority,
            start: wordRevealStart,
            trigger: step,
         },
      });

      addCharReveal(timeline, titleChars, { stagger: stepCharStagger });
      addWordReveal(timeline, bodyLines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         position: stepBodyDelay,
         stagger: lineRevealStagger,
      });
   }

   function showAll(elements: HTMLElement[]) {
      gsap.set(elements, { clearProps: "transform", visibility: "inherit" });
   }

   async function initialize(
      chars: HTMLElement[],
      titleParts: readonly SplitTextResult[],
      bodyParts: readonly SplitTextResult[],
   ) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const ScrollTrigger = await loadPlugin("ScrollTrigger");
      if (!ScrollTrigger || disposed) return;

      const root = toValue(scope);
      const title = root?.querySelector<HTMLElement>(selectors.title);
      if (!root || !title) return;

      const steps = [
         ...root.querySelectorAll<HTMLElement>(selectors.step),
      ].map<StepParts>((step, index) => ({
         bodyLines: bodyParts[index]?.lines ?? [],
         step,
         titleChars: titleParts[index]?.chars ?? [],
      }));

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               showAll([
                  ...chars,
                  ...steps.flatMap(({ bodyLines, titleChars }) => [
                     ...titleChars,
                     ...bodyLines,
                  ]),
               ]);
               return;
            }

            if (chars.length) revealTitleChars(chars, title);
            steps.forEach(revealStep);
         },
         scope,
      );

      await refresh();
   }

   watch(
      () =>
         [
            toValue(titleSplit),
            toValue(stepTitleSplits),
            toValue(stepBodySplits),
         ] as const,
      ([title, stepTitles, stepBodies]) => {
         if (
            title === undefined ||
            stepTitles.includes(undefined) ||
            stepBodies.includes(undefined)
         ) {
            return;
         }

         return initialize(
            title?.chars ?? [],
            stepTitles.filter((parts) => parts !== undefined),
            stepBodies.filter((parts) => parts !== undefined),
         );
      },
      { flush: "post", immediate: true },
   );

   onScopeDispose(() => {
      disposed = true;
   });
}
