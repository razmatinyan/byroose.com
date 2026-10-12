import { nextTick, onMounted, onScopeDispose, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { addCharReveal } from "@/lib/char-reveal";
import {
   addWordReveal,
   navRevealStagger,
   revealMaskClip,
   wordRevealStart,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;

const selectors = {
   count: "[data-work-filters-count]",
   countChar: "[data-work-filters-count-char]",
   filterMask: "[data-work-filter-mask]",
   filterRise: "[data-work-filter-rise]",
   filters: "[data-work-filters]",
   item: "[data-work-project-item]",
} as const;

const filterRiseStart = 0.3;
const swapLeave = { duration: 0.35, ease: "power2.in", stagger: 0.03, y: 24 };
const swapEnter = { duration: 0.8, ease: "power3.out", stagger: 0.08, y: 48 };

function queryAll(root: Element, selector: string) {
   return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function isShown(element: HTMLElement) {
   return element.style.display !== "none";
}

export function useWorkProjectsMotion(scope: MotionScope) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;
   let animated = false;
   let swapId = 0;

   function shownItems(root: HTMLElement) {
      return queryAll(root, selectors.item).filter(isShown);
   }

   function countText(root: HTMLElement) {
      return root.querySelector(selectors.count)?.textContent ?? "";
   }

   function showCount(root: HTMLElement) {
      const chars = queryAll(root, selectors.countChar);
      if (chars.length) gsap.set(chars, { visibility: "inherit" });
   }

   function revealCount(root: HTMLElement) {
      addCharReveal(gsap.timeline(), queryAll(root, selectors.countChar));
   }

   function revealFilters(root: HTMLElement) {
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

      gsap.set(masks, { clipPath: revealMaskClip });
      addCharReveal(timeline, queryAll(filters, selectors.countChar));
      addWordReveal(timeline, rises, {
         position: filterRiseStart,
         stagger: navRevealStagger,
      });
      timeline
         .set(rises, { clearProps: "transform" })
         .set(masks, { clearProps: "clipPath" });
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
         if (root) showCount(root);
         await refresh();
         return;
      }

      const leaving = shownItems(root);
      await tweenItems(leaving, { ...swapLeave, autoAlpha: 0 });
      if (id !== swapId || disposed) return;

      const previousCount = countText(root);
      update();
      await nextTick();
      if (id !== swapId || disposed) return;

      if (countText(root) !== previousCount) revealCount(root);
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

   onMounted(async () => {
      const plugin = await loadPlugin("ScrollTrigger");
      const root = toValue(scope);
      if (!plugin || !root || disposed) return;

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               animated = false;
               const rises = queryAll(root, selectors.filterRise);
               if (rises.length) gsap.set(rises, { visibility: "inherit" });
               showCount(root);
               return;
            }

            animated = true;
            revealFilters(root);

            return () => {
               animated = false;
            };
         },
         scope,
      );

      await refresh();
   });

   onScopeDispose(() => {
      disposed = true;
   });

   return { swapProjects };
}
