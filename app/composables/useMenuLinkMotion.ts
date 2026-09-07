import { onMounted, onScopeDispose } from 'vue'
import { unrefElement } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'

const menuLinkMotionConditions = {
	hover: '(hover: hover)',
	motion: '(prefers-reduced-motion: no-preference)',
}

export function useMenuLinkMotion(target: MaybeComputedElementRef) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap()
	let active = true

	onScopeDispose(() => {
		active = false
	})

	onMounted(async () => {
		const SplitText = await loadPlugin('SplitText')
		if (!SplitText || !active) return

		createMatchMedia(menuLinkMotionConditions, context => {
			if (!context.conditions?.hover || !context.conditions?.motion) return

			const element = unrefElement(target)
			if (!(element instanceof HTMLElement)) return

			const textContainer = element.querySelector(
				':scope > [data-menu-texts]',
			)
			if (!textContainer) return

			const label = textContainer.querySelector<HTMLElement>(
				':scope > [data-menu-label]',
			)
			const labelCopy = textContainer.querySelector<HTMLElement>(
				':scope > [data-menu-label-copy]',
			)
			if (!label || !labelCopy) return

			const labelSplit = SplitText.create(label, {
				aria: 'hidden',
				charsClass: 'site-menu-character',
				smartWrap: true,
				tag: 'span',
				type: 'chars',
			})
			const labelCopySplit = SplitText.create(labelCopy, {
				aria: 'hidden',
				charsClass: 'site-menu-character',
				smartWrap: true,
				tag: 'span',
				type: 'chars',
			})
			const characters = [...labelSplit.chars, ...labelCopySplit.chars]

			gsap.set(labelCopy, { visibility: 'visible' })
			gsap.set(labelCopySplit.chars, { force3D: true, yPercent: -120 })

			const clearTransformHint = () => {
				gsap.set(characters, { clearProps: 'willChange' })
			}

			const rollover = gsap
				.timeline({
					onComplete: clearTransformHint,
					onReverseComplete: clearTransformHint,
					paused: true,
				})
				.to(
					labelSplit.chars,
					{
						duration: 0.4,
						ease: 'power3.inOut',
						force3D: true,
						stagger: 0.018,
						yPercent: 120,
					},
					0,
				)
				.to(
					labelCopySplit.chars,
					{
						duration: 0.4,
						ease: 'power3.inOut',
						force3D: true,
						stagger: 0.018,
						yPercent: 0,
					},
					0,
				)

			let pointerInside = false
			let focusVisible = false
			let covered = false

			const sync = () => {
				const nextCovered = pointerInside || focusVisible
				if (nextCovered === covered) return

				covered = nextCovered
				gsap.set(characters, { willChange: 'transform' })

				if (covered) {
					rollover.play()
					return
				}

				rollover.reverse()
			}

			const handlePointerEnter = () => {
				pointerInside = true
				sync()
			}

			const handlePointerLeave = () => {
				pointerInside = false
				sync()
			}

			const handleFocus = () => {
				focusVisible = element.matches(':focus-visible')
				sync()
			}

			const handleBlur = () => {
				focusVisible = false
				sync()
			}

			element.addEventListener('blur', handleBlur)
			element.addEventListener('focus', handleFocus)
			element.addEventListener('pointerenter', handlePointerEnter)
			element.addEventListener('pointerleave', handlePointerLeave)

			return () => {
				element.removeEventListener('blur', handleBlur)
				element.removeEventListener('focus', handleFocus)
				element.removeEventListener('pointerenter', handlePointerEnter)
				element.removeEventListener('pointerleave', handlePointerLeave)
				rollover.kill()
				gsap.set(characters, {
					clearProps: 'transform,willChange',
				})
				gsap.set(labelCopy, { clearProps: 'visibility' })
				labelCopySplit.revert()
				labelSplit.revert()
			}
		})
	})
}
