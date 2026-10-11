import { onMounted, onScopeDispose, readonly, shallowRef, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { until } from "@vueuse/core";
import type { SplitTextResult } from "@/lib/split-text";
import { swapEase } from "@/lib/swap-timing";
import {
   titleLineRevealOffset,
   titleLineRevealStagger,
   wordRevealDuration,
   wordRevealEase,
   wordRevealOffset,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;

const selectors = {
   content: "[data-about-hero-content]",
   drift: "[data-about-hero-drift], [data-about-title-text], [data-about-title-inset]",
   inset: "[data-about-title-inset]",
   insetContent: "[data-about-title-inset-content]",
   reveal: "[data-about-hero-reveal]",
   titleLine: "[data-about-title-line]",
   titleMask: "[data-about-title-mask]",
} as const;

const descriptionLineStagger = 0.06;
const descriptionStart = 0.35;
const heroDrift = 0.5;
const insetOpenProperty = "--about-title-inset-open";
const insetRevealStart = 0.3;
const insetRevealDuration = 1.1;
const insetContentScale = 1.3;

function queryAll(root: HTMLElement, selector: string) {
   return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function useAboutHeroMotion(
   scope: MotionScope,
   descriptionSplit: SplitSource,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   const { waitForReveal } = usePageTransition();
   const revealed = shallowRef(false);
   let disposed = false;

   function revealHero(root: HTMLElement, descriptionLines: HTMLElement[]) {
      const titleLines = queryAll(root, selectors.titleLine);
      const titleMasks = queryAll(root, selectors.titleMask);
      const revealTargets = queryAll(root, selectors.reveal);
      const insets = queryAll(root, selectors.inset);
      const insetContents = queryAll(root, selectors.insetContent);
      const animated = [
         ...titleLines,
         ...titleMasks,
         ...descriptionLines,
         ...revealTargets,
         ...insets,
         ...insetContents,
      ];

      gsap.set(titleMasks, { overflow: "clip" });
      gsap.set(titleLines, {
         position: "relative",
         top: (_index: number, line: HTMLElement) =>
            (line.offsetHeight * titleLineRevealOffset) / 100,
      });
      gsap.set(descriptionLines, { yPercent: wordRevealOffset });
      gsap.set(insets, { [insetOpenProperty]: 0 });
      gsap.set(insetContents, { scale: insetContentScale });
      gsap.set(revealTargets, { visibility: "inherit" });

      const timeline = gsap
         .timeline({
            defaults: { duration: wordRevealDuration, ease: wordRevealEase },
            onComplete: () => {
               revealed.value = true;
               gsap.set(animated, { clearProps: "all" });
            },
         })
         .to(titleLines, { stagger: titleLineRevealStagger, top: 0 }, 0)
         .to(
            descriptionLines,
            { stagger: descriptionLineStagger, yPercent: 0 },
            descriptionStart,
         );

      if (!insets.length) return;

      const insetReveal = {
         duration: insetRevealDuration,
         ease: swapEase,
      };

      timeline
         .to(insets, { ...insetReveal, [insetOpenProperty]: 1 }, insetRevealStart)
         .to(insetContents, { ...insetReveal, scale: 1 }, insetRevealStart);
   }

   function driftHero(root: HTMLElement) {
      const content = root.querySelector<HTMLElement>(selectors.content);
      const faded = queryAll(root, selectors.drift);
      if (!content) return;

      const scrollTrigger = {
         end: "bottom top",
         invalidateOnRefresh: true,
         scrub: true,
         start: 0,
         trigger: root,
      };

      gsap.fromTo(
         content,
         { top: 0 },
         {
            ease: "none",
            top: () => root.offsetHeight * heroDrift,
            scrollTrigger,
         },
      );

      if (!faded.length) return;

      gsap.fromTo(
         faded,
         { opacity: 1 },
         { ease: "none", opacity: 0, scrollTrigger },
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
