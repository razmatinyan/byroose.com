import { nextTick, onScopeDispose, readonly, shallowRef, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import {
   imageParallaxEnd,
   imageParallaxScale,
   imageParallaxShift,
   imageParallaxStart,
} from "@/lib/image-parallax";
import type { SplitTextResult } from "@/lib/split-text";
import {
   addWordReveal,
   lineRevealDuration,
   lineRevealEase,
   lineRevealStagger,
   titleLineRevealOffset,
   titleLineRevealStagger,
   wordRevealDuration,
   wordRevealEase,
   wordRevealOffset,
   wordRevealStart,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitListSource = MaybeRefOrGetter<
   readonly (SplitTextResult | undefined)[]
>;

interface AboutSectionMotionOptions {
   textSplits?: SplitListSource;
}

const selectors = {
   media: "[data-about-media]",
   mediaLayer: "[data-about-media-layer]",
   rise: "[data-about-rise]",
   riseGroup: "[data-about-rise-group]",
   riseMask: "[data-about-rise-mask]",
   text: "[data-about-text]",
   title: "[data-about-title]",
   titleLine: "[data-about-title-line]",
   titleMask: "[data-about-title-mask]",
} as const;

const hiddenMediaClip = "inset(0% 0% 100% 0%)";
const visibleMediaClip = "inset(0% 0% 0% 0%)";
const mediaRevealDuration = 1.2;
const mediaRevealEase = "power3.inOut";
const riseStagger = 0.08;

function queryAll(root: HTMLElement, selector: string) {
   return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function useAboutSectionMotion(
   scope: MotionScope,
   { textSplits = [] }: AboutSectionMotionOptions = {},
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   const titleRevealed = shallowRef(false);
   let disposed = false;
   let initialized = false;

   function revealTitle(title: HTMLElement) {
      const lines = queryAll(title, selectors.titleLine);
      const masks = queryAll(title, selectors.titleMask);
      if (!lines.length) {
         titleRevealed.value = true;
         return;
      }

      gsap.set(masks, { clipPath: "inset(0)" });
      gsap.set(lines, { yPercent: titleLineRevealOffset });
      gsap
         .timeline({
            onComplete: () => {
               gsap.set([...lines, ...masks], {
                  clearProps: "clipPath,transform",
               });
               titleRevealed.value = true;
            },
            scrollTrigger: {
               once: true,
               start: wordRevealStart,
               trigger: title,
            },
         })
         .to(lines, {
            duration: wordRevealDuration,
            ease: wordRevealEase,
            stagger: titleLineRevealStagger,
            yPercent: 0,
         });
   }

   function revealMedia(frame: HTMLElement) {
      gsap.fromTo(
         frame,
         { clipPath: hiddenMediaClip },
         {
            clearProps: "clipPath",
            clipPath: visibleMediaClip,
            duration: mediaRevealDuration,
            ease: mediaRevealEase,
            scrollTrigger: {
               once: true,
               start: wordRevealStart,
               trigger: frame,
            },
         },
      );

      const layer = frame.querySelector<HTMLElement>(selectors.mediaLayer);
      if (!layer) return;

      gsap.set(layer, { scale: imageParallaxScale });
      gsap.fromTo(
         layer,
         { yPercent: -imageParallaxShift },
         {
            ease: "none",
            scrollTrigger: {
               end: imageParallaxEnd,
               scrub: true,
               start: imageParallaxStart,
               trigger: frame,
            },
            yPercent: imageParallaxShift,
         },
      );
   }

   function revealRiseGroup(group: HTMLElement) {
      const items = queryAll(group, selectors.rise);
      const masks = queryAll(group, selectors.riseMask);
      if (!items.length) return;

      gsap.set(masks, { clipPath: "inset(0)" });
      gsap.set(items, { yPercent: wordRevealOffset });
      gsap
         .timeline({
            onComplete: () => {
               gsap.set([...items, ...masks], {
                  clearProps: "clipPath,transform",
               });
            },
            scrollTrigger: {
               once: true,
               start: wordRevealStart,
               trigger: group,
            },
         })
         .to(items, {
            duration: wordRevealDuration,
            ease: wordRevealEase,
            stagger: riseStagger,
            yPercent: 0,
         });
   }

   function revealText(element: HTMLElement, lines: HTMLElement[]) {
      if (!lines.length) return;

      const timeline = gsap.timeline({
         scrollTrigger: {
            once: true,
            start: wordRevealStart,
            trigger: element,
         },
      });

      addWordReveal(timeline, lines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         stagger: lineRevealStagger,
      });
   }

   function showLines(lines: HTMLElement[]) {
      if (!lines.length) return;

      gsap.set(lines, { clearProps: "transform", visibility: "inherit" });
   }

   async function initialize(textLines: HTMLElement[][]) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const ScrollTrigger = await loadPlugin("ScrollTrigger");
      const root = toValue(scope);
      if (!ScrollTrigger || !root || disposed) return;

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               showLines(textLines.flat());
               titleRevealed.value = true;
               return;
            }

            const title = root.querySelector<HTMLElement>(selectors.title);
            if (title) revealTitle(title);
            else titleRevealed.value = true;

            queryAll(root, selectors.media).forEach(revealMedia);
            queryAll(root, selectors.riseGroup).forEach(revealRiseGroup);
            queryAll(root, selectors.text).forEach((element, index) =>
               revealText(element, textLines[index] ?? []),
            );
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

   return { titleRevealed: readonly(titleRevealed) };
}
