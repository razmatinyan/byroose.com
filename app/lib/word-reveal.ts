export const wordRevealDuration = 0.8;
export const wordRevealEase = "power3.out";
export const wordRevealOffset = 115;
export const wordRevealStart = "top 82%";
export const wordRevealStagger = 0.03;
export const wordRevealDenseStagger = 0.01;
export const navRevealStagger = 0.08;

export interface WordRevealOptions {
	duration?: number;
	ease?: gsap.EaseString;
	position?: gsap.Position;
	stagger?: number;
}

export function addWordReveal(
	timeline: gsap.core.Timeline,
	elements: readonly Element[],
	{
		duration = wordRevealDuration,
		ease = wordRevealEase,
		position = 0,
		stagger = wordRevealStagger,
	}: WordRevealOptions = {},
) {
	if (!elements.length) return timeline;

	return timeline
		.set(
			elements,
			{ visibility: "inherit", yPercent: wordRevealOffset },
			position,
		)
		.to(
			elements,
			{
				duration,
				ease,
				stagger,
				yPercent: 0,
			},
			position,
		);
}
