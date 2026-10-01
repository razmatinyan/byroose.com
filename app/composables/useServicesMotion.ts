import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { SplitTextResult } from "@/lib/split-text";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitListSource = MaybeRefOrGetter<
	readonly (SplitTextResult | undefined)[]
>;

interface ServicesMotionTargets {
	descriptionSplits: SplitListSource;
	introSplits: SplitListSource;
	titleSplits: SplitListSource;
}

interface ServicePanelParts {
	lines: HTMLElement[];
	panel: HTMLElement;
	words: HTMLElement[];
}

const selectors = {
	image: "[data-service-image]",
	intro: "[data-services-intro]",
	media: "[data-service-media]",
	mediaExit: "[data-service-media-exit]",
	panel: "[data-service-panel]",
} as const;

const pinLength = 1.5;
const refreshPriority = -1;
const introWordDuration = 1;
const introWordStagger = 0.45;
const introHold = 0.6;
const introWordFrom = {
	filter: "blur(16px)",
	opacity: 0.12,
	scale: 1.6,
};
const maskOffset = 115;
const wordDuration = 0.45;
const wordStagger = 0.08;
const lineDuration = 0.45;
const lineStagger = 0.1;
const linesAt = 0.2;
const mediaAt = 0.35;
const mediaDuration = 1;
const imageZoom = 1.3;
const serviceHold = 0.3;
const exitLength = 0.6;

function splitPart(
	parts: SplitTextResult | undefined,
	key: "lines" | "words",
) {
	return parts?.[key] ?? [];
}

export function useServicesMotion(
	scope: MotionScope,
	{ descriptionSplits, introSplits, titleSplits }: ServicesMotionTargets,
) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap();
	const { refresh } = useSmoothScroll();
	let disposed = false;
	let initialized = false;

	function pinnedTimeline(trigger: HTMLElement) {
		return gsap.timeline({
			defaults: { ease: "none" },
			scrollTrigger: {
				end: `+=${pinLength * 100}%`,
				pin: true,
				refreshPriority,
				scrub: true,
				start: "top top",
				trigger,
			},
		});
	}

	function revealIntro(intro: HTMLElement, words: HTMLElement[]) {
		if (!words.length) return;

		gsap.set(words, { ...introWordFrom, visibility: "inherit" });

		pinnedTimeline(intro)
			.to(
				words,
				{
					duration: introWordDuration,
					ease: "power2.out",
					filter: "blur(0px)",
					opacity: 1,
					scale: 1,
					stagger: introWordStagger,
				},
				0,
			)
			.to({}, { duration: introHold });
	}

	function exitMedia(
		mediaExit: HTMLElement,
		timeline: gsap.core.Timeline,
	) {
		const pinEnd = () => timeline.scrollTrigger?.end ?? 0;

		gsap.fromTo(
			mediaExit,
			{ scale: 1 },
			{
				ease: "power1.in",
				immediateRender: false,
				scale: 0,
				scrollTrigger: {
					end: () => pinEnd() + window.innerHeight * exitLength,
					invalidateOnRefresh: true,
					refreshPriority,
					scrub: true,
					start: pinEnd,
				},
			},
		);
	}

	function revealService({ lines, panel, words }: ServicePanelParts) {
		const media = panel.querySelector<HTMLElement>(selectors.media);
		const mediaExit = panel.querySelector<HTMLElement>(selectors.mediaExit);
		const image = panel.querySelector<HTMLElement>(selectors.image);
		const timeline = pinnedTimeline(panel);

		if (words.length) {
			gsap.set(words, { visibility: "inherit", yPercent: maskOffset });
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

		if (lines.length) {
			gsap.set(lines, { visibility: "inherit", yPercent: maskOffset });
			timeline.to(
				lines,
				{
					duration: lineDuration,
					ease: "power3.out",
					stagger: lineStagger,
					yPercent: 0,
				},
				linesAt,
			);
		}

		if (media) {
			gsap.set(media, { scale: 0 });
			timeline.to(
				media,
				{ duration: mediaDuration, ease: "power2.out", scale: 1 },
				mediaAt,
			);
		}

		if (image) {
			gsap.set(image, { scale: imageZoom });
			timeline.to(image, { duration: mediaDuration, scale: 1 }, mediaAt);
		}

		timeline.to({}, { duration: serviceHold });

		if (mediaExit) exitMedia(mediaExit, timeline);
	}

	function showAll(elements: HTMLElement[]) {
		if (!elements.length) return;

		gsap.set(elements, {
			clearProps: "transform",
			visibility: "inherit",
		});
	}

	async function initialize(
		introWords: HTMLElement[],
		titleParts: readonly SplitTextResult[],
		descriptionParts: readonly SplitTextResult[],
	) {
		if (initialized || disposed) return;

		initialized = true;
		await nextTick();
		const ScrollTrigger = await loadPlugin("ScrollTrigger");
		if (!ScrollTrigger || disposed) return;

		const root = toValue(scope);
		const intro = root?.querySelector<HTMLElement>(selectors.intro);
		if (!root || !intro) return;

		const panels = [
			...root.querySelectorAll<HTMLElement>(selectors.panel),
		].map((panel, index) => ({
			lines: splitPart(descriptionParts[index], "lines"),
			panel,
			words: splitPart(titleParts[index], "words"),
		}));

		createMatchMedia(
			{
				motion: "(prefers-reduced-motion: no-preference)",
				reduceMotion: "(prefers-reduced-motion: reduce)",
			},
			(context) => {
				if (context.conditions?.reduceMotion) {
					showAll([
						...introWords,
						...panels.flatMap(({ lines, words }) => [
							...words,
							...lines,
						]),
					]);
					return;
				}

				revealIntro(intro, introWords);
				for (const panel of panels) revealService(panel);
			},
			scope,
		);

		await refresh();
	}

	watch(
		() =>
			[
				toValue(introSplits),
				toValue(titleSplits),
				toValue(descriptionSplits),
			] as const,
		([intro, titles, descriptions]) => {
			const splits = [...intro, ...titles, ...descriptions];
			if (splits.includes(undefined)) return;

			return initialize(
				intro.flatMap((parts) => splitPart(parts, "words")),
				titles.filter((parts) => parts !== undefined),
				descriptions.filter((parts) => parts !== undefined),
			);
		},
		{ flush: "post", immediate: true },
	);

	onScopeDispose(() => {
		disposed = true;
	});
}
