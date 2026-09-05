import {
	computed,
	nextTick,
	onMounted,
	readonly,
	shallowRef,
	useTemplateRef,
} from 'vue'

type HeaderMode = 'compact' | 'full'

interface HeaderMotionOptions {
	focusNavigation?: boolean
	immediate?: boolean
}

type ApplyHeaderMode = (
	mode: HeaderMode,
	options?: HeaderMotionOptions,
) => void

export function useSiteHeaderMotion() {
	const menuOpen = shallowRef(false)
	const headerMode = shallowRef<HeaderMode>('full')
	const headerRoot = useTemplateRef<HTMLElement>('headerRoot')
	const logoLink = useTemplateRef<HTMLAnchorElement>('logoLink')
	const primaryNavigation = useTemplateRef<HTMLElement>('primaryNavigation')
	const headerCta = useTemplateRef<HTMLElement>('headerCta')
	const menuButton = useTemplateRef<HTMLElement>('menuButton')
	const mobileNavigation = useTemplateRef<HTMLElement>('mobileNavigation')
	const { createMatchMedia, gsap } = useGsap()
	const { onScroll } = useSmoothScroll()

	let applyHeaderMode: ApplyHeaderMode = mode => {
		headerMode.value = mode
	}
	let currentScroll = 0
	let manualRevealAnchor: number | null = null

	const menuButtonLabel = computed(() => {
		if (menuOpen.value) return 'Close navigation'
		if (headerMode.value === 'compact') return 'Show navigation'
		return 'Open navigation'
	})

	function closeMenu() {
		menuOpen.value = false
	}

	async function focusFirstMobileLink() {
		await nextTick()
		mobileNavigation.value
			?.querySelector<HTMLAnchorElement>('a')
			?.focus()
	}

	function handleMenuButtonClick() {
		const desktop = window.matchMedia('(min-width: 64rem)').matches

		if (headerMode.value === 'compact') {
			manualRevealAnchor = currentScroll
			applyHeaderMode('full', { focusNavigation: desktop })

			if (!desktop) {
				menuOpen.value = true
				void focusFirstMobileLink()
			}

			return
		}

		menuOpen.value = !menuOpen.value
		if (menuOpen.value) void focusFirstMobileLink()
	}

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

				const ctaElement: HTMLElement = cta
				const logoElement: HTMLAnchorElement = logo
				const navigationElement: HTMLElement = navigation
				const menuElement: HTMLElement = menu
				const desktop = Boolean(context.conditions?.desktop)
				const reduceMotion = Boolean(context.conditions?.reduceMotion)
				const revealTargets = desktop
					? [logoElement, navigationElement]
					: [logoElement]
				const menuOffset = menuElement.offsetWidth + 8
				let activeTimeline: gsap.core.Timeline | null = null
				let previousScroll = window.scrollY
				let previousDirection: -1 | 0 | 1 = 0
				let directionalDistance = 0

				currentScroll = previousScroll

				function focusFirstPrimaryLink() {
					navigationElement
						.querySelector<HTMLAnchorElement>('a')
						?.focus()
				}

				function setImmediateState(mode: HeaderMode) {
					const compact = mode === 'compact'

					gsap.set(revealTargets, {
						autoAlpha: compact ? 0 : 1,
						pointerEvents: compact ? 'none' : 'auto',
						yPercent: compact ? -135 : 0,
					})
					gsap.set(ctaElement, {
						x: desktop && !compact ? menuOffset : 0,
					})
					gsap.set(menuElement, {
						autoAlpha: desktop && !compact ? 0 : 1,
						pointerEvents: desktop && !compact ? 'none' : 'auto',
						rotation: 0,
						scale: 1,
						x: 0,
					})
				}

				const setHeaderMode: ApplyHeaderMode = (
					mode,
					{ focusNavigation = false, immediate = false } = {},
				) => {
					if (mode === headerMode.value && !immediate) {
						if (focusNavigation) focusFirstPrimaryLink()
						return
					}

					headerMode.value = mode
					if (mode === 'compact') closeMenu()

					activeTimeline?.kill()

					if (immediate || reduceMotion) {
						setImmediateState(mode)
						if (focusNavigation) focusFirstPrimaryLink()
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
								ease: 'power3.in',
								pointerEvents: 'none',
								stagger: 0.018,
								yPercent: -135,
							},
							0,
						)

						if (desktop) {
							activeTimeline.to(
								ctaElement,
								{
									duration: 0.26,
									ease: 'power4.out',
									x: 0,
								},
								0.02,
							)
							activeTimeline.fromTo(
								menuElement,
								{
									autoAlpha: 0,
									rotation: -8,
									scale: 0.78,
									x: 10,
								},
								{
									autoAlpha: 1,
									duration: 0.24,
									ease: 'power4.out',
									pointerEvents: 'auto',
									rotation: 0,
									scale: 1,
									x: 0,
								},
								0.05,
							)
						}

						return
					}

					activeTimeline = gsap.timeline({
						defaults: { overwrite: 'auto' },
						onComplete: focusNavigation
							? focusFirstPrimaryLink
							: undefined,
					})

					if (desktop) {
						activeTimeline.to(
							menuElement,
							{
								autoAlpha: 0,
								duration: 0.16,
								ease: 'power3.in',
								pointerEvents: 'none',
								rotation: 8,
								scale: 0.8,
								x: 10,
							},
							0,
						)
						activeTimeline.to(
							ctaElement,
							{
								duration: 0.26,
								ease: 'power4.out',
								x: menuOffset,
							},
							0,
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

				applyHeaderMode = setHeaderMode
				setHeaderMode(headerMode.value, { immediate: true })

				const unsubscribe = onScroll(lenis => {
					const nextScroll = Math.max(0, lenis.animatedScroll)
					const delta = nextScroll - previousScroll
					const direction: -1 | 0 | 1 =
						delta > 0.25 ? 1 : delta < -0.25 ? -1 : 0

					currentScroll = nextScroll
					previousScroll = nextScroll

					if (nextScroll <= 24) {
						manualRevealAnchor = null
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
						manualRevealAnchor = null
						if (directionalDistance >= 8) setHeaderMode('full')
						return
					}

					if (
						manualRevealAnchor !== null &&
						nextScroll - manualRevealAnchor < 24
					) {
						return
					}

					manualRevealAnchor = null
					if (nextScroll >= 96 && directionalDistance >= 12) {
						setHeaderMode('compact')
					}
				})

				return () => {
					unsubscribe()
					activeTimeline?.kill()
					if (applyHeaderMode === setHeaderMode) {
						applyHeaderMode = mode => {
							headerMode.value = mode
						}
					}
				}
			},
			headerRoot,
		)
	})

	return {
		closeMenu,
		handleMenuButtonClick,
		headerMode: readonly(headerMode),
		menuButtonLabel,
		menuOpen: readonly(menuOpen),
	}
}
