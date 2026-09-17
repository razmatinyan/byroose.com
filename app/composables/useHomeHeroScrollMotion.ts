import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { HomeIntroState } from "./useHomeIntroMotion";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type IntroStateSource = MaybeRefOrGetter<HomeIntroState>;

interface FeaturedCardTransform {
	scale: number;
	x: number;
	yAtCenter: number;
	yAtEnd: number;
}

const centerArrivalProgress = 0.38;
const featuredAspectRatio = 16 / 9;

const selectors = {
	card: "[data-home-hero-scroll-card]",
	hero: "[data-home-hero-scroll]",
	space: "[data-home-hero-scroll-space]",
} as const;

function getFeaturedCardTransform(
	hero: HTMLElement,
	card: HTMLElement,
	scrollDistance: number,
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
	const finalCardHeight = card.offsetWidth / featuredAspectRatio;
	const heroRect = hero.getBoundingClientRect();
	const heroDocumentTop = heroRect.top + window.scrollY;
	const cardDocumentCenterY =
		heroDocumentTop + offsetTop + card.offsetHeight / 2;
	const scale = Math.min(
		availableWidth / card.offsetWidth,
		availableHeight / finalCardHeight,
	);

	return {
		scale,
		x:
			window.innerWidth / 2 -
			(heroRect.left + offsetLeft + card.offsetWidth / 2),
		yAtCenter:
			window.innerHeight / 2 +
			scrollDistance * centerArrivalProgress -
			cardDocumentCenterY,
		yAtEnd:
			window.innerHeight / 2 + scrollDistance - cardDocumentCenterY,
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
		const transitionSpace = root?.querySelector<HTMLElement>(selectors.space);
		const featuredCard = hero?.querySelector<HTMLElement>(selectors.card);
		if (!hero || !transitionSpace || !featuredCard) return;

		createMatchMedia(
			"(prefers-reduced-motion: no-preference)",
			() => {
				gsap.set(featuredCard, {
					alignSelf: "center",
					force3D: false,
					transformOrigin: "center center",
					zIndex: 50,
				});

				const timeline = gsap.timeline({
					scrollTrigger: {
						end: () => `+=${transitionSpace.offsetHeight}`,
						invalidateOnRefresh: true,
						scrub: true,
						start: 0,
						trigger: hero,
					},
				});

				timeline.to(
					featuredCard,
					{
						duration: centerArrivalProgress,
						ease: "none",
						force3D: false,
						rotation: 0,
						x: () =>
							getFeaturedCardTransform(
								hero,
								featuredCard,
								transitionSpace.offsetHeight,
							).x,
						y: () =>
							getFeaturedCardTransform(
								hero,
								featuredCard,
								transitionSpace.offsetHeight,
							).yAtCenter,
					},
					0,
				);
				timeline.to(
					featuredCard,
					{
						duration: 1 - centerArrivalProgress,
						ease: "none",
						force3D: false,
						y: () =>
							getFeaturedCardTransform(
								hero,
								featuredCard,
								transitionSpace.offsetHeight,
							).yAtEnd,
					},
					centerArrivalProgress,
				);
				timeline.to(
					featuredCard,
					{
						aspectRatio: "16 / 9",
						duration: 0.88,
						ease: "none",
						force3D: false,
						scale: () =>
							getFeaturedCardTransform(
								hero,
								featuredCard,
								transitionSpace.offsetHeight,
							).scale,
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
