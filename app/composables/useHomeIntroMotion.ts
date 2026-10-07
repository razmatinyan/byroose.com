import {
   nextTick,
   onMounted,
   onScopeDispose,
   readonly,
   toValue,
   watch,
} from "vue";
import type { MaybeRefOrGetter } from "vue";
import { addStackReveal } from "@/lib/stack-reveal";
import {
   addWordReveal,
   navRevealStagger,
   wordRevealOffset,
} from "@/lib/word-reveal";
import type { SplitTextResult } from "@/lib/split-text";

export type HomeIntroState = "complete" | "pending" | "playing";
type IntroScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;

interface CardPlacement {
   startX: number;
   startY: number;
}

interface NativeScrollStyles {
   bodyOverflow: string;
   bodyOverscrollBehavior: string;
   bodyTouchAction: string;
   htmlOverflow: string;
   htmlScrollbarGutter: string;
}

const DOCK_OFFSET_Y = 40;
const HEADER_LOWER_DURATION = 0.22;
const HEADER_LOWER_STAGGER = 0.015;

const selectors = {
   action: "[data-home-intro-action]",
   actionMask: "[data-home-intro-action-mask]",
   card: "[data-home-intro-card]",
   copy: "[data-home-intro-copy]",
   removedCard: "[data-home-intro-card-remove]",
   header: "[data-home-intro-header]:not([data-page-transition-clone])",
   mediaGrid: "[data-home-intro-media-grid]",
   title: "[data-home-intro-title]",
} as const;

export function useHomeIntroState() {
   const route = useRoute();

   return useState<HomeIntroState>("home-intro-state", () =>
      route.path === "/" ? "pending" : "complete",
   );
}

function waitForSplit(source: SplitSource) {
   const current = toValue(source);
   if (current !== undefined) return Promise.resolve(current);

   return new Promise<SplitTextResult>((resolve) => {
      const stop = watch(
         () => toValue(source),
         (value) => {
            if (value === undefined) return;

            stop();
            resolve(value);
         },
      );
   });
}

function waitForImage(image: HTMLImageElement) {
   if (image.complete) return image.decode().catch(() => undefined);

   return new Promise<void>((resolve) => {
      const settle = () => {
         image.removeEventListener("error", settle);
         image.removeEventListener("load", settle);
         resolve();
      };

      image.addEventListener("error", settle, { once: true });
      image.addEventListener("load", settle, { once: true });
   }).then(() => image.decode().catch(() => undefined));
}

function getStackPlacements(
   cards: HTMLElement[],
): { placements: CardPlacement[]; stackScale: number } | null {
   const cardRects = cards.map((card) => card.getBoundingClientRect());
   const firstCard = cardRects[0];
   if (!firstCard || firstCard.width === 0) return null;

   const stackWidth = Math.min(520, Math.max(240, window.innerWidth - 40));
   const stackScale = stackWidth / firstCard.width;
   const startCenterX = window.innerWidth / 2;
   const startCenterY = window.innerHeight / 2;

   return {
      placements: cardRects.map((rect) => ({
         startX: startCenterX - (rect.left + rect.width / 2),
         startY: startCenterY - (rect.top + rect.height / 2),
      })),
      stackScale,
   };
}

function getIntroHeaders() {
   return Array.from(document.querySelectorAll<HTMLElement>(selectors.header));
}

export function useHomeIntroMotion(
   scope: IntroScope,
   titleSplitSource: SplitSource,
   descriptionSplitSource: SplitSource,
) {
   const introState = useHomeIntroState();
   introState.value = "pending";
   const startsWithPreloader = useNuxtApp().isHydrating;
   const { createContext, createMatchMedia, gsap } = useGsap();
   const { lock, refresh } = useSmoothScroll();
   const { waitForReveal } = usePageTransition();
   let nativeScrollStyles: NativeScrollStyles | null = null;
   let releaseScroll: (() => void) | null = null;
   let disposed = false;
   let preloaderAvailable = startsWithPreloader;

   function lockScroll() {
      if (releaseScroll) return;

      const html = document.documentElement;
      const body = document.body;
      nativeScrollStyles = {
         bodyOverflow: body.style.overflow,
         bodyOverscrollBehavior: body.style.overscrollBehavior,
         bodyTouchAction: body.style.touchAction,
         htmlOverflow: html.style.overflow,
         htmlScrollbarGutter: html.style.scrollbarGutter,
      };
      html.style.overflow = "hidden";
      html.style.scrollbarGutter = "stable";
      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "none";
      body.style.touchAction = "none";
      releaseScroll = lock();
   }

   function unlockScroll() {
      if (!releaseScroll || !nativeScrollStyles) return;

      const html = document.documentElement;
      const body = document.body;
      html.style.overflow = nativeScrollStyles.htmlOverflow;
      html.style.scrollbarGutter = nativeScrollStyles.htmlScrollbarGutter;
      body.style.overflow = nativeScrollStyles.bodyOverflow;
      body.style.overscrollBehavior = nativeScrollStyles.bodyOverscrollBehavior;
      body.style.touchAction = nativeScrollStyles.bodyTouchAction;
      nativeScrollStyles = null;
      releaseScroll();
      releaseScroll = null;
      refresh();
   }

   function settleMedia(
      finalImages: HTMLElement[],
      removedCards: HTMLElement[],
   ) {
      gsap.set(finalImages, { visibility: "inherit", y: DOCK_OFFSET_Y });
      for (const card of removedCards) card.hidden = true;
   }

   function completeImmediately(
      elements: HTMLElement[],
      removedCards: HTMLElement[],
      finalImages: HTMLElement[],
   ) {
      introState.value = "complete";
      gsap.set(elements, { clearProps: "all" });
      settleMedia(finalImages, removedCards);
      unlockScroll();
   }

   function lowerHeader() {
      const headers = getIntroHeaders();
      const { items, masks } = getHeaderRevealParts(headers);
      const context = createContext(() => {
         gsap.set(headers, { pointerEvents: "none", visibility: "inherit" });
         gsap.set(masks, { clipPath: "inset(0)" });
      });

      gsap.ticker.add(() => {
         if (disposed) return;

         context?.add(() => {
            gsap.to(items, {
               duration: HEADER_LOWER_DURATION,
               ease: "power2.in",
               stagger: HEADER_LOWER_STAGGER,
               yPercent: wordRevealOffset,
            });
         });
      }, true);
   }

   onMounted(async () => {
      const root = toValue(scope);
      if (!root) {
         introState.value = "complete";
         return;
      }

      const images = Array.from(
         root.querySelectorAll<HTMLElement>(selectors.card),
      );
      const firstImage = images[0];
      const removedCards = Array.from(
         root.querySelectorAll<HTMLElement>(selectors.removedCard),
      );
      const finalImages = images.filter(
         (image) => !removedCards.includes(image),
      );
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
         introState.value = "complete";
         settleMedia(finalImages, removedCards);
         return;
      }

      lockScroll();
      introState.value = "playing";

      if (!startsWithPreloader) {
         settleMedia(finalImages, removedCards);
         lowerHeader();
      }

      const preloaderImages = startsWithPreloader
         ? images.flatMap((image) => {
              const imageElement = image.querySelector<HTMLImageElement>("img");
              return imageElement ? [imageElement] : [];
           })
         : [];

      await nextTick();
      const [titleSplit, descriptionSplit] = await Promise.all([
         waitForSplit(titleSplitSource),
         waitForSplit(descriptionSplitSource),
         document.fonts.ready,
         Promise.all(preloaderImages.map(waitForImage)),
      ]);
      if (!startsWithPreloader) await waitForReveal();
      if (disposed) return;

      createMatchMedia(
         {
            desktop: "(min-width: 64rem)",
            mobile: "(max-width: 63.999rem)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            const headers = getIntroHeaders();
            const mediaGrid = root.querySelector<HTMLElement>(
               selectors.mediaGrid,
            );
            const { items: headerItems, masks: headerMasks } =
               getHeaderRevealParts(headers);
            const title = root.querySelector<HTMLElement>(selectors.title);
            const titleLines = titleSplit?.lines ?? [];
            const descriptionLines = descriptionSplit?.lines ?? [];
            const copyElements = Array.from(
               root.querySelectorAll<HTMLElement>(selectors.copy),
            );
            const actionMask = root.querySelector<HTMLElement>(
               selectors.actionMask,
            );
            const action = root.querySelector<HTMLElement>(selectors.action);
            const animatedElements = [
               ...headers,
               ...headerItems,
               ...headerMasks,
               ...(title ? [title] : []),
               ...titleLines,
               ...copyElements,
               ...descriptionLines,
               ...(action ? [action] : []),
               ...images,
               ...(mediaGrid ? [mediaGrid] : []),
            ];
            const reduceMotion = Boolean(context.conditions?.reduceMotion);

            if (introState.value === "complete" || reduceMotion) {
               completeImmediately(animatedElements, removedCards, finalImages);
               return;
            }

            if (
               !headers.length ||
               !mediaGrid ||
               !title ||
               !firstImage ||
               !finalImages.length ||
               !titleLines.length ||
               !descriptionLines.length ||
               !actionMask ||
               !action
            ) {
               completeImmediately(animatedElements, removedCards, finalImages);
               return;
            }

            const playPreloader = preloaderAvailable;
            preloaderAvailable = false;
            const placementData = playPreloader
               ? getStackPlacements(images)
               : null;
            if (playPreloader && !placementData) {
               completeImmediately(animatedElements, removedCards, finalImages);
               return;
            }

            gsap.set(headers, { pointerEvents: "none", visibility: "inherit" });
            gsap.set(headerMasks, { clipPath: "inset(0)" });
            gsap.set(titleLines, { yPercent: 150 });
            gsap.set([...descriptionLines, action], { yPercent: 115 });
            gsap.set(actionMask, { clipPath: "inset(0)" });
            gsap.set([title, ...copyElements], { visibility: "inherit" });

            const tl = gsap.timeline({
               onComplete: () => {
                  introState.value = "complete";
                  gsap.set(animatedElements, { clearProps: "all" });
                  settleMedia(finalImages, removedCards);
                  unlockScroll();
               },
            });

            if (placementData) {
               const { placements, stackScale } = placementData;
               for (const card of removedCards) card.hidden = false;
               gsap.set(mediaGrid, { zIndex: 70 });
               images.forEach((image, index) => {
                  const placement = placements[index];
                  if (!placement) return;

                  gsap.set(image, {
                     scale: 0,
                     visibility: "inherit",
                     willChange: "transform",
                     x: placement.startX,
                     y: placement.startY,
                     zIndex: index + 1,
                     rotation: 0,
                  });
               });

               addStackReveal(tl, images, { scale: stackScale });
               tl.addLabel("expand");
               tl.set(removedCards, { visibility: "hidden" }, "expand");
               tl.to(
                  finalImages,
                  {
                     duration: 1,
                     ease: "power3.inOut",
                     rotation: (index) =>
                        Number(
                           finalImages[index]?.dataset.homeIntroCardRotation ??
                              0,
                        ),
                     scale: 1.08,
                     stagger: { each: 0.06, from: "center" },
                     x: 0,
                     y: DOCK_OFFSET_Y,
                  },
                  "expand-=0.35",
               );
            } else {
               settleMedia(finalImages, removedCards);
            }

            const revealStart = placementData ? "expand+=0.1" : 0;
            tl.set(headers, { pointerEvents: "auto" }, revealStart);
            addWordReveal(tl, headerItems, {
               position: revealStart,
               stagger: navRevealStagger,
            });
            tl.to(
               titleLines,
               {
                  duration: 0.8,
                  ease: "power3.out",
                  stagger: 0.1,
                  yPercent: 0,
               },
               revealStart,
            );
            tl.to(
               [...descriptionLines, action],
               {
                  duration: 0.8,
                  ease: "power3.out",
                  stagger: 0.06,
                  yPercent: 0,
               },
               revealStart,
            );
         },
         scope,
      );
   });

   onScopeDispose(() => {
      disposed = true;
      unlockScroll();
      introState.value = "complete";
   });

   return {
      introState: readonly(introState),
   };
}
