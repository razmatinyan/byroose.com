export interface RibbonPoint {
	x: number;
	y: number;
}

export interface RibbonAnchors {
	gridBottom: number;
	gridTop: number;
	height: number;
	statementBottom: number;
	statementTop: number;
	width: number;
}

export interface RibbonSegment {
	crossing?: number;
	from: number;
	id: string;
	layer: "over" | "under";
	to: number;
}

export interface RibbonSample {
	length: number;
	x: number;
	y: number;
}

export interface RibbonView {
	height: number;
	margin: number;
	width: number;
}

export interface RibbonShadeLine {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}

export interface RibbonDrawTiming {
	duration: number;
	ease: (progress: number) => number;
}

export const ribbonTuckReach = 0.05;
export const ribbonEndReach = 0.093;
export const ribbonHeadLine = 0.8;
export const ribbonHeadLead = 0.8;
export const ribbonLengthShare = 0.3;
export const ribbonHiddenShare = 0.03;
export const ribbonShadeReach = 1.5;

const ribbonRoute: ReadonlyArray<readonly [number, number]> = [
	[0.227, 0],
	[0.23, 0.885],
	[0.259, 1.487],
	[0.326, 1.936],
	[0.425, 2.205],
	[0.53, 2.436],
	[0.613, 2.846],
	[0.683, 4],
	[0.725, 4.226],
	[0.731, 4.433],
	[0.709, 4.64],
	[0.664, 4.8],
	[0.581, 4.895],
	[0.495, 4.866],
	[0.425, 4.744],
	[0.386, 4.546],
	[0.38, 4.32],
	[0.402, 4.094],
	[0.457, 3],
	[0.53, 2.487],
	[0.619, 2.179],
	[0.747, 2.026],
	[0.888, 2.154],
	[1.009, 2.436],
	[1.124, 3.429],
	[1.16, 4.6],
	[1.1, 5.2],
	[1, 5.564],
	[0.92, 6.45],
	[0.77, 7.2],
	[0.58, 7.7],
	[0.42, 7.78],
	[0.27, 7.5],
	[0.14, 6.85],
	[0.04, 5.95],
	[-0.07, 5.15],
];

export const ribbonSegments: readonly RibbonSegment[] = [
	{ from: 0, id: "lead", layer: "over", to: 15 },
	{ crossing: 19, from: 15, id: "climb", layer: "under", to: 23 },
	{ from: 23, id: "sweep", layer: "over", to: 35 },
];

export const ribbonPaintOrder: readonly RibbonSegment[] = [
	...ribbonSegments.filter(({ layer }) => layer === "under"),
	...ribbonSegments.filter(({ layer }) => layer === "over"),
];

function anchorLines({
	gridBottom,
	gridTop,
	height,
	statementBottom,
	statementTop,
	width,
}: RibbonAnchors) {
	return [
		-width * ribbonTuckReach,
		0,
		statementTop,
		statementBottom,
		gridTop,
		gridBottom,
		height,
		height + width * ribbonEndReach,
	];
}

function lineAt(lines: readonly number[], position: number) {
	const index = Math.min(Math.floor(position), lines.length - 2);
	const start = lines[index] ?? 0;
	const end = lines[index + 1] ?? start;
	return start + (end - start) * (position - index);
}

export function resolveRibbonRoute(anchors: RibbonAnchors): RibbonPoint[] {
	const lines = anchorLines(anchors);

	return ribbonRoute.map(([x, position]) => ({
		x: x * anchors.width,
		y: lineAt(lines, position),
	}));
}

function pointAt(points: readonly RibbonPoint[], index: number) {
	const clamped = Math.min(Math.max(index, 0), points.length - 1);
	return points[clamped] as RibbonPoint;
}

function formatPoint({ x, y }: RibbonPoint) {
	return `${x.toFixed(1)} ${y.toFixed(1)}`;
}

function knotSpan(from: RibbonPoint, to: RibbonPoint) {
	return Math.sqrt(Math.max(Math.hypot(to.x - from.x, to.y - from.y), 1e-6));
}

function centripetalHandle(
	outer: RibbonPoint,
	anchor: RibbonPoint,
	toward: RibbonPoint,
	outerSpan: number,
	innerSpan: number,
): RibbonPoint {
	const outerSquare = outerSpan * outerSpan;
	const innerSquare = innerSpan * innerSpan;
	const anchorWeight =
		2 * outerSquare + 3 * outerSpan * innerSpan + innerSquare;
	const divisor = 3 * outerSpan * (outerSpan + innerSpan);

	return {
		x:
			(outerSquare * toward.x - innerSquare * outer.x + anchorWeight * anchor.x) /
			divisor,
		y:
			(outerSquare * toward.y - innerSquare * outer.y + anchorWeight * anchor.y) /
			divisor,
	};
}

export function ribbonPathData(
	points: readonly RibbonPoint[],
	from: number,
	to: number,
) {
	const commands = [`M ${formatPoint(pointAt(points, from))}`];
	const lastIndex = points.length - 1;

	for (let index = from; index < to; index += 1) {
		const previous = pointAt(points, index - 1);
		const start = pointAt(points, index);
		const end = pointAt(points, index + 1);
		const next = pointAt(points, index + 2);
		const span = knotSpan(start, end);
		const leadingSpan = index > 0 ? knotSpan(previous, start) : span;
		const trailingSpan = index + 2 <= lastIndex ? knotSpan(end, next) : span;
		const startHandle = centripetalHandle(
			previous,
			start,
			end,
			leadingSpan,
			span,
		);
		const endHandle = centripetalHandle(next, end, start, trailingSpan, span);

		commands.push(
			`C ${formatPoint(startHandle)} ${formatPoint(endHandle)} ${formatPoint(end)}`,
		);
	}

	return commands.join(" ");
}

export function ribbonShadeLine(
	points: readonly RibbonPoint[],
	crossing: number,
	reach: number,
): RibbonShadeLine {
	const center = pointAt(points, crossing);
	const before = pointAt(points, crossing - 1);
	const after = pointAt(points, crossing + 1);
	const span = Math.hypot(after.x - before.x, after.y - before.y) || 1;
	const directionX = (after.x - before.x) / span;
	const directionY = (after.y - before.y) / span;

	return {
		x1: center.x - directionX * reach,
		x2: center.x + directionX * reach,
		y1: center.y - directionY * reach,
		y2: center.y + directionY * reach,
	};
}

function sampleIndexAt(times: readonly number[], target: number) {
	let low = 0;
	let high = times.length - 1;

	while (high - low > 1) {
		const middle = Math.floor((low + high) / 2);
		if ((times[middle] ?? 0) <= target) low = middle;
		else high = middle;
	}

	return low;
}

function isHidden(
	sample: RibbonSample,
	tipScreenY: number,
	{ margin, width }: RibbonView,
) {
	return (
		sample.x < -margin || sample.x > width + margin || tipScreenY < -margin
	);
}

export function createRibbonDrawTiming(
	samples: readonly RibbonSample[],
	view: RibbonView,
): RibbonDrawTiming {
	const first = samples[0];
	const last = samples.at(-1);
	if (!first || !last || last.length <= 0) {
		return { duration: 1, ease: (progress) => progress };
	}

	const headLine = view.height * ribbonHeadLine;
	const headLead = view.height * ribbonHeadLead;
	const times = [0];

	for (let index = 1; index < samples.length; index += 1) {
		const sample = samples[index] as RibbonSample;
		const previous = samples[index - 1] as RibbonSample;
		const previousTime = times[index - 1] ?? 0;
		const tipScreenY = sample.y - first.y - previousTime + headLine;
		const share = isHidden(sample, tipScreenY, view)
			? ribbonHiddenShare
			: ribbonLengthShare;

		times.push(
			Math.max(
				previousTime + (sample.length - previous.length) * share,
				sample.y - first.y - headLead,
			),
		);
	}

	const duration = times.at(-1) ?? 1;

	return {
		duration,
		ease: (progress) => {
			if (progress <= 0) return 0;
			if (progress >= 1) return 1;

			const target = progress * duration;
			const index = sampleIndexAt(times, target);
			const startTime = times[index] ?? 0;
			const endTime = times[index + 1] ?? startTime;
			const start = samples[index] ?? first;
			const end = samples[index + 1] ?? start;
			const share =
				endTime > startTime ? (target - startTime) / (endTime - startTime) : 0;

			return (start.length + (end.length - start.length) * share) / last.length;
		},
	};
}
