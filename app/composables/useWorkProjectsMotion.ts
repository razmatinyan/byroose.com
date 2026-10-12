import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import { addCharReveal } from "@/lib/char-reveal";
import type { SplitTextResult } from "@/lib/split-text";
import {
   addWordReveal,
   lineRevealDuration,
   lineRevealEase,
   navRevealStagger,
   wordRevealOffset,
   wordRevealStart,
} from "@/lib/word-reveal";

type ScrollTriggerPlugin = typeof ScrollTrigger;
type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;

interface ProjectReveal {
   timeline: gsap.core.Timeline;
   trigger: ScrollTrigger;
}

const selectors = {
   filterMask: "[data-work-filter-mask]",
   filterRise: "[data-work-filter-rise]",
   filters: "[data-work-filters]",
   item: "[data-work-project-item]",
   media: "[data-work-project-media]",
   meta: "[data-work-project-meta]",
} as const;

const hiddenMediaClip = "inset(0% 0% 100% 0%)";
const visibleMediaClip = "inset(0% 0% 0% 0%)";
const mediaRevealDuration = 1.2;
const mediaRevealEase = "power3.inOut";
const metaRevealStart = 0.4;
const filterRiseStart = 0.3;
const projectRowStagger = 0.15;
const swapLeave = { duration: 0.35, ease: "power2.in", stagger: 0.03, y: 24 };
const swapEnter = { duration: 0.8, ease: "power3.out", stagger: 0.08, y: 48 };

function queryAll(root: Element, selector: string) {
   return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function isShown(element: HTMLElement) {
   return element.style.display !== "none";
}

export function useWorkProjectsMotion(
   scope: MotionScope,
   filtersSplit: SplitSource,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let initialized = false;
   let animated = false;
   let swapId = 0;
   let projectReveals: ProjectReveal[] = [];

   function shownItems(root: HTMLElement) {
      return queryAll(root, selectors.item).filter(isShown);
   }

   function revealFilters(root: HTMLElement, chars: HTMLElement[]) {
      const filters = root.querySelector<HTMLElement>(selectors.filters);
      if (!filters) return;

      const masks = queryAll(filters, selectors.filterMask);
      const rises = queryAll(filters, selectors.filterRise);
      const timeline = gsap.timeline({
         scrollTrigger: {
            once: true,
            start: wordRevealStart,
            trigger: filters,
         },
      });

      gsap.set(masks, { clipPath: "inset(0)" });
      addCharReveal(timeline, chars);
      addWordReveal(timeline, rises, {
         position: filterRiseStart,
         stagger: navRevealStagger,
      });
      timeline
         .set(rises, { clearProps: "transform" })
         .set(masks, { clearProps: "clipPath" });
   }

   function rowDelay(root: HTMLElement, item: HTMLElement) {
      const rowIndex = shownItems(root)
         .filter((entry) => entry.offsetTop === item.offsetTop)
         .indexOf(item);

      return Math.max(rowIndex, 0) * projectRowStagger;
   }

   function revealProject(
      plugin: ScrollTriggerPlugin,
      root: HTMLElement,
      item: HTMLElement,
   ) {
      const media = item.querySelector<HTMLElement>(selectors.media);
      const meta = item.querySelector<HTMLElement>(selectors.meta);
      const timeline = gsap.timeline({ paused: true });

      if (media) {
         gsap.set(media, { clipPath: hiddenMediaClip });
         timeline.to(
            media,
            {
               clearProps: "clipPath",
               clipPath: visibleMediaClip,
               duration: mediaRevealDuration,
               ease: mediaRevealEase,
            },
            0,
         );
      }

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
            metaRevealStart,
         );
      }

      const trigger = plugin.create({
         once: true,
         onEnter: () => timeline.delay(rowDelay(root, item)).restart(true),
         start: wordRevealStart,
         trigger: item,
      });

      projectReveals.push({ timeline, trigger });
   }

   function settleProjectReveals() {
      projectReveals.forEach(({ timeline, trigger }) => {
         trigger.kill();
         timeline.delay(0).progress(1);
      });
      projectReveals = [];
   }

   function tweenItems(items: HTMLElement[], vars: gsap.TweenVars) {
      if (!items.length) return Promise.resolve();

      return new Promise<void>((resolve) => {
         gsap.to(items, {
            ...vars,
            onComplete: resolve,
            onInterrupt: resolve,
            overwrite: true,
         });
      });
   }

   async function swapProjects(update: () => void) {
      const root = toValue(scope);
      const id = ++swapId;

      if (!root || !animated) {
         update();
         await nextTick();
         await refresh();
         return;
      }

      settleProjectReveals();
      const leaving = shownItems(root);
      await tweenItems(leaving, { ...swapLeave, autoAlpha: 0 });
      if (id !== swapId || disposed) return;

      update();
      await nextTick();
      if (id !== swapId || disposed) return;

      gsap.set(leaving, { clearProps: "opacity,visibility,transform" });
      const entering = shownItems(root);
      gsap.set(entering, { autoAlpha: 0, y: swapEnter.y });
      await refresh();
      if (id !== swapId || disposed) return;

      await tweenItems(entering, {
         ...swapEnter,
         autoAlpha: 1,
         clearProps: "opacity,visibility,transform",
         y: 0,
      });
   }

   async function initialize(chars: HTMLElement[]) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const plugin = await loadPlugin("ScrollTrigger");
      const root = toValue(scope);
      if (!plugin || !root || disposed) return;

      const rises = queryAll(root, selectors.filterRise);

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               animated = false;
               const shown = [...chars, ...rises];
               if (shown.length) gsap.set(shown, { visibility: "inherit" });
               return;
            }

            animated = true;
            revealFilters(root, chars);
            shownItems(root).forEach((item) =>
               revealProject(plugin, root, item),
            );

            return () => {
               animated = false;
               projectReveals = [];
            };
         },
         scope,
      );

      await refresh();
   }

   watch(
      () => toValue(filtersSplit),
      (split) => {
         if (split === undefined) return;

         return initialize(split?.chars ?? []);
      },
      { flush: "post", immediate: true },
   );

   onScopeDispose(() => {
      disposed = true;
   });

   return { swapProjects };
}
