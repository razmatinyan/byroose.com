import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { HomeIntroState } from "./useHomeIntroMotion";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type IntroStateSource = MaybeRefOrGetter<HomeIntroState>;

interface FeaturedCardTransform {
	scale: number;
	x: number;
	y: number;
}

const selectors = {
	card: "[data-home-hero-scroll-card]",
	hero: "[data-home-hero-scroll]",
} as const;

function getFeaturedCardTransform(
	hero: HTMLElement,
	card: HTMLElement,
): FeaturedCardTransform {
	let offsetLeft = card.offsetLeft;
	let offsetTop = card.offsetTop;
	let offsetParent = card.offsetParent;

	while (offsetParent instanceof HTMLElement && offsetParent !== hero) {
		offsetLeft += offsetParent.offsetLeft;
		offsetTop += offsetParent.offsetTop;
		offsetParent = offsetParent.offsetParent;
	}

	const availableWidth = window.innerWidth * 0.92;
	const availableHeight = window.innerHeight * 0.82;
	const scale = Math.min(
		availableWidth / card.offsetWidth,
		availableHeight / card.offsetHeight,
	);

	return {
		scale,
		x: window.innerWidth / 2 - (offsetLeft + card.offsetWidth / 2),
		y: window.innerHeight / 2 - (offsetTop + card.offsetHeight / 2),
	};
}

export function useHomeHeroScrollMotion(
	scope: MotionScope,
	introStateSource: IntroStateSource,
) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap();
	const { refresh } = useSmoothScroll();
	let disposed = false;
	let initialized = false;

	async function initialize() {
		if (initialized || disposed) return;

		initialized = true;
		await nextTick();
		const ScrollTrigger = await loadPlugin("ScrollTrigger");
		if (!ScrollTrigger || disposed) return;

		const root = toValue(scope);
		const hero = root?.querySelector<HTMLElement>(selectors.hero);
		const featuredCard = hero?.querySelector<HTMLElement>(selectors.card);
		if (!hero || !featuredCard) return;

		createMatchMedia(
			"(prefers-reduced-motion: no-preference)",
			() => {
				gsap.set(featuredCard, {
					transformOrigin: "center center",
					willChange: "transform",
					zIndex: 50,
				});

				const timeline = gsap.timeline({
					scrollTrigger: {
						anticipatePin: 1,
						end: () => `+=${window.innerHeight}`,
						invalidateOnRefresh: true,
						pin: hero,
						pinSpacing: true,
						scrub: true,
						start: "top top",
						trigger: hero,
					},
				});

				timeline.to(
					featuredCard,
					{
						duration: 0.38,
						ease: "none",
						force3D: true,
						rotation: 0,
						x: () => getFeaturedCardTransform(hero, featuredCard).x,
						y: () => getFeaturedCardTransform(hero, featuredCard).y,
					},
					0,
				);
				timeline.to(
					featuredCard,
					{
						duration: 0.88,
						ease: "none",
						force3D: true,
						scale: () =>
							getFeaturedCardTransform(hero, featuredCard).scale,
					},
					0.12,
				);
			},
			scope,
		);

		await refresh();
	}

	watch(
		() => toValue(introStateSource),
		(state) => {
			if (state === "complete") return initialize();
		},
		{ flush: "post" },
	);

	onScopeDispose(() => {
		disposed = true;
	});
}
