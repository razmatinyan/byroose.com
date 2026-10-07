import { onMounted } from "vue";
import type { TransitionProps } from "vue";

type ScrollTriggerPlugin = typeof import("gsap/ScrollTrigger").ScrollTrigger;

interface TransitionPart {
   done: () => void;
   element: HTMLElement;
}

const transitionDuration = 1.1;
const transitionEaseData = "0.73, 0.05, 0.112, 1";
const leaveScale = 0.97;
const leaveTravel = 0.25;
const shadeOpacity = 0.8;
const revealDelay = 0.4;
const enteringLayer = 20;
const followSelector = "[data-page-transition-follow]";
const shadeSelector = "[data-page-transition-shade]";
const enteringProps =
   "backgroundColor,left,minHeight,paddingTop,position,right,top,transform,zIndex";

function prefersReducedMotion() {
   return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function asTransitionPart(element: Element, done: () => void) {
   return element instanceof HTMLElement ? { done, element } : null;
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
   let ease: gsap.EaseString | gsap.EaseFunction = "power3.inOut";
   let scrollTrigger: ScrollTriggerPlugin | null = null;
   let leaving: TransitionPart | null = null;
   let entering: TransitionPart | null = null;
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

   function complete(
      leave: TransitionPart | null,
      enter: TransitionPart | null,
      followers: HTMLElement[],
      shade: HTMLElement | null,
   ) {
      leave?.done();
      if (followers.length) {
         gsap.set(followers, { clearProps: "transform,transformOrigin" });
      }
      if (shade) gsap.set(shade, { clearProps: "opacity,visibility" });
      if (enter) gsap.set(enter.element, { clearProps: enteringProps });
      $pageTransition.finish();
      enter?.done();
   }

   function run() {
      isScheduled = false;
      const leave = leaving;
      const enter = entering;
      leaving = null;
      entering = null;

      if (prefersReducedMotion()) {
         complete(leave, enter, [], null);
         return;
      }

      const shade = document.querySelector<HTMLElement>(shadeSelector);
      const followers = leave
         ? Array.from(document.querySelectorAll<HTMLElement>(followSelector))
         : [];
      const leavingSurfaces = leave ? [leave.element, ...followers] : [];

      if (leave) anchorPinnedElements(leave.element);
      for (const surface of leavingSurfaces) {
         gsap.set(surface, { transformOrigin: viewportCenterOrigin(surface) });
      }

      const timeline = gsap.timeline({
         defaults: { duration: transitionDuration, ease },
         onComplete: () => complete(leave, enter, followers, shade),
         paused: true,
      });

      if (leavingSurfaces.length) {
         timeline.to(
            leavingSurfaces,
            { scale: leaveScale, y: -window.innerHeight * leaveTravel },
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
      if (enter) timeline.to(enter.element, { y: 0 }, 0);
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

      schedule();
   }

   return {
      css: false,
      onBeforeEnter,
      onEnter,
      onLeave,
   };
}
