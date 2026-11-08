import type { CustomEase as CustomEasePlugin } from "gsap/CustomEase";

export const slideDuration = 0.65;

const slideEaseName = "nav-link-slide";
const slideEaseData = "M0,0 C0.16,1 0.35,1 1,1";

export function registerSlideEase(CustomEase: typeof CustomEasePlugin) {
	return (
		CustomEase.get(slideEaseName) ??
		CustomEase.create(slideEaseName, slideEaseData)
	);
}
