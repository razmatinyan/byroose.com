import { onMounted } from "vue";
import type { TransitionProps } from "vue";

type ScrollTriggerPlugin = typeof import("gsap/ScrollTrigger").ScrollTrigger;

interface TransitionPart {
   done: () => void;
   element: HTMLElement;
}

interface TransitionScene {
   enter: TransitionPart | null;
   followers: HTMLElement[];
   headerClones: HTMLElement[];
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
const headerCloneLayer = 5;
const cloneAttribute = "data-page-transition-clone";
const followSelector = "[data-page-transition-follow]";
const headerSelector = "[data-page-transition-header]";
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
   const x = document.documentElement.clientWidth / 2 - bounds.left;
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

   function cloneHeader(header: HTMLElement) {
      const clone = header.cloneNode(true);
      if (!(clone instanceof HTMLElement)) return [];

      const bounds = header.getBoundingClientRect();
      clone.inert = true;
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute(cloneAttribute, "");
      for (const element of clone.querySelectorAll("[id]")) {
         element.removeAttribute("id");
      }
      document.body.append(clone);
      gsap.set(clone, {
         boxSizing: "border-box",
         height: bounds.height,
         left: bounds.left,
         margin: 0,
         position: "fixed",
         top: bounds.top,
         width: bounds.width,
         zIndex: headerCloneLayer,
      });
      return [clone];
   }

   function complete({
      enter,
      followers,
      headerClones,
      headers,
      leave,
      shade,
   }: TransitionScene) {
      leave?.done();
      for (const clone of headerClones) clone.remove();
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
      leaving = null;
      entering = null;

      if (prefersReducedMotion()) {
         complete({
            enter,
            followers: [],
            headerClones: [],
            headers: [],
            leave,
            shade: null,
         });
         return;
      }

      const shade = document.querySelector<HTMLElement>(shadeSelector);
      const followers = leave
         ? Array.from(document.querySelectorAll<HTMLElement>(followSelector))
         : [];
      const headers =
         leave && enter
            ? Array.from(document.querySelectorAll<HTMLElement>(headerSelector))
            : [];
      const headerClones = headers.flatMap(cloneHeader);
      const leavingSurfaces = leave
         ? [leave.element, ...followers, ...headerClones]
         : [];
      const scene = { enter, followers, headerClones, headers, leave, shade };

      if (leave) anchorPinnedElements(leave.element);
      for (const surface of leavingSurfaces) {
         gsap.set(surface, { transformOrigin: viewportCenterOrigin(surface) });
      }
      if (headers.length) gsap.set(headers, { y: window.innerHeight });
      $pageTransition.move();

      const timeline = gsap.timeline({
         defaults: { duration: transitionDuration, ease },
         onComplete: () => complete(scene),
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
      if (enter) timeline.to([enter.element, ...headers], { y: 0 }, 0);
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
