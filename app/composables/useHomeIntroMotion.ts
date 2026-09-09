import {
   nextTick,
   onMounted,
   onScopeDispose,
   readonly,
   shallowRef,
   toValue,
   watch,
} from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { SplitTextResult } from "@/lib/split-text";

type IntroState = "complete" | "pending" | "playing";
type IntroScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type TitleSplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;

interface TravelPlacement {
   dockX: number;
   dockY: number;
}

interface CardPlacement extends TravelPlacement {
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

const selectors = {
   backdrop: "[data-home-intro-backdrop]",
   card: "[data-home-intro-card]",
   removedCard: "[data-home-intro-card-remove]",
   header: "[data-home-intro-header]",
   mediaGrid: "[data-home-intro-media-grid]",
   title: "[data-home-intro-title]",
} as const;

function waitForTitleSplit(source: TitleSplitSource) {
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

function getPlacements(
   cards: HTMLElement[],
   mediaGrid: HTMLElement,
   dockImage: HTMLElement,
): { placements: CardPlacement[]; stackScale: number } | null {
   const cardRects = cards.map((card) => card.getBoundingClientRect());
   const firstCard = cardRects[0];
   if (!firstCard || firstCard.width === 0) return null;

   const mediaRect = mediaGrid.getBoundingClientRect();
   const dockImageRect = dockImage.getBoundingClientRect();
   const stackWidth = Math.min(520, Math.max(240, window.innerWidth - 40));
   const stackScale = stackWidth / firstCard.width;
   const startCenterX = window.innerWidth / 2;
   const startCenterY = window.innerHeight / 2;
   const dockCenterX = mediaRect.left + mediaRect.width / 2;
   const dockCenterY =
      dockImageRect.top + dockImageRect.height / 2 + DOCK_OFFSET_Y;

   return {
      placements: cardRects.map((rect) => ({
         dockX: dockCenterX - (rect.left + rect.width / 2),
         dockY: dockCenterY - (rect.top + rect.height / 2),
         startX: startCenterX - (rect.left + rect.width / 2),
         startY: startCenterY - (rect.top + rect.height / 2),
      })),
      stackScale,
   };
}

function getTravelPlacements(
   images: HTMLElement[],
   mediaGrid: HTMLElement,
   dockImage: HTMLElement,
   getTranslation: (image: HTMLElement) => { x: number; y: number },
): TravelPlacement[] {
   const mediaRect = mediaGrid.getBoundingClientRect();
   const dockImageRect = dockImage.getBoundingClientRect();
   const dockImageTranslation = getTranslation(dockImage);
   const dockCenterX = mediaRect.left + mediaRect.width / 2;
   const dockCenterY =
      dockImageRect.top +
      dockImageRect.height / 2 -
      dockImageTranslation.y +
      DOCK_OFFSET_Y;

   return images.map((image) => {
      const rect = image.getBoundingClientRect();
      const translation = getTranslation(image);

      return {
         dockX: translation.x + dockCenterX - (rect.left + rect.width / 2),
         dockY: translation.y + dockCenterY - (rect.top + rect.height / 2),
      };
   });
}

export function useHomeIntroMotion(
   scope: IntroScope,
   titleSplitSource: TitleSplitSource,
) {
   const introState = shallowRef<IntroState>("pending");
   const startsWithPreloader = useNuxtApp().isHydrating;
   const { createMatchMedia, gsap } = useGsap();
   const { ready, refresh, start, stop } = useSmoothScroll();
   let nativeScrollStyles: NativeScrollStyles | null = null;
   let scrollLocked = false;
   let disposed = false;
   let preloaderAvailable = startsWithPreloader;

   function lockScroll() {
      if (scrollLocked) return;

      const html = document.documentElement;
      const body = document.body;
      nativeScrollStyles = {
         bodyOverflow: body.style.overflow,
         bodyOverscrollBehavior: body.style.overscrollBehavior,
         bodyTouchAction: body.style.touchAction,
         htmlOverflow: html.style.overflow,
         htmlScrollbarGutter: html.style.scrollbarGutter,
      };
      scrollLocked = true;
      html.style.overflow = "hidden";
      html.style.scrollbarGutter = "stable";
      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "none";
      body.style.touchAction = "none";
      stop();
      void ready().then(() => {
         if (scrollLocked) stop();
      });
   }

   function unlockScroll() {
      if (!scrollLocked || !nativeScrollStyles) return;

      const html = document.documentElement;
      const body = document.body;
      html.style.overflow = nativeScrollStyles.htmlOverflow;
      html.style.scrollbarGutter = nativeScrollStyles.htmlScrollbarGutter;
      body.style.overflow = nativeScrollStyles.bodyOverflow;
      body.style.overscrollBehavior = nativeScrollStyles.bodyOverscrollBehavior;
      body.style.touchAction = nativeScrollStyles.bodyTouchAction;
      nativeScrollStyles = null;
      scrollLocked = false;
      start();
      void refresh();
   }

   function completeImmediately(
      backdrop: HTMLElement | null,
      elements: HTMLElement[],
      removedCards: HTMLElement[],
      finalImages: HTMLElement[],
   ) {
      introState.value = "complete";
      if (backdrop) backdrop.hidden = true;
      gsap.set(elements, { clearProps: "all" });
      gsap.set(finalImages, { y: DOCK_OFFSET_Y });
      for (const card of removedCards) card.hidden = true;
      unlockScroll();
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
      const notFirstImages = images.slice(1);
      const lastImage = images[images.length - 1];
      const notLastImages = images.slice(0, -1);
      const removedCards = Array.from(
         root.querySelectorAll<HTMLElement>(selectors.removedCard),
      );
      const finalImages = images.filter(
         (image) => !removedCards.includes(image),
      );
      const dockImage = finalImages[0];
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
         introState.value = "complete";
         const backdrop = root.querySelector<HTMLElement>(selectors.backdrop);
         if (backdrop) backdrop.hidden = true;
         gsap.set(finalImages, { y: DOCK_OFFSET_Y });
         for (const card of removedCards) card.hidden = true;
         return;
      }

      lockScroll();
      introState.value = "playing";

      const imageElements = images.flatMap((image) => {
         const imageElement = image.querySelector<HTMLImageElement>("img");
         return imageElement ? [imageElement] : [];
      });

      await nextTick();
      const [titleSplit] = await Promise.all([
         waitForTitleSplit(titleSplitSource),
         document.fonts.ready,
         Promise.all(imageElements.map(waitForImage)),
      ]);
      if (disposed) return;

      createMatchMedia(
         {
            desktop: "(min-width: 64rem)",
            mobile: "(max-width: 63.999rem)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            const backdrop = root.querySelector<HTMLElement>(
               selectors.backdrop,
            );
            const header = root.querySelector<HTMLElement>(selectors.header);
            const mediaGrid = root.querySelector<HTMLElement>(
               selectors.mediaGrid,
            );
            const title = root.querySelector<HTMLElement>(selectors.title);
            const titleLines = titleSplit?.lines ?? [];
            const animatedElements = [
               ...(header ? [header] : []),
               ...(title ? [title] : []),
               ...titleLines,
               ...images,
               ...(mediaGrid ? [mediaGrid] : []),
            ];
            const reduceMotion = Boolean(context.conditions?.reduceMotion);

            if (introState.value === "complete" || reduceMotion) {
               completeImmediately(
                  backdrop,
                  animatedElements,
                  removedCards,
                  finalImages,
               );
               return;
            }

            if (
               !backdrop ||
               !header ||
               !mediaGrid ||
               !title ||
               !firstImage ||
               !lastImage ||
               !dockImage ||
               !titleLines.length
            ) {
               completeImmediately(
                  backdrop,
                  animatedElements,
                  removedCards,
                  finalImages,
               );
               return;
            }

            const placementData = getPlacements(images, mediaGrid, dockImage);
            if (!placementData) {
               completeImmediately(
                  backdrop,
                  animatedElements,
                  removedCards,
                  finalImages,
               );
               return;
            }

            const { placements, stackScale } = placementData;
            const playPreloader = preloaderAvailable;
            preloaderAvailable = false;
            backdrop.hidden = false;
            for (const card of removedCards) card.hidden = false;

            gsap.set(backdrop, {
               autoAlpha: 1,
               scaleY: 1,
               transformOrigin: "bottom center",
            });
            gsap.set(header, {
               autoAlpha: 0,
               pointerEvents: "none",
               y: -24,
            });
            gsap.set(titleLines, {
               yPercent: 115,
            });
            gsap.set(title, { visibility: "inherit" });
            gsap.set(mediaGrid, { zIndex: 70 });
            images.forEach((image, index) => {
               const placement = placements[index];
               if (!placement) return;

               gsap.set(image, {
                  scale: playPreloader ? 0 : stackScale,
                  visibility: "inherit",
                  willChange: "transform",
                  x: placement.startX,
                  y: placement.startY,
                  zIndex: index + 1,
                  rotation: 0,
               });
            });

            const duration = 1;
            let travelPlacements: TravelPlacement[] = placements;
            const tl = gsap.timeline({
               onComplete: () => {
                  introState.value = "complete";
                  backdrop.hidden = true;
                  gsap.set(animatedElements, { clearProps: "all" });
                  gsap.set(finalImages, { y: DOCK_OFFSET_Y });
                  for (const card of removedCards) card.hidden = true;
                  unlockScroll();
               },
            });

            if (playPreloader) {
               tl.to(firstImage, {
                  duration,
                  ease: "power3.out",
                  scale: stackScale,
               });
               tl.to(
                  notFirstImages,
                  {
                     duration,
                     ease: "power3.out",
                     scale: stackScale,
                     stagger: 0.12,
                  },
                  `<${duration / 3}`,
               );
            }

            tl.call(() => {
               travelPlacements = getTravelPlacements(
                  images,
                  mediaGrid,
                  dockImage,
                  (image) => ({
                     x:
                        Number.parseFloat(
                           String(gsap.getProperty(image, "x")),
                        ) || 0,
                     y:
                        Number.parseFloat(
                           String(gsap.getProperty(image, "y")),
                        ) || 0,
                  }),
               );
            });

            const totalMoveDuration =
               duration + 0.12 * (notLastImages.length - 1);

            tl.to(notLastImages, {
               duration,
               ease: "power2.inOut",
               stagger: 0.1,
               x: (index) => travelPlacements[index]?.dockX ?? 0,
               y: (index) => travelPlacements[index]?.dockY ?? 0,
            });
            tl.to(
               images,
               {
                  duration,
                  keyframes: {
                     "15%": {
                        ease: "power2.in",
                        scale: stackScale * 1.15,
                     },
                     "45%": {
                        ease: "power2.out",
                        scale: stackScale * 1.3,
                     },
                     "100%": {
                        ease: "power3.inOut",
                        scale: stackScale,
                     },
                  },
                  stagger: 0.1,
               },
               "<",
            );
            tl.to(
               backdrop,
               {
                  duration: totalMoveDuration,
                  ease: "power2.inOut",
                  scaleY: 0,
               },
               "<",
            );
            tl.to(
               lastImage,
               {
                  duration,
                  ease: "power2.inOut",
                  x: () => travelPlacements[images.length - 1]?.dockX ?? 0,
                  y: () => travelPlacements[images.length - 1]?.dockY ?? 0,
               },
               `<${duration - 0.1}`,
            );
            tl.addLabel("expand");
            tl.set(removedCards, { visibility: "hidden" }, "expand");
            tl.to(
               finalImages,
               {
                  duration: 0.92,
                  ease: "power3.inOut",
                  rotation: (index) =>
                     Number(
                        finalImages[index]?.dataset.homeIntroCardRotation ?? 0,
                     ),
                  scale: 1.08,
                  stagger: { each: 0.055, from: "center" },
                  x: 0,
                  y: DOCK_OFFSET_Y,
               },
               "expand",
            );
            tl.to(
               header,
               {
                  autoAlpha: 1,
                  duration: 0.72,
                  ease: "power3.out",
                  pointerEvents: "auto",
                  y: 0,
               },
               "<+0.4",
            );
            tl.to(
               titleLines,
               {
                  duration: 0.8,
                  ease: "power3.out",
                  stagger: 0.1,
                  yPercent: 0,
               },
               "-=0.6",
            );
         },
         scope,
      );
   });

   onScopeDispose(() => {
      disposed = true;
      unlockScroll();
   });

   return {
      introState: readonly(introState),
   };
}
