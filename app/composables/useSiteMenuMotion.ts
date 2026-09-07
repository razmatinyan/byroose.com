import { onMounted, toValue, useTemplateRef, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { useEventListener } from '@vueuse/core'

type ApplyMenuState = (open: boolean, immediate?: boolean) => void

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

				const revealTargets = Array.from(
					panel.querySelectorAll<HTMLElement>('[data-menu-reveal]'),
				)
				const reduceMotion = Boolean(context.conditions?.reduceMotion)
				const collapsedScaleX = () =>
					Math.min(1, button.offsetWidth / panel.offsetWidth)
				const collapsedScaleY = () =>
					Math.min(1, button.offsetHeight / panel.offsetHeight)
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
						scaleX: collapsedScaleX,
						scaleY: collapsedScaleY,
						transformOrigin: '100% 0%',
					},
					{
						duration: 0.44,
						ease: 'power2.out',
						scaleX: 1,
						scaleY: 1,
					},
					0,
				)
				panelTimeline.fromTo(
					revealTargets,
					{ autoAlpha: 0, y: 8 },
					{
						autoAlpha: 1,
						duration: 0.28,
						ease: 'power2.out',
						stagger: 0.05,
						y: 0,
					},
					0.18,
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
					gsap.set(panel, {
						pointerEvents: expanded ? 'auto' : 'none',
						visibility: 'visible',
					})
					panelTimeline.invalidate().progress(expanded ? 1 : 0).pause()
					if (!expanded) gsap.set(panel, { visibility: 'hidden' })
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
