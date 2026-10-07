import { onMounted, readonly, shallowRef, useTemplateRef, watch } from 'vue'
import { unrefElement } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'
import { addWordReveal, navRevealStagger } from '@/lib/word-reveal'

type HeaderMode = 'compact' | 'full'

const fullModeScrollLimit = 24
const compactModeScrollStart = 96
const navItemSelector = '[data-home-intro-nav-item]'
const riseSelector = '[data-header-rise]'
const riseMaskSelector = '[data-header-rise-mask]'

interface HeaderMotionOptions {
	immediate?: boolean
}

function resolveElement(target: MaybeComputedElementRef): HTMLElement | null {
	const element = unrefElement(target)
	return element instanceof HTMLElement ? element : null
}

function queryAll(roots: readonly Element[], selector: string) {
	return roots.flatMap(root =>
		Array.from(root.querySelectorAll<HTMLElement>(selector)),
	)
}

export function getHeaderRevealParts(roots: readonly Element[]) {
	const items = queryAll(roots, `${navItemSelector}, ${riseSelector}`)
		.map(element => ({ element, left: element.getBoundingClientRect().left }))
		.sort((first, second) => first.left - second.left)
		.map(({ element }) => element)

	return { items, masks: queryAll(roots, riseMaskSelector) }
}

export function useSiteHeaderMotion() {
	const headerMode = shallowRef<HeaderMode>('full')
	const navRevealed = shallowRef(false)
	const headerRoot = useTemplateRef<HTMLElement>('headerRoot')
	const primaryNavigation = useTemplateRef<HTMLElement>('primaryNavigation')
	const logoLayer = useTemplateRef<HTMLElement>('logoLayer')
	const headerCta = useTemplateRef<HTMLElement>('headerCta')
	const menuButton = useTemplateRef<HTMLElement>('menuButton')
	const { createContext, createMatchMedia, gsap } = useGsap()
	const { onScroll } = useSmoothScroll()
	const { phase: transitionPhase } = usePageTransition()
	const introState = useHomeIntroState()
	const route = useRoute()

	watch(introState, state => {
		if (state === 'complete') navRevealed.value = true
	})

	function revealNavigation() {
		const roots = [resolveElement(headerRoot), resolveElement(logoLayer)]
			.filter(root => root !== null)
		const { items, masks } = getHeaderRevealParts(roots)
		const reduceMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches

		if (!items.length || reduceMotion) {
			navRevealed.value = true
			return
		}

		createContext(() => {
			gsap.set(masks, { clipPath: 'inset(0)' })
			const timeline = gsap.timeline({
				onComplete: () => {
					navRevealed.value = true
					gsap.set([...items, ...masks], { clearProps: 'all' })
				},
			})
			addWordReveal(timeline, items, { stagger: navRevealStagger })
		}, headerRoot)
	}

	onMounted(() => {
		if (route.path !== '/' || introState.value === 'complete') {
			revealNavigation()
		}

		createMatchMedia(
			{
				desktop: '(min-width: 64rem)',
				mobile: '(max-width: 63.999rem)',
				reduceMotion: '(prefers-reduced-motion: reduce)',
			},
			context => {
				const cta = resolveElement(headerCta)
				const navigation = resolveElement(primaryNavigation)
				const menu = resolveElement(menuButton)

				if (!cta || !navigation || !menu) return

				const desktop = Boolean(context.conditions?.desktop)
				const reduceMotion = Boolean(context.conditions?.reduceMotion)
				const menuOffset = menu.offsetWidth + 8
				let activeTimeline: gsap.core.Timeline | null = null

				function setImmediateState(mode: HeaderMode) {
					const compact = mode === 'compact'

					gsap.set(navigation, {
						autoAlpha: desktop && compact ? 0 : 1,
						pointerEvents: desktop && compact ? 'none' : 'auto',
						yPercent: desktop && compact ? -135 : 0,
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

					if (immediate || reduceMotion || !desktop) {
						setImmediateState(mode)
						return
					}

					activeTimeline = gsap.timeline({
						defaults: { overwrite: 'auto' },
					})

					if (mode === 'compact') {
						activeTimeline.to(
							navigation,
							{
								autoAlpha: 0,
								duration: 0.24,
								ease: 'power4.out',
								pointerEvents: 'none',
								yPercent: -135,
							},
							0,
						)
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
						return
					}

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
					activeTimeline.to(
						navigation,
						{
							autoAlpha: 1,
							duration: 0.3,
							ease: 'power4.out',
							pointerEvents: 'auto',
							yPercent: 0,
						},
						0.04,
					)
				}

				setHeaderMode(headerMode.value, { immediate: true })

				const stopTransitionWatch = watch(transitionPhase, phase => {
					if (phase === 'moving') setHeaderMode('full', { immediate: true })
				})

				const unsubscribe = onScroll(lenis => {
					const scroll = Math.max(0, lenis.animatedScroll)

					if (scroll <= fullModeScrollLimit) {
						setHeaderMode('full')
						return
					}

					if (scroll >= compactModeScrollStart) {
						setHeaderMode('compact')
					}
				})

				return () => {
					unsubscribe()
					stopTransitionWatch()
					activeTimeline?.kill()
				}
			},
			headerRoot,
		)
	})

	return {
		headerMode: readonly(headerMode),
		headerRoot,
		navRevealed: readonly(navRevealed),
	}
}
