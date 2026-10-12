import { onMounted, onScopeDispose, readonly, shallowRef, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { until } from "@vueuse/core";
import {
   charRevealDuration,
   charRevealEase,
   charRevealStagger,
} from "@/lib/char-reveal";
import type { SplitTextResult } from "@/lib/split-text";
import {
   revealMaskClip,
   titleLineRevealOffset,
   wordRevealDuration,
   wordRevealEase,
   wordRevealOffset,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;

const selectors = {
   content: "[data-work-hero-content]",
   reveal: "[data-work-hero-reveal]",
   titleChar: "[data-work-hero-title-char]",
   titleMask: "[data-work-hero-title-mask]",
} as const;

const descriptionLineStagger = 0.06;
const descriptionStart = 0.35;
const heroDrift = 0.5;

function queryAll(root: HTMLElement, selector: string) {
   return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function useWorkHeroMotion(
   scope: MotionScope,
   descriptionSplit: SplitSource,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   const { waitForReveal } = usePageTransition();
   const revealed = shallowRef(false);
   let disposed = false;

   function revealHero(root: HTMLElement, descriptionLines: HTMLElement[]) {
      const titleChars = queryAll(root, selectors.titleChar);
      const titleMasks = queryAll(root, selectors.titleMask);
      const revealTargets = queryAll(root, selectors.reveal);
      const animated = [
         ...titleChars,
         ...titleMasks,
         ...descriptionLines,
         ...revealTargets,
      ];

      gsap.set(titleMasks, { clipPath: revealMaskClip });
      gsap.set(titleChars, { yPercent: titleLineRevealOffset });
      gsap.set(descriptionLines, { yPercent: wordRevealOffset });
      gsap.set(revealTargets, { visibility: "inherit" });

      gsap
         .timeline({
            defaults: { duration: wordRevealDuration, ease: wordRevealEase },
            onComplete: () => {
               revealed.value = true;
               gsap.set(animated, { clearProps: "all" });
            },
         })
         .to(
            titleChars,
            {
               duration: charRevealDuration,
               ease: charRevealEase,
               stagger: charRevealStagger,
               yPercent: 0,
            },
            0,
         )
         .to(
            descriptionLines,
            { stagger: descriptionLineStagger, yPercent: 0 },
            descriptionStart,
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
      const [split, ScrollTrigger] = await Promise.all([
         until(() => toValue(descriptionSplit)).not.toBeUndefined(),
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

            if (!revealed.value) revealHero(root, split?.lines ?? []);
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
