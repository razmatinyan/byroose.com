import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { unrefElement } from "@vueuse/core";
import type { MaybeComputedElementRef } from "@vueuse/core";
import type { SplitTextResult } from "@/lib/split-text";
import {
	addWordReveal,
	wordRevealDenseStagger,
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

	function revealPortrait(image: HTMLElement) {
		gsap.fromTo(
			image,
			{ clipPath: hiddenPortraitClip },
			{
				clipPath: visiblePortraitClip,
				clearProps: "clipPath",
				duration: 1.2,
				ease: "power3.inOut",
				scrollTrigger: {
					once: true,
					start: wordRevealStart,
					trigger: image,
				},
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
		const image = unrefElement(portrait);
		const copyRoot = unrefElement(copy);
		if (
			!root ||
			!(image instanceof HTMLElement) ||
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
					return;
				}

				revealWords(statementWords, root, wordRevealStagger);
				revealPortrait(image);
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
