import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { SplitTextResult } from "@/lib/split-text";
import {
  addWordReveal,
  lineRevealDuration,
  lineRevealEase,
  lineRevealStagger,
  titleLineRevealStagger,
  wordRevealStart,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitListSource = MaybeRefOrGetter<
  readonly (SplitTextResult | undefined)[]
>;

interface ServiceStoryMotionTargets {
  descriptionSplits: SplitListSource;
  titleSplits: SplitListSource;
}

const selectors = {
  block: "[data-service-story-block]",
  link: "[data-service-story-link]",
} as const;

const descriptionDelay = 0.3;

export function useServiceStoryMotion(
  scope: MotionScope,
  { descriptionSplits, titleSplits }: ServiceStoryMotionTargets,
) {
  const { createMatchMedia, gsap, loadPlugin } = useGsap();
  const { refresh } = useSmoothScroll();
  let disposed = false;
  let initialized = false;

  function revealBlock(
    block: HTMLElement,
    titleLines: HTMLElement[],
    descriptionLines: HTMLElement[],
  ) {
    const links = Array.from(
      block.querySelectorAll<HTMLElement>(selectors.link),
    );
    const timeline = gsap.timeline({
      scrollTrigger: { once: true, start: wordRevealStart, trigger: block },
    });

    addWordReveal(timeline, titleLines, {
      duration: lineRevealDuration,
      ease: lineRevealEase,
      stagger: titleLineRevealStagger,
    });
    addWordReveal(timeline, descriptionLines, {
      duration: lineRevealDuration,
      ease: lineRevealEase,
      position: descriptionDelay,
      stagger: lineRevealStagger,
    });
    addWordReveal(timeline, links, {
      duration: lineRevealDuration,
      ease: lineRevealEase,
      position: descriptionDelay + descriptionLines.length * lineRevealStagger,
    });
  }

  async function initialize(
    titles: readonly SplitTextResult[],
    descriptions: readonly SplitTextResult[],
  ) {
    if (initialized || disposed) return;

    initialized = true;
    await nextTick();
    const ScrollTrigger = await loadPlugin("ScrollTrigger");
    const root = toValue(scope);
    if (!ScrollTrigger || !root || disposed) return;

    const blocks = Array.from(
      root.querySelectorAll<HTMLElement>(selectors.block),
    );

    createMatchMedia(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (context.conditions?.reduceMotion) {
          gsap.set(
            [
              ...titles.flatMap((parts) => parts?.lines ?? []),
              ...descriptions.flatMap((parts) => parts?.lines ?? []),
              ...root.querySelectorAll<HTMLElement>(selectors.link),
            ],
            { visibility: "inherit" },
          );
          return;
        }

        blocks.forEach((block, index) =>
          revealBlock(
            block,
            titles[index]?.lines ?? [],
            descriptions[index]?.lines ?? [],
          ),
        );
      },
      scope,
    );

    await refresh();
  }

  watch(
    () => [toValue(titleSplits), toValue(descriptionSplits)] as const,
    ([titles, descriptions]) => {
      if (titles.includes(undefined) || descriptions.includes(undefined)) {
        return;
      }

      return initialize(
        titles.filter((parts) => parts !== undefined),
        descriptions.filter((parts) => parts !== undefined),
      );
    },
    { flush: "post", immediate: true },
  );

  onScopeDispose(() => {
    disposed = true;
  });
}
