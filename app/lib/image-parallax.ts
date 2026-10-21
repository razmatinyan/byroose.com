export const imageParallaxScale = 1.3;
export const imageParallaxShift = 14;
export const imageParallaxStart = "top bottom";
export const imageParallaxEnd = "bottom top";

export function imageParallaxShiftFor(scale: number) {
   return (imageParallaxShift * (scale - 1)) / (imageParallaxScale - 1);
}
