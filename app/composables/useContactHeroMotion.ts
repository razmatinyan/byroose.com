import {
   nextTick,
   onMounted,
   onScopeDispose,
   readonly,
   shallowRef,
   toValue,
} from "vue";
import type { MaybeRefOrGetter } from "vue";
import { until } from "@vueuse/core";
import {
   servicesHeroInsetContentScale,
   servicesHeroInsetDuration,
} from "@/lib/services-hero";
import type { SplitTextResult } from "@/lib/split-text";
import { swapEase } from "@/lib/swap-timing";
import {
   navRevealStagger,
   revealMaskClip,
   titleLineRevealOffset,
   titleLineRevealStagger,
   wordRevealDuration,
   wordRevealEase,
   wordRevealOffset,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;

const selectors = {
   field: "[data-contact-hero-field]",
   inset: "[data-contact-hero-inset]",
   insetContent: "[data-contact-hero-inset-content]",
   reveal: "[data-contact-hero-reveal]",
   titleLine: "[data-contact-hero-title-line]",
   titleMask: "[data-contact-hero-title-mask]",
} as const;

const descriptionLineStagger = 0.06;
const descriptionStart = 0.3;
const fieldRevealDistance = 48;
const fieldStart = 0.45;
const insetOpenProperty = "--contact-hero-inset-open";
const insetStart = 0.4;

function queryAll(root: HTMLElement, selector: string) {
   return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function useContactHeroMotion(
   scope: MotionScope,
   descriptionSplit: SplitSource,
) {
   const { createMatchMedia, gsap } = useGsap();
   const { waitForReveal } = usePageTransition();
   const revealed = shallowRef(false);
   let disposed = false;

   function revealHero(root: HTMLElement, descriptionLines: HTMLElement[]) {
      const revealTargets = queryAll(root, selectors.reveal);
      const fields = queryAll(root, selectors.field);
      const titleLines = queryAll(root, selectors.titleLine);
      const titleMasks = queryAll(root, selectors.titleMask);
      const insets = queryAll(root, selectors.inset);
      const insetContents = queryAll(root, selectors.insetContent);
      gsap.set(titleMasks, { clipPath: revealMaskClip });
      gsap.set(titleLines, { yPercent: titleLineRevealOffset });
      gsap.set(insets, { [insetOpenProperty]: 0 });
      gsap.set(insetContents, { scale: servicesHeroInsetContentScale });
      gsap.set(descriptionLines, { yPercent: wordRevealOffset });
      gsap.set(revealTargets, { visibility: "inherit" });
      gsap.set(fields, { autoAlpha: 0, y: fieldRevealDistance });

      gsap
         .timeline({
            defaults: { duration: wordRevealDuration, ease: wordRevealEase },
            onComplete: async () => {
               revealed.value = true;
               await nextTick();
               if (disposed) return;

               gsap.set([...titleLines, ...descriptionLines], {
                  clearProps: "transform",
               });
               gsap.set(titleMasks, { clearProps: "clipPath" });
               gsap.set([...insets, ...insetContents], { clearProps: "all" });
               gsap.set(fields, { clearProps: "opacity,transform,visibility" });
               gsap.set(revealTargets, { clearProps: "visibility" });
            },
         })
         .to(
            titleLines,
            { stagger: titleLineRevealStagger, yPercent: 0 },
            0,
         )
         .to(
            descriptionLines,
            { stagger: descriptionLineStagger, yPercent: 0 },
            descriptionStart,
         )
         .to(
            fields,
            { autoAlpha: 1, stagger: navRevealStagger, y: 0 },
            fieldStart,
         )
         .to(
            insets,
            {
               [insetOpenProperty]: 1,
               duration: servicesHeroInsetDuration,
               ease: swapEase,
            },
            insetStart,
         )
         .to(
            insetContents,
            {
               duration: servicesHeroInsetDuration,
               ease: swapEase,
               scale: 1,
            },
            insetStart,
         );
   }

   onMounted(async () => {
      const [description] = await Promise.all([
         until(() => toValue(descriptionSplit)).not.toBeUndefined(),
         document.fonts.ready,
         waitForReveal(),
      ]);
      const root = toValue(scope);
      if (disposed) return;

      if (!root) {
         revealed.value = true;
         return;
      }

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) {
               revealed.value = true;
               return;
            }

            if (!revealed.value) {
               revealHero(root, description?.lines ?? []);
            }
         },
         scope,
      );
   });

   onScopeDispose(() => {
      disposed = true;
   });

   return { revealed: readonly(revealed) };
}
