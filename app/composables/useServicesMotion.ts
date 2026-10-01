import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { addCharReveal } from "@/lib/char-reveal";
import type { SplitTextResult } from "@/lib/split-text";
import { addWordReveal } from "@/lib/word-reveal";

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
	descriptionWords: HTMLElement[];
	panel: HTMLElement;
	titleChars: HTMLElement[];
}

const selectors = {
	image: "[data-service-image]",
	intro: "[data-services-intro]",
	media: "[data-service-media]",
	mediaExit: "[data-service-media-exit]",
	mediaFrame: "[data-service-media-frame]",
	panel: "[data-service-panel]",
	title: "[data-service-title]",
} as const;

const refreshPriority = -1;
const introPinLength = 1.5;
const introWordDuration = 1;
const introWordStagger = 0.45;
const introHold = 0.6;
const introWordFrom = {
	filter: "blur(16px)",
	opacity: 0.12,
	scale: 0.6,
};
const textRevealStart = "top 60%";
const descriptionStagger = 0.025;
const imageZoom = 1.3;
const mediaRunway = 1;
const mediaPeakScale = 0.8;
const mediaEntryEase = "sine.out";
const mediaExitEase = "sine.in";

function splitWords(parts: SplitTextResult | undefined) {
	return parts?.words ?? [];
}

export function useServicesMotion(
	scope: MotionScope,
	{ descriptionSplits, introSplits, titleSplits }: ServicesMotionTargets,
) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap();
	const { refresh } = useSmoothScroll();
	let disposed = false;
	let initialized = false;

	function revealIntro(intro: HTMLElement, words: HTMLElement[]) {
		if (!words.length) return;

		gsap.set(words, { ...introWordFrom, visibility: "inherit" });

		gsap
			.timeline({
				defaults: { ease: "none" },
				scrollTrigger: {
					end: `+=${introPinLength * 100}%`,
					pin: true,
					refreshPriority,
					scrub: true,
					start: "top top",
					trigger: intro,
				},
			})
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

	function revealText({
		descriptionWords,
		panel,
		titleChars,
	}: ServicePanelParts) {
		const title = panel.querySelector<HTMLElement>(selectors.title);
		if (!title || (!titleChars.length && !descriptionWords.length)) return;

		const timeline = gsap.timeline({
			scrollTrigger: {
				once: true,
				refreshPriority,
				start: textRevealStart,
				trigger: title,
			},
		});

		addCharReveal(timeline, titleChars);
		addWordReveal(timeline, descriptionWords, {
			position: 0,
			stagger: descriptionStagger,
		});
	}

	function scaleMedia(panel: HTMLElement) {
		const frame = panel.querySelector<HTMLElement>(selectors.mediaFrame);
		const media = panel.querySelector<HTMLElement>(selectors.media);
		const mediaExit = panel.querySelector<HTMLElement>(selectors.mediaExit);
		const image = panel.querySelector<HTMLElement>(selectors.image);
		if (!frame || !media || !mediaExit) return;

		gsap.set(frame, { "--service-media-runway": mediaRunway });

		const timeline = gsap
			.timeline({
				defaults: { duration: 1, ease: "none" },
				scrollTrigger: {
					end: "bottom top",
					invalidateOnRefresh: true,
					refreshPriority,
					scrub: true,
					start: "top bottom",
					trigger: frame,
				},
			})
			.fromTo(
				mediaExit,
				{ y: 0 },
				{ duration: 2, y: () => frame.offsetHeight - mediaExit.offsetHeight },
				0,
			)
			.fromTo(
				media,
				{ scale: 0 },
				{ ease: mediaEntryEase, scale: mediaPeakScale },
				0,
			)
			.fromTo(
				mediaExit,
				{ scale: 1 },
				{ ease: mediaExitEase, immediateRender: false, scale: 0 },
				1,
			);

		if (image) {
			timeline.fromTo(image, { scale: imageZoom }, { scale: 1 }, 0);
		}
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
			descriptionWords: splitWords(descriptionParts[index]),
			panel,
			titleChars: titleParts[index]?.chars ?? [],
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
						...panels.flatMap(({ descriptionWords, titleChars }) => [
							...titleChars,
							...descriptionWords,
						]),
					]);
					return;
				}

				revealIntro(intro, introWords);
				for (const panel of panels) {
					revealText(panel);
					scaleMedia(panel.panel);
				}
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
				intro.flatMap(splitWords),
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
