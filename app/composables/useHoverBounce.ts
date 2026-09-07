import { onMounted, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { unrefElement } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'

const motionConditions = {
	hover: '(hover: hover)',
	motion: '(prefers-reduced-motion: no-preference)',
}
const hoverScale = 1.08
const pressedScale = 0.96

interface HoverBounceOptions {
	hover?: MaybeRefOrGetter<boolean>
	press?: boolean
}

export function useHoverBounce(
	target: MaybeComputedElementRef,
	{ hover = true, press = false }: HoverBounceOptions = {},
) {
	const { createMatchMedia, gsap } = useGsap()

	onMounted(() => {
		createMatchMedia(motionConditions, context => {
			if (!context.conditions?.motion) return

			const element = unrefElement(target)
			if (!(element instanceof HTMLElement)) return

			let activeTween: gsap.core.Tween | null = null
			let keyboardPressed = false
			let pointerInside = false
			let pointerPressed = false

			const scaleTo = (scale: number, duration: number, ease: string) => {
				activeTween?.kill()
				activeTween = gsap.to(element, { duration, ease, scale })
			}

			const canHover = () => Boolean(context.conditions?.hover) && toValue(hover)
			const isDisabled = () =>
				element.matches(':disabled, [aria-disabled="true"]')
			const isKeyboardActivation = (event: KeyboardEvent) =>
				event.key === 'Enter' ||
				(event.key === ' ' &&
					element.matches(
						'button, [role="button"], input[type="button"], input[type="reset"], input[type="submit"]',
					))

			const settle = () => {
				if (press && (pointerPressed || keyboardPressed)) {
					scaleTo(pressedScale, 0.12, 'power2.out')
					return
				}

				if (canHover() && pointerInside) {
					scaleTo(hoverScale, 0.8, 'elastic.out(1.3, 0.3)')
					return
				}

				scaleTo(1, 0.45, 'back.out(2.2)')
			}

			const handlePointerEnter = () => {
				pointerInside = true
				if (canHover()) settle()
			}
			const handlePointerLeave = () => {
				pointerInside = false
				pointerPressed = false
				settle()
			}
			const handlePointerDown = (event: PointerEvent) => {
				if (!press || event.button !== 0 || isDisabled()) return
				pointerPressed = true
				settle()
			}
			const handlePointerUp = () => {
				if (!pointerPressed) return
				pointerPressed = false
				settle()
			}
			const handleKeyDown = (event: KeyboardEvent) => {
				if (
					!press ||
					event.repeat ||
					isDisabled() ||
					!isKeyboardActivation(event)
				) {
					return
				}

				keyboardPressed = true
				settle()
			}
			const handleKeyUp = (event: KeyboardEvent) => {
				if (!keyboardPressed || !isKeyboardActivation(event)) return
				keyboardPressed = false
				settle()
			}
			const handleBlur = () => {
				if (!keyboardPressed) return
				keyboardPressed = false
				settle()
			}

			gsap.set(element, { willChange: 'transform' })
			element.addEventListener('pointerenter', handlePointerEnter)
			element.addEventListener('pointerleave', handlePointerLeave)
			if (press) {
				element.addEventListener('blur', handleBlur)
				element.addEventListener('keydown', handleKeyDown)
				element.addEventListener('keyup', handleKeyUp)
				element.addEventListener('pointercancel', handlePointerUp)
				element.addEventListener('pointerdown', handlePointerDown)
				element.addEventListener('pointerup', handlePointerUp)
			}

			return () => {
				element.removeEventListener('pointerenter', handlePointerEnter)
				element.removeEventListener('pointerleave', handlePointerLeave)
				if (press) {
					element.removeEventListener('blur', handleBlur)
					element.removeEventListener('keydown', handleKeyDown)
					element.removeEventListener('keyup', handleKeyUp)
					element.removeEventListener('pointercancel', handlePointerUp)
					element.removeEventListener('pointerdown', handlePointerDown)
					element.removeEventListener('pointerup', handlePointerUp)
				}
				activeTween?.kill()
				activeTween = null
				gsap.set(element, { clearProps: 'scale,willChange' })
			}
		})
	})
}
