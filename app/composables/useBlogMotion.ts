import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SplitTextResult } from "@/lib/split-text";
import {
   addWordReveal,
   lineRevealDuration,
   lineRevealEase,
   lineRevealStagger,
   wordRevealDuration,
   wordRevealEase,
   wordRevealOffset,
   wordRevealStagger,
   wordRevealStart,
} from "@/lib/word-reveal";

type ScrollTriggerPlugin = typeof ScrollTrigger;
type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;
type SplitListSource = MaybeRefOrGetter<
   readonly (SplitTextResult | undefined)[]
>;

interface BlogMotionTargets {
   cardTitleSplits: SplitListSource;
   titleSplit: SplitSource;
}

interface CardParts {
   card: HTMLElement;
   titleLines: HTMLElement[];
}

interface CardReveal {
   timeline: gsap.core.Timeline;
   trigger: ScrollTrigger;
}

const selectors = {
   card: "[data-blog-card]",
   cardMeta: "[data-blog-card-meta]",
   cta: "[data-blog-cta]",
   ctaMask: "[data-blog-cta-mask]",
   heading: "[data-blog-heading]",
} as const;

const refreshPriority = -3;
const cardRevealDuration = 1.2;
const cardRevealEase = "power3.inOut";
const cardRevealStagger = 0.15;
const cardTextLead = 0.5;
const hiddenCardClip = "inset(100% 0% 0% 0%)";
const visibleCardClip = "inset(0% 0% 0% 0%)";

export function useBlogMotion(
   scope: MotionScope,
   { cardTitleSplits, titleSplit }: BlogMotionTargets,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let initialized = false;
   let ready = false;
   let reducedMotion = false;
   let motionContext: gsap.Context | null = null;
   let scrollTriggerPlugin: ScrollTriggerPlugin | null = null;
   let cards: CardParts[] = [];
   const cardTimelines = new Map<HTMLElement, CardReveal>();
   const revealedCards = new WeakSet<HTMLElement>();

   function revealHeading(root: HTMLElement, titleWords: HTMLElement[]) {
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

      addWordReveal(timeline, titleWords);

      const ctaMask = heading.querySelector<HTMLElement>(selectors.ctaMask);
      const cta = heading.querySelector<HTMLElement>(selectors.cta);
      if (!ctaMask || !cta) return;

      gsap.set(ctaMask, { clipPath: "inset(0)" });
      gsap.set(cta, { yPercent: wordRevealOffset });
      timeline
         .to(
            cta,
            {
               clearProps: "transform",
               duration: wordRevealDuration,
               ease: wordRevealEase,
               yPercent: 0,
            },
            titleWords.length * wordRevealStagger,
         )
         .set(ctaMask, { clearProps: "clipPath" });
   }

   function rowDelay(card: HTMLElement) {
      const rowIndex = cards
         .filter((parts) => parts.card.offsetTop === card.offsetTop)
         .findIndex((parts) => parts.card === card);

      return Math.max(rowIndex, 0) * cardRevealStagger;
   }

   function revealCard(parts: CardParts) {
      if (!scrollTriggerPlugin) return;

      const { card, titleLines } = parts;
      const meta = card.querySelector<HTMLElement>(selectors.cardMeta);
      const textStart = cardRevealDuration * cardTextLead;

      const timeline = gsap
         .timeline({
            onStart: () => revealedCards.add(card),
            paused: true,
         })
         .fromTo(
            card,
            { clipPath: hiddenCardClip },
            {
               clearProps: "clipPath",
               clipPath: visibleCardClip,
               duration: cardRevealDuration,
               ease: cardRevealEase,
            },
            0,
         );

      addWordReveal(timeline, titleLines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         position: textStart,
         stagger: lineRevealStagger,
      });

      if (meta) {
         gsap.set(meta, { yPercent: wordRevealOffset });
         timeline.to(
            meta,
            {
               clearProps: "transform",
               duration: lineRevealDuration,
               ease: lineRevealEase,
               yPercent: 0,
            },
            textStart + titleLines.length * lineRevealStagger,
         );
      }

      const trigger = scrollTriggerPlugin.create({
         once: true,
         onEnter: () => timeline.delay(rowDelay(card)).restart(true),
         refreshPriority,
         start: wordRevealStart,
         trigger: card,
      });

      cardTimelines.set(card, { timeline, trigger });
   }

   function showAll(elements: HTMLElement[]) {
      if (!elements.length) return;

      gsap.set(elements, {
         clearProps: "transform",
         visibility: "inherit",
      });
   }

   function replaceTitleLines(index: number, lines: HTMLElement[]) {
      const parts = cards[index];
      if (!parts) return;

      parts.titleLines = lines;
      const context = motionContext;

      if (reducedMotion || !context || revealedCards.has(parts.card)) {
         showAll(lines);
         return;
      }

      const previous = cardTimelines.get(parts.card);
      previous?.trigger.kill();
      previous?.timeline.kill();
      context.add(() => revealCard(parts));
   }

   async function initialize(
      titleWords: HTMLElement[],
      titleParts: readonly SplitTextResult[],
   ) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      scrollTriggerPlugin = (await loadPlugin("ScrollTrigger")) ?? null;
      if (!scrollTriggerPlugin || disposed) return;

      const root = toValue(scope);
      if (!root) return;

      cards = [...root.querySelectorAll<HTMLElement>(selectors.card)].map(
         (card, index) => ({
            card,
            titleLines: titleParts[index]?.lines ?? [],
         }),
      );

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
                  ...titleWords,
                  ...cards.flatMap(({ titleLines }) => titleLines),
               ]);
               return;
            }

            revealHeading(root, titleWords);
            cards.forEach(revealCard);
         },
         scope,
      );

      ready = true;
      await refresh();
   }

   watch(
      () => [toValue(titleSplit), toValue(cardTitleSplits)] as const,
      ([title, cardTitles]) => {
         if (title === undefined || cardTitles.includes(undefined)) return;

         return initialize(
            title?.words ?? [],
            cardTitles.filter((parts) => parts !== undefined),
         );
      },
      { flush: "post", immediate: true },
   );

   watch(
      () => toValue(cardTitleSplits),
      (next, previous) => {
         if (!ready) return;

         next.forEach((parts, index) => {
            if (parts && parts !== previous?.[index]) {
               replaceTitleLines(index, parts.lines);
            }
         });
      },
      { flush: "post" },
   );

   onScopeDispose(() => {
      disposed = true;
   });
}
