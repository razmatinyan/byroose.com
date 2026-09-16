import { onScopeDispose } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

const enterDuration = 0.5
const leaveDuration = 0.3
const enterOffsetY = 24
const leaveOffsetY = 16
const enterScale = 0.96
const leaveScale = 0.98
const enterEase = 'power3.out'
const leaveEase = 'power2.in'
const restingState = { autoAlpha: 1, scale: 1, y: 0 }

export function useCookieBannerMotion() {
	const { gsap } = useGsap()
	const reducedMotion = usePreferredReducedMotion()
	let activeTween: gsap.core.Tween | null = null

	const prefersReducedMotion = () => reducedMotion.value === 'reduce'

	onScopeDispose(() => {
		activeTween?.kill()
		activeTween = null
	})

	function prepare(element: Element) {
		if (prefersReducedMotion()) {
			gsap.set(element, restingState)
			return
		}

		gsap.set(element, {
			autoAlpha: 0,
			scale: enterScale,
			y: enterOffsetY,
		})
	}

	function enter(element: Element, done: () => void) {
		activeTween?.kill()

		if (prefersReducedMotion()) {
			gsap.set(element, restingState)
			done()
			return
		}

		activeTween = gsap.to(element, {
			...restingState,
			duration: enterDuration,
			ease: enterEase,
			onComplete: done,
		})
	}

	function leave(element: Element, done: () => void) {
		activeTween?.kill()

		if (prefersReducedMotion()) {
			gsap.set(element, { autoAlpha: 0 })
			done()
			return
		}

		activeTween = gsap.to(element, {
			autoAlpha: 0,
			duration: leaveDuration,
			ease: leaveEase,
			onComplete: done,
			scale: leaveScale,
			y: leaveOffsetY,
		})
	}

	return { enter, leave, prepare }
}
