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
const releaseLength = 0.3;
const releaseGrowth = 1.1;
const releaseGrowthLength = 1.3;
const featuredAspectRatio = 16 / 9;

const selectors = {
	card: "[data-home-hero-scroll-card]",
	hero: "[data-home-hero-scroll]",
	space: "[data-home-hero-scroll-space]",
} as const;

function getCardOffset(hero: HTMLElement, card: HTMLElement) {
	let left = card.offsetLeft;
	let top = card.offsetTop;
	let offsetParent = card.offsetParent;

	while (offsetParent instanceof HTMLElement && offsetParent !== hero) {
		left += offsetParent.offsetLeft;
		top += offsetParent.offsetTop;
		offsetParent = offsetParent.offsetParent;
	}

	return { left, top };
}

function getCardDocumentCenterY(hero: HTMLElement, card: HTMLElement) {
	const heroDocumentTop = hero.getBoundingClientRect().top + window.scrollY;

	return heroDocumentTop + getCardOffset(hero, card).top + card.offsetHeight / 2;
}

function getTransitionStart(hero: HTMLElement, card: HTMLElement) {
	return Math.max(
		0,
		getCardDocumentCenterY(hero, card) - window.innerHeight / 2,
	);
}

function getFeaturedCardTransform(
	hero: HTMLElement,
	card: HTMLElement,
	transitionEnd: number,
): FeaturedCardTransform {
	const availableWidth = window.innerWidth * 0.92;
	const availableHeight = window.innerHeight * 0.82;
	const finalCardHeight = card.offsetWidth / featuredAspectRatio;
	const heroRect = hero.getBoundingClientRect();
	const cardDocumentCenterY = getCardDocumentCenterY(hero, card);
	const transitionStart = getTransitionStart(hero, card);
	const centerArrival =
		transitionStart + (transitionEnd - transitionStart) * centerArrivalProgress;
	const scale = Math.min(
		availableWidth / card.offsetWidth,
		availableHeight / finalCardHeight,
	);

	return {
		scale,
		x:
			window.innerWidth / 2 -
			(heroRect.left + getCardOffset(hero, card).left + card.offsetWidth / 2),
		yAtCenter: window.innerHeight / 2 + centerArrival - cardDocumentCenterY,
		yAtEnd: window.innerHeight / 2 + transitionEnd - cardDocumentCenterY,
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
			"(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
			() => {
				gsap.set(featuredCard, {
					alignSelf: "center",
					force3D: false,
					transformOrigin: "center center",
					zIndex: 50,
				});

				const timeline = gsap.timeline({
					scrollTrigger: {
						end: () => transitionSpace.offsetHeight,
						invalidateOnRefresh: true,
						scrub: true,
						start: () => getTransitionStart(hero, featuredCard),
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

				const release = () => window.innerHeight * releaseLength;
				const featured = () =>
					getFeaturedCardTransform(
						hero,
						featuredCard,
						transitionSpace.offsetHeight,
					);

				gsap.fromTo(
					featuredCard,
					{ y: () => featured().yAtEnd },
					{
						ease: "power1.out",
						force3D: false,
						immediateRender: false,
						scrollTrigger: {
							end: () => transitionSpace.offsetHeight + release(),
							invalidateOnRefresh: true,
							scrub: true,
							start: () => transitionSpace.offsetHeight,
						},
						y: () => featured().yAtEnd + release() / 2,
					},
				);

				gsap.fromTo(
					featuredCard,
					{ scale: () => featured().scale },
					{
						ease: "power1.out",
						force3D: false,
						immediateRender: false,
						scale: () => featured().scale * releaseGrowth,
						scrollTrigger: {
							end: () =>
								transitionSpace.offsetHeight +
								window.innerHeight * releaseGrowthLength,
							invalidateOnRefresh: true,
							scrub: true,
							start: () => transitionSpace.offsetHeight,
						},
					},
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
