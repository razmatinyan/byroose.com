export interface CurveKey {
	at: number
	value: number
	slope: number
}

export type CurveEase = (progress: number) => number

function hermite(from: CurveKey, to: CurveKey, at: number) {
	const span = to.at - from.at
	if (span <= 0) return to.value

	const t = (at - from.at) / span
	const t2 = t * t
	const t3 = t2 * t

	return (
		(2 * t3 - 3 * t2 + 1) * from.value +
		(t3 - 2 * t2 + t) * span * from.slope +
		(3 * t2 - 2 * t3) * to.value +
		(t3 - t2) * span * to.slope
	)
}

export function sampleCurve(keys: readonly CurveKey[], at: number) {
	const first = keys[0]
	const last = keys.at(-1)
	if (!first || !last) return 0
	if (at <= first.at) return first.value
	if (at >= last.at) return last.value

	const nextIndex = keys.findIndex(key => key.at > at)
	const from = keys[nextIndex - 1]
	const to = keys[nextIndex]

	return from && to ? hermite(from, to, at) : last.value
}

export function curveEase(keys: () => readonly CurveKey[]): CurveEase {
	return progress => {
		const current = keys()
		const first = current[0]
		const last = current.at(-1)
		if (!first || !last) return progress

		const valueSpan = last.value - first.value
		if (valueSpan === 0) return progress

		const at = first.at + (last.at - first.at) * progress
		return (sampleCurve(current, at) - first.value) / valueSpan
	}
}
