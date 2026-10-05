import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import type { SplitTextResult } from "@/lib/split-text";
import { swapDuration, swapEase } from "@/lib/swap-timing";
import {
   addWordReveal,
   lineRevealDuration,
   lineRevealEase,
   lineRevealStagger,
   wordRevealStart,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;
type SplitListSource = MaybeRefOrGetter<
   readonly (SplitTextResult | undefined)[]
>;

interface FaqMotionTargets {
   answerSplits: SplitListSource;
   openIndex: MaybeRefOrGetter<number>;
   titleSplit: SplitSource;
}

interface FaqItemParts {
   content: HTMLElement | null;
   cross: HTMLElement | null;
   divider: HTMLElement | null;
   rise: HTMLElement[];
}

const selectors = {
   content: "[data-faq-content]",
   cross: "[data-faq-icon-cross]",
   divider: "[data-faq-divider]",
   item: "[data-faq-item]",
   list: "[data-faq-list]",
   rise: "[data-faq-rise]",
   title: "[data-faq-title]",
} as const;

const refreshPriority = -4;
const itemRevealStagger = 0.08;
const crossClosedRotation = 90;

export function useFaqMotion(
   scope: MotionScope,
   { answerSplits, openIndex, titleSplit }: FaqMotionTargets,
) {
   const { createContext, createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   const preferredMotion = usePreferredReducedMotion();
   let disposed = false;
   let initialized = false;
   let ready = false;
   let reducedMotion = false;
   let titleRevealed = false;
   let expandedIndex = -1;
   let motionContext: gsap.Context | null = null;
   let toggleContext: gsap.Context | null = null;
   let titleTimeline: gsap.core.Timeline | null = null;
   const answerTimelines = new Map<number, gsap.core.Timeline>();

   function getItemParts(item: Element): FaqItemParts {
      return {
         content: item.querySelector<HTMLElement>(selectors.content),
         cross: item.querySelector<HTMLElement>(selectors.cross),
         divider: item.querySelector<HTMLElement>(selectors.divider),
         rise: [...item.querySelectorAll<HTMLElement>(selectors.rise)],
      };
   }

   function getItems() {
      const root = toValue(scope);
      if (!root) return [];

      return [...root.querySelectorAll(selectors.item)].map(getItemParts);
   }

   function showAll(elements: HTMLElement[]) {
      if (!elements.length) return;

      gsap.set(elements, {
         clearProps: "transform",
         visibility: "inherit",
      });
   }

   function revealTitle(root: HTMLElement, lines: HTMLElement[]) {
      const title = root.querySelector<HTMLElement>(selectors.title);
      if (!title) return;

      titleTimeline = gsap.timeline({
         onStart: () => {
            titleRevealed = true;
         },
         scrollTrigger: {
            once: true,
            refreshPriority,
            start: wordRevealStart,
            trigger: title,
         },
      });

      addWordReveal(titleTimeline, lines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         stagger: lineRevealStagger,
      });
   }

   function revealItems(root: HTMLElement, items: FaqItemParts[]) {
      const list = root.querySelector<HTMLElement>(selectors.list);
      if (!list) return;

      const timeline = gsap.timeline({
         scrollTrigger: {
            once: true,
            refreshPriority,
            start: wordRevealStart,
            trigger: list,
         },
      });

      items.forEach(({ divider, rise }, index) => {
         const position = index * itemRevealStagger;

         addWordReveal(timeline, rise, {
            duration: lineRevealDuration,
            ease: lineRevealEase,
            position,
            stagger: 0,
         });

         if (!divider) return;

         timeline.fromTo(
            divider,
            { scaleX: 0, transformOrigin: "left center", visibility: "inherit" },
            { duration: lineRevealDuration, ease: lineRevealEase, scaleX: 1 },
            position,
         );
      });
   }

   function replaceTitleLines(lines: HTMLElement[]) {
      const root = toValue(scope);
      const context = motionContext;

      if (!root || reducedMotion || !context || titleRevealed) {
         showAll(lines);
         return;
      }

      titleTimeline?.scrollTrigger?.kill();
      titleTimeline?.kill();
      context.add(() => revealTitle(root, lines));
   }

   async function initialize(titleLines: HTMLElement[]) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const scrollTriggerPlugin = await loadPlugin("ScrollTrigger");
      if (!scrollTriggerPlugin || disposed) return;

      const root = toValue(scope);
      if (!root) return;

      const items = getItems();

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
                  ...titleLines,
                  ...items.flatMap(({ divider, rise }) =>
                     divider ? [...rise, divider] : rise,
                  ),
               ]);
               return;
            }

            revealTitle(root, titleLines);
            revealItems(root, items);
         },
         scope,
      );

      ready = true;
      await refresh();
   }

   function currentHeight(content: HTMLElement, fallback: number) {
      return content.style.height
         ? content.getBoundingClientRect().height
         : fallback;
   }

   function revealAnswer(index: number, animate: boolean) {
      const lines = toValue(answerSplits)[index]?.lines ?? [];
      answerTimelines.get(index)?.kill();
      answerTimelines.delete(index);
      if (!lines.length) return;

      if (!animate) {
         gsap.set(lines, { clearProps: "transform" });
         return;
      }

      const timeline = gsap.timeline();
      addWordReveal(timeline, lines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         stagger: lineRevealStagger,
      });
      answerTimelines.set(index, timeline);
   }

   function setExpanded(
      { content, cross }: FaqItemParts,
      expanded: boolean,
      duration: number,
   ) {
      if (content) {
         const fullHeight = content.scrollHeight;
         gsap.killTweensOf(content);
         gsap.fromTo(
            content,
            {
               height: currentHeight(content, expanded ? 0 : fullHeight),
               visibility: "visible",
            },
            {
               clearProps: "height,visibility",
               duration,
               ease: swapEase,
               height: expanded ? fullHeight : 0,
            },
         );
      }

      if (cross) {
         gsap.to(cross, {
            duration,
            ease: swapEase,
            overwrite: "auto",
            rotation: expanded ? 0 : crossClosedRotation,
         });
      }
   }

   function toggle(next: number) {
      const items = getItems();
      const animate = preferredMotion.value !== "reduce";
      const duration = animate ? swapDuration : 0;
      const collapsing = items[expandedIndex];
      const expanding = items[next];

      if (collapsing && expandedIndex !== next) {
         setExpanded(collapsing, false, duration);
      }

      if (expanding && expandedIndex !== next) {
         setExpanded(expanding, true, duration);
         revealAnswer(next, animate);
      }

      expandedIndex = next;
   }

   watch(
      () => toValue(titleSplit),
      (next, previous) => {
         if (next === undefined) return;
         if (!initialized) return initialize(next?.lines ?? []);
         if (ready && next && next !== previous) replaceTitleLines(next.lines);
      },
      { flush: "post", immediate: true },
   );

   watch(
      () => toValue(openIndex),
      (next) => {
         if (!import.meta.client || disposed) return;

         toggleContext ??= createContext(() => {}, scope);
         if (!toggleContext) return;

         toggleContext.add(() => toggle(next));
      },
      { flush: "post" },
   );

   onScopeDispose(() => {
      disposed = true;
   });
}
