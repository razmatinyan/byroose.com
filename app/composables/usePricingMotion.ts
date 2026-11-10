import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
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
type ScrollTriggerPlugin = typeof import("gsap/ScrollTrigger").ScrollTrigger;

interface PricingMotionTargets {
   activeCategory: MaybeRefOrGetter<string>;
   descriptionSplit: SplitSource;
   titleSplit: SplitSource;
}

const selectors = {
   activeCards: "[data-pricing-panel][data-state='active'] [data-pricing-card]",
   cards: "[data-pricing-card]",
   heading: "[data-pricing-heading]",
   panels: "[data-pricing-panels]",
   reveal: "[data-pricing-reveal]",
} as const;

const refreshPriority = -2;
const titleWordStagger = 0.08;
const descriptionDelay = 0.3;
const switcherDelay = 0.45;
const riseOffset = 48;
const cardStagger = 0.1;
const cardSwapOffset = 32;
const cardSwapDuration = 0.8;
const cardSwapStagger = 0.07;
const cardSwapEase = "power3.out";

export function usePricingMotion(
   scope: MotionScope,
   { activeCategory, descriptionSplit, titleSplit }: PricingMotionTargets,
) {
   const { createContext, createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   const preferredMotion = usePreferredReducedMotion();
   let disposed = false;
   let initialized = false;
   let swapContext: gsap.Context | null = null;

   function queryAll(root: HTMLElement, selector: string) {
      return [...root.querySelectorAll<HTMLElement>(selector)];
   }

   function showAll(elements: HTMLElement[]) {
      if (!elements.length) return;

      gsap.set(elements, {
         clearProps: "transform,opacity",
         visibility: "inherit",
      });
   }

   function revealHeading(
      root: HTMLElement,
      words: HTMLElement[],
      lines: HTMLElement[],
   ) {
      const heading = root.querySelector<HTMLElement>(selectors.heading);
      if (!heading) return;

      const timeline = gsap.timeline({
         scrollTrigger: {
            once: true,
            refreshPriority,
            start: wordRevealStart,
            trigger: heading,
         },
      });

      addWordReveal(timeline, words, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         stagger: titleWordStagger,
      });
      addWordReveal(timeline, lines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         position: descriptionDelay,
         stagger: lineRevealStagger,
      });
      timeline.fromTo(
         queryAll(root, selectors.reveal),
         { autoAlpha: 0, y: riseOffset },
         {
            autoAlpha: 1,
            clearProps: "transform,opacity",
            duration: lineRevealDuration,
            ease: lineRevealEase,
            y: 0,
         },
         switcherDelay,
      );
   }

   function revealCards(root: HTMLElement, scrollTrigger: ScrollTriggerPlugin) {
      const panels = root.querySelector<HTMLElement>(selectors.panels);
      if (!panels) return;

      scrollTrigger.create({
         once: true,
         refreshPriority,
         start: wordRevealStart,
         trigger: panels,
         onEnter: () => {
            const activeCards = queryAll(root, selectors.activeCards);
            const restingCards = queryAll(root, selectors.cards).filter(
               (card) => !activeCards.includes(card),
            );

            showAll(restingCards);
            gsap.fromTo(
               activeCards,
               { autoAlpha: 0, y: riseOffset * 2 },
               {
                  autoAlpha: 1,
                  clearProps: "transform,opacity",
                  duration: lineRevealDuration,
                  ease: lineRevealEase,
                  stagger: cardStagger,
                  y: 0,
               },
            );
         },
      });
   }

   async function initialize() {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const scrollTriggerPlugin = await loadPlugin("ScrollTrigger");
      if (!scrollTriggerPlugin || disposed) return;

      const root = toValue(scope);
      if (!root) return;

      const words = toValue(titleSplit)?.words ?? [];
      const lines = toValue(descriptionSplit)?.lines ?? [];

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               showAll([
                  ...words,
                  ...lines,
                  ...queryAll(root, selectors.reveal),
                  ...queryAll(root, selectors.cards),
               ]);
               return;
            }

            revealHeading(root, words, lines);
            revealCards(root, scrollTriggerPlugin);
         },
         scope,
      );

      await refresh();
   }

   function swapCards() {
      const root = toValue(scope);
      if (!root || preferredMotion.value === "reduce") return;

      swapContext ??= createContext(() => {}, scope);
      swapContext?.add(() => {
         const cards = queryAll(root, selectors.activeCards);
         gsap.killTweensOf(cards);
         gsap.fromTo(
            cards,
            { autoAlpha: 0, y: cardSwapOffset },
            {
               autoAlpha: 1,
               clearProps: "transform,opacity",
               duration: cardSwapDuration,
               ease: cardSwapEase,
               stagger: cardSwapStagger,
               y: 0,
            },
         );
      });
   }

   watch(
      () => [toValue(titleSplit), toValue(descriptionSplit)] as const,
      ([title, description]) => {
         if (!title || !description) return;
         return initialize();
      },
      { flush: "post", immediate: true },
   );

   watch(
      () => toValue(activeCategory),
      () => {
         if (!import.meta.client || disposed) return;
         swapCards();
      },
      { flush: "post" },
   );

   onScopeDispose(() => {
      disposed = true;
   });
}
