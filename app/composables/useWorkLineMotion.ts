import { onMounted, onScopeDispose, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { createRibbonDrawTiming, ribbonHeadLine } from "@/lib/ribbon-path";
import type { RibbonSample } from "@/lib/ribbon-path";
import { workLineLead, workLinePath } from "@/lib/work-line-path";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;

interface WorkLineGeometry {
	length: number;
	path: SVGPathElement;
	samples: RibbonSample[];
	startY: number;
	strokeWidth: number;
	svg: SVGSVGElement;
	width: number;
}

const sampleSpacing = 8;
const drawScrub = 1;
const revealOffset = 0.01;
const desktopMotionQuery =
	"(min-width: 64rem) and (prefers-reduced-motion: no-preference)";

const selectors = {
	path: "[data-work-line-path]",
	svg: "[data-work-line]",
} as const;

function startPosition(startY: number) {
	const sign = startY < 0 ? "-=" : "+=";
	return `top${sign}${Math.abs(startY)} ${ribbonHeadLine * 100}%`;
}

function frameSize(svg: SVGSVGElement) {
	const { height, width } = svg.getBoundingClientRect();
	return { height, width };
}

export function useWorkLineMotion(scope: MotionScope) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap();
	const { refresh } = useSmoothScroll();
	let motionContext: gsap.Context | null = null;
	let drawing: gsap.core.Tween | null = null;
	let strokeTimeline: gsap.core.Timeline | null = null;
	let measuredSize = "";
	let disposed = false;

	function findSvg() {
		return toValue(scope)?.querySelector<SVGSVGElement>(selectors.svg);
	}

	function measure(): WorkLineGeometry | null {
		const svg = findSvg();
		const path = svg?.querySelector<SVGPathElement>(selectors.path);
		if (!svg || !path) return null;

		const { height, width } = frameSize(svg);
		if (!height || !width) return null;

		svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
		path.setAttribute("d", workLinePath({ height, width }));

		const length = path.getTotalLength();
		const steps = Math.max(1, Math.ceil(length / sampleSpacing));
		const samples = Array.from({ length: steps + 1 }, (_, step) => {
			const distance = (length * step) / steps;
			const point = path.getPointAtLength(distance);
			return { length: distance, x: point.x, y: point.y };
		});

		measuredSize = `${width}x${height}`;
		return {
			length,
			path,
			samples,
			startY: samples[0]?.y ?? 0,
			strokeWidth: Number.parseFloat(getComputedStyle(path).strokeWidth),
			svg,
			width,
		};
	}

	function draw({
		length,
		path,
		samples,
		startY,
		strokeWidth,
		svg,
		width,
	}: WorkLineGeometry) {
		const timeline = gsap
			.timeline({ defaults: { ease: "none" }, paused: true })
			.fromTo(
				path,
				{ drawSVG: "0% 0%" },
				{ drawSVG: "0% 100%", duration: length },
				0,
			)
			.set(path, { visibility: "visible" }, revealOffset);

		const timing = createRibbonDrawTiming(samples, {
			height: window.innerHeight,
			lead: workLineLead,
			margin: strokeWidth / 2,
			width,
		});

		strokeTimeline = timeline;
		drawing = gsap.to(timeline, {
			ease: timing.ease,
			scrollTrigger: {
				end: `+=${timing.duration}`,
				onLeaveBack: (self) => self.getTween()?.progress(1),
				scrub: drawScrub,
				start: startPosition(startY),
				trigger: svg,
			},
			time: timeline.duration(),
		});
	}

	function clearDrawing() {
		drawing?.scrollTrigger?.kill();
		drawing?.kill();
		strokeTimeline?.kill();
		drawing = null;
		strokeTimeline = null;
	}

	async function rebuild() {
		const svg = findSvg();
		const context = motionContext;
		if (!svg || !context) return;

		const { height, width } = frameSize(svg);
		if (`${width}x${height}` === measuredSize) return;

		const geometry = measure();
		if (!geometry) return;

		clearDrawing();
		context.add(() => draw(geometry));
		await refresh();
	}

	async function initialize() {
		const [ScrollTrigger, DrawSVGPlugin] = await Promise.all([
			loadPlugin("ScrollTrigger"),
			loadPlugin("DrawSVGPlugin"),
		]);
		if (!ScrollTrigger || !DrawSVGPlugin || disposed) return;

		measure();

		createMatchMedia(
			desktopMotionQuery,
			(context) => {
				const geometry = measure();
				if (!geometry) return;

				motionContext = context;
				draw(geometry);

				return () => {
					motionContext = null;
					drawing = null;
					strokeTimeline = null;
				};
			},
			scope,
		);

		await refresh();
	}

	useResizeObserver(
		() => findSvg(),
		() => {
			if (motionContext) return rebuild();

			measure();
		},
	);

	onMounted(() => initialize());

	onScopeDispose(() => {
		disposed = true;
	});
}
