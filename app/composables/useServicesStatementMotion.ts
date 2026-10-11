import { onMounted, onScopeDispose, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { until } from "@vueuse/core";
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

const textSelector = "[data-services-statement-text]";
const dimmedWordOpacity = 0.2;
const wordHighlightDuration = 0.6;
const wordHighlightStagger = 0.2;
const wordHighlightStart = "top 65%";
const wordHighlightEnd = "bottom 50%";

export function useServicesStatementMotion(
   scope: MotionScope,
   textSplit: SplitSource,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;

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

   function highlightWords(text: HTMLElement, words: HTMLElement[]) {
      if (!words.length) return;

      gsap.set(words, { opacity: dimmedWordOpacity });
      gsap.to(words, {
         duration: wordHighlightDuration,
         ease: "none",
         opacity: 1,
         stagger: wordHighlightStagger,
         scrollTrigger: {
            end: wordHighlightEnd,
            scrub: true,
            start: wordHighlightStart,
            trigger: text,
         },
      });
   }

   onMounted(async () => {
      const [split, ScrollTrigger] = await Promise.all([
         until(() => toValue(textSplit)).not.toBeUndefined(),
         loadPlugin("ScrollTrigger"),
      ]);
      const root = toValue(scope);
      const text = root?.querySelector<HTMLElement>(textSelector);
      if (disposed || !split || !ScrollTrigger || !text) return;

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               gsap.set(split.lines, { visibility: "inherit" });
               return;
            }

            revealLines(text, split.lines);
            highlightWords(text, split.words);
         },
         scope,
      );

      await refresh();
   });

   onScopeDispose(() => {
      disposed = true;
   });
}
