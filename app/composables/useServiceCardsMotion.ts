import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { SplitTextResult } from "@/lib/split-text";
import { addWordReveal, wordRevealStart } from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;

const selectors = {
  card: "[data-service-card]",
  line: "[data-service-cards-line]",
  title: "[data-service-cards-title]",
  track: "[data-service-cards-track]",
} as const;

const titleWordStagger = 0.08;
const lineDuration = 1;
const lineEase = "none";
const cardDuration = 1.1;
const cardEase = "elastic.out(1, 0.6)";
const cardLead = 0.1;
const trackStart = "top 75%";

export function useServiceCardsMotion(
  scope: MotionScope,
  titleSplit: SplitSource,
) {
  const { createMatchMedia, gsap, loadPlugin } = useGsap();
  const { refresh } = useSmoothScroll();
  let disposed = false;
  let initialized = false;

  function revealTitle(title: HTMLElement, words: HTMLElement[]) {
    const timeline = gsap.timeline({
      scrollTrigger: { once: true, start: wordRevealStart, trigger: title },
    });

    addWordReveal(timeline, words, { stagger: titleWordStagger });
  }

  function revealCards(
    track: HTMLElement,
    cards: HTMLElement[],
    line: SVGPathElement | null,
  ) {
    const timeline = gsap.timeline({
      scrollTrigger: { once: true, start: trackStart, trigger: track },
    });

    if (line) {
      timeline.fromTo(
        line,
        { drawSVG: "0% 0%" },
        { drawSVG: "0% 100%", duration: lineDuration, ease: lineEase },
        0,
      );
    }

    cards.forEach((card, index) => {
      const reachedAt = (lineDuration * (index + 0.5)) / cards.length;
      const start = Math.max(0, reachedAt - cardLead);

      timeline
        .set(card, { scale: 0, visibility: "inherit" }, 0)
        .to(
          card,
          {
            clearProps: "scale",
            duration: cardDuration,
            ease: cardEase,
            scale: 1,
          },
          start,
        );
    });
  }

  async function initialize(words: HTMLElement[]) {
    if (initialized || disposed) return;

    initialized = true;
    await nextTick();
    const [ScrollTrigger, DrawSVGPlugin] = await Promise.all([
      loadPlugin("ScrollTrigger"),
      loadPlugin("DrawSVGPlugin"),
    ]);
    const root = toValue(scope);
    if (!ScrollTrigger || !DrawSVGPlugin || !root || disposed) return;

    const title = root.querySelector<HTMLElement>(selectors.title);
    const track = root.querySelector<HTMLElement>(selectors.track);
    const line = root.querySelector<SVGPathElement>(selectors.line);
    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(selectors.card),
    );
    if (!title || !track) return;

    createMatchMedia(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (context.conditions?.reduceMotion) {
          gsap.set([...words, ...cards], { visibility: "inherit" });
          return;
        }

        revealTitle(title, words);
        revealCards(track, cards, line);
      },
      scope,
    );

    await refresh();
  }

  watch(
    () => toValue(titleSplit),
    (parts) => {
      if (parts) return initialize(parts.words);
    },
    { flush: "post", immediate: true },
  );

  onScopeDispose(() => {
    disposed = true;
  });
}
