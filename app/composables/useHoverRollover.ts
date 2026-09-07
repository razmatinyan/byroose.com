import { onMounted, onScopeDispose } from 'vue'
import { unrefElement } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'

const motionConditions = {
	motion: '(prefers-reduced-motion: no-preference)',
	reduceMotion: '(prefers-reduced-motion: reduce)',
}

const elasticEaseData = [
	'M0,0',
	'L0.076,0.5737',
	'L0.1187,0.8382',
	'L0.1419,0.9463',
	'L0.1654,1.0292',
	'L0.1897,1.0886',
	'L0.2153,1.1258',
	'L0.2297,1.137',
	'L0.2448,1.1424',
	'L0.261,1.1423',
	'L0.2786,1.1366',
	'L0.3101,1.1165',
	'L0.3862,1.0507',
	'L0.4257,1.0219',
	'L0.4699,0.9995',
	'L0.5163,0.9872',
	'L0.5877,0.9842',
	'L0.8126,1.0011',
	'L1,1',
].join(' ')
const smoothEaseData = '.32,.72,0,1'
const colorEaseData = '.215,.61,.355,1'
const opacityEaseData = '0,0,.58,1'
const textAngleProperty = '--rollover-text-angle'
const textYProperty = '--rollover-text-y'
const textTranslateDuration = 0.75
const textRotateDuration = 0.5
const textOpacityDuration = 0.2
const textColorDuration = 0.2
const textEntryDelay = 0.1
const layerDuration = 0.38
const layerRestScale = 0.94
const layerStagger = 0.06
const rolloverEase = 'power3.out'
const glyphExit = { x: 200, y: -100 }
const glyphEntry = { x: -200, y: 100 }
const glyphRest = { x: 0, y: 0 }

type CustomEasePlugin = typeof import('gsap/CustomEase').CustomEase

interface HoverRolloverOptions {
	speed?: number
}

function createRolloverEases(CustomEase: CustomEasePlugin) {
	return {
		color: CustomEase.create('hover-rollover-color', colorEaseData),
		elastic: CustomEase.create('hover-rollover-elastic', elasticEaseData),
		opacity: CustomEase.create('hover-rollover-opacity', opacityEaseData),
		smooth: CustomEase.create('hover-rollover-smooth', smoothEaseData),
	}
}

export function useHoverRollover(
	target: MaybeComputedElementRef,
	{ speed = 1 }: HoverRolloverOptions = {},
) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap()
	let active = true

	onScopeDispose(() => {
		active = false
	})

	onMounted(async () => {
		const CustomEase = await loadPlugin('CustomEase')
		if (!CustomEase || !active) return

		const eases = createRolloverEases(CustomEase)

		createMatchMedia(motionConditions, context => {
			const element = unrefElement(target)
			if (!element) return

			const layerContainer = element.querySelector(
				':scope > [data-rollover-layers]',
			)
			const textContainer = element.querySelector(
				':scope > [data-rollover-texts]',
			)
			if (!layerContainer || !textContainer) return

			const label = textContainer.querySelector(
				':scope > [data-rollover-label]',
			)
			const labelCopy = textContainer.querySelector(
				':scope > [data-rollover-label-copy]',
			)
			const layers = Array.from(
				layerContainer.querySelectorAll(':scope > [data-rollover-layer]'),
			)

			if (!label || !labelCopy || layers.length === 0) return

			const glyph = element.querySelector(
				':scope > [data-rollover-icon] [data-rollover-glyph]',
			)
			const glyphCopy = element.querySelector(
				':scope > [data-rollover-icon] [data-rollover-glyph-copy]',
			)
			const reduceMotion = Boolean(context.conditions?.reduceMotion)
			const descending = [...layers].reverse()
			const restingColor = getComputedStyle(label).color
			const coveredColor = getComputedStyle(labelCopy).color

			gsap.set(label, { opacity: 1 })
			gsap.set(labelCopy, { opacity: 0 })
			gsap.set(layers, {
				scale: layerRestScale,
				transformOrigin: '50% 100%',
				y: 0,
				yPercent: 100,
			})

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

				const labelAngle = cover ? '-60deg' : '0deg'
				const labelY = cover ? '-2em' : '0em'
				const labelOpacity = cover ? 0 : 1
				const labelColor = cover ? coveredColor : restingColor
				const labelCopyAngle = cover ? '0deg' : '-30deg'
				const labelCopyY = cover ? '0em' : '2em'
				const labelCopyOpacity = cover ? 1 : 0
				const labelCopyStart = cover ? textEntryDelay : 0
				const layerPosition = cover ? 0 : 100
				const layerScale = cover ? 1 : layerRestScale
				const glyphPosition = cover ? glyphExit : glyphRest
				const glyphCopyPosition = cover ? glyphRest : glyphEntry

				if (reduceMotion) {
					rollover = null
					gsap.set(label, {
						[textAngleProperty]: labelAngle,
						[textYProperty]: labelY,
						color: labelColor,
						opacity: labelOpacity,
					})
					gsap.set(labelCopy, {
						[textAngleProperty]: labelCopyAngle,
						[textYProperty]: labelCopyY,
						opacity: labelCopyOpacity,
					})
					gsap.set(layers, {
						scale: layerScale,
						yPercent: layerPosition,
					})
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
					{
						[textYProperty]: labelY,
						duration: textTranslateDuration,
						ease: eases.elastic,
					},
					0,
				)
				timeline.to(
					label,
					{
						[textAngleProperty]: labelAngle,
						duration: textRotateDuration,
						ease: eases.smooth,
					},
					0,
				)
				timeline.to(
					label,
					{
						duration: textOpacityDuration,
						ease: eases.opacity,
						opacity: labelOpacity,
					},
					0,
				)
				timeline.to(
					label,
					{
						color: labelColor,
						duration: textColorDuration,
						ease: eases.color,
					},
					0,
				)
				timeline.to(
					labelCopy,
					{
						[textYProperty]: labelCopyY,
						duration: textTranslateDuration,
						ease: eases.elastic,
					},
					labelCopyStart,
				)
				timeline.to(
					labelCopy,
					{
						[textAngleProperty]: labelCopyAngle,
						duration: textRotateDuration,
						ease: eases.smooth,
					},
					labelCopyStart,
				)
				timeline.to(
					labelCopy,
					{
						duration: textOpacityDuration,
						ease: eases.opacity,
						opacity: labelCopyOpacity,
					},
					labelCopyStart,
				)

				for (const [index, layer] of (cover
					? layers
					: descending
				).entries()) {
					timeline.to(
						layer,
						{ scale: layerScale, yPercent: layerPosition },
						index * layerStagger,
					)
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
				gsap.set([label, labelCopy], {
					clearProps: `${textAngleProperty},${textYProperty},color,opacity`,
				})
				gsap.set(
					[...layers, glyph, glyphCopy].filter(Boolean),
					{ clearProps: 'transform,transformOrigin' },
				)
			}
		})
	})
}
