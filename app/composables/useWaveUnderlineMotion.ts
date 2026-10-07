import { onMounted, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";

type WavePath = MaybeRefOrGetter<SVGPathElement | null | undefined>;

interface WaveUnderlineMotionOptions {
   animated: MaybeRefOrGetter<boolean>;
   delay: MaybeRefOrGetter<number>;
   drawn: MaybeRefOrGetter<boolean>;
   duration: MaybeRefOrGetter<number>;
}

export function useWaveUnderlineMotion(
   pathTarget: WavePath,
   options: WaveUnderlineMotionOptions,
) {
   const { createMatchMedia, gsap, loadPlugin } = useGsap();

   onMounted(async () => {
      const DrawSVGPlugin = await loadPlugin("DrawSVGPlugin");
      if (!DrawSVGPlugin) return;

      createMatchMedia(
         {
            motion: "(prefers-reduced-motion: no-preference)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
         },
         (context) => {
            const path = toValue(pathTarget);
            if (!path) return;

            let tween: gsap.core.Tween | null = null;
            const motionAllowed = () =>
               context.conditions?.motion === true &&
               toValue(options.animated);

            gsap.set(path, {
               drawSVG: motionAllowed() ? "0% 0%" : "0% 100%",
               visibility: "visible",
            });

            const stopWatching = watch(
               [
                  () => toValue(options.drawn),
                  () => toValue(options.duration),
                  () => toValue(options.delay),
                  () => toValue(options.animated),
               ],
               ([drawn, duration, delay]) => {
                  const animate = motionAllowed();
                  tween?.kill();
                  tween = gsap.to(path, {
                     delay: drawn && animate ? Math.max(0, delay) : 0,
                     drawSVG: drawn ? "0% 100%" : "0% 0%",
                     duration: animate ? Math.max(0, duration) : 0,
                     ease: "power3.inOut",
                     overwrite: "auto",
                  });
               },
               { immediate: true },
            );

            return () => {
               stopWatching();
               tween?.kill();
               gsap.set(path, {
                  clearProps: "visibility,strokeDasharray,strokeDashoffset",
               });
            };
         },
         pathTarget,
      );
   });
}
