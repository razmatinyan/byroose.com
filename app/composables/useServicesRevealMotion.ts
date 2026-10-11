import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { SplitTextResult } from "@/lib/split-text";
import {
   addWordReveal,
   lineRevealDuration,
   lineRevealEase,
   lineRevealStagger,
   wordRevealDuration,
   wordRevealEase,
   wordRevealStart,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitListSource = MaybeRefOrGetter<
   readonly (SplitTextResult | undefined)[]
>;

const selectors = {
   backdrop: "[data-services-reveal-backdrop]",
   rise: "[data-services-reveal-rise]",
   text: "[data-services-reveal-text]",
} as const;

const backdropLeadProperty = "--services-reveal-backdrop-lead";
const backdropRiseLength = 0.8;
const backdropRadius = 32;
const riseDelay = 0.3;

function queryAll(root: HTMLElement, selector: string) {
   return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function useServicesRevealMotion(
   scope: MotionScope,
   textSplits: SplitListSource,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let initialized = false;

   function revealLines(text: HTMLElement, lines: HTMLElement[]) {
      if (!lines.length) return;

      const timeline = gsap.timeline({
         scrollTrigger: {
            once: true,
            start: wordRevealStart,
            trigger: text,
         },
      });

      addWordReveal(timeline, lines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         stagger: lineRevealStagger,
      });
   }

   function revealRise(item: HTMLElement) {
      const timeline = gsap.timeline({
         scrollTrigger: {
            once: true,
            start: wordRevealStart,
            trigger: item,
         },
      });

      addWordReveal(timeline, [item], {
         duration: wordRevealDuration,
         ease: wordRevealEase,
         position: riseDelay,
      });
   }

   function riseBackdrop(root: HTMLElement, backdrop: HTMLElement) {
      gsap.set(root, { [backdropLeadProperty]: 1 });

      const lead = () => -backdrop.offsetTop;
      const halfWidth = () => backdrop.offsetWidth / 2;
      const restingTop = () =>
         Math.max(0, lead() - window.innerHeight * (1 - backdropRiseLength));

      gsap.fromTo(
         backdrop,
         {
            clipPath: () =>
               `inset(${lead()}px ${halfWidth()}px ${backdrop.offsetHeight - lead()}px ${halfWidth()}px round ${backdropRadius}px)`,
         },
         {
            clipPath: () => `inset(${restingTop()}px 0px 0px 0px round 0px)`,
            ease: "none",
            scrollTrigger: {
               end: `top ${(1 - backdropRiseLength) * 100}%`,
               invalidateOnRefresh: true,
               scrub: true,
               start: "top bottom",
               trigger: root,
            },
         },
      );
   }

   async function initialize(textLines: HTMLElement[][]) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const ScrollTrigger = await loadPlugin("ScrollTrigger");
      const root = toValue(scope);
      if (!ScrollTrigger || !root || disposed) return;

      const texts = queryAll(root, selectors.text);
      const rises = queryAll(root, selectors.rise);
      const backdrop = root.querySelector<HTMLElement>(selectors.backdrop);

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               const shown = [...textLines.flat(), ...rises];
               if (shown.length) gsap.set(shown, { visibility: "inherit" });
               return;
            }

            if (backdrop) riseBackdrop(root, backdrop);
            texts.forEach((text, index) =>
               revealLines(text, textLines[index] ?? []),
            );
            rises.forEach(revealRise);
         },
         scope,
      );

      await refresh();
   }

   watch(
      () => toValue(textSplits),
      (splits) => {
         if (splits.includes(undefined)) return;

         return initialize(splits.map((parts) => parts?.lines ?? []));
      },
      { flush: "post", immediate: true },
   );

   onScopeDispose(() => {
      disposed = true;
   });
}
