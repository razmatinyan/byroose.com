import { onMounted, readonly, shallowRef, useTemplateRef } from 'vue'

type HeaderMode = 'compact' | 'full'

interface HeaderMotionOptions {
	immediate?: boolean
}

export function useSiteHeaderMotion() {
	const headerMode = shallowRef<HeaderMode>('full')
	const headerRoot = useTemplateRef<HTMLElement>('headerRoot')
	const logoLink = useTemplateRef<HTMLAnchorElement>('logoLink')
	const primaryNavigation = useTemplateRef<HTMLElement>('primaryNavigation')
	const headerCta = useTemplateRef<HTMLElement>('headerCta')
	const menuButton = useTemplateRef<HTMLElement>('menuButton')
	const { createMatchMedia, gsap } = useGsap()
	const { onScroll } = useSmoothScroll()

	onMounted(() => {
		createMatchMedia(
			{
				desktop: '(min-width: 64rem)',
				mobile: '(max-width: 63.999rem)',
				reduceMotion: '(prefers-reduced-motion: reduce)',
			},
			context => {
				const cta = headerCta.value
				const logo = logoLink.value
				const navigation = primaryNavigation.value
				const menu = menuButton.value

				if (!cta || !logo || !navigation || !menu) return

				const desktop = Boolean(context.conditions?.desktop)
				const reduceMotion = Boolean(context.conditions?.reduceMotion)
				const revealTargets = desktop ? [logo, navigation] : [logo]
				const menuOffset = menu.offsetWidth + 8
				let activeTimeline: gsap.core.Timeline | null = null
				let previousScroll = window.scrollY
				let previousDirection: -1 | 0 | 1 = 0
				let directionalDistance = 0

				function setImmediateState(mode: HeaderMode) {
					const compact = mode === 'compact'

					gsap.set(revealTargets, {
						autoAlpha: compact ? 0 : 1,
						pointerEvents: compact ? 'none' : 'auto',
						yPercent: compact ? -135 : 0,
					})
					gsap.set(cta, {
						x: desktop && !compact ? menuOffset : 0,
					})
					gsap.set(menu, {
						autoAlpha: desktop && !compact ? 0 : 1,
						pointerEvents: desktop && !compact ? 'none' : 'auto',
						scale: desktop && !compact ? 0 : 1,
					})
				}

				const setHeaderMode = (
					mode: HeaderMode,
					{ immediate = false }: HeaderMotionOptions = {},
				): void => {
					if (mode === headerMode.value && !immediate) return

					headerMode.value = mode
					activeTimeline?.kill()

					if (immediate || reduceMotion) {
						setImmediateState(mode)
						return
					}

					if (mode === 'compact') {
						activeTimeline = gsap.timeline({
							defaults: { overwrite: 'auto' },
						})
						activeTimeline.to(
							revealTargets,
							{
								autoAlpha: 0,
								duration: 0.24,
								ease: 'power4.out',
								pointerEvents: 'none',
								stagger: 0.018,
								yPercent: -135,
							},
							0,
						)

						if (desktop) {
							activeTimeline.to(
								cta,
								{
									duration: 0.28,
									ease: 'power4.out',
									x: 0,
								},
								0,
							)
							activeTimeline.to(
								menu,
								{
									autoAlpha: 1,
									duration: 0.3,
									ease: 'back.out(1.7)',
									pointerEvents: 'auto',
									scale: 1,
								},
								0.1,
							)
						}

						return
					}

					activeTimeline = gsap.timeline({
						defaults: { overwrite: 'auto' },
					})

					if (desktop) {
						activeTimeline.to(
							menu,
							{
								autoAlpha: 0,
								duration: 0.3,
								ease: 'power4.out',
								pointerEvents: 'none',
								scale: 0,
							},
							0,
						)
						activeTimeline.to(
							cta,
							{
								duration: 0.3,
								ease: 'power2.out',
								x: menuOffset,
							},
							0.05,
						)
					}

					activeTimeline.to(
						revealTargets,
						{
							autoAlpha: 1,
							duration: 0.3,
							ease: 'power4.out',
							pointerEvents: 'auto',
							stagger: 0.025,
							yPercent: 0,
						},
						0.04,
					)
				}

				setHeaderMode(headerMode.value, { immediate: true })

				const unsubscribe = onScroll(lenis => {
					const nextScroll = Math.max(0, lenis.animatedScroll)
					const delta = nextScroll - previousScroll
					const direction: -1 | 0 | 1 =
						delta > 0.25 ? 1 : delta < -0.25 ? -1 : 0

					previousScroll = nextScroll

					if (nextScroll <= 24) {
						directionalDistance = 0
						previousDirection = 0
						setHeaderMode('full')
						return
					}

					if (direction === 0) return

					if (direction !== previousDirection) {
						directionalDistance = 0
						previousDirection = direction
					}

					directionalDistance += Math.abs(delta)

					if (direction === -1) {
						if (directionalDistance >= 8) setHeaderMode('full')
						return
					}

					if (nextScroll >= 96 && directionalDistance >= 12) {
						setHeaderMode('compact')
					}
				})

				return () => {
					unsubscribe()
					activeTimeline?.kill()
				}
			},
			headerRoot,
		)
	})

	return {
		headerMode: readonly(headerMode),
	}
}
