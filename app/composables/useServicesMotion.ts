import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import {
   servicesHeroInsetContentScale,
   servicesHeroInsetDuration,
} from "@/lib/services-hero";
import type { SplitTextResult } from "@/lib/split-text";
import { swapEase } from "@/lib/swap-timing";
import {
   addWordReveal,
   lineRevealDuration,
   lineRevealEase,
   lineRevealStagger,
   wordRevealDuration,
   wordRevealEase,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitListSource = MaybeRefOrGetter<
   readonly (SplitTextResult | undefined)[]
>;

interface ServicesMotionTargets {
   descriptionSplits: SplitListSource;
   introSplits: SplitListSource;
}

interface ServicePanelParts {
   descriptionLines: HTMLElement[];
   panel: HTMLElement;
}

interface PanelLayout {
   content: HTMLElement;
   panel: HTMLElement;
}

interface PanelTravel {
   entry: number;
   rate: number;
}

interface PanelInset {
   content: string;
   frame: string;
   property: string;
}

const selectors = {
   card: "[data-service-card]",
   curve: "[data-service-curve]",
   content: "[data-service-content]",
   intro: "[data-services-intro]",
   link: "[data-service-link]",
   linkContent: "[data-service-link-content]",
   titleInset: "[data-service-title-inset]",
   titleInsetContent: "[data-service-title-inset-content]",
   panel: "[data-service-panel]",
   rise: "[data-service-rise]",
   title: "[data-service-title]",
} as const;

const refreshPriority = -1;
const introPinLength = 1.5;
const introWordDuration = 1;
const introWordStagger = 0.45;
const introHold = 0.6;
const introWordFrom = {
   filter: "blur(16px)",
   opacity: 0,
   scale: 0.6,
};
const textRevealAt = 0.6;
const riseDelay = 0.3;
const linkOpenProperty = "--service-link-open";
const titleInsetOpenProperty = "--service-title-inset-open";
const panelRunway = 1;
const cardRadius = 32;
const cardInset = 0.04;
const cardStartScale = 0.92;
const coveredBlur = 16;
const coveredBlurEase = "power1.out";
const curveExitReach = 1;
const touchQuery = "(hover: none) and (pointer: coarse)";

function splitWords(parts: SplitTextResult | undefined) {
   return parts?.words ?? [];
}

function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
   let offset = 0;
   let node: HTMLElement | null = element;

   while (node && node !== ancestor) {
      offset += node.offsetTop;
      node =
         node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
   }

   return offset;
}

export function useServicesMotion(
   scope: MotionScope,
   { descriptionSplits, introSplits }: ServicesMotionTargets,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let initialized = false;
   let ready = false;
   let reducedMotion = false;
   let touchMotion = false;
   let motionContext: gsap.Context | null = null;
   let panels: ServicePanelParts[] = [];
   const textTimelines = new Map<HTMLElement, gsap.core.Timeline>();
   const revealedPanels = new WeakSet<HTMLElement>();
   const staticPanels = new WeakSet<HTMLElement>();

   function revealIntro(intro: HTMLElement, words: HTMLElement[]) {
      if (!words.length) return;

      gsap.set(words, { ...introWordFrom, visibility: "inherit" });

      gsap
         .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
               end: `+=${introPinLength * 100}%`,
               pin: true,
               refreshPriority,
               scrub: true,
               start: "top top",
               trigger: intro,
            },
         })
         .to(
            words,
            {
               duration: introWordDuration,
               ease: "power2.out",
               filter: "blur(0px)",
               opacity: 1,
               scale: 1,
               stagger: introWordStagger,
            },
            0,
         )
         .to({}, { duration: introHold });
   }

   function runwayOf(panel: HTMLElement, content: HTMLElement) {
      return panel.clientHeight - content.offsetTop - content.offsetHeight;
   }

   function layoutOf(panel: HTMLElement): PanelLayout | null {
      const content = panel.querySelector<HTMLElement>(selectors.content);
      return content ? { content, panel } : null;
   }

   function travelOf({ content, panel }: PanelLayout): PanelTravel {
      const viewport = window.innerHeight;
      const range = viewport + panel.offsetHeight;

      return {
         entry: panel.getBoundingClientRect().top + window.scrollY - viewport,
         rate: runwayOf(panel, content) / range,
      };
   }

   function scrollWhen(
      layout: PanelLayout,
      offset: () => number,
      viewportRatio: number,
   ) {
      return () => {
         const travel = travelOf(layout);
         const viewport = window.innerHeight;
         const scrolled =
            (viewport + offset() - viewportRatio * viewport) /
            (1 - travel.rate);

         return travel.entry + scrolled;
      };
   }

   function contentEndCenteredAt(layout: PanelLayout) {
      const { content, panel } = layout;

      return scrollWhen(
         layout,
         () => offsetWithin(content, panel) + content.offsetHeight,
         0.5,
      );
   }

   function slowContent(layout: PanelLayout) {
      const { content, panel } = layout;

      gsap.set(panel, { "--service-runway": panelRunway });

      const children = [...content.children];
      const titles = children.filter((child) =>
         child.matches(selectors.title),
      );
      const others = children.filter(
         (child) => !child.matches(selectors.title),
      );
      const runway = () => runwayOf(panel, content);

      const timeline = gsap.timeline({
         defaults: { ease: "none" },
         scrollTrigger: {
            end: "bottom top",
            invalidateOnRefresh: true,
            refreshPriority,
            scrub: true,
            start: "top bottom",
            trigger: panel,
         },
      });

      if (others.length) timeline.fromTo(others, { y: 0 }, { y: runway }, 0);
      if (titles.length) {
         timeline.fromTo(titles, { top: 0 }, { top: runway }, 0);
      }
   }

   function textRevealStart(layout: PanelLayout, title: HTMLElement) {
      if (touchMotion || staticPanels.has(layout.panel)) {
         return () =>
            title.getBoundingClientRect().top +
            window.scrollY -
            window.innerHeight * textRevealAt;
      }

      return scrollWhen(
         layout,
         () => offsetWithin(title, layout.panel),
         textRevealAt,
      );
   }

   function revealText(
      { descriptionLines, panel }: ServicePanelParts,
      layout: PanelLayout,
   ) {
      const title = panel.querySelector<HTMLElement>(selectors.title);
      if (!title || !descriptionLines.length) return;

      const timeline = gsap.timeline({
         onStart: () => revealedPanels.add(panel),
         scrollTrigger: {
            invalidateOnRefresh: true,
            once: true,
            refreshPriority,
            start: textRevealStart(layout, title),
         },
      });

      addWordReveal(timeline, descriptionLines, {
         duration: lineRevealDuration,
         ease: lineRevealEase,
         stagger: lineRevealStagger,
      });
      const rise = panel.querySelector<HTMLElement>(selectors.rise);
      if (rise) {
         addWordReveal(timeline, [rise], {
            duration: wordRevealDuration,
            ease: wordRevealEase,
            position: riseDelay,
         });
      }
      openInset(timeline, panel, {
         content: selectors.titleInsetContent,
         frame: selectors.titleInset,
         property: titleInsetOpenProperty,
      });
      openInset(timeline, panel, {
         content: selectors.linkContent,
         frame: selectors.link,
         property: linkOpenProperty,
      });
      textTimelines.set(panel, timeline);
   }

   function openInset(
      timeline: gsap.core.Timeline,
      panel: HTMLElement,
      { content: contentSelector, frame: frameSelector, property }: PanelInset,
   ) {
      const frame = panel.querySelector<HTMLElement>(frameSelector);
      const content = panel.querySelector<HTMLElement>(contentSelector);
      if (!frame) return;

      const reveal = { duration: servicesHeroInsetDuration, ease: swapEase };
      timeline.to(frame, { ...reveal, [property]: 1 }, 0);

      if (content) {
         timeline.fromTo(
            content,
            { scale: servicesHeroInsetContentScale },
            { ...reveal, scale: 1 },
            0,
         );
      }
   }

   function replaceDescriptionLines(index: number, lines: HTMLElement[]) {
      const parts = panels[index];
      if (!parts) return;

      parts.descriptionLines = lines;
      const layout = layoutOf(parts.panel);
      const context = motionContext;

      if (
         reducedMotion ||
         !context ||
         !layout ||
         revealedPanels.has(parts.panel)
      ) {
         showAll(lines);
         return;
      }

      const previous = textTimelines.get(parts.panel);
      previous?.scrollTrigger?.kill();
      previous?.kill();
      context.add(() => revealText(parts, layout));
   }

   function isCard(panel: HTMLElement) {
      return panel.dataset.serviceSurface === "dark";
   }

   function pinCovered(covered: HTMLElement, card: HTMLElement) {
      const content = covered.querySelector<HTMLElement>(selectors.content);

      gsap.set(covered, { minHeight: "100svh" });

      const timeline = gsap.timeline({
         defaults: { ease: coveredBlurEase },
         scrollTrigger: {
            end: "top top",
            endTrigger: card,
            invalidateOnRefresh: true,
            pin: true,
            pinSpacing: false,
            refreshPriority,
            scrub: true,
            start: "bottom bottom",
            trigger: covered,
         },
      });

      if (content) {
         timeline.fromTo(
            content,
            { filter: "blur(0px)", opacity: 1 },
            { filter: `blur(${coveredBlur}px)`, opacity: 0 },
            0,
         );
      }
   }

   function riseCard(panel: HTMLElement) {
      const card = panel.querySelector<HTMLElement>(selectors.card);
      if (!card) return;

      gsap.fromTo(
         card,
         { borderRadius: cardRadius, scale: cardStartScale },
         {
            borderRadius: 0,
            ease: "none",
            scale: 1,
            scrollTrigger: {
               end: "top top",
               invalidateOnRefresh: true,
               refreshPriority,
               scrub: true,
               start: "top bottom",
               trigger: panel,
            },
         },
      );
   }

   function curveExit(layout: PanelLayout) {
      const { panel } = layout;
      const curve = panel.querySelector<HTMLElement>(selectors.curve);
      const section = panel.parentElement;
      if (!curve || !section) return;

      const depth = () =>
         (section.getBoundingClientRect().bottom -
            panel.getBoundingClientRect().bottom) *
         curveExitReach;

      gsap.fromTo(
         curve,
         { height: depth, scaleY: 0 },
         {
            ease: "none",
            height: depth,
            scaleY: 1,
            scrollTrigger: {
               end: "bottom top",
               invalidateOnRefresh: true,
               refreshPriority,
               scrub: true,
               start: touchMotion ? "bottom bottom" : contentEndCenteredAt(layout),
               trigger: panel,
            },
         },
      );
   }

   function coveringCard(index: number) {
      const next = panels[index + 1]?.panel;
      return !touchMotion && next && isCard(next) ? next : undefined;
   }

   function animatePanel(parts: ServicePanelParts, index: number) {
      const layout = layoutOf(parts.panel);
      if (!layout) return;

      const card = coveringCard(index);
      if (card) pinCovered(parts.panel, card);
      if (!touchMotion && isCard(parts.panel)) riseCard(parts.panel);
      curveExit(layout);
      if (!touchMotion && !card) slowContent(layout);
      revealText(parts, layout);
   }

   function showAll(elements: HTMLElement[]) {
      if (!elements.length) return;

      gsap.set(elements, {
         clearProps: "transform",
         visibility: "inherit",
      });
   }

   async function initialize(
      introWords: HTMLElement[],
      descriptionParts: readonly SplitTextResult[],
   ) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const ScrollTrigger = await loadPlugin("ScrollTrigger");
      if (!ScrollTrigger || disposed) return;

      const root = toValue(scope);
      const intro = root?.querySelector<HTMLElement>(selectors.intro);
      if (!root || !intro) return;

      panels = [...root.querySelectorAll<HTMLElement>(selectors.panel)].map(
         (panel, index) => ({
            descriptionLines: descriptionParts[index]?.lines ?? [],
            panel,
         }),
      );

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
            touch: touchQuery,
         },
         (context) => {
            motionContext = context;
            reducedMotion = Boolean(context.conditions?.reduceMotion);
            touchMotion = Boolean(context.conditions?.touch);

            if (reducedMotion) {
               showAll([
                  ...introWords,
                  ...panels.flatMap(({ descriptionLines }) => descriptionLines),
                  ...root.querySelectorAll<HTMLElement>(selectors.rise),
               ]);
               return;
            }

            panels.forEach(({ panel }, index) => {
               if (coveringCard(index)) staticPanels.add(panel);
               else staticPanels.delete(panel);
            });
            revealIntro(intro, introWords);
            panels.forEach(animatePanel);
         },
         scope,
      );

      ready = true;
      await refresh();
   }

   watch(
      () => [toValue(introSplits), toValue(descriptionSplits)] as const,
      ([intro, descriptions]) => {
         const splits = [...intro, ...descriptions];
         if (splits.includes(undefined)) return;

         return initialize(
            intro.flatMap(splitWords),
            descriptions.filter((parts) => parts !== undefined),
         );
      },
      { flush: "post", immediate: true },
   );

   watch(
      () => toValue(descriptionSplits),
      (next, previous) => {
         if (!ready) return;

         next.forEach((parts, index) => {
            if (parts && parts !== previous?.[index]) {
               replaceDescriptionLines(index, parts.lines);
            }
         });
      },
      { flush: "post" },
   );

   onScopeDispose(() => {
      disposed = true;
   });
}
