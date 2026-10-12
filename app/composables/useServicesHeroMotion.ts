import { onMounted, onScopeDispose, readonly, shallowRef, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import {
   servicesHeroInsetContentScale,
   servicesHeroInsetDuration,
   servicesHeroInsetOpenProperty,
} from "@/lib/services-hero";
import { swapEase } from "@/lib/swap-timing";
import {
   titleLineRevealOffset,
   titleLineRevealStagger,
   wordRevealDuration,
   wordRevealEase,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;

const selectors = {
   content: "[data-services-hero-content]",
   inset: "[data-services-hero-inset]",
   insetContent: "[data-services-hero-inset-content]",
   reveal: "[data-services-hero-reveal]",
   titleLine: "[data-services-hero-title-line]",
   titleMask: "[data-services-hero-title-mask]",
} as const;

const insetRevealStart = 0.3;
const insetRevealGap = 0.3;
const heroDrift = 0.5;

function queryAll(root: HTMLElement, selector: string) {
   return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function useServicesHeroMotion(scope: MotionScope) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   const { waitForReveal } = usePageTransition();
   const revealed = shallowRef(false);
   let disposed = false;

   function openInset(
      timeline: gsap.core.Timeline,
      frame: HTMLElement,
      position: number,
   ) {
      timeline.to(
         frame,
         {
            [servicesHeroInsetOpenProperty]: 1,
            duration: servicesHeroInsetDuration,
            ease: swapEase,
         },
         position,
      );

      const content = frame.querySelector<HTMLElement>(selectors.insetContent);
      if (!content) return;

      timeline.to(
         content,
         { duration: servicesHeroInsetDuration, ease: swapEase, scale: 1 },
         position,
      );
   }

   function revealHero(root: HTMLElement) {
      const titleLines = queryAll(root, selectors.titleLine);
      const titleMasks = queryAll(root, selectors.titleMask);
      const revealTargets = queryAll(root, selectors.reveal);
      const insets = queryAll(root, selectors.inset);
      const insetContents = queryAll(root, selectors.insetContent);
      const animated = [
         ...titleLines,
         ...titleMasks,
         ...revealTargets,
         ...insets,
         ...insetContents,
      ];

      gsap.set(titleMasks, { clipPath: "inset(0)" });
      gsap.set(titleLines, { yPercent: titleLineRevealOffset });
      gsap.set(insets, { [servicesHeroInsetOpenProperty]: 0 });
      gsap.set(insetContents, { scale: servicesHeroInsetContentScale });
      gsap.set(revealTargets, { visibility: "inherit" });

      const timeline = gsap
         .timeline({
            onComplete: () => {
               revealed.value = true;
               gsap.set(animated, { clearProps: "all" });
            },
         })
         .to(
            titleLines,
            {
               duration: wordRevealDuration,
               ease: wordRevealEase,
               stagger: titleLineRevealStagger,
               yPercent: 0,
            },
            0,
         );

      insets.forEach((frame, index) =>
         openInset(timeline, frame, insetRevealStart + index * insetRevealGap),
      );
   }

   function driftHero(root: HTMLElement) {
      const content = root.querySelector<HTMLElement>(selectors.content);
      if (!content) return;

      gsap.fromTo(
         content,
         { opacity: 1, y: 0 },
         {
            ease: "none",
            opacity: 0,
            y: () => root.offsetHeight * heroDrift,
            scrollTrigger: {
               end: "bottom top",
               invalidateOnRefresh: true,
               scrub: true,
               start: 0,
               trigger: root,
            },
         },
      );
   }

   onMounted(async () => {
      const [, ScrollTrigger] = await Promise.all([
         document.fonts.ready,
         loadPlugin("ScrollTrigger"),
         waitForReveal(),
      ]);
      const root = toValue(scope);
      if (disposed) return;

      if (!root || !ScrollTrigger) {
         revealed.value = true;
         return;
      }

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               revealed.value = true;
               return;
            }

            if (!revealed.value) revealHero(root);
            driftHero(root);
         },
         scope,
      );

      await refresh();
   });

   onScopeDispose(() => {
      disposed = true;
   });

   return { revealed: readonly(revealed) };
}
