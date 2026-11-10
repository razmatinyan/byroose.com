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
   descriptionSplit: SplitSource;
   stepBodySplits: SplitListSource;
   stepTitleSplits: SplitListSource;
   titleSplit: SplitSource;
}

interface StepParts {
   bodyLines: HTMLElement[];
   step: HTMLElement;
   titleChars: HTMLElement[];
}

interface ChartParts {
   bars: HTMLElement[];
   chart: HTMLElement;
   lines: HTMLElement[];
   numbers: HTMLElement[];
}

const selectors = {
   bar: "[data-journey-bar]",
   chart: "[data-journey-chart]",
   heading: "[data-journey-heading]",
   line: "[data-journey-line]",
   number: "[data-journey-number]",
   step: "[data-journey-step]",
} as const;

const refreshPriority = -2;
const headingRevealStart = "top 85%";
const titleWordStagger = 0.08;
const descriptionDelay = 0.3;
const stepCharStagger = 0.02;
const stepBodyDelay = 0.2;
const lineDrawDuration = 1.2;
const lineDrawEase = "power3.inOut";
const lineStagger = 0.04;
const numberDelay = 0.35;
const numberStagger = 0.03;
const numberOffset = 60;
const barsDelay = 0.5;
const barStagger = 0.15;
const barHiddenClip = "inset(0 100% 0 0)";
const barShownClip = "inset(0 0% 0 0)";
const stepsDelay = 0.9;
const stepStagger = 0.12;

export function useJourneyMotion(
   scope: MotionScope,
   {
      descriptionSplit,
      stepBodySplits,
      stepTitleSplits,
      titleSplit,
   }: JourneyMotionTargets,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let initialized = false;

   function createTimeline(trigger: HTMLElement, start = wordRevealStart) {
      return gsap.timeline({
         scrollTrigger: { once: true, refreshPriority, start, trigger },
      });
   }

   function revealHeading(
      trigger: HTMLElement,
      title: SplitTextResult,
      description: SplitTextResult,
   ) {
      const timeline = createTimeline(trigger, headingRevealStart);

      if (title?.chars.length) addCharReveal(timeline, title.chars);
      else addWordReveal(timeline, title?.words ?? [], {
         stagger: titleWordStagger,
      });

      addWordReveal(timeline, description?.lines ?? [], {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         position: descriptionDelay,
         stagger: lineRevealStagger,
      });
   }

   function addStepReveal(
      timeline: gsap.core.Timeline,
      { bodyLines, titleChars }: StepParts,
      position: number,
   ) {
      addCharReveal(timeline, titleChars, {
         position,
         stagger: stepCharStagger,
      });
      addWordReveal(timeline, bodyLines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         position: position + stepBodyDelay,
         stagger: lineRevealStagger,
      });
   }

   function revealChart({ bars, chart, lines, numbers }: ChartParts) {
      const timeline = createTimeline(chart);

      timeline
         .fromTo(
            lines,
            { scaleY: 0 },
            {
               duration: lineDrawDuration,
               ease: lineDrawEase,
               scaleY: 1,
               stagger: lineStagger,
            },
            0,
         )
         .fromTo(
            numbers,
            { autoAlpha: 0, yPercent: numberOffset },
            {
               autoAlpha: 1,
               duration: lineRevealDuration,
               ease: lineRevealEase,
               stagger: numberStagger,
               yPercent: 0,
            },
            numberDelay,
         )
         .fromTo(
            bars,
            { clipPath: barHiddenClip },
            {
               clipPath: barShownClip,
               duration: lineRevealDuration,
               ease: lineRevealEase,
               stagger: barStagger,
            },
            barsDelay,
         );

      return timeline;
   }

   function showAll(elements: HTMLElement[]) {
      gsap.set(elements, { clearProps: "transform", visibility: "inherit" });
   }

   async function initialize(
      heading: SplitTextResult,
      description: SplitTextResult,
      titleParts: readonly SplitTextResult[],
      bodyParts: readonly SplitTextResult[],
   ) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const ScrollTrigger = await loadPlugin("ScrollTrigger");
      if (!ScrollTrigger || disposed) return;

      const root = toValue(scope);
      const headingBlock = root?.querySelector<HTMLElement>(selectors.heading);
      const chart = root?.querySelector<HTMLElement>(selectors.chart);
      if (!root || !headingBlock || !chart) return;

      const chartParts: ChartParts = {
         bars: [...root.querySelectorAll<HTMLElement>(selectors.bar)],
         chart,
         lines: [...root.querySelectorAll<HTMLElement>(selectors.line)],
         numbers: [...root.querySelectorAll<HTMLElement>(selectors.number)],
      };
      const steps = [
         ...root.querySelectorAll<HTMLElement>(selectors.step),
      ].map<StepParts>((step, index) => ({
         bodyLines: bodyParts[index]?.lines ?? [],
         step,
         titleChars: titleParts[index]?.chars ?? [],
      }));

      createMatchMedia(
         {
            narrow: "(prefers-reduced-motion: no-preference) and (max-width: 767.98px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
            wide: "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               showAll([
                  ...(heading?.chars ?? []),
                  ...(heading?.words ?? []),
                  ...(description?.lines ?? []),
                  ...steps.flatMap(({ bodyLines, titleChars }) => [
                     ...titleChars,
                     ...bodyLines,
                  ]),
               ]);
               return;
            }

            revealHeading(headingBlock, heading, description);
            const chartTimeline = revealChart(chartParts);

            if (context.conditions?.wide) {
               steps.forEach((step, index) =>
                  addStepReveal(
                     chartTimeline,
                     step,
                     stepsDelay + index * stepStagger,
                  ),
               );
               return;
            }

            steps.forEach((step) =>
               addStepReveal(createTimeline(step.step), step, 0),
            );
         },
         scope,
      );

      await refresh();
   }

   watch(
      () =>
         [
            toValue(titleSplit),
            toValue(descriptionSplit),
            toValue(stepTitleSplits),
            toValue(stepBodySplits),
         ] as const,
      ([title, description, stepTitles, stepBodies]) => {
         if (
            title === undefined ||
            description === undefined ||
            stepTitles.includes(undefined) ||
            stepBodies.includes(undefined)
         ) {
            return;
         }

         return initialize(
            title,
            description,
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
