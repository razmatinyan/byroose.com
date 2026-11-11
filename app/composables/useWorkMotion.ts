import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { addCharReveal } from "@/lib/char-reveal";
import {
   imageParallaxEnd,
   imageParallaxScale,
   imageParallaxShiftFor,
   imageParallaxStart,
} from "@/lib/image-parallax";
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
   more: "[data-work-more]",
   morePanel: "[data-work-more-panel]",
   reveal: "[data-work-case-reveal]",
} as const;

const revealStart = "top 90%";
const lineDuration = 0.8;
const lineStagger = 0.08;
const caseListLag = 0.7;
const caseListFadeStart = 0.3;

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

   function revealTitleChars(chars: HTMLElement[], trigger: HTMLElement) {
      if (!chars.length) return;

      const timeline = gsap.timeline({
         scrollTrigger: {
            once: true,
            start: revealStart,
            trigger,
         },
      });

      addCharReveal(timeline, chars);
   }

   function showTitleChars(chars: HTMLElement[]) {
      if (!chars.length) return;

      gsap.set(chars, {
         clearProps: "transform",
         visibility: "inherit",
      });
   }

   function readImageScale(image: HTMLElement) {
      const scale = Number(image.dataset.workCaseImageScale);
      return scale > 1 ? scale : imageParallaxScale;
   }

   function parallaxImage(image: HTMLElement, trigger: HTMLElement) {
      const scale = readImageScale(image);
      const shift = imageParallaxShiftFor(scale);

      gsap.set(image, { scale });

      gsap.fromTo(
         image,
         { yPercent: -shift },
         {
            ease: "none",
            scrollTrigger: {
               end: imageParallaxEnd,
               scrub: true,
               start: imageParallaxStart,
               trigger,
            },
            yPercent: shift,
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
      const lines = [
         ...caseElement.querySelectorAll<HTMLElement>(selectors.reveal),
      ];

      if (image) parallaxImage(image, caseElement);
      if (!lines.length) return;

      const timeline = gsap.timeline({
         scrollTrigger: {
            once: true,
            start: revealStart,
            trigger: caseElement,
         },
      });

      revealLines(timeline, lines, 0);
   }

   function handOffToPanel(root: HTMLElement) {
      const caseList = root.querySelector<HTMLElement>(selectors.caseList);
      const lastCase = [
         ...root.querySelectorAll<HTMLElement>(selectors.case),
      ].at(-1);
      const more = root.querySelector<HTMLElement>(selectors.more);
      const panel = more?.querySelector<HTMLElement>(selectors.morePanel);
      if (!caseList || !lastCase || !more || !panel) return;

      gsap.set(more, { "--more-works-runway": 1 });

      const timeline = gsap.timeline({
         defaults: { duration: 1, ease: "none" },
         scrollTrigger: {
            end: "top top",
            endTrigger: more,
            invalidateOnRefresh: true,
            refreshPriority: 2,
            scrub: true,
            start: () =>
               documentTop(lastCase) +
               lastCase.offsetHeight / 2 -
               window.innerHeight / 2,
         },
      });

      const handoffDistance = () => {
         const trigger = timeline.scrollTrigger;
         return trigger ? trigger.end - trigger.start : window.innerHeight;
      };

      timeline
         .to(caseList, { y: () => handoffDistance() * caseListLag }, 0)
         .fromTo(
            panel,
            { y: () => window.innerHeight - handoffDistance() },
            { y: 0 },
            0,
         )
         .to(
            caseList,
            { duration: 1 - caseListFadeStart, opacity: 0 },
            caseListFadeStart,
         );
   }

   async function initialize(titleChars: HTMLElement[]) {
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
               showTitleChars(titleChars);
               return;
            }

            revealTitleChars(titleChars, root);
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

         return initialize(parts?.chars ?? []);
      },
      { flush: "post", immediate: true },
   );

   onScopeDispose(() => {
      disposed = true;
   });
}
