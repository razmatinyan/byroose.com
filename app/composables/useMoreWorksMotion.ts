import { nextTick, onScopeDispose, shallowRef, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { SplitTextResult } from "@/lib/split-text";

type MotionTarget = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;
type ScrollTriggerPlugin = typeof import("gsap/ScrollTrigger").ScrollTrigger;

interface MoreWorksMotionTargets {
   action: MotionTarget;
   endSplit: SplitSource;
   endWord: MotionTarget;
   media: MotionTarget;
   panel: MotionTarget;
   startSplit: SplitSource;
   startWord: MotionTarget;
}

interface MoreWorksElements {
   action: HTMLElement;
   endWord: HTMLElement;
   media: HTMLElement;
   panel: HTMLElement;
   startWord: HTMLElement;
   track: HTMLElement;
}

const revealLead = 0.6;
const pinLength = 1;
const charDuration = 0.3;
const charSpread = 0.6;
const wordSpread = 0.22;
const wordDriftShare = 0.3;

export function useMoreWorksMotion(
   track: MotionTarget,
   {
      action,
      endSplit,
      endWord,
      media,
      panel,
      startSplit,
      startWord,
   }: MoreWorksMotionTargets,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   const cycling = shallowRef(false);
   let disposed = false;
   let initialized = false;

   function resolveElements(): MoreWorksElements | null {
      const actionElement = toValue(action);
      const endWordElement = toValue(endWord);
      const mediaElement = toValue(media);
      const panelElement = toValue(panel);
      const startWordElement = toValue(startWord);
      const trackElement = toValue(track);

      if (
         !actionElement ||
         !endWordElement ||
         !mediaElement ||
         !panelElement ||
         !startWordElement ||
         !trackElement
      ) {
         return null;
      }

      return {
         action: actionElement,
         endWord: endWordElement,
         media: mediaElement,
         panel: panelElement,
         startWord: startWordElement,
         track: trackElement,
      };
   }

   function pinPanel(ScrollTrigger: ScrollTriggerPlugin, track: HTMLElement) {
      ScrollTrigger.create({
         end: `+=${pinLength * 100}%`,
         pin: true,
         refreshPriority: 1,
         start: "top top",
         trigger: track,
      });
   }

   function revealTitle(
      { action, endWord, media, startWord, track }: MoreWorksElements,
      startChars: HTMLElement[],
      endChars: HTMLElement[],
   ) {
      const duration = revealLead + pinLength;
      const spread = () => window.innerWidth * wordSpread;
      const charReveal = {
         duration: charDuration,
         opacity: 1,
         stagger: { amount: charSpread },
      };

      const timeline = gsap
         .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
               end: () => `+=${window.innerHeight * duration}`,
               invalidateOnRefresh: true,
               scrub: true,
               start: `top ${revealLead * 100}%`,
               trigger: track,
            },
         })
         .fromTo(startWord, { x: () => -spread() }, { duration, x: 0 }, 0)
         .fromTo(endWord, { x: spread }, { duration, x: 0 }, 0)
         .fromTo(media, { scale: 0 }, { duration, scale: 1 }, 0)
         .fromTo(
            action,
            { scale: 0 },
            { duration: pinLength, ease: "power2.out", scale: 1 },
            revealLead,
         );

      driftTitle({ endWord, media, startWord, track }, timeline);

      const chars = [...startChars, ...endChars];
      if (chars.length) gsap.set(chars, { opacity: 0 });

      if (startChars.length) {
         timeline.to([...startChars].reverse(), { ...charReveal }, 0);
      }

      if (endChars.length) {
         timeline.to(endChars, { ...charReveal }, 0);
      }
   }

   function driftTitle(
      {
         endWord,
         media,
         startWord,
         track,
      }: Pick<MoreWorksElements, "endWord" | "media" | "startWord" | "track">,
      reveal: gsap.core.Timeline,
   ) {
      const revealEnd = () => reveal.scrollTrigger?.end ?? 0;
      const driftShare = () =>
         track.offsetHeight /
         (2 * window.innerHeight * (revealLead + pinLength));
      const wordGap = () =>
         endWord.offsetLeft - (startWord.offsetLeft + startWord.offsetWidth);
      const driftX = () =>
         Math.min(
            window.innerWidth * wordSpread * driftShare(),
            Math.max(0, wordGap()) * wordDriftShare,
         );

      gsap
         .timeline({
            defaults: { immediateRender: false },
            scrollTrigger: {
               end: () => revealEnd() + track.offsetHeight,
               invalidateOnRefresh: true,
               scrub: true,
               start: revealEnd,
            },
         })
         .fromTo(startWord, { x: 0 }, { ease: "power2.out", x: driftX }, 0)
         .fromTo(
            endWord,
            { x: 0 },
            { ease: "power2.out", x: () => -driftX() },
            0,
         )
         .fromTo(
            media,
            { scale: 1 },
            { ease: "power1.out", scale: () => 1 + driftShare() },
            0,
         );
   }

   function syncCycling(panel: HTMLElement) {
      const { bottom, top } = panel.getBoundingClientRect();
      cycling.value = bottom > 0 && top < window.innerHeight;
   }

   function stopCycling() {
      cycling.value = false;
   }

   function trackVisibility(
      ScrollTrigger: ScrollTriggerPlugin,
      { panel, track }: MoreWorksElements,
   ) {
      ScrollTrigger.create({
         end: () =>
            `+=${track.offsetHeight + window.innerHeight * (pinLength + 2)}`,
         invalidateOnRefresh: true,
         onRefresh: () => syncCycling(panel),
         onToggle: (self) => {
            if (self.isActive) syncCycling(panel);
            else stopCycling();
         },
         onUpdate: () => syncCycling(panel),
         start: "top bottom",
         trigger: track,
      });
   }

   async function initialize(startChars: HTMLElement[], endChars: HTMLElement[]) {
      if (initialized || disposed) return;

      initialized = true;
      await nextTick();
      const ScrollTrigger = await loadPlugin("ScrollTrigger");
      if (!ScrollTrigger || disposed) return;

      const elements = resolveElements();
      if (!elements) return;

      createMatchMedia(
         "(prefers-reduced-motion: no-preference)",
         () => {
            pinPanel(ScrollTrigger, elements.track);
            revealTitle(elements, startChars, endChars);
            trackVisibility(ScrollTrigger, elements);

            return stopCycling;
         },
         track,
      );

      await refresh();
   }

   watch(
      () => [toValue(startSplit), toValue(endSplit)] as const,
      ([start, end]) => {
         if (start === undefined || end === undefined) return;

         return initialize(start?.chars ?? [], end?.chars ?? []);
      },
      { flush: "post", immediate: true },
   );

   onScopeDispose(() => {
      disposed = true;
   });

   return { cycling };
}
