import { onMounted } from 'vue'
import { unrefElement } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'

const motionConditions = {
	motion: '(prefers-reduced-motion: no-preference)',
	reduceMotion: '(prefers-reduced-motion: reduce)',
}

const labelDuration = 0.34
const labelExit = -150
const layerDuration = 0.38
const layerStagger = 0.06
const rolloverEase = 'power3.out'
const glyphExit = { x: 200, y: -100 }
const glyphEntry = { x: -200, y: 100 }
const glyphRest = { x: 0, y: 0 }

interface HoverRolloverOptions {
	speed?: number
}

export function useHoverRollover(
	target: MaybeComputedElementRef,
	{ speed = 1 }: HoverRolloverOptions = {},
) {
	const { createMatchMedia, gsap } = useGsap()

	onMounted(() => {
		createMatchMedia(motionConditions, context => {
			const element = unrefElement(target)
			if (!element) return

			const label = element.querySelector(':scope > [data-rollover-label]')
			const layers = Array.from(
				element.querySelectorAll(':scope > [data-rollover-layer]'),
			)

			if (!label || layers.length === 0) return

			const glyph = element.querySelector(
				':scope > [data-rollover-icon] [data-rollover-glyph]',
			)
			const glyphCopy = element.querySelector(
				':scope > [data-rollover-icon] [data-rollover-glyph-copy]',
			)
			const reduceMotion = Boolean(context.conditions?.reduceMotion)
			const descending = [...layers].reverse()

			gsap.set(layers, { y: 0, yPercent: 100 })

			if (glyph && glyphCopy) {
				gsap.set(glyph, {
					x: 0,
					xPercent: glyphRest.x,
					y: 0,
					yPercent: glyphRest.y,
				})
				gsap.set(glyphCopy, {
					x: 0,
					xPercent: glyphEntry.x,
					y: 0,
					yPercent: glyphEntry.y,
				})
			}

			let rollover: gsap.core.Timeline | null = null
			let covered = false

			const settle = (cover: boolean) => {
				if (cover === covered) return

				covered = cover
				rollover?.kill()

				const labelPosition = cover ? labelExit : 0
				const layerPosition = cover ? 0 : 100
				const glyphPosition = cover ? glyphExit : glyphRest
				const glyphCopyPosition = cover ? glyphRest : glyphEntry

				if (reduceMotion) {
					rollover = null
					gsap.set(label, { yPercent: labelPosition })
					gsap.set(layers, { yPercent: layerPosition })
					if (glyph && glyphCopy) {
						gsap.set(glyph, {
							xPercent: glyphPosition.x,
							yPercent: glyphPosition.y,
						})
						gsap.set(glyphCopy, {
							xPercent: glyphCopyPosition.x,
							yPercent: glyphCopyPosition.y,
						})
					}
					return
				}

				const timeline = gsap.timeline({
					defaults: { duration: layerDuration, ease: rolloverEase },
				})

				timeline.timeScale(speed)

				timeline.to(
					label,
					{ duration: labelDuration, yPercent: labelPosition },
					0,
				)

				for (const [index, layer] of (cover
					? layers
					: descending
				).entries()) {
					timeline.to(layer, { yPercent: layerPosition }, index * layerStagger)
				}

				if (glyph && glyphCopy) {
					timeline.to(
						glyph,
						{ xPercent: glyphPosition.x, yPercent: glyphPosition.y },
						0,
					)
					timeline.to(
						glyphCopy,
						{
							xPercent: glyphCopyPosition.x,
							yPercent: glyphCopyPosition.y,
						},
						0,
					)
				}

				rollover = timeline
			}

			let pointerInside = false
			let focusVisible = false

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
				rollover?.kill()
				gsap.set(
					[label, ...layers, glyph, glyphCopy].filter(Boolean),
					{ clearProps: 'transform' },
				)
			}
		})
	})
}
