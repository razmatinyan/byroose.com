import { onMounted, onScopeDispose, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useResizeObserver } from "@vueuse/core";
import {
	createRibbonDrawTiming,
	resolveRibbonRoute,
	ribbonHeadLine,
	ribbonPathData,
	ribbonSegments,
	ribbonShadeLine,
	ribbonShadeReach,
} from "@/lib/ribbon-path";
import type { RibbonSample } from "@/lib/ribbon-path";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;

interface RibbonStroke {
	length: number;
	path: SVGPathElement;
}

interface RibbonGeometry {
	samples: RibbonSample[];
	startY: number;
	strokeWidth: number;
	strokes: RibbonStroke[];
	width: number;
}

const sampleSpacing = 8;
const drawScrub = 1;
const revealOffset = 0.01;

const selectors = {
	grid: "[data-studio-ribbon-grid]",
	segment: (id: string) => `[data-studio-ribbon-segment="${id}"]`,
	shade: (id: string) => `[data-studio-ribbon-shade="${id}"]`,
	statement: "[data-studio-ribbon-statement]",
	svg: "[data-studio-ribbon]",
} as const;

function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
	let offset = element.offsetTop;
	let parent = element.offsetParent;

	while (parent instanceof HTMLElement && parent !== ancestor) {
		offset += parent.offsetTop;
		parent = parent.offsetParent;
	}

	return offset;
}

function startPosition(startY: number) {
	const sign = startY < 0 ? "-=" : "+=";
	return `top${sign}${Math.abs(startY)} ${ribbonHeadLine * 100}%`;
}

export function useStudioRibbonMotion(scope: MotionScope) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap();
	const { refresh } = useSmoothScroll();
	let motionContext: gsap.Context | null = null;
	let drawing: gsap.core.Tween | null = null;
	let strokeTimeline: gsap.core.Timeline | null = null;
	let measuredSize = "";
	let disposed = false;

	function measure(): RibbonGeometry | null {
		const studio = toValue(scope);
		const svg = studio?.querySelector<SVGSVGElement>(selectors.svg);
		const statementElement = studio?.querySelector<HTMLElement>(
			selectors.statement,
		);
		const gridElement = studio?.querySelector<HTMLElement>(selectors.grid);
		if (!studio || !svg || !statementElement || !gridElement) return null;

		const width = studio.offsetWidth;
		const height = studio.offsetHeight;
		const statementTop = offsetWithin(statementElement, studio);
		const gridTop = offsetWithin(gridElement, studio);
		const points = resolveRibbonRoute({
			gridBottom: gridTop + gridElement.offsetHeight,
			gridTop,
			height,
			statementBottom: statementTop + statementElement.offsetHeight,
			statementTop,
			width,
		});

		svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

		const strokes: RibbonStroke[] = [];
		const samples: RibbonSample[] = [];
		let drawnLength = 0;
		let strokeWidth = 0;

		for (const segment of ribbonSegments) {
			const path = svg.querySelector<SVGPathElement>(
				selectors.segment(segment.id),
			);
			if (!path) return null;

			path.setAttribute(
				"d",
				ribbonPathData(points, segment.from, segment.to),
			);

			strokeWidth = Number.parseFloat(getComputedStyle(path).strokeWidth);

			if (segment.crossing !== undefined) {
				const shade = svg.querySelector<SVGLinearGradientElement>(
					selectors.shade(segment.id),
				);
				const line = ribbonShadeLine(
					points,
					segment.crossing,
					strokeWidth * ribbonShadeReach,
				);

				for (const [name, value] of Object.entries(line)) {
					shade?.setAttribute(name, value.toFixed(1));
				}
			}

			const length = path.getTotalLength();
			const steps = Math.max(1, Math.ceil(length / sampleSpacing));

			for (let step = 0; step <= steps; step += 1) {
				const distance = (length * step) / steps;
				const point = path.getPointAtLength(distance);
				samples.push({
					length: drawnLength + distance,
					x: point.x,
					y: point.y,
				});
			}

			strokes.push({ length, path });
			drawnLength += length;
		}

		measuredSize = `${width}x${height}`;
		return {
			samples,
			startY: points[0]?.y ?? 0,
			strokeWidth,
			strokes,
			width,
		};
	}

	function draw({
		samples,
		startY,
		strokeWidth,
		strokes,
		width,
	}: RibbonGeometry) {
		const studio = toValue(scope);
		if (!studio) return;

		const timeline = gsap.timeline({
			defaults: { ease: "none" },
			paused: true,
		});
		let position = 0;

		for (const { length, path } of strokes) {
			timeline.fromTo(
				path,
				{ drawSVG: "0% 0%" },
				{ drawSVG: "0% 100%", duration: length },
				position,
			);
			timeline.set(path, { visibility: "visible" }, position + revealOffset);
			position += length;
		}

		const timing = createRibbonDrawTiming(samples, {
			height: window.innerHeight,
			margin: strokeWidth / 2,
			width,
		});

		strokeTimeline = timeline;
		drawing = gsap.to(timeline, {
			ease: timing.ease,
			scrollTrigger: {
				end: `+=${timing.duration}`,
				scrub: drawScrub,
				start: startPosition(startY),
				trigger: studio,
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
		const studio = toValue(scope);
		const context = motionContext;
		if (!studio || !context) return;
		if (`${studio.offsetWidth}x${studio.offsetHeight}` === measuredSize) return;

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
		if (!measure()) return;

		createMatchMedia(
			"(prefers-reduced-motion: no-preference)",
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
		() => toValue(scope),
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
