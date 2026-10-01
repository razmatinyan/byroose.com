export const charRevealDuration = 0.9
export const charRevealEase = "power3.out"
export const charRevealOffset = 115
export const charRevealStagger = 0.035

export interface CharRevealOptions {
	position?: gsap.Position
	stagger?: number
}

export function addCharReveal(
	timeline: gsap.core.Timeline,
	elements: readonly Element[],
	{ position = 0, stagger = charRevealStagger }: CharRevealOptions = {},
) {
	if (!elements.length) return timeline

	return timeline
		.set(
			elements,
			{ visibility: "inherit", yPercent: charRevealOffset },
			position,
		)
		.to(
			elements,
			{
				duration: charRevealDuration,
				ease: charRevealEase,
				stagger,
				yPercent: 0,
			},
			position,
		)
}
