import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { unrefElement } from "@vueuse/core";
import type { MaybeComputedElementRef } from "@vueuse/core";
import {
	imageParallaxEnd,
	imageParallaxScale,
	imageParallaxShift,
	imageParallaxStart,
} from "@/lib/image-parallax";
import type { SplitTextResult } from "@/lib/split-text";
import {
	addWordReveal,
	wordRevealDenseStagger,
	wordRevealEase,
	wordRevealStagger,
	wordRevealStart,
} from "@/lib/word-reveal";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;
type WordSource = MaybeRefOrGetter<HTMLElement[] | undefined>;

interface StudioMotionTargets {
	copy: MaybeComputedElementRef;
	copyWords: WordSource;
	portrait: MaybeComputedElementRef;
	statementSplit: SplitSource;
}

const badgeSelector = "[data-studio-badge]";
const badgeRevealDuration = 1;
const badgeRevealOverlap = 0.3;
const portraitImageSelector = "[data-studio-portrait-image]";
const hiddenPortraitClip = "inset(0% 0% 100% 0%)";
const visiblePortraitClip = "inset(0% 0% 0% 0%)";

export function useStudioMotion(
	scope: MotionScope,
	{ copy, copyWords, portrait, statementSplit }: StudioMotionTargets,
) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap();
	const { refresh } = useSmoothScroll();
	let disposed = false;
	let initialized = false;

	function revealWords(
		words: HTMLElement[],
		trigger: HTMLElement,
		stagger: number,
	) {
		if (!words.length) return;

		const timeline = gsap.timeline({
			scrollTrigger: {
				once: true,
				start: wordRevealStart,
				trigger,
			},
		});

		addWordReveal(timeline, words, { stagger });
	}

	function revealStatement(words: HTMLElement[], root: HTMLElement) {
		const badge = root.querySelector<HTMLElement>(badgeSelector);
		if (!words.length && !badge) return;

		const timeline = gsap.timeline({
			scrollTrigger: {
				once: true,
				start: wordRevealStart,
				trigger: root,
			},
		});

		addWordReveal(timeline, words, { stagger: wordRevealStagger });
		if (!badge) return;

		timeline.fromTo(
			badge,
			{ scale: 0, visibility: "inherit" },
			{
				clearProps: "transform",
				duration: badgeRevealDuration,
				ease: wordRevealEase,
				scale: 1,
			},
			words.length ? `-=${badgeRevealOverlap}` : 0,
		);
	}

	function revealPortrait(frame: HTMLElement) {
		gsap.fromTo(
			frame,
			{ clipPath: hiddenPortraitClip },
			{
				clipPath: visiblePortraitClip,
				clearProps: "clipPath",
				duration: 1.2,
				ease: "power3.inOut",
				scrollTrigger: {
					once: true,
					start: wordRevealStart,
					trigger: frame,
				},
			},
		);
	}

	function parallaxPortrait(frame: HTMLElement) {
		const image = frame.querySelector<HTMLElement>(portraitImageSelector);
		if (!image) return;

		gsap.set(image, { scale: imageParallaxScale });
		gsap.fromTo(
			image,
			{ yPercent: -imageParallaxShift },
			{
				ease: "none",
				scrollTrigger: {
					end: imageParallaxEnd,
					scrub: true,
					start: imageParallaxStart,
					trigger: frame,
				},
				yPercent: imageParallaxShift,
			},
		);
	}

	function showWords(words: HTMLElement[]) {
		if (!words.length) return;

		gsap.set(words, {
			clearProps: "transform",
			visibility: "inherit",
		});
	}

	function showBadge(root: HTMLElement) {
		const badge = root.querySelector<HTMLElement>(badgeSelector);
		if (!badge) return;

		gsap.set(badge, { clearProps: "transform", visibility: "inherit" });
	}

	async function initialize(
		statementWords: HTMLElement[],
		paragraphWords: HTMLElement[],
	) {
		if (initialized || disposed) return;

		initialized = true;
		await nextTick();
		const ScrollTrigger = await loadPlugin("ScrollTrigger");
		if (!ScrollTrigger || disposed) return;

		const root = toValue(scope);
		const frame = unrefElement(portrait);
		const copyRoot = unrefElement(copy);
		if (
			!root ||
			!(frame instanceof HTMLElement) ||
			!(copyRoot instanceof HTMLElement)
		)
			return;

		createMatchMedia(
			{
				motion: "(prefers-reduced-motion: no-preference)",
				reduceMotion: "(prefers-reduced-motion: reduce)",
			},
			(context) => {
				if (context.conditions?.reduceMotion) {
					showWords([...statementWords, ...paragraphWords]);
					showBadge(root);
					return;
				}

				revealStatement(statementWords, root);
				revealPortrait(frame);
				parallaxPortrait(frame);
				revealWords(paragraphWords, copyRoot, wordRevealDenseStagger);
			},
			scope,
		);

		await refresh();
	}

	watch(
		() => [toValue(statementSplit), toValue(copyWords)] as const,
		([statementParts, paragraphWords]) => {
			if (statementParts === undefined || paragraphWords === undefined)
				return;

			return initialize(statementParts?.words ?? [], paragraphWords);
		},
		{ flush: "post", immediate: true },
	);

	onScopeDispose(() => {
		disposed = true;
	});
}
