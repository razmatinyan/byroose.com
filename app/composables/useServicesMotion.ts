import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
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
	descriptionLines: HTMLElement[];
	panel: HTMLElement;
	titleWords: HTMLElement[];
}

const selectors = {
	content: "[data-service-content]",
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
	opacity: 0,
	scale: 0.6,
};
const textRevealAt = 0.6;
const titleStagger = 0.08;
const descriptionStagger = 0.1;
const descriptionDuration = 1.1;
const imageZoom = 1.3;
const panelRunway = 1;
const mediaPeakScale = 0.8;
const mediaEntryEase = "sine.out";
const mediaExitEase = "sine.in";

function splitWords(parts: SplitTextResult | undefined) {
	return parts?.words ?? [];
}

function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
	let offset = 0;
	let node: HTMLElement | null = element;

	while (node && node !== ancestor) {
		offset += node.offsetTop;
		node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
	}

	return offset;
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

	function runwayOf(panel: HTMLElement, content: HTMLElement) {
		return panel.clientHeight - content.offsetTop - content.offsetHeight;
	}

	function scrollWhen(
		panel: HTMLElement,
		content: HTMLElement,
		offset: () => number,
		viewportRatio: number,
	) {
		return () => {
			const viewport = window.innerHeight;
			const range = viewport + panel.offsetHeight;
			const travel = range - runwayOf(panel, content);
			const panelTop = panel.getBoundingClientRect().top + window.scrollY;

			return (
				panelTop -
				viewport +
				((viewport + offset() - viewportRatio * viewport) * range) / travel
			);
		};
	}

	function slowContent(panel: HTMLElement, content: HTMLElement) {
		gsap.set(panel, { "--service-runway": panelRunway });

		gsap.fromTo(
			content,
			{ y: 0 },
			{
				ease: "none",
				y: () => runwayOf(panel, content),
				scrollTrigger: {
					end: "bottom top",
					invalidateOnRefresh: true,
					refreshPriority,
					scrub: true,
					start: "top bottom",
					trigger: panel,
				},
			},
		);
	}

	function revealText(
		{ descriptionLines, panel, titleWords }: ServicePanelParts,
		content: HTMLElement,
	) {
		const title = panel.querySelector<HTMLElement>(selectors.title);
		if (!title || (!titleWords.length && !descriptionLines.length)) return;

		const timeline = gsap.timeline({
			scrollTrigger: {
				invalidateOnRefresh: true,
				once: true,
				refreshPriority,
				start: scrollWhen(
					panel,
					content,
					() => offsetWithin(title, panel),
					textRevealAt,
				),
			},
		});

		addWordReveal(timeline, titleWords, { stagger: titleStagger });
		addWordReveal(timeline, descriptionLines, {
			duration: descriptionDuration,
			position: 0,
			stagger: descriptionStagger,
		});
	}

	function scaleMedia(panel: HTMLElement, content: HTMLElement) {
		const frame = panel.querySelector<HTMLElement>(selectors.mediaFrame);
		const media = panel.querySelector<HTMLElement>(selectors.media);
		const mediaExit = panel.querySelector<HTMLElement>(selectors.mediaExit);
		const image = panel.querySelector<HTMLElement>(selectors.image);
		if (!frame || !media || !mediaExit) return;

		const frameAt = (share: number) => () =>
			offsetWithin(frame, panel) + frame.offsetHeight * share;
		const peak = scrollWhen(panel, content, frameAt(0.5), 0.5);

		const entry = gsap
			.timeline({
				defaults: { ease: mediaEntryEase },
				scrollTrigger: {
					end: peak,
					invalidateOnRefresh: true,
					refreshPriority,
					scrub: true,
					start: scrollWhen(panel, content, frameAt(0), 1),
				},
			})
			.fromTo(media, { scale: 0 }, { scale: mediaPeakScale }, 0);

		if (image) entry.fromTo(image, { scale: imageZoom }, { scale: 1 }, 0);

		gsap.fromTo(
			mediaExit,
			{ scale: 1 },
			{
				ease: mediaExitEase,
				immediateRender: false,
				scale: 0,
				scrollTrigger: {
					end: scrollWhen(panel, content, frameAt(1), 0),
					invalidateOnRefresh: true,
					refreshPriority,
					scrub: true,
					start: peak,
				},
			},
		);
	}

	function animatePanel(parts: ServicePanelParts) {
		const content = parts.panel.querySelector<HTMLElement>(selectors.content);
		if (!content) return;

		slowContent(parts.panel, content);
		revealText(parts, content);
		scaleMedia(parts.panel, content);
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
			descriptionLines: descriptionParts[index]?.lines ?? [],
			panel,
			titleWords: splitWords(titleParts[index]),
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
						...panels.flatMap(({ descriptionLines, titleWords }) => [
							...titleWords,
							...descriptionLines,
						]),
					]);
					return;
				}

				revealIntro(intro, introWords);
				for (const panel of panels) animatePanel(panel);
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
