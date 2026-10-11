import { onMounted, onScopeDispose, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import {
   servicesHeroInsetContentScale,
   servicesHeroInsetOpenProperty,
} from "@/lib/services-hero";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;

interface FlightParts {
   flyer: HTMLElement;
   layer: HTMLElement;
   origin: HTMLElement;
   target: HTMLElement;
}

interface FlightBox {
   height: number;
   left: number;
   radius: number;
   scale: number;
   top: number;
   width: number;
}

const selectors = {
   flyer: "[data-services-flight]",
   layer: "[data-services-flight-layer]",
   origin: "[data-services-flight-origin]",
   target: "[data-services-flight-target]",
} as const;

const flightEnd = "center center";

function findParts(root: HTMLElement): FlightParts | null {
   const flyer = root.querySelector<HTMLElement>(selectors.flyer);
   const layer = root.querySelector<HTMLElement>(selectors.layer);
   const origin = root.querySelector<HTMLElement>(selectors.origin);
   const target = root.querySelector<HTMLElement>(selectors.target);
   if (!flyer || !layer || !origin || !target) return null;

   return { flyer, layer, origin, target };
}

function insetOpenAmount(origin: HTMLElement) {
   const value = Number.parseFloat(
      getComputedStyle(origin).getPropertyValue(servicesHeroInsetOpenProperty),
   );

   return Number.isNaN(value) ? 1 : value;
}

function measure(element: HTMLElement, page: DOMRect, scale: number): FlightBox {
   const rect = element.getBoundingClientRect();

   return {
      height: rect.height,
      left: rect.left - page.left,
      radius:
         Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0,
      scale,
      top: rect.top - page.top,
      width: rect.width,
   };
}

export function useServicesMediaFlight(scope: MotionScope) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();
   const { refresh } = useSmoothScroll();
   let disposed = false;

   function place(root: HTMLElement, parts: FlightParts, progress: number) {
      if (!root.isConnected) return;

      const page = root.getBoundingClientRect();
      const revealScale =
         servicesHeroInsetContentScale -
         (servicesHeroInsetContentScale - 1) * insetOpenAmount(parts.origin);
      const box = gsap.utils.interpolate(
         measure(parts.origin, page, revealScale),
         measure(parts.target, page, 1),
         progress,
      );

      parts.flyer.style.borderRadius = `${box.radius}px`;
      parts.flyer.style.height = `${box.height}px`;
      parts.flyer.style.transform = `translate3d(${box.left}px, ${box.top}px, 0)`;
      parts.flyer.style.visibility = "inherit";
      parts.flyer.style.width = `${box.width}px`;
      parts.layer.style.transform = `scale(${box.scale})`;
   }

   function follow(root: HTMLElement, parts: FlightParts, progress: () => number) {
      const update = () => place(root, parts, progress());

      update();
      gsap.ticker.add(update);

      return () => {
         gsap.ticker.remove(update);
         gsap.set([parts.flyer, parts.layer], { clearProps: "all" });
      };
   }

   onMounted(async () => {
      const ScrollTrigger = await loadPlugin("ScrollTrigger");
      const root = toValue(scope);
      const parts = root ? findParts(root) : null;
      if (disposed || !ScrollTrigger || !root || !parts) return;

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion)
               return follow(root, parts, () => 1);

            const flight = ScrollTrigger.create({
               end: flightEnd,
               invalidateOnRefresh: true,
               start: 0,
               trigger: parts.target,
            });

            return follow(root, parts, () => flight.progress);
         },
         scope,
      );

      await refresh();
   });

   onScopeDispose(() => {
      disposed = true;
   });
}
