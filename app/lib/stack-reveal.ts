export const stackRevealDuration = 1
export const stackRevealEase = "power3.out"
export const stackRevealLeadRatio = 1 / 3
export const stackRevealStagger = 0.12

export interface StackRevealOptions {
	duration?: number
	position?: gsap.Position
	scale?: number
	stagger?: number
}

export function addStackReveal(
	timeline: gsap.core.Timeline,
	elements: readonly Element[],
	{
		duration = stackRevealDuration,
		position = 0,
		scale = 1,
		stagger = stackRevealStagger,
	}: StackRevealOptions = {},
) {
	const [lead, ...followers] = elements
	if (!lead) return timeline

	timeline.to(lead, { duration, ease: stackRevealEase, scale }, position)

	if (followers.length) {
		timeline.to(
			followers,
			{ duration, ease: stackRevealEase, scale, stagger },
			`<${duration * stackRevealLeadRatio}`,
		)
	}

	return timeline
}
