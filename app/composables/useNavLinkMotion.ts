import { onMounted } from 'vue'
import { unrefElement } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'

const labelSelector = '[data-nav-label]'
const labelCopySelector = '[data-nav-label-copy]'
const lineSelector = '[data-nav-line]'
const hoverDuration = 0.7
const hoverEase = 'power4.inOut'

export function useNavLinkMotion(target: MaybeComputedElementRef) {
	const { createMatchMedia, gsap } = useGsap()

	onMounted(() => {
		createMatchMedia(
			{
				motion: '(prefers-reduced-motion: no-preference)',
				reduceMotion: '(prefers-reduced-motion: reduce)',
			},
			context => {
				const element = unrefElement(target)
				if (!(element instanceof HTMLElement)) return

				const label = element.querySelector<HTMLElement>(labelSelector)
				const labelCopy =
					element.querySelector<HTMLElement>(labelCopySelector)
				const line = element.querySelector<HTMLElement>(lineSelector)
				if (!label || !labelCopy || !line) return

				const tween = {
					duration: context.conditions?.motion ? hoverDuration : 0,
					ease: hoverEase,
					force3D: false,
					overwrite: 'auto' as const,
				}
				let active = false
				let pointerInside = false
				let focusVisible = false

				gsap.set(label, { scale: 1 })
				gsap.set(labelCopy, { scale: 0 })
				gsap.set(line, { scaleX: 0 })

				const settle = (next: boolean) => {
					if (next === active) return

					active = next
					gsap.to(label, { ...tween, scale: next ? 0 : 1 })
					gsap.to(labelCopy, { ...tween, scale: next ? 1 : 0 })
					gsap.to(line, { ...tween, scaleX: next ? 1 : 0 })
				}

				const sync = () => settle(pointerInside || focusVisible)

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

					const targets = [label, labelCopy, line]
					gsap.killTweensOf(targets)
					gsap.set(targets, { clearProps: 'transform' })
				}
			},
			() => unrefElement(target),
		)
	})
}
