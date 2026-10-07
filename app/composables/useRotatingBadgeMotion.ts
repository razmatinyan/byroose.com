import { onMounted, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

type MotionTarget = MaybeRefOrGetter<Element | null | undefined>;

interface SpinState {
   angle: number;
   speed: number;
}

const restingSpeed = 24;
const velocityBoost = 0.25;
const maximumBoost = 10;
const minimumVelocity = 0.2;
const boostDuration = 0.4;
const settleDelay = 0.2;
const settleDuration = 1.4;

export function useRotatingBadgeMotion(target: MotionTarget) {
   const { createMatchMedia, gsap } = useGsap();
   const { onScroll } = useSmoothScroll();
   let spin: SpinState | null = null;
   let settle: gsap.core.Tween | null = null;

   function setSpeed(speed: number, duration: number) {
      if (!spin) return;

      gsap.to(spin, {
         duration,
         ease: "power2.out",
         overwrite: true,
         speed,
      });
   }

   onScroll(({ velocity }) => {
      if (!spin || Math.abs(velocity) < minimumVelocity) return;

      const boost = Math.min(
         maximumBoost,
         1 + Math.abs(velocity) * velocityBoost,
      );
      setSpeed(Math.sign(velocity) * restingSpeed * boost, boostDuration);
      settle?.restart(true);
   });

   onMounted(() => {
      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            if (context.conditions?.reduceMotion) return;

            const element = toValue(target);
            if (!element) return;

            const state: SpinState = { angle: 0, speed: restingSpeed };
            const setRotation = gsap.quickSetter(element, "rotation", "deg");
            const tick = (_time: number, deltaTime: number) => {
               state.angle =
                  (state.angle + (state.speed * deltaTime) / 1000) % 360;
               setRotation(state.angle);
            };

            spin = state;
            settle = gsap.delayedCall(settleDelay, () =>
               setSpeed(restingSpeed, settleDuration),
            );
            settle.pause();
            gsap.ticker.add(tick);

            return () => {
               gsap.ticker.remove(tick);
               gsap.killTweensOf(state);
               settle?.kill();
               settle = null;
               spin = null;
               gsap.set(element, { clearProps: "transform" });
            };
         },
         target,
      );
   });
}
