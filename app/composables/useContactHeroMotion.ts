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
import type { SplitTextResult } from "@/lib/split-text";
import {
   navRevealStagger,
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
   reveal: "[data-contact-hero-reveal]",
} as const;

const descriptionLineStagger = 0.06;
const descriptionStart = 0.3;
const fieldRevealDistance = 48;
const fieldStart = 0.45;

function queryAll(root: HTMLElement, selector: string) {
   return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function useContactHeroMotion(
   scope: MotionScope,
   titleSplit: SplitSource,
   descriptionSplit: SplitSource,
) {
   const { createMatchMedia, gsap } = useGsap();
   const { waitForReveal } = usePageTransition();
   const revealed = shallowRef(false);
   let disposed = false;

   function revealHero(
      root: HTMLElement,
      titleLines: HTMLElement[],
      descriptionLines: HTMLElement[],
   ) {
      const revealTargets = queryAll(root, selectors.reveal);
      const fields = queryAll(root, selectors.field);
      gsap.set(titleLines, { yPercent: titleLineRevealOffset });
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
         );
   }

   onMounted(async () => {
      const [title, description] = await Promise.all([
         until(() => toValue(titleSplit)).not.toBeUndefined(),
         until(() => toValue(descriptionSplit)).not.toBeUndefined(),
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
               revealHero(root, title?.lines ?? [], description?.lines ?? []);
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
