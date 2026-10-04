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

export function useFitText(text: MaybeComputedElementRef) {
   let scale = 1;

   function fit() {
      const element = unrefElement(text);
      if (!(element instanceof HTMLElement) || !element.parentElement) return;

      const width = element.getBoundingClientRect().width;
      const available = contentWidthOf(element.parentElement);
      if (width <= 0 || available <= 0) return;

      const ratio = available / width;
      if (Math.abs(ratio - 1) < fitTolerance) return;

      scale *= ratio;
      element.style.setProperty(fitScaleProperty, String(scale));
   }

   useResizeObserver(text, fit);
}
