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
	y: number;
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
export const ribbonHeadLine = 0.6;
export const ribbonHeadLead = 0.3;
export const ribbonLengthShare = 0.15;
export const ribbonShadeReach = 1.5;

const ribbonRoute: ReadonlyArray<readonly [number, number]> = [
	[0.54, 0],
	[0.504, 1.1],
	[0.469, 1.87],
	[0.45, 2.45],
	[0.463, 2.95],
	[0.504, 4.02],
	[0.575, 4.14],
	[0.677, 4.17],
	[0.785, 4.09],
	[0.83, 2.95],
	[0.798, 2.4],
	[0.709, 2.225],
	[0.594, 2.45],
	[0.492, 3],
	[0.421, 4.05],
	[0.383, 4.24],
	[0.393, 4.43],
	[0.409, 4.62],
	[0.447, 4.81],
	[0.498, 4.93],
	[0.607, 5.11],
	[0.734, 5.27],
	[0.881, 5.08],
	[1.034, 4.84],
	[1.124, 4.73],
	[1.098, 4.47],
	[0.958, 4.46],
	[0.798, 4.54],
	[0.639, 4.73],
	[0.53, 4.97],
	[0.396, 5.75],
	[0.268, 6.38],
	[0.166, 6.52],
	[0.089, 6.08],
	[0.038, 5.3],
	[-0.077, 4.84],
];

export const ribbonSegments: readonly RibbonSegment[] = [
	{ from: 0, id: "lead", layer: "over", to: 11 },
	{ crossing: 13, from: 11, id: "loop", layer: "under", to: 15 },
	{ from: 15, id: "sweep", layer: "over", to: 26 },
	{ crossing: 29, from: 26, id: "return", layer: "under", to: 35 },
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

export function ribbonPathData(
	points: readonly RibbonPoint[],
	from: number,
	to: number,
) {
	const commands = [`M ${formatPoint(pointAt(points, from))}`];

	for (let index = from; index < to; index += 1) {
		const previous = pointAt(points, index - 1);
		const start = pointAt(points, index);
		const end = pointAt(points, index + 1);
		const next = pointAt(points, index + 2);
		const startHandle = {
			x: start.x + (end.x - previous.x) / 6,
			y: start.y + (end.y - previous.y) / 6,
		};
		const endHandle = {
			x: end.x - (next.x - start.x) / 6,
			y: end.y - (next.y - start.y) / 6,
		};

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

export function createRibbonDrawTiming(
	samples: readonly RibbonSample[],
	lead: number,
): RibbonDrawTiming {
	const first = samples[0];
	const last = samples.at(-1);
	if (!first || !last || last.length <= 0) {
		return { duration: 1, ease: (progress) => progress };
	}

	const times = [0];
	for (let index = 1; index < samples.length; index += 1) {
		const sample = samples[index] as RibbonSample;
		const previous = samples[index - 1] as RibbonSample;
		const previousTime = times[index - 1] ?? 0;

		times.push(
			Math.max(
				previousTime + (sample.length - previous.length) * ribbonLengthShare,
				sample.y - first.y - lead,
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
