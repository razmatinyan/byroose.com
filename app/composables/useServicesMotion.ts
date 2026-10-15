import { nextTick, onScopeDispose, shallowRef, toValue, watch } from "vue";
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
   frame: HTMLElement;
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
   backdrop: "[data-service-backdrop]",
   backdropCurve: "[data-service-backdrop-curve]",
   backdropSurface: "[data-service-backdrop-surface]",
   content: "[data-service-content]",
   image: "[data-service-image]",
   intro: "[data-services-intro]",
   link: "[data-service-link]",
   linkContent: "[data-service-link-content]",
   titleInset: "[data-service-title-inset]",
   titleInsetContent: "[data-service-title-inset-content]",
   media: "[data-service-media]",
   mediaExit: "[data-service-media-exit]",
   mediaFrame: "[data-service-media-frame]",
   panel: "[data-service-panel]",
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
const linkOpenProperty = "--service-link-open";
const titleInsetOpenProperty = "--service-title-inset-open";
const imageZoom = 1.3;
const panelRunway = 1;
const mediaPeakScale = 0.8;
const mediaEntryEase = "sine.out";
const mediaExitEase = "sine.in";
const backdropLead = 1;
const backdropRevealDelay = 0.7;
const backdropRiseLength = 0.8;
const backdropRadius = 32;
const backdropExitReach = 1;
const touchQuery = "(hover: none) and (pointer: coarse)";
const touchMediaStart = "top 85%";
const touchMediaDuration = 1.2;
const touchMediaEase = "power3.out";

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
   const introRevealed = shallowRef(false);

   function revealIntro(intro: HTMLElement, words: HTMLElement[]) {
      if (!words.length) return;

      const wordsRevealedAt =
         introWordDuration + introWordStagger * (words.length - 1);
      introRevealed.value = false;
      gsap.set(words, { ...introWordFrom, visibility: "inherit" });

      const timeline: gsap.core.Timeline = gsap
         .timeline({
            defaults: { ease: "none" },
            onUpdate: () => {
               introRevealed.value = timeline.time() >= wordsRevealedAt;
            },
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
      const frame = panel.querySelector<HTMLElement>(selectors.mediaFrame);
      return content && frame ? { content, frame, panel } : null;
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

   function mediaCenteredAt(layout: PanelLayout) {
      const { frame, panel } = layout;

      return scrollWhen(
         layout,
         () => offsetWithin(frame, panel) + frame.offsetHeight / 2,
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
      if (touchMotion) {
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

   function scaleMedia(layout: PanelLayout) {
      const { frame, panel } = layout;
      const media = panel.querySelector<HTMLElement>(selectors.media);
      const mediaExit = panel.querySelector<HTMLElement>(selectors.mediaExit);
      const image = panel.querySelector<HTMLElement>(selectors.image);
      if (!media || !mediaExit) return;

      const frameAt = (share: number) => () =>
         offsetWithin(frame, panel) + frame.offsetHeight * share;
      const centered = mediaCenteredAt(layout);

      const entry = gsap
         .timeline({
            defaults: { ease: mediaEntryEase },
            scrollTrigger: {
               end: centered,
               invalidateOnRefresh: true,
               refreshPriority,
               scrub: true,
               start: scrollWhen(layout, frameAt(0), 1),
            },
         })
         .fromTo(media, { scale: 0 }, { scale: mediaPeakScale }, 0);

      if (image) entry.fromTo(image, { scale: imageZoom }, { scale: 1 }, 0);

      gsap.fromTo(
         mediaExit,
         { scale: 1 },
         {
            ease: mediaExitEase,
            immediateRender: false,
            scale: 0,
            scrollTrigger: {
               end: scrollWhen(layout, frameAt(1), 0),
               invalidateOnRefresh: true,
               refreshPriority,
               scrub: true,
               start: centered,
            },
         },
      );
   }

   function revealMedia({ frame, panel }: PanelLayout) {
      const media = panel.querySelector<HTMLElement>(selectors.media);
      const image = panel.querySelector<HTMLElement>(selectors.image);
      if (!media) return;

      const timeline = gsap
         .timeline({
            defaults: { duration: touchMediaDuration, ease: touchMediaEase },
            scrollTrigger: {
               once: true,
               refreshPriority,
               start: touchMediaStart,
               trigger: frame,
            },
         })
         .fromTo(media, { scale: 0 }, { scale: 1 }, 0);

      if (image) timeline.fromTo(image, { scale: imageZoom }, { scale: 1 }, 0);
   }

   function riseBackdrop(layout: PanelLayout) {
      const { panel } = layout;
      const backdrop = panel.querySelector<HTMLElement>(selectors.backdrop);
      const surface = panel.querySelector<HTMLElement>(
         selectors.backdropSurface,
      );
      const title = panel.querySelector<HTMLElement>(selectors.title);
      if (!backdrop || !surface || !title) return;

      gsap.set(panel, { "--service-backdrop-lead": backdropLead });

      const textStart = textRevealStart(layout, title);
      const panelEntry = () =>
         panel.getBoundingClientRect().top +
         window.scrollY -
         window.innerHeight;
      const start = () =>
         gsap.utils.interpolate(panelEntry(), textStart(), backdropRevealDelay);
      const distance = () => window.innerHeight * backdropRiseLength;
      const lead = () => -backdrop.offsetTop;
      const halfWidth = () => surface.offsetWidth / 2;
      const panelTopAtStart = () =>
         panel.getBoundingClientRect().top + window.scrollY - start();
      const viewportBottomAtStart = () =>
         window.innerHeight - panelTopAtStart() + lead();
      const viewportTopAtEnd = () =>
         lead() - Math.max(0, panelTopAtStart() - distance());

      gsap.fromTo(
         surface,
         {
            clipPath: () =>
               `inset(${viewportBottomAtStart()}px ${halfWidth()}px ${surface.offsetHeight - viewportBottomAtStart()}px ${halfWidth()}px round ${backdropRadius}px)`,
         },
         {
            clipPath: () =>
               `inset(${viewportTopAtEnd()}px 0px 0px 0px round 0px)`,
            ease: "none",
            scrollTrigger: {
               end: () => start() + distance(),
               invalidateOnRefresh: true,
               refreshPriority,
               scrub: true,
               start,
            },
         },
      );
   }

   function curveBackdrop(layout: PanelLayout) {
      const { panel } = layout;
      const backdrop = panel.querySelector<HTMLElement>(selectors.backdrop);
      const curve = panel.querySelector<HTMLElement>(selectors.backdropCurve);
      const section = panel.parentElement;
      if (!backdrop || !curve || !section) return;

      const closingSpace = () =>
         section.getBoundingClientRect().bottom -
         panel.getBoundingClientRect().bottom;

      gsap
         .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
               end: "bottom top",
               invalidateOnRefresh: true,
               refreshPriority,
               scrub: true,
               start: touchMotion ? "bottom bottom" : mediaCenteredAt(layout),
               trigger: panel,
            },
         })
         .fromTo(curve, { scaleY: 0 }, { scaleY: 1 }, 0)
         .fromTo(
            backdrop,
            { y: 0 },
            {
               y: () =>
                  closingSpace() * backdropExitReach - curve.offsetHeight,
            },
            0,
         );
   }

   function animatePanel(parts: ServicePanelParts) {
      const layout = layoutOf(parts.panel);
      if (!layout) return;

      if (!touchMotion) riseBackdrop(layout);
      curveBackdrop(layout);
      if (!touchMotion) slowContent(layout);
      revealText(parts, layout);
      if (touchMotion) revealMedia(layout);
      else scaleMedia(layout);
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
               ]);
               introRevealed.value = true;
               return;
            }

            revealIntro(intro, introWords);
            for (const panel of panels) animatePanel(panel);
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

   return { introRevealed };
}
