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

export interface RibbonPiece {
	end: RibbonPoint;
	endHandle: RibbonPoint;
	start: RibbonPoint;
	startHandle: RibbonPoint;
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
export const ribbonHeadLine = 0.8;
export const ribbonHeadLead = 0.8;
export const ribbonLengthShare = 0.3;
export const ribbonHiddenShare = 0.03;
export const ribbonShadeReach = 1.5;

export const ribbonArtwork = {
	anchors: {
		gridBottom: 949,
		gridTop: 478,
		height: 1093,
		statementBottom: 398,
		statementTop: 144,
		width: 1440,
	},
	path: "M316.5 0.0899658C331.86 84.0813 498.583 129.704 695.093 199.07M695.093 199.07C799.228 235.828 911.727 279.254 1014.5 338.59C1240 468.782 1209 709.795 1014.5 822.09C857.247 912.88 528 914.09 389.5 775.59C241 627.09 315 364.589 447.5 288.09C522.352 244.874 605.769 215.327 695.093 199.07ZM695.093 199.07C896.943 162.334 1128.96 193.464 1360.5 288.09C1627.7 397.29 1750.5 516.59 1750.5 648.59C1750.5 796.59 1546.5 966.59 1388.5 1026.59C1191 1101.59 394.5 1186.09 -97.5 1011.09",
} as const satisfies { anchors: RibbonAnchors; path: string };

export const ribbonSegments: readonly RibbonSegment[] = [
	{ from: 0, id: "lead", layer: "over", to: 4 },
	{ crossing: 6, from: 4, id: "climb", layer: "under", to: 7 },
	{ from: 7, id: "sweep", layer: "over", to: 10 },
];

export const ribbonPaintOrder: readonly RibbonSegment[] = [
	...ribbonSegments.filter(({ layer }) => layer === "under"),
	...ribbonSegments.filter(({ layer }) => layer === "over"),
];

const pathTokenPattern = /[a-z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi;
const commandArity: Record<string, number> = {
	c: 6,
	h: 1,
	l: 2,
	m: 2,
	s: 4,
	v: 1,
	z: 0,
};

function between(from: RibbonPoint, to: RibbonPoint, share: number) {
	return {
		x: from.x + (to.x - from.x) * share,
		y: from.y + (to.y - from.y) * share,
	};
}

function samePoint(first: RibbonPoint, second: RibbonPoint) {
	return (
		Math.abs(first.x - second.x) < 0.01 && Math.abs(first.y - second.y) < 0.01
	);
}

function linePiece(start: RibbonPoint, end: RibbonPoint): RibbonPiece {
	return {
		end,
		endHandle: between(start, end, 2 / 3),
		start,
		startHandle: between(start, end, 1 / 3),
	};
}

function mirrorHandle(pieces: readonly RibbonPiece[], cursor: RibbonPoint) {
	const previous = pieces.at(-1);
	if (!previous || !samePoint(previous.end, cursor)) return cursor;

	return {
		x: cursor.x * 2 - previous.endHandle.x,
		y: cursor.y * 2 - previous.endHandle.y,
	};
}

export function parseRibbonPath(data: string): RibbonPiece[] {
	const tokens = data.match(pathTokenPattern) ?? [];
	const pieces: RibbonPiece[] = [];
	let cursor: RibbonPoint = { x: 0, y: 0 };
	let subpathStart = cursor;
	let command = "";
	let index = 0;

	const read = () => Number(tokens[index++]);

	while (index < tokens.length) {
		const token = tokens[index] ?? "";

		if (/[a-z]/i.test(token)) {
			command = token;
			index += 1;
		}

		const kind = command.toLowerCase();
		const arity = commandArity[kind];
		if (arity === undefined) {
			throw new Error(`Unsupported ribbon path command "${command}".`);
		}

		const relative = command === kind;
		const offset = relative ? cursor : { x: 0, y: 0 };
		const point = () => {
			const x = read();
			const y = read();
			return { x: offset.x + x, y: offset.y + y };
		};

		if (kind === "z") {
			if (!samePoint(cursor, subpathStart)) {
				pieces.push(linePiece(cursor, subpathStart));
			}
			cursor = subpathStart;
			continue;
		}

		if (index + arity > tokens.length) break;

		if (kind === "m") {
			cursor = point();
			subpathStart = cursor;
			command = relative ? "l" : "L";
			continue;
		}

		let end: RibbonPoint;

		if (kind === "c") {
			const startHandle = point();
			const endHandle = point();
			end = point();
			pieces.push({ end, endHandle, start: cursor, startHandle });
		} else if (kind === "s") {
			const startHandle = mirrorHandle(pieces, cursor);
			const endHandle = point();
			end = point();
			pieces.push({ end, endHandle, start: cursor, startHandle });
		} else {
			end =
				kind === "h"
					? { x: offset.x + read(), y: cursor.y }
					: kind === "v"
						? { x: cursor.x, y: offset.y + read() }
						: point();
			if (!samePoint(cursor, end)) pieces.push(linePiece(cursor, end));
		}

		cursor = end;
	}

	return pieces;
}

const artworkPieces = parseRibbonPath(ribbonArtwork.path);

function anchorPairs(design: RibbonAnchors, live: RibbonAnchors) {
	return [
		[0, 0],
		[design.statementTop, live.statementTop],
		[design.statementBottom, live.statementBottom],
		[design.gridTop, live.gridTop],
		[design.gridBottom, live.gridBottom],
		[design.height, live.height],
	] as const;
}

function projectY(
	y: number,
	pairs: ReturnType<typeof anchorPairs>,
	scale: number,
) {
	const first = pairs[0];
	const last = pairs[pairs.length - 1] ?? first;
	if (y <= first[0]) return first[1] + (y - first[0]) * scale;
	if (y >= last[0]) return last[1] + (y - last[0]) * scale;

	for (let index = 1; index < pairs.length; index += 1) {
		const [designEnd, liveEnd] = pairs[index] ?? last;
		if (y > designEnd) continue;

		const [designStart, liveStart] = pairs[index - 1] ?? first;
		const span = designEnd - designStart;
		if (span <= 0) return liveEnd;

		return liveStart + ((y - designStart) / span) * (liveEnd - liveStart);
	}

	return last[1];
}

export function resolveRibbonPieces(live: RibbonAnchors): RibbonPiece[] {
	const design = ribbonArtwork.anchors;
	const scale = live.width / design.width;
	const pairs = anchorPairs(design, live);
	const project = ({ x, y }: RibbonPoint) => ({
		x: x * scale,
		y: projectY(y, pairs, scale),
	});

	return artworkPieces.map(({ end, endHandle, start, startHandle }) => ({
		end: project(end),
		endHandle: project(endHandle),
		start: project(start),
		startHandle: project(startHandle),
	}));
}

function direction(from: RibbonPoint, to: RibbonPoint) {
	const span = Math.hypot(to.x - from.x, to.y - from.y) || 1;
	return { x: (to.x - from.x) / span, y: (to.y - from.y) / span };
}

export function ribbonTuckPoint(
	pieces: readonly RibbonPiece[],
	reach: number,
): RibbonPoint | undefined {
	const first = pieces[0];
	if (!first) return undefined;

	const heading = samePoint(first.start, first.startHandle)
		? direction(first.start, first.end)
		: direction(first.start, first.startHandle);

	return {
		x: first.start.x - heading.x * reach,
		y: first.start.y - heading.y * reach,
	};
}

function formatPoint({ x, y }: RibbonPoint) {
	return `${x.toFixed(1)} ${y.toFixed(1)}`;
}

export function ribbonSegmentPath(
	pieces: readonly RibbonPiece[],
	{ from, to }: RibbonSegment,
	tuck?: RibbonPoint,
) {
	const first = pieces[from];
	if (!first) return "";

	const commands = tuck
		? [`M ${formatPoint(tuck)}`, `L ${formatPoint(first.start)}`]
		: [`M ${formatPoint(first.start)}`];
	let cursor = first.start;

	for (const piece of pieces.slice(from, to)) {
		if (!samePoint(piece.start, cursor)) {
			commands.push(`M ${formatPoint(piece.start)}`);
		}

		commands.push(
			`C ${formatPoint(piece.startHandle)} ${formatPoint(piece.endHandle)} ${formatPoint(piece.end)}`,
		);
		cursor = piece.end;
	}

	return commands.join(" ");
}

export function ribbonShadeLine(
	pieces: readonly RibbonPiece[],
	crossing: number,
	reach: number,
): RibbonShadeLine | undefined {
	const piece = pieces[crossing];
	if (!piece) return undefined;

	const previous = pieces[crossing - 1];
	const heading = previous
		? direction(previous.endHandle, piece.startHandle)
		: direction(piece.start, piece.startHandle);
	const center = piece.start;

	return {
		x1: center.x - heading.x * reach,
		x2: center.x + heading.x * reach,
		y1: center.y - heading.y * reach,
		y2: center.y + heading.y * reach,
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
