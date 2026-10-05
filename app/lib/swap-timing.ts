export const swapDuration = 0.7
export const swapScrollDuration = 1.5
export const swapScrollMaxDuration = 2.5
export const swapEase = 'power4.inOut'

const swapScrollDistanceExponent = 0.25

export function getSwapScrollDuration(distance: number, viewportHeight: number) {
	const viewports = distance / Math.max(viewportHeight, 1)
	const distanceDuration = viewports ** swapScrollDistanceExponent

	return Math.min(
		Math.max(distanceDuration, swapScrollDuration),
		swapScrollMaxDuration,
	)
}
