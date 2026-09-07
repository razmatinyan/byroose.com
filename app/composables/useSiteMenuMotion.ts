import { onMounted, toValue, useTemplateRef, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { useEventListener } from '@vueuse/core'

type ApplyMenuState = (open: boolean, immediate?: boolean) => void

const menuPanelOffset = 8
const menuViewportInset = 16

export function useSiteMenuMotion(open: MaybeRefOrGetter<boolean>) {
	const siteMenuRoot = useTemplateRef<HTMLElement>('siteMenuRoot')
	const menuButton = useTemplateRef<HTMLButtonElement>('menuButton')
	const menuPanel = useTemplateRef<HTMLElement>('menuPanel')
	const menuLineTop = useTemplateRef<HTMLElement>('menuLineTop')
	const menuLineBottom = useTemplateRef<HTMLElement>('menuLineBottom')
	const { createMatchMedia, gsap } = useGsap()
	let applyMenuState: ApplyMenuState = () => undefined

	watch(
		() => toValue(open),
		value => applyMenuState(value),
		{ flush: 'post' },
	)

	useEventListener('resize', () => {
		applyMenuState(toValue(open), true)
	})

	onMounted(() => {
		createMatchMedia(
			{
				motion: '(prefers-reduced-motion: no-preference)',
				reduceMotion: '(prefers-reduced-motion: reduce)',
			},
			context => {
				const button = menuButton.value
				const panel = menuPanel.value
				const topLine = menuLineTop.value
				const bottomLine = menuLineBottom.value

				if (!button || !panel || !topLine || !bottomLine) return

				const buttonElement = button
				const panelElement = panel
				const revealTargets = Array.from(
					panel.querySelectorAll<HTMLElement>('[data-menu-reveal]'),
				)
				const reduceMotion = Boolean(context.conditions?.reduceMotion)
				let collapsedScaleX = 1
				let collapsedScaleY = 1
				let panelOrigin = '100% 0%'

				function positionPanel(
					buttonElement: HTMLButtonElement,
					panelElement: HTMLElement,
				) {
					const buttonBounds = buttonElement.getBoundingClientRect()
					const panelWidth = panelElement.offsetWidth
					const maximumLeft = window.innerWidth - panelWidth - menuViewportInset
					const desiredLeft = buttonBounds.right - panelWidth + menuPanelOffset
					const left = Math.max(
						menuViewportInset,
						Math.min(maximumLeft, desiredLeft),
					)
					const top = Math.max(
						menuPanelOffset,
						buttonBounds.top - menuPanelOffset,
					)
					collapsedScaleX = Math.min(1, buttonBounds.width / panelWidth)
					collapsedScaleY = Math.min(
						1,
						buttonBounds.height / panelElement.offsetHeight,
					)
					const originX =
						collapsedScaleX < 1
							? (buttonBounds.left - left) / (1 - collapsedScaleX)
							: panelWidth / 2
					const originY =
						collapsedScaleY < 1
							? (buttonBounds.top - top) / (1 - collapsedScaleY)
							: panelElement.offsetHeight / 2

					panelOrigin = `${originX}px ${originY}px`
					gsap.set(panelElement, { left, top, transformOrigin: panelOrigin })
				}

				let lineTimeline: gsap.core.Timeline | null = null

				const panelTimeline = gsap.timeline({
					paused: true,
					onComplete: () => {
						gsap.set(panel, { clearProps: 'willChange' })
					},
					onReverseComplete: () => {
						gsap.set(panel, {
							clearProps: 'willChange',
							visibility: 'hidden',
						})
					},
				})

				panelTimeline.fromTo(
					panel,
					{
						rotation: 0,
						scaleX: () => collapsedScaleX,
						scaleY: () => collapsedScaleY,
						skewX: 0,
						transformOrigin: () => panelOrigin,
						x: 0,
						y: 0,
					},
					{
						duration: 0.38,
						ease: 'power4.out',
						rotation: 0.25,
						scaleX: 1.025,
						scaleY: 0.985,
						skewX: 0.35,
						x: 3,
						y: -3,
					},
					0,
				)
				panelTimeline.to(
					panel,
					{
						duration: 0.2,
						ease: 'power2.out',
						rotation: 0,
						scaleX: 1,
						scaleY: 1,
						skewX: 0,
						x: 0,
						y: 0,
					},
					0.34,
				)
				panelTimeline.fromTo(
					revealTargets,
					{ autoAlpha: 0 },
					{
						autoAlpha: 1,
						duration: 0.18,
						ease: 'power3.out',
						stagger: 0.025,
					},
					0.44,
				)

				function setLines(expanded: boolean, immediate: boolean) {
					lineTimeline?.kill()
					gsap.set([topLine, bottomLine], { willChange: 'transform' })
					lineTimeline = gsap.timeline({
						defaults: {
							duration: immediate ? 0 : 0.38,
							ease: 'power3.inOut',
							overwrite: 'auto',
						},
						onComplete: () => {
							gsap.set([topLine, bottomLine], {
								clearProps: 'willChange',
							})
						},
					})
					lineTimeline.to(
						topLine,
						{ rotation: expanded ? 45 : 0, y: expanded ? 0 : -3 },
						0,
					)
					lineTimeline.to(
						bottomLine,
						{ rotation: expanded ? -45 : 0, y: expanded ? 0 : 3 },
						0,
					)
				}

				function setImmediateState(expanded: boolean) {
					positionPanel(buttonElement, panelElement)
					gsap.set(panel, {
						pointerEvents: expanded ? 'auto' : 'none',
						visibility: 'visible',
					})
					panelTimeline.invalidate().progress(expanded ? 1 : 0).pause()
					if (!expanded) {
						gsap.set(panel, {
							rotation: 0,
							scaleX: collapsedScaleX,
							scaleY: collapsedScaleY,
							skewX: 0,
							transformOrigin: panelOrigin,
							visibility: 'hidden',
							x: 0,
							y: 0,
						})
						gsap.set(revealTargets, { autoAlpha: 0 })
					}
					setLines(expanded, true)
				}

				const setMenuState: ApplyMenuState = (
					expanded,
					immediate = false,
				) => {
					if (immediate || reduceMotion) {
						setImmediateState(expanded)
						return
					}

					setLines(expanded, false)

					if (expanded) {
						if (panelTimeline.progress() === 0) {
							positionPanel(buttonElement, panelElement)
							panelTimeline.invalidate()
						}
						gsap.set(panel, {
							pointerEvents: 'auto',
							visibility: 'visible',
							willChange: 'transform',
						})
						panelTimeline.play()
						return
					}

					gsap.set(panel, {
						pointerEvents: 'none',
						willChange: 'transform',
					})
					panelTimeline.reverse()
				}

				applyMenuState = setMenuState
				setImmediateState(toValue(open))

				return () => {
					lineTimeline?.kill()
					panelTimeline.kill()
					gsap.set([panel, topLine, bottomLine], {
						clearProps: 'willChange',
					})
					if (applyMenuState === setMenuState) {
						applyMenuState = () => undefined
					}
				}
			},
			siteMenuRoot,
		)
	})

	return {
		menuButton,
		menuLineBottom,
		menuLineTop,
		menuPanel,
		siteMenuRoot,
	}
}
