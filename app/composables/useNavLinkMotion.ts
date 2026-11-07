import { onMounted, onScopeDispose } from 'vue'
import { unrefElement } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'

const labelSelector = '[data-nav-label]'
const labelCopySelector = '[data-nav-label-copy]'
const lineSelector = '[data-nav-line]'
const slideDuration = 0.65
const slideEaseName = 'nav-link-slide'
const slideEaseData = 'M0,0 C0.16,1 0.35,1 1,1'

export function useNavLinkMotion(target: MaybeComputedElementRef) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap()
	let active = true

	onScopeDispose(() => {
		active = false
	})

	onMounted(async () => {
		const CustomEase = await loadPlugin('CustomEase')
		if (!CustomEase || !active) return

		const slideEase = CustomEase.get(slideEaseName)
			?? CustomEase.create(slideEaseName, slideEaseData)

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

				const animated = Boolean(context.conditions?.motion)
				const shared = { force3D: false, overwrite: 'auto' as const }
				const tween = {
					...shared,
					duration: animated ? slideDuration : 0,
					ease: slideEase,
				}
				let hovered = false
				let pointerInside = false
				let focusVisible = false

				gsap.set(label, { yPercent: 0 })
				gsap.set(labelCopy, { y: 0, yPercent: 100 })
				gsap.set(line, { scaleX: 0 })

				const settle = (next: boolean) => {
					if (next === hovered) return

					hovered = next
					gsap.to(label, { ...tween, yPercent: next ? -100 : 0 })
					gsap.to(labelCopy, { ...tween, yPercent: next ? 0 : 100 })
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
