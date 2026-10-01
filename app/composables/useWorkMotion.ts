import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { addStackReveal } from "@/lib/stack-reveal";
import type { SplitTextResult } from "@/lib/split-text";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;

interface WorkMotionTargets {
   titleSplit: SplitSource;
}

const selectors = {
   case: "[data-work-case]",
   caseList: "[data-work-case-list]",
   image: "[data-work-case-image]",
   layer: "[data-work-case-layer]",
   more: "[data-work-more]",
   morePanel: "[data-work-more-panel]",
   reveal: "[data-work-case-reveal]",
} as const;

const revealStart = "top 90%";
const lineDuration = 0.8;
const lineStagger = 0.08;
const linesAtMedia = 0.1;
const parallaxScale = 1.3;
const parallaxShift = 14;
const caseListLag = 0.4;
const caseListFadeStart = 0.3;
const panelArrivalOffset = 20;

function documentTop(element: HTMLElement) {
   let top = 0;
   let node: HTMLElement | null = element;

   while (node) {
      top += node.offsetTop;
      node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
   }

   return top;
}

export function useWorkMotion(
   scope: MotionScope,
   { titleSplit }: WorkMotionTargets,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let initialized = false;

   function revealTitleWords(words: HTMLElement[], trigger: HTMLElement) {
      if (!words.length) return;

      gsap.set(words, {
         visibility: "inherit",
         yPercent: 115,
      });

      gsap.to(words, {
         duration: 1.2,
         ease: "power3.out",
         stagger: 0.095,
         scrollTrigger: {
            once: true,
            start: revealStart,
            trigger,
         },
         yPercent: 0,
      });
   }

   function showTitleWords(words: HTMLElement[]) {
      if (!words.length) return;

      gsap.set(words, {
         clearProps: "transform",
         visibility: "inherit",
      });
   }

   function parallaxImage(image: HTMLElement, trigger: HTMLElement) {
      gsap.set(image, { scale: parallaxScale });

      gsap.fromTo(
         image,
         { yPercent: -parallaxShift },
         {
            ease: "none",
            scrollTrigger: {
               end: "bottom top",
               scrub: true,
               start: "top bottom",
               trigger,
            },
            yPercent: parallaxShift,
         },
      );
   }

   function revealLines(
      timeline: gsap.core.Timeline,
      lines: HTMLElement[],
      position: number,
   ) {
      timeline.fromTo(
         lines,
         { yPercent: 115 },
         {
            duration: lineDuration,
            ease: "power3.out",
            stagger: lineStagger,
            yPercent: 0,
         },
         position,
      );
   }

   function revealCase(caseElement: HTMLElement) {
      const image = caseElement.querySelector<HTMLElement>(selectors.image);
      const layers = [
         ...caseElement.querySelectorAll<HTMLElement>(selectors.layer),
      ];
      const lines = [
         ...caseElement.querySelectorAll<HTMLElement>(selectors.reveal),
      ];

      if (image) parallaxImage(image, caseElement);
      if (!layers.length && !lines.length) return;

      gsap.set(layers, { scale: 0 });

      const timeline = gsap.timeline({
         scrollTrigger: {
            once: true,
            start: revealStart,
            trigger: caseElement,
         },
      });

      addStackReveal(timeline, layers);
      if (lines.length) {
         revealLines(timeline, lines, timeline.duration() * linesAtMedia);
      }
   }

   function handOffToPanel(root: HTMLElement) {
      const caseList = root.querySelector<HTMLElement>(selectors.caseList);
      const lastCase = [
         ...root.querySelectorAll<HTMLElement>(selectors.case),
      ].at(-1);
      const more = root.querySelector<HTMLElement>(selectors.more);
      const panel = more?.querySelector<HTMLElement>(selectors.morePanel);
      if (!caseList || !lastCase || !more || !panel) return;

      gsap.set(more, { "--more-works-overlap": panelArrivalOffset / 100 });

      gsap
         .timeline({
            defaults: { duration: 1, ease: "none" },
            scrollTrigger: {
               end: "top top",
               endTrigger: more,
               invalidateOnRefresh: true,
               scrub: true,
               start: () =>
                  documentTop(lastCase) +
                  lastCase.offsetHeight / 2 -
                  window.innerHeight / 2,
            },
         })
         .to(caseList, { y: () => window.innerHeight * caseListLag }, 0)
         .fromTo(panel, { yPercent: panelArrivalOffset }, { yPercent: 0 }, 0)
         .to(
            caseList,
            { duration: 1 - caseListFadeStart, opacity: 0 },
            caseListFadeStart,
         );
   }

   async function initialize(titleWords: HTMLElement[]) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const ScrollTrigger = await loadPlugin("ScrollTrigger");
      if (!ScrollTrigger || disposed) return;

      const root = toValue(scope);
      if (!root) return;

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               showTitleWords(titleWords);
               return;
            }

            revealTitleWords(titleWords, root);
            for (const caseElement of root.querySelectorAll<HTMLElement>(
               selectors.case,
            )) {
               revealCase(caseElement);
            }
            handOffToPanel(root);
         },
         scope,
      );

      await refresh();
   }

   watch(
      () => toValue(titleSplit),
      (parts) => {
         if (parts === undefined) return;

         return initialize(parts?.words ?? []);
      },
      { flush: "post", immediate: true },
   );

   onScopeDispose(() => {
      disposed = true;
   });
}
