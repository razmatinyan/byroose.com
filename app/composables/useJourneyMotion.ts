import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { SplitTextResult } from "@/lib/split-text";
import {
   addWordReveal,
   lineRevealDuration,
   lineRevealEase,
   lineRevealStagger,
   wordRevealOffset,
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
   slide: HTMLElement;
   titleLines: HTMLElement[];
}

type StepText = "body" | "title";

const selectors = {
   card: "[data-journey-slide-card]",
   copy: "[data-journey-step-copy]",
   cta: "[data-journey-step-cta]",
   ctaMask: "[data-journey-step-cta-mask]",
   frame: "[data-journey-slide-frame]",
   media: "[data-journey-step-media]",
   number: "[data-journey-step-number]",
   slide: "[data-journey-slide]",
   stepTitle: "[data-journey-step-title]",
   title: "[data-journey-title]",
} as const;

const refreshPriority = -2;
const titleRevealStart = "top 85%";
const titleCharFrom = {
   rotation: -24,
   scale: 0,
   transformOrigin: "50% 0%",
   yPercent: -110,
};
const titleCharDuration = 1.1;
const titleCharStagger = 0.045;
const titleCharEase = "power3.out";
const mediaRevealDuration = 1.2;
const mediaRevealEase = "power3.inOut";
const hiddenMediaClip = "inset(100% 0% 0% 0%)";
const visibleMediaClip = "inset(0% 0% 0% 0%)";
const stackScale = 0.7;
const stackTiltX = 40;
const stackMaxTiltZ = 5;
const stackEase = "power1.in";
const stackFadeAt = 0.75;
const stackFadeEase = "power1.inOut";

export function useJourneyMotion(
   scope: MotionScope,
   { stepBodySplits, stepTitleSplits, titleSplit }: JourneyMotionTargets,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let initialized = false;
   let ready = false;
   let reducedMotion = false;
   let motionContext: gsap.Context | null = null;
   let steps: StepParts[] = [];
   const textTimelines: Record<
      StepText,
      Map<HTMLElement, gsap.core.Timeline>
   > = { body: new Map(), title: new Map() };
   const revealedTexts: Record<StepText, WeakSet<HTMLElement>> = {
      body: new WeakSet(),
      title: new WeakSet(),
   };

   function spawnTitleChars(chars: HTMLElement[], trigger: HTMLElement) {
      if (!chars.length) return;

      gsap
         .timeline({
            scrollTrigger: {
               once: true,
               refreshPriority,
               start: titleRevealStart,
               trigger,
            },
         })
         .set(chars, { visibility: "inherit" }, 0)
         .fromTo(
            chars,
            titleCharFrom,
            {
               duration: titleCharDuration,
               ease: titleCharEase,
               rotation: 0,
               scale: 1,
               stagger: titleCharStagger,
               yPercent: 0,
            },
            0,
         );
   }

   function textTrigger(slide: HTMLElement) {
      return slide.querySelector<HTMLElement>(selectors.stepTitle) ?? slide;
   }

   function revealNumber({ slide }: StepParts) {
      const number = slide.querySelector<HTMLElement>(selectors.number);
      if (!number) return;

      const timeline = gsap.timeline({
         scrollTrigger: {
            once: true,
            refreshPriority,
            start: wordRevealStart,
            trigger: textTrigger(slide),
         },
      });

      addWordReveal(timeline, [number], {
         duration: lineRevealDuration,
         ease: lineRevealEase,
      });
   }

   function revealTitle({ slide, titleLines }: StepParts) {
      const title = slide.querySelector<HTMLElement>(selectors.stepTitle);
      if (!title || !titleLines.length) return;

      const timeline = gsap.timeline({
         onStart: () => revealedTexts.title.add(slide),
         scrollTrigger: {
            once: true,
            refreshPriority,
            start: wordRevealStart,
            trigger: title,
         },
      });

      addWordReveal(timeline, titleLines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         stagger: lineRevealStagger,
      });
      textTimelines.title.set(slide, timeline);
   }

   function revealBody({ bodyLines, slide }: StepParts) {
      const copy = slide.querySelector<HTMLElement>(selectors.copy);
      if (!copy || !bodyLines.length) return;

      const timeline = gsap.timeline({
         onStart: () => revealedTexts.body.add(slide),
         scrollTrigger: {
            once: true,
            refreshPriority,
            start: wordRevealStart,
            trigger: textTrigger(slide),
         },
      });

      addWordReveal(timeline, bodyLines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         stagger: lineRevealStagger,
      });

      const ctaMask = slide.querySelector<HTMLElement>(selectors.ctaMask);
      const cta = slide.querySelector<HTMLElement>(selectors.cta);
      if (ctaMask && cta) {
         gsap.set(ctaMask, { clipPath: "inset(0)" });
         gsap.set(cta, { yPercent: wordRevealOffset });
         timeline
            .to(
               cta,
               {
                  clearProps: "transform",
                  duration: lineRevealDuration,
                  ease: lineRevealEase,
                  yPercent: 0,
               },
               0,
            )
            .set(ctaMask, { clearProps: "clipPath" });
      }

      textTimelines.body.set(slide, timeline);
   }

   function revealMedia({ slide }: StepParts) {
      const media = slide.querySelector<HTMLElement>(selectors.media);
      if (!media) return;

      gsap.fromTo(
         media,
         { clipPath: hiddenMediaClip },
         {
            clearProps: "clipPath",
            clipPath: visibleMediaClip,
            duration: mediaRevealDuration,
            ease: mediaRevealEase,
            scrollTrigger: {
               once: true,
               refreshPriority,
               start: wordRevealStart,
               trigger: media,
            },
         },
      );
   }

   function stackSlide({ slide }: StepParts) {
      const frame = slide.querySelector<HTMLElement>(selectors.frame);
      const card = slide.querySelector<HTMLElement>(selectors.card);
      if (!frame || !card) return;

      gsap
         .timeline({
            scrollTrigger: {
               end: "+=100%",
               pin: frame,
               pinSpacing: false,
               refreshPriority,
               scrub: true,
               start: "top top",
               trigger: slide,
            },
         })
         .to(
            card,
            {
               duration: 1,
               ease: stackEase,
               rotationX: stackTiltX,
               rotationZ: gsap.utils.random(-stackMaxTiltZ, stackMaxTiltZ),
               scale: stackScale,
            },
            0,
         )
         .to(
            card,
            {
               autoAlpha: 0,
               duration: 1 - stackFadeAt,
               ease: stackFadeEase,
            },
            stackFadeAt,
         );
   }

   function showAll(elements: HTMLElement[]) {
      if (!elements.length) return;

      gsap.set(elements, {
         clearProps: "transform",
         visibility: "inherit",
      });
   }

   function replaceLines(
      text: StepText,
      index: number,
      lines: HTMLElement[],
   ) {
      const parts = steps[index];
      if (!parts) return;

      if (text === "title") parts.titleLines = lines;
      else parts.bodyLines = lines;

      const context = motionContext;

      if (reducedMotion || !context || revealedTexts[text].has(parts.slide)) {
         showAll(lines);
         return;
      }

      const previous = textTimelines[text].get(parts.slide);
      previous?.scrollTrigger?.kill();
      previous?.kill();
      context.add(() =>
         text === "title" ? revealTitle(parts) : revealBody(parts),
      );
   }

   function watchResplits(text: StepText, source: SplitListSource) {
      watch(
         () => toValue(source),
         (next, previous) => {
            if (!ready) return;

            next.forEach((parts, index) => {
               if (parts && parts !== previous?.[index]) {
                  replaceLines(text, index, parts.lines);
               }
            });
         },
         { flush: "post" },
      );
   }

   async function initialize(
      titleChars: HTMLElement[],
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

      steps = [...root.querySelectorAll<HTMLElement>(selectors.slide)].map(
         (slide, index) => ({
            bodyLines: bodyParts[index]?.lines ?? [],
            slide,
            titleLines: titleParts[index]?.lines ?? [],
         }),
      );

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            motionContext = context;
            reducedMotion = Boolean(context.conditions?.reduceMotion);

            if (reducedMotion) {
               showAll([
                  ...titleChars,
                  ...steps.flatMap(({ bodyLines, slide, titleLines }) => [
                     ...slide.querySelectorAll<HTMLElement>(selectors.number),
                     ...titleLines,
                     ...bodyLines,
                  ]),
               ]);
               return;
            }

            spawnTitleChars(titleChars, title);
            steps.forEach((step, index) => {
               if (index < steps.length - 1) stackSlide(step);
               revealNumber(step);
               revealTitle(step);
               revealMedia(step);
               revealBody(step);
            });
         },
         scope,
      );

      ready = true;
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

   watchResplits("title", stepTitleSplits);
   watchResplits("body", stepBodySplits);

   onScopeDispose(() => {
      disposed = true;
   });
}
