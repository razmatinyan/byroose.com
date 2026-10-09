import {
	parseRibbonPath,
	projectRibbonPieces,
	ribbonSegmentPath,
} from "@/lib/ribbon-path";
import type { RibbonAnchorPair, RibbonSegment } from "@/lib/ribbon-path";

export interface DrawnLineFrame {
	anchors: readonly number[];
	height: number;
	width: number;
}

export interface DrawnLineArtwork {
	anchors: readonly number[];
	bottom: number;
	path: string;
	top: number;
	width: number;
}

export interface DrawnLine {
	lead?: number;
	path: (frame: DrawnLineFrame) => string;
}

function framePairs(
	artwork: DrawnLineArtwork,
	frame: DrawnLineFrame,
): RibbonAnchorPair[] {
	const anchorPairs = artwork.anchors.flatMap((design, index) => {
		const live = frame.anchors[index];
		return live === undefined ? [] : [[design, live] as const];
	});

	return [[artwork.top, 0], ...anchorPairs, [artwork.bottom, frame.height]];
}

export function createDrawnLinePath(artwork: DrawnLineArtwork) {
	const pieces = parseRibbonPath(artwork.path);
	const segment: RibbonSegment = {
		from: 0,
		id: "line",
		layer: "over",
		to: pieces.length,
	};

	return (frame: DrawnLineFrame) =>
		ribbonSegmentPath(
			projectRibbonPieces(
				pieces,
				framePairs(artwork, frame),
				frame.width / artwork.width,
			),
			segment,
		);
}
