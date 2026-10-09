import { onMounted } from "vue";
import type { TransitionProps } from "vue";

type ScrollTriggerPlugin = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type ScrollTriggerInstance = ReturnType<ScrollTriggerPlugin["getAll"]>[number];

interface TransitionPart {
   done: () => void;
   element: HTMLElement;
}

interface FrozenScene {
   clones: HTMLElement[];
   followers: HTMLElement[];
   headers: HTMLElement[];
}

interface TransitionScene {
   clones: HTMLElement[];
   enter: TransitionPart | null;
   followers: HTMLElement[];
   headers: HTMLElement[];
   leave: TransitionPart | null;
   shade: HTMLElement | null;
}

const transitionDuration = 1.1;
const transitionEaseData = "0.73, 0.05, 0.112, 1";
const leaveScale = 0.97;
const leaveTravel = 0.25;
const shadeOpacity = 0.8;
const revealDelay = 0.4;
const enteringLayer = 20;
const cloneLayer = 5;
const cloneAttribute = "data-page-transition-clone";
const followSelector = "[data-page-transition-follow]";
const headerSelector = "[data-page-transition-header]";
const overlaySelector = "[data-page-transition-overlay]";
const shadeSelector = "[data-page-transition-shade]";
const enteringProps =
   "backgroundColor,left,minHeight,paddingTop,position,right,top,transform,zIndex";

function prefersReducedMotion() {
   return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function asTransitionPart(element: Element, done: () => void) {
   return element instanceof HTMLElement ? { done, element } : null;
}

function isVisible(element: HTMLElement) {
   return getComputedStyle(element).visibility !== "hidden";
}

function viewportCenterOrigin(element: HTMLElement) {
   const bounds = element.getBoundingClientRect();
   const x = window.innerWidth / 2 - bounds.left;
   const y = window.innerHeight / 2 - bounds.top;
   return `${x}px ${y}px`;
}

export function usePageTransitionMotion(): TransitionProps {
   const { gsap, loadPlugin } = useGsap();
   const { $pageTransition } = useNuxtApp();
   const { reset: resetScroll } = useSmoothScroll();
   let ease: gsap.EaseString | gsap.EaseFunction = "power3.inOut";
   let scrollTrigger: ScrollTriggerPlugin | null = null;
   let leaving: TransitionPart | null = null;
   let entering: TransitionPart | null = null;
   let frozen: FrozenScene | null = null;
   let isScheduled = false;

   onMounted(async () => {
      const [CustomEase, ScrollTrigger] = await Promise.all([
         loadPlugin("CustomEase"),
         loadPlugin("ScrollTrigger"),
      ]);
      if (CustomEase) {
         ease = CustomEase.create("page-transition", transitionEaseData);
      }
      scrollTrigger = ScrollTrigger;
   });

   function anchorPinnedElements(page: HTMLElement) {
      if (!scrollTrigger) return;

      const bounds = page.getBoundingClientRect();
      for (const trigger of scrollTrigger.getAll()) {
         const pin = trigger.pin;
         if (!(pin instanceof HTMLElement) || !page.contains(pin)) continue;

         const style = getComputedStyle(pin);
         if (style.position !== "fixed") continue;

         gsap.set(pin, {
            left: Number.parseFloat(style.left) - bounds.left,
            top: Number.parseFloat(style.top) - bounds.top,
         });
      }
   }

   function cloneInPlace(source: HTMLElement) {
      const clone = source.cloneNode(true);
      if (!(clone instanceof HTMLElement)) return [];

      const bounds = source.getBoundingClientRect();
      clone.inert = true;
      clone.removeAttribute("id");
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute(cloneAttribute, "");
      for (const element of clone.querySelectorAll("[id]")) {
         element.removeAttribute("id");
      }
      document.body.append(clone);
      clone.scrollTop = source.scrollTop;
      gsap.set(clone, {
         boxSizing: "border-box",
         height: bounds.height,
         left: bounds.left,
         margin: 0,
         position: "fixed",
         top: bounds.top,
         width: bounds.width,
         zIndex: cloneLayer,
      });
      return [clone];
   }

   function pauseScrollTriggers() {
      const triggers = scrollTrigger?.getAll() ?? [];
      for (const trigger of triggers) trigger.disable(false);
      return triggers;
   }

   function resumeScrollTriggers(triggers: ScrollTriggerInstance[]) {
      const remaining = new Set(scrollTrigger?.getAll());
      for (const trigger of triggers) {
         if (remaining.has(trigger)) trigger.enable(false, false);
      }
   }

   function freeze(page: HTMLElement): FrozenScene {
      const triggers = pauseScrollTriggers();
      const followers = Array.from(
         document.querySelectorAll<HTMLElement>(followSelector),
      );
      const headers = Array.from(
         document.querySelectorAll<HTMLElement>(headerSelector),
      );
      const overlays = Array.from(
         document.querySelectorAll<HTMLElement>(overlaySelector),
      ).filter(isVisible);
      const clones = [...overlays, ...headers].flatMap(cloneInPlace);

      $pageTransition.deferCleanup(() => resumeScrollTriggers(triggers));
      anchorPinnedElements(page);
      gsap.set([page, ...followers], { y: -window.scrollY });
      resetScroll();
      return { clones, followers, headers };
   }

   function complete({
      clones,
      enter,
      followers,
      headers,
      leave,
      shade,
   }: TransitionScene) {
      leave?.done();
      for (const clone of clones) clone.remove();
      if (followers.length) {
         gsap.set(followers, { clearProps: "transform,transformOrigin" });
      }
      if (headers.length) gsap.set(headers, { clearProps: "transform" });
      if (shade) gsap.set(shade, { clearProps: "opacity,visibility" });
      if (enter) gsap.set(enter.element, { clearProps: enteringProps });
      $pageTransition.finish();
      enter?.done();
   }

   function run() {
      isScheduled = false;
      const leave = leaving;
      const enter = entering;
      const { clones, followers, headers } = frozen ?? {
         clones: [],
         followers: [],
         headers: [],
      };
      leaving = null;
      entering = null;
      frozen = null;

      if (prefersReducedMotion()) {
         complete({
            clones,
            enter,
            followers,
            headers: [],
            leave,
            shade: null,
         });
         return;
      }

      const shade = document.querySelector<HTMLElement>(shadeSelector);
      const risingHeaders = enter ? headers : [];
      const leavingSurfaces = leave
         ? [leave.element, ...followers, ...clones]
         : [];
      const scene = {
         clones,
         enter,
         followers,
         headers: risingHeaders,
         leave,
         shade,
      };

      for (const surface of leavingSurfaces) {
         gsap.set(surface, { transformOrigin: viewportCenterOrigin(surface) });
      }
      if (risingHeaders.length) {
         gsap.set(risingHeaders, { y: window.innerHeight });
      }
      $pageTransition.move();

      const timeline = gsap.timeline({
         defaults: { duration: transitionDuration, ease },
         onComplete: () => complete(scene),
         paused: true,
      });

      if (leavingSurfaces.length) {
         timeline.to(
            leavingSurfaces,
            { scale: leaveScale, y: `-=${window.innerHeight * leaveTravel}` },
            0,
         );
      }
      if (leave && shade) {
         timeline.fromTo(
            shade,
            { autoAlpha: 0 },
            { autoAlpha: shadeOpacity },
            0,
         );
      }
      if (enter) timeline.to([enter.element, ...risingHeaders], { y: 0 }, 0);
      timeline.call($pageTransition.reveal, undefined, revealDelay);

      gsap.ticker.add(() => {
         timeline.play();
      }, true);
   }

   function schedule() {
      if (isScheduled) return;

      isScheduled = true;
      queueMicrotask(run);
   }

   function onBeforeEnter(element: Element) {
      if (!(element instanceof HTMLElement) || prefersReducedMotion()) return;

      gsap.set(element, {
         backgroundColor: getComputedStyle(document.body).backgroundColor,
         left: 0,
         minHeight: "100svh",
         position: "fixed",
         right: 0,
         top: 0,
         y: window.innerHeight,
         zIndex: enteringLayer,
      });
   }

   function onEnter(element: Element, done: () => void) {
      $pageTransition.claim();
      entering = asTransitionPart(element, done);
      if (!entering) {
         done();
         return;
      }

      if (!prefersReducedMotion()) {
         const host = element.parentElement;
         gsap.set(element, {
            paddingTop: host ? host.getBoundingClientRect().top + window.scrollY : 0,
         });
      }
      schedule();
   }

   function onLeave(element: Element, done: () => void) {
      $pageTransition.claim();
      leaving = asTransitionPart(element, done);
      if (!leaving) {
         done();
         return;
      }

      if (!prefersReducedMotion()) frozen = freeze(leaving.element);
      schedule();
   }

   return {
      css: false,
      onBeforeEnter,
      onEnter,
      onLeave,
   };
}
