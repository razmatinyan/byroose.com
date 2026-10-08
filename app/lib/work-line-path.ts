import { parseRibbonPath, ribbonSegmentPath } from "@/lib/ribbon-path";
import type { RibbonPiece, RibbonSegment } from "@/lib/ribbon-path";

export interface WorkLineFrame {
	height: number;
	width: number;
}

export const workLineLead = 0;

export const workLineArtwork = {
	path: "M1528.08-11.79c-258.14,95.7-517.82,187.37-775.03,285.52-32.44,13.21-64.44,27.6-95.15,44.48-259.5,138.37-376.02,461.22-237.41,726.04,75.31,145.25,216.72,237.91,325.76,357.37,114.56,124.21,197.53,283.11,208.83,453.56,8.65,124.28-21.38,252-92.37,354.95-57.39,84.74-137.59,151.23-205.76,227.47-147.22,158.48-201.76,374.02-233.8,583.72",
	width: 1440,
} as const;

const artworkPieces = parseRibbonPath(workLineArtwork.path);
const artworkBottom = artworkPieces.at(-1)?.end.y ?? 1;
const workLineSegment: RibbonSegment = {
	from: 0,
	id: "line",
	layer: "over",
	to: artworkPieces.length,
};

function resolveWorkLinePieces({ height, width }: WorkLineFrame): RibbonPiece[] {
	const scaleX = width / workLineArtwork.width;
	const scaleY = height / artworkBottom;
	const project = ({ x, y }: { x: number; y: number }) => ({
		x: x * scaleX,
		y: y * scaleY,
	});

	return artworkPieces.map(({ end, endHandle, start, startHandle }) => ({
		end: project(end),
		endHandle: project(endHandle),
		start: project(start),
		startHandle: project(startHandle),
	}));
}

export function workLinePath(frame: WorkLineFrame) {
	return ribbonSegmentPath(resolveWorkLinePieces(frame), workLineSegment);
}
