import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
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
type SplitListSource = MaybeRefOrGetter<
   readonly (SplitTextResult | undefined)[]
>;

interface WhyChooseMotionTargets {
   cardBodySplits: SplitListSource;
   cardTitleSplits: SplitListSource;
   noteSplits: SplitListSource;
   titleSplit: SplitSource;
}

interface NoteParts {
   lines: HTMLElement[];
   note: HTMLElement;
}

interface CardParts {
   bodyLines: HTMLElement[];
   frame: HTMLElement;
   titleWords: HTMLElement[];
}

const selectors = {
   card: "[data-reason-card]",
   cardNumber: "[data-reason-card-number]",
   frame: "[data-reason]",
   note: "[data-why-note]",
   title: "[data-why-title]",
} as const;

const refreshPriority = -2;
const titleRevealStart = "top 85%";
const titleCharFrom = {
   rotation: -24,
   scale: 0,
   transformOrigin: "50% 0%",
   yPercent: -110,
};
const titleCharDuration = 1.1;
const titleCharStagger = 0.045;
const titleCharEase = "power3.out";
const cardRiseOffset = 160;
const cardRiseDuration = 1.2;
const cardRiseEase = "power3.out";
const cardTextDelay = 0.2;
const lineReveal = {
   duration: lineRevealDuration,
   ease: lineRevealEase,
   stagger: lineRevealStagger,
};

function linesOf(parts: SplitTextResult | undefined) {
   return parts?.lines ?? [];
}

export function useWhyChooseMotion(
   scope: MotionScope,
   {
      cardBodySplits,
      cardTitleSplits,
      noteSplits,
      titleSplit,
   }: WhyChooseMotionTargets,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let initialized = false;
   let ready = false;
   let reducedMotion = false;
   let motionContext: gsap.Context | null = null;
   let notes: NoteParts[] = [];
   let cards: CardParts[] = [];
   const timelines = new Map<HTMLElement, gsap.core.Timeline>();
   const revealed = new WeakSet<HTMLElement>();

   function revealTimeline(trigger: HTMLElement) {
      const timeline = gsap.timeline({
         onStart: () => revealed.add(trigger),
         scrollTrigger: {
            once: true,
            refreshPriority,
            start: wordRevealStart,
            trigger,
         },
      });

      timelines.set(trigger, timeline);
      return timeline;
   }

   function spawnTitleChars(chars: HTMLElement[], trigger: HTMLElement) {
      if (!chars.length) return;

      gsap
         .timeline({
            scrollTrigger: {
               once: true,
               refreshPriority,
               start: titleRevealStart,
               trigger,
            },
         })
         .set(chars, { visibility: "inherit" }, 0)
         .fromTo(
            chars,
            titleCharFrom,
            {
               duration: titleCharDuration,
               ease: titleCharEase,
               rotation: 0,
               scale: 1,
               stagger: titleCharStagger,
               yPercent: 0,
            },
            0,
         );
   }

   function revealNote({ lines, note }: NoteParts) {
      addWordReveal(revealTimeline(note), lines, lineReveal);
   }

   function revealCard({ bodyLines, frame, titleWords }: CardParts) {
      const timeline = revealTimeline(frame);
      const card = frame.querySelector<HTMLElement>(selectors.card);
      const number = frame.querySelector<HTMLElement>(selectors.cardNumber);

      if (card) {
         timeline.fromTo(
            card,
            { y: cardRiseOffset },
            {
               clearProps: "transform",
               duration: cardRiseDuration,
               ease: cardRiseEase,
               y: 0,
            },
            0,
         );
      }

      const textAt = { ...lineReveal, position: cardTextDelay };
      addWordReveal(timeline, number ? [number] : [], textAt);
      addWordReveal(timeline, titleWords, textAt);
      addWordReveal(timeline, bodyLines, {
         ...lineReveal,
         position: cardTextDelay + titleWords.length * lineRevealStagger,
      });
   }

   function showAll(elements: HTMLElement[]) {
      if (!elements.length) return;

      gsap.set(elements, {
         clearProps: "transform",
         visibility: "inherit",
      });
   }

   function replaceLines(
      trigger: HTMLElement,
      lines: HTMLElement[],
      rebuild: () => void,
   ) {
      const context = motionContext;

      if (reducedMotion || !context || revealed.has(trigger)) {
         showAll(lines);
         return;
      }

      const previous = timelines.get(trigger);
      previous?.scrollTrigger?.kill();
      previous?.kill();
      context.add(rebuild);
   }

   function replaceNoteLines(index: number, lines: HTMLElement[]) {
      const parts = notes[index];
      if (!parts) return;

      parts.lines = lines;
      replaceLines(parts.note, lines, () => revealNote(parts));
   }

   function replaceBodyLines(index: number, lines: HTMLElement[]) {
      const parts = cards[index];
      if (!parts) return;

      parts.bodyLines = lines;
      replaceLines(parts.frame, lines, () => revealCard(parts));
   }

   function watchResplits(
      source: SplitListSource,
      replace: (index: number, lines: HTMLElement[]) => void,
   ) {
      watch(
         () => toValue(source),
         (next, previous) => {
            if (!ready) return;

            next.forEach((parts, index) => {
               if (parts && parts !== previous?.[index]) {
                  replace(index, parts.lines);
               }
            });
         },
         { flush: "post" },
      );
   }

   async function initialize(
      titleChars: HTMLElement[],
      noteParts: readonly (SplitTextResult | undefined)[],
      cardTitleParts: readonly (SplitTextResult | undefined)[],
      cardBodyParts: readonly (SplitTextResult | undefined)[],
   ) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const ScrollTrigger = await loadPlugin("ScrollTrigger");
      if (!ScrollTrigger || disposed) return;

      const root = toValue(scope);
      const title = root?.querySelector<HTMLElement>(selectors.title);
      if (!root || !title) return;

      notes = [...root.querySelectorAll<HTMLElement>(selectors.note)].map(
         (note, index) => ({ lines: linesOf(noteParts[index]), note }),
      );
      cards = [...root.querySelectorAll<HTMLElement>(selectors.frame)].map(
         (frame, index) => ({
            bodyLines: linesOf(cardBodyParts[index]),
            frame,
            titleWords: cardTitleParts[index]?.words ?? [],
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
                  ...titleChars,
                  ...notes.flatMap(({ lines }) => lines),
                  ...cards.flatMap(({ bodyLines, frame, titleWords }) => [
                     ...frame.querySelectorAll<HTMLElement>(
                        selectors.cardNumber,
                     ),
                     ...titleWords,
                     ...bodyLines,
                  ]),
               ]);
               return;
            }

            spawnTitleChars(titleChars, title);
            notes.forEach(revealNote);
            cards.forEach(revealCard);
         },
         scope,
      );

      ready = true;
      await refresh();
   }

   watch(
      () =>
         [
            toValue(titleSplit),
            toValue(noteSplits),
            toValue(cardTitleSplits),
            toValue(cardBodySplits),
         ] as const,
      ([title, noteParts, cardTitleParts, cardBodyParts]) => {
         if (
            title === undefined ||
            noteParts.includes(undefined) ||
            cardTitleParts.includes(undefined) ||
            cardBodyParts.includes(undefined)
         ) {
            return;
         }

         return initialize(
            title?.chars ?? [],
            noteParts,
            cardTitleParts,
            cardBodyParts,
         );
      },
      { flush: "post", immediate: true },
   );

   watchResplits(noteSplits, replaceNoteLines);
   watchResplits(cardBodySplits, replaceBodyLines);

   onScopeDispose(() => {
      disposed = true;
   });
}
