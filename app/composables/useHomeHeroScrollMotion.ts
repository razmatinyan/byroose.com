import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { curveEase } from "@/lib/scroll-curve";
import type { CurveKey } from "@/lib/scroll-curve";
import type { HomeIntroState } from "./useHomeIntroMotion";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type IntroStateSource = MaybeRefOrGetter<HomeIntroState>;

interface FeaturedCardPath {
	end: number;
	fitScale: number;
	release: number;
	rejoin: number;
	settled: number;
	start: number;
	x: number;
}

const releaseLength = 0.3;
const releaseGrowth = 1.1;
const releaseGrowthLength = 1.3;
const releaseGrowthLead = 1.5;
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

function getCenterArrival(
	hero: HTMLElement,
	card: HTMLElement,
	restY: number,
) {
	return Math.max(
		0,
		getCardDocumentCenterY(hero, card) + restY - window.innerHeight / 2,
	);
}

function measureCardPath(
	hero: HTMLElement,
	card: HTMLElement,
	transitionSpace: HTMLElement,
	restY: number,
): FeaturedCardPath {
	const viewport = window.innerHeight;
	const release = transitionSpace.offsetHeight;
	const centerArrival = getCenterArrival(hero, card, restY);
	const settleReach = Math.max(
		0,
		Math.min(centerArrival, release - centerArrival),
	);
	const finalCardHeight = card.offsetWidth / featuredAspectRatio;
	const heroLeft = hero.getBoundingClientRect().left;

	return {
		end: release + viewport * releaseGrowthLength,
		fitScale: Math.min(
			(window.innerWidth * 0.92) / card.offsetWidth,
			(viewport * 0.82) / finalCardHeight,
		),
		release,
		rejoin: release + viewport * releaseLength,
		settled: centerArrival + settleReach,
		start: centerArrival - settleReach,
		x:
			window.innerWidth / 2 -
			(heroLeft + getCardOffset(hero, card).left + card.offsetWidth / 2),
	};
}

function liftKeys(path: FeaturedCardPath): CurveKey[] {
	const settleLift = (path.settled - path.start) / 2;
	const heldLift = settleLift + path.release - path.settled;
	const releasedLift = heldLift + (path.rejoin - path.release) / 2;

	return [
		{ at: path.start, slope: 0, value: 0 },
		{ at: path.settled, slope: 1, value: settleLift },
		{ at: path.release, slope: 1, value: heldLift },
		{ at: path.rejoin, slope: 0, value: releasedLift },
		{ at: path.end, slope: 0, value: releasedLift },
	];
}

function scaleKeys(path: FeaturedCardPath, restScale: number): CurveKey[] {
	const grownScale = path.fitScale * releaseGrowth;
	const growthSpeed =
		(releaseGrowthLead * (grownScale - path.fitScale)) /
		Math.max(1, path.end - path.release);

	return [
		{ at: path.start, slope: 0, value: restScale },
		{ at: path.release, slope: growthSpeed, value: path.fitScale },
		{ at: path.end, slope: 0, value: grownScale },
	];
}

function settleKeys(path: FeaturedCardPath, settledAt: number): CurveKey[] {
	return [
		{ at: path.start, slope: 0, value: 0 },
		{ at: settledAt, slope: 0, value: 1 },
		{ at: path.end, slope: 0, value: 1 },
	];
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
				const restScale = Number(gsap.getProperty(featuredCard, "scale"));
				const restY = Number(gsap.getProperty(featuredCard, "y"));
				let path = measureCardPath(
					hero,
					featuredCard,
					transitionSpace,
					restY,
				);
				const remeasure = () => {
					path = measureCardPath(
						hero,
						featuredCard,
						transitionSpace,
						restY,
					);
					return path.start;
				};

				gsap.set(featuredCard, {
					alignSelf: "center",
					force3D: false,
					transformOrigin: "center center",
					zIndex: 50,
				});

				gsap
					.timeline({
						defaults: { duration: 1, force3D: false },
						scrollTrigger: {
							end: () => path.end,
							invalidateOnRefresh: true,
							scrub: true,
							start: remeasure,
						},
					})
					.to(
						featuredCard,
						{
							ease: curveEase(() => liftKeys(path)),
							y: () => restY + (liftKeys(path).at(-1)?.value ?? 0),
						},
						0,
					)
					.to(
						featuredCard,
						{
							ease: curveEase(() => settleKeys(path, path.settled)),
							rotation: 0,
							x: () => path.x,
						},
						0,
					)
					.to(
						featuredCard,
						{
							ease: curveEase(() => scaleKeys(path, restScale)),
							scale: () => path.fitScale * releaseGrowth,
						},
						0,
					)
					.to(
						featuredCard,
						{
							aspectRatio: "16 / 9",
							ease: curveEase(() => settleKeys(path, path.release)),
						},
						0,
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
