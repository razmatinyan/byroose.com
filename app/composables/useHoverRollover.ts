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
const swapEntryDuration = 0.75
const swapExitDuration = 0.5
const textColorDuration = 0.2
const swapEntryDelay = 0.1
const swapExitOrigin = '100% 0%'
const swapEntryOrigin = '0% 100%'
const layerDuration = 0.38
const layerRestScale = 0.94
const layerStagger = 0.06
const layerRestOffset = { xPercent: -100, yPercent: 100 }
const layerCoverOffset = { xPercent: 0, yPercent: 0 }
const rolloverEase = 'power3.out'

type CustomEasePlugin = typeof import('gsap/CustomEase').CustomEase

interface HoverRolloverOptions {
	speed?: number
}

interface SwapPair {
	original: Element
	copy: Element
}

function createRolloverEases(CustomEase: CustomEasePlugin) {
	return {
		color: CustomEase.create('hover-rollover-color', colorEaseData),
		elastic: CustomEase.create('hover-rollover-elastic', elasticEaseData),
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
			if (!layerContainer) return

			const label =
				textContainer?.querySelector(':scope > [data-rollover-label]') ??
				null
			const labelCopy =
				textContainer?.querySelector(
					':scope > [data-rollover-label-copy]',
				) ?? null
			const layers = Array.from(
				layerContainer.querySelectorAll(':scope > [data-rollover-layer]'),
			)
			const finalLayer = layers.at(-1)

			if (!finalLayer) return

			const texts =
				label && labelCopy ? { copy: labelCopy, original: label } : null

			const icon = element.querySelector(':scope > [data-rollover-icon]')
			const glyph = element.querySelector(
				':scope > [data-rollover-icon] [data-rollover-glyph]',
			)
			const glyphCopy = element.querySelector(
				':scope > [data-rollover-icon] [data-rollover-glyph-copy]',
			)
			const glyphs =
				glyph && glyphCopy ? { copy: glyphCopy, original: glyph } : null
			const swapPairs: SwapPair[] = [texts, glyphs].filter(
				(pair): pair is SwapPair => pair !== null,
			)
			const swapElements = swapPairs.flatMap(pair => [
				pair.original,
				pair.copy,
			])
			const reduceMotion = Boolean(context.conditions?.reduceMotion)
			const descending = [...layers].reverse()
			const occludedLayers = layers.slice(0, -1)
			const layerSettleTime =
				(layers.length - 1) * layerStagger + layerDuration
			const restingColor = () => getComputedStyle(element).color
			const coveredColor = () =>
				getComputedStyle(labelCopy ?? finalLayer).color
			const coloredText = [label, icon].filter(Boolean)

			for (const pair of swapPairs) {
				gsap.set(pair.original, {
					scale: 1,
					transformOrigin: swapExitOrigin,
				})
				gsap.set(pair.copy, { scale: 0, transformOrigin: swapEntryOrigin })
			}
			gsap.set(layers, {
				force3D: false,
				scale: layerRestScale,
				transformOrigin: '0% 100%',
				x: 0,
				y: 0,
				...layerRestOffset,
			})

			let rollover: gsap.core.Timeline | null = null
			let covered = false

			const settle = (cover: boolean) => {
				if (cover === covered) return

				covered = cover
				rollover?.kill()

				const labelColor = cover ? coveredColor() : restingColor()
				const settledColor = cover
					? { color: labelColor }
					: { clearProps: 'color' }
				const originalScale = cover ? 0 : 1
				const copyScale = cover ? 1 : 0
				const leaving = cover ? 'original' : 'copy'
				const entering = cover ? 'copy' : 'original'
				const layerPosition = cover ? layerCoverOffset : layerRestOffset
				const layerScale = cover ? 1 : layerRestScale
				const occludedVisibility = cover ? 'hidden' : 'visible'
				const hostBackground = cover
					? { backgroundClip: 'content-box' }
					: { clearProps: 'backgroundClip' }

				if (reduceMotion) {
					rollover = null
					for (const pair of swapPairs) {
						gsap.set(pair.original, { scale: originalScale })
						gsap.set(pair.copy, { scale: copyScale })
					}
					gsap.set(coloredText, settledColor)
					gsap.set(layers, {
						force3D: false,
						scale: layerScale,
						...layerPosition,
					})
					gsap.set(occludedLayers, {
						visibility: occludedVisibility,
					})
					gsap.set(element, hostBackground)
					return
				}

				const timeline = gsap.timeline({
					defaults: { duration: layerDuration, ease: rolloverEase },
				})

				timeline.timeScale(speed)

				timeline.to(
					coloredText,
					{
						color: labelColor,
						duration: textColorDuration,
						ease: eases.color,
					},
					0,
				)

				if (!cover) {
					timeline.set(coloredText, settledColor, textColorDuration)
				}

				for (const pair of swapPairs) {
					timeline.to(
						pair[leaving],
						{
							duration: swapExitDuration,
							ease: eases.smooth,
							scale: 0,
						},
						0,
					)
					timeline.to(
						pair[entering],
						{
							duration: swapEntryDuration,
							ease: eases.elastic,
							scale: 1,
						},
						swapEntryDelay,
					)
				}

				for (const [index, layer] of (cover
					? layers
					: descending
				).entries()) {
					timeline.to(
						layer,
						{
							force3D: false,
							scale: layerScale,
							...layerPosition,
						},
						index * layerStagger,
					)
				}

				timeline.set(
					occludedLayers,
					{ visibility: occludedVisibility },
					cover ? layerSettleTime : 0,
				)
				timeline.set(
					element,
					hostBackground,
					cover ? layerSettleTime : 0,
				)

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
				gsap.set(element, { clearProps: 'backgroundClip' })
				gsap.set(coloredText, { clearProps: 'color' })
				gsap.set([...layers, ...swapElements], {
					clearProps: 'transform,transformOrigin,visibility',
				})
			}
		})
	})
}
