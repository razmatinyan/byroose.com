import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { addCharReveal } from "@/lib/char-reveal";
import type { SplitTextResult } from "@/lib/split-text";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;
type SplitListSource = MaybeRefOrGetter<
	readonly (SplitTextResult | undefined)[]
>;

interface ServicesMotionTargets {
	active: MaybeRefOrGetter<number>;
	optionSplits: SplitListSource;
	titleSplit: SplitSource;
}

interface ServicesElements {
	arrow: HTMLElement | null;
	images: HTMLElement[];
	layout: HTMLElement;
	root: HTMLElement;
	visual: HTMLElement;
}

const selectors = {
	arrow: "[data-services-title-arrow]",
	image: "[data-services-image]",
	layout: "[data-services-layout]",
	visual: "[data-services-visual]",
} as const;

const titleRevealStart = "top 90%";
const layoutRevealStart = "top 82%";
const wordDuration = 0.8;
const wordStagger = 0.06;
const visualDuration = 1.2;
const swapDuration = 1.1;
const swapEase = "expo.out";
const visibleClip = "inset(0% 0% 0% 0%)";
const clipFromTop = "inset(0% 0% 100% 0%)";
const clipFromBottom = "inset(100% 0% 0% 0%)";

export function useServicesMotion(
	scope: MotionScope,
	{ active, optionSplits, titleSplit }: ServicesMotionTargets,
) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap();
	const { refresh } = useSmoothScroll();
	let disposed = false;
	let initialized = false;
	let images: HTMLElement[] = [];
	let shownIndex = 0;
	let layer = 0;
	let swapTime = swapDuration;

	function resolveElements(): ServicesElements | null {
		const root = toValue(scope);
		const layout = root?.querySelector<HTMLElement>(selectors.layout);
		const visual = root?.querySelector<HTMLElement>(selectors.visual);
		if (!root || !layout || !visual) return null;

		return {
			arrow: root.querySelector<HTMLElement>(selectors.arrow),
			images: [...visual.querySelectorAll<HTMLElement>(selectors.image)],
			layout,
			root,
			visual,
		};
	}

	function revealTitle(chars: HTMLElement[], trigger: HTMLElement) {
		const timeline = gsap.timeline({
			scrollTrigger: {
				once: true,
				start: titleRevealStart,
				trigger,
			},
		});

		addCharReveal(timeline, chars);
	}

	function revealLayout(
		words: HTMLElement[],
		{ layout, visual }: ServicesElements,
	) {
		const timeline = gsap.timeline({
			scrollTrigger: {
				once: true,
				start: layoutRevealStart,
				trigger: layout,
			},
		});

		timeline.fromTo(
			visual,
			{ clipPath: clipFromTop },
			{
				clearProps: "clipPath",
				clipPath: visibleClip,
				duration: visualDuration,
				ease: "power3.inOut",
			},
			0,
		);

		if (!words.length) return;

		gsap.set(words, { visibility: "inherit", yPercent: 115 });
		timeline.to(
			words,
			{
				duration: wordDuration,
				ease: "power3.out",
				stagger: wordStagger,
				yPercent: 0,
			},
			0,
		);
	}

	function showAll(elements: HTMLElement[]) {
		if (!elements.length) return;

		gsap.set(elements, {
			clearProps: "transform",
			visibility: "inherit",
		});
	}

	function showImage(next: number) {
		const incoming = images[next];
		if (!incoming || next === shownIndex) return;

		const clipPath = next > shownIndex ? clipFromBottom : clipFromTop;
		shownIndex = next;
		layer += 1;

		gsap.set(incoming, { zIndex: layer });
		gsap.fromTo(
			incoming,
			{ clipPath },
			{
				clipPath: visibleClip,
				duration: swapTime,
				ease: swapEase,
				overwrite: true,
			},
		);
	}

	async function initialize(
		titleChars: HTMLElement[],
		optionWords: HTMLElement[],
	) {
		if (initialized || disposed) return;

		initialized = true;
		await nextTick();
		const ScrollTrigger = await loadPlugin("ScrollTrigger");
		if (!ScrollTrigger || disposed) return;

		const elements = resolveElements();
		if (!elements) return;

		const chars = elements.arrow
			? [...titleChars, elements.arrow]
			: titleChars;

		createMatchMedia(
			{
				motion: "(prefers-reduced-motion: no-preference)",
				reduceMotion: "(prefers-reduced-motion: reduce)",
			},
			(context) => {
				if (context.conditions?.reduceMotion) {
					swapTime = 0;
					showAll([...chars, ...optionWords]);
					return;
				}

				swapTime = swapDuration;
				revealTitle(chars, elements.root);
				revealLayout(optionWords, elements);
			},
			scope,
		);

		images = elements.images;
		showImage(toValue(active));

		await refresh();
	}

	watch(
		() => [toValue(titleSplit), ...toValue(optionSplits)] as const,
		([title, ...options]) => {
			if (title === undefined || options.includes(undefined)) return;

			return initialize(
				title?.chars ?? [],
				options.flatMap((parts) => parts?.words ?? []),
			);
		},
		{ flush: "post", immediate: true },
	);

	watch(
		() => toValue(active),
		(next) => showImage(next),
	);

	onScopeDispose(() => {
		disposed = true;
		if (images.length) gsap.killTweensOf(images);
	});
}
