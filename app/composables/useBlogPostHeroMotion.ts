import { onMounted, onScopeDispose, readonly, shallowRef, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { until } from "@vueuse/core";
import type { SplitTextResult } from "@/lib/split-text";
import { wordRevealDuration, wordRevealEase, wordRevealOffset } from "@/lib/word-reveal";

type MotionElement = MaybeRefOrGetter<HTMLElement | null | undefined>;

const titleWordStagger = 0.06;
const coverStart = 0.35;
const coverDuration = 1.4;
const coverEase = "power4.out";
const coverScale = 1.15;
const coverHidden = "inset(100% 0% 0% 0% round 1rem)";
const coverShown = "inset(0% 0% 0% 0% round 1rem)";

export function useBlogPostHeroMotion(
   titleSplit: MaybeRefOrGetter<SplitTextResult | undefined>,
   coverFrame: MotionElement,
) {
   const { createMatchMedia, gsap } = useGsap();
   const { waitForReveal } = usePageTransition();
   const revealed = shallowRef(false);
   let disposed = false;

   onScopeDispose(() => {
      disposed = true;
   });

   function reveal(words: HTMLElement[], frame: HTMLElement | null, image: HTMLElement | null) {
      gsap.set(words, { yPercent: wordRevealOffset });
      if (frame) gsap.set(frame, { clipPath: coverHidden });
      if (image) gsap.set(image, { scale: coverScale });
      revealed.value = true;

      const timeline = gsap.timeline({
         onComplete: () => {
            gsap.set(words, { clearProps: "transform" });
            if (frame) gsap.set(frame, { clearProps: "clipPath" });
            if (image) gsap.set(image, { clearProps: "transform" });
         },
      });

      timeline.to(
         words,
         { duration: wordRevealDuration, ease: wordRevealEase, stagger: titleWordStagger, yPercent: 0 },
         0,
      );

      if (frame) {
         timeline.to(frame, { duration: coverDuration, ease: coverEase, clipPath: coverShown }, coverStart);
      }

      if (image) {
         timeline.to(image, { duration: coverDuration, ease: coverEase, scale: 1 }, coverStart);
      }
   }

   onMounted(async () => {
      const [split] = await Promise.all([
         until(() => toValue(titleSplit)).not.toBeUndefined(),
         waitForReveal(),
      ]);
      if (disposed) return;

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion || revealed.value) {
               revealed.value = true;
               return;
            }

            const frame = toValue(coverFrame) ?? null;
            reveal(split?.words ?? [], frame, frame?.querySelector("img") ?? null);
         },
      );
   });

   return { revealed: readonly(revealed) };
}
