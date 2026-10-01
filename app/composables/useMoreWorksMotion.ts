import { nextTick, onScopeDispose, shallowRef, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { SplitTextResult } from "@/lib/split-text";

type MotionTarget = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;
type ScrollTriggerPlugin = typeof import("gsap/ScrollTrigger").ScrollTrigger;

interface MoreWorksMotionTargets {
   endSplit: SplitSource;
   endWord: MotionTarget;
   media: MotionTarget;
   panel: MotionTarget;
   startSplit: SplitSource;
   startWord: MotionTarget;
}

interface MoreWorksElements {
   endWord: HTMLElement;
   media: HTMLElement;
   panel: HTMLElement;
   startWord: HTMLElement;
   track: HTMLElement;
}

const headerLine = 40;
const charsRevealStart = "top 30%";
const charDuration = 0.6;
const charStagger = 0.06;
const mediaStartScale = 0.55;
const wordSpread = 0.22;

export function useMoreWorksMotion(
   track: MotionTarget,
   { endSplit, endWord, media, panel, startSplit, startWord }: MoreWorksMotionTargets,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   const { setCoversHeader } = useHeaderSurface();
   const cycling = shallowRef(false);
   let disposed = false;
   let initialized = false;

   function resolveElements(): MoreWorksElements | null {
      const endWordElement = toValue(endWord);
      const mediaElement = toValue(media);
      const panelElement = toValue(panel);
      const startWordElement = toValue(startWord);
      const trackElement = toValue(track);

      if (
         !endWordElement ||
         !mediaElement ||
         !panelElement ||
         !startWordElement ||
         !trackElement
      ) {
         return null;
      }

      return {
         endWord: endWordElement,
         media: mediaElement,
         panel: panelElement,
         startWord: startWordElement,
         track: trackElement,
      };
   }

   function revealChars(
      startChars: HTMLElement[],
      endChars: HTMLElement[],
      trigger: HTMLElement,
   ) {
      const chars = [...startChars, ...endChars];
      if (!chars.length) return;

      gsap.set(chars, { opacity: 0 });

      const reveal = {
         duration: charDuration,
         ease: "power2.out",
         opacity: 1,
         stagger: charStagger,
      };

      gsap
         .timeline({
            scrollTrigger: {
               once: true,
               start: charsRevealStart,
               trigger,
            },
         })
         .to([...startChars].reverse(), reveal, 0)
         .to(endChars, reveal, 0);
   }

   function convergeTitle({ endWord, media, startWord, track }: MoreWorksElements) {
      const spread = () => window.innerWidth * wordSpread;

      gsap
         .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
               end: "+=100%",
               invalidateOnRefresh: true,
               pin: true,
               refreshPriority: 1,
               scrub: true,
               start: "top top",
               trigger: track,
            },
         })
         .fromTo(startWord, { x: () => -spread() }, { x: 0 }, 0)
         .fromTo(endWord, { x: spread }, { x: 0 }, 0)
         .fromTo(media, { scale: mediaStartScale }, { scale: 1 }, 0);
   }

   function syncPanel(panel: HTMLElement, motion: boolean) {
      const { bottom, top } = panel.getBoundingClientRect();

      setCoversHeader(top <= headerLine && bottom >= headerLine);
      cycling.value = motion && bottom > 0 && top < window.innerHeight;
   }

   function releasePanel() {
      setCoversHeader(false);
      cycling.value = false;
   }

   function trackPanel(
      ScrollTrigger: ScrollTriggerPlugin,
      { panel, track }: MoreWorksElements,
      motion: boolean,
   ) {
      ScrollTrigger.create({
         end: () => `+=${track.offsetHeight + window.innerHeight * 2}`,
         invalidateOnRefresh: true,
         onRefresh: () => syncPanel(panel, motion),
         onToggle: (self) => {
            if (self.isActive) syncPanel(panel, motion);
            else releasePanel();
         },
         onUpdate: () => syncPanel(panel, motion),
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
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            const motion = Boolean(context.conditions?.motion);

            if (motion) {
               revealChars(startChars, endChars, elements.track);
               convergeTitle(elements);
            }

            trackPanel(ScrollTrigger, elements, motion);

            return releasePanel;
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
