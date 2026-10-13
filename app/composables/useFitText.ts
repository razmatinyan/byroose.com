import { unrefElement, useResizeObserver } from "@vueuse/core";
import type { MaybeComputedElementRef } from "@vueuse/core";

const fitScaleProperty = "--fit-text-scale";
const fitTolerance = 0.002;

function contentWidthOf(element: HTMLElement) {
   const style = getComputedStyle(element);

   return (
      element.getBoundingClientRect().width -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight) -
      parseFloat(style.borderLeftWidth) -
      parseFloat(style.borderRightWidth)
   );
}

interface FitTextOptions {
   maxScale?: number;
}

export function useFitText(
   text: MaybeComputedElementRef,
   { maxScale = Number.POSITIVE_INFINITY }: FitTextOptions = {},
) {
   let scale = 1;

   function fit() {
      const element = unrefElement(text);
      if (!(element instanceof HTMLElement) || !element.parentElement) return;

      const width = element.getBoundingClientRect().width;
      const available = contentWidthOf(element.parentElement);
      if (width <= 0 || available <= 0) return;

      const ratio = available / width;
      if (Math.abs(ratio - 1) < fitTolerance) return;

      const nextScale = Math.min(scale * ratio, maxScale);
      if (nextScale === scale) return;

      scale = nextScale;
      element.style.setProperty(fitScaleProperty, String(scale));
   }

   useResizeObserver(text, fit);
}
