import { onMounted, onScopeDispose, readonly, shallowRef, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
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
   media: "[data-services-hero-media]",
   mediaImage: "[data-services-hero-media-image]",
   reveal: "[data-services-hero-reveal]",
   titleLine: "[data-services-hero-title-line]",
   titleMask: "[data-services-hero-title-mask]",
} as const;

const mediaOpenProperty = "--services-hero-media-open";
const mediaRevealStart = 0.9;
const mediaRevealGap = 0.8;
const mediaRevealDuration = 1.1;
const mediaImageScale = 1.3;
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

   function openMedia(
      timeline: gsap.core.Timeline,
      frame: HTMLElement,
      position: number,
   ) {
      timeline.to(
         frame,
         {
            [mediaOpenProperty]: 1,
            duration: mediaRevealDuration,
            ease: swapEase,
         },
         position,
      );

      const image = frame.querySelector<HTMLElement>(selectors.mediaImage);
      if (!image) return;

      timeline.to(
         image,
         { duration: mediaRevealDuration, ease: swapEase, scale: 1 },
         position,
      );
   }

   function revealHero(root: HTMLElement) {
      const titleLines = queryAll(root, selectors.titleLine);
      const titleMasks = queryAll(root, selectors.titleMask);
      const revealTargets = queryAll(root, selectors.reveal);
      const media = queryAll(root, selectors.media);
      const mediaImages = queryAll(root, selectors.mediaImage);
      const animated = [
         ...titleLines,
         ...titleMasks,
         ...revealTargets,
         ...media,
         ...mediaImages,
      ];

      gsap.set(titleMasks, { clipPath: "inset(0)" });
      gsap.set(titleLines, { yPercent: titleLineRevealOffset });
      gsap.set(media, { [mediaOpenProperty]: 0 });
      gsap.set(mediaImages, { scale: mediaImageScale });
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

      media.forEach((frame, index) =>
         openMedia(timeline, frame, mediaRevealStart + index * mediaRevealGap),
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
