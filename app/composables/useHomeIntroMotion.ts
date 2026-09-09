import {
	nextTick,
	onMounted,
	onScopeDispose,
	readonly,
	shallowRef,
	toValue,
	watch,
} from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { SplitTextResult } from '@/lib/split-text'

type IntroState = 'complete' | 'pending' | 'playing'
type IntroScope = MaybeRefOrGetter<HTMLElement | null | undefined>
type TitleSplitSource = MaybeRefOrGetter<SplitTextResult | undefined>

interface CardPlacement {
	dockX: number
	dockY: number
	startX: number
	startY: number
}

interface NativeScrollStyles {
	bodyOverflow: string
	bodyOverscrollBehavior: string
	bodyTouchAction: string
	htmlOverflow: string
	htmlScrollbarGutter: string
}

const selectors = {
	backdrop: '[data-home-intro-backdrop]',
	card: '[data-home-intro-card]',
	removedCard: '[data-home-intro-card-remove]',
	header: '[data-home-intro-header]',
	mediaGrid: '[data-home-intro-media-grid]',
	title: '[data-home-intro-title]',
} as const

function waitForTitleSplit(source: TitleSplitSource) {
	const current = toValue(source)
	if (current !== undefined) return Promise.resolve(current)

	return new Promise<SplitTextResult>(resolve => {
		const stop = watch(
			() => toValue(source),
			value => {
				if (value === undefined) return

				stop()
				resolve(value)
			},
		)
	})
}

function groupWordsByLine(words: HTMLElement[]) {
	const lines: Array<{ top: number; words: HTMLElement[] }> = []

	for (const word of words) {
		const top = Math.round(word.getBoundingClientRect().top)
		const line = lines.find(entry => Math.abs(entry.top - top) <= 2)
		if (line) {
			line.words.push(word)
			continue
		}

		lines.push({ top, words: [word] })
	}

	return lines.sort((a, b) => a.top - b.top).map(line => line.words)
}

function waitForImage(image: HTMLImageElement) {
	if (image.complete) return image.decode().catch(() => undefined)

	return new Promise<void>(resolve => {
		const settle = () => {
			image.removeEventListener('error', settle)
			image.removeEventListener('load', settle)
			resolve()
		}

		image.addEventListener('error', settle, { once: true })
		image.addEventListener('load', settle, { once: true })
	}).then(() => image.decode().catch(() => undefined))
}

function getPlacements(
	cards: HTMLElement[],
	mediaGrid: HTMLElement,
): { placements: CardPlacement[]; stackScale: number } | null {
	const cardRects = cards.map(card => card.getBoundingClientRect())
	const firstCard = cardRects[0]
	if (!firstCard || firstCard.width === 0) return null

	const mediaRect = mediaGrid.getBoundingClientRect()
	const stackWidth = Math.min(520, Math.max(240, window.innerWidth - 40))
	const stackScale = stackWidth / firstCard.width
	const startCenterX = window.innerWidth / 2
	const startCenterY = window.innerHeight / 2
	const dockCenterX = mediaRect.left + mediaRect.width / 2
	const dockCenterY = mediaRect.top + mediaRect.height / 2

	return {
		placements: cardRects.map(rect => ({
			dockX: dockCenterX - (rect.left + rect.width / 2),
			dockY: dockCenterY - (rect.top + rect.height / 2),
			startX: startCenterX - (rect.left + rect.width / 2),
			startY: startCenterY - (rect.top + rect.height / 2),
		})),
		stackScale,
	}
}

export function useHomeIntroMotion(
	scope: IntroScope,
	titleSplitSource: TitleSplitSource,
) {
	const introState = shallowRef<IntroState>('pending')
	const startsWithPreloader = useNuxtApp().isHydrating
	const { createMatchMedia, gsap } = useGsap()
	const { ready, refresh, start, stop } = useSmoothScroll()
	let nativeScrollStyles: NativeScrollStyles | null = null
	let scrollLocked = false
	let disposed = false
	let preloaderAvailable = startsWithPreloader

	function lockScroll() {
		if (scrollLocked) return

		const html = document.documentElement
		const body = document.body
		nativeScrollStyles = {
			bodyOverflow: body.style.overflow,
			bodyOverscrollBehavior: body.style.overscrollBehavior,
			bodyTouchAction: body.style.touchAction,
			htmlOverflow: html.style.overflow,
			htmlScrollbarGutter: html.style.scrollbarGutter,
		}
		scrollLocked = true
		html.style.overflow = 'hidden'
		html.style.scrollbarGutter = 'stable'
		body.style.overflow = 'hidden'
		body.style.overscrollBehavior = 'none'
		body.style.touchAction = 'none'
		stop()
		void ready().then(() => {
			if (scrollLocked) stop()
		})
	}

	function unlockScroll() {
		if (!scrollLocked || !nativeScrollStyles) return

		const html = document.documentElement
		const body = document.body
		html.style.overflow = nativeScrollStyles.htmlOverflow
		html.style.scrollbarGutter = nativeScrollStyles.htmlScrollbarGutter
		body.style.overflow = nativeScrollStyles.bodyOverflow
		body.style.overscrollBehavior = nativeScrollStyles.bodyOverscrollBehavior
		body.style.touchAction = nativeScrollStyles.bodyTouchAction
		nativeScrollStyles = null
		scrollLocked = false
		start()
		void refresh()
	}

	function completeImmediately(
		backdrop: HTMLElement | null,
		elements: HTMLElement[],
		removedCards: HTMLElement[],
	) {
		introState.value = 'complete'
		if (backdrop) backdrop.hidden = true
		gsap.set(elements, { clearProps: 'all' })
		for (const card of removedCards) card.hidden = true
		unlockScroll()
	}

	onMounted(async () => {
		const root = toValue(scope)
		if (!root) {
			introState.value = 'complete'
			return
		}

		const cards = Array.from(
			root.querySelectorAll<HTMLElement>(selectors.card),
		)
		const removedCards = Array.from(
			root.querySelectorAll<HTMLElement>(selectors.removedCard),
		)
		const finalCards = cards.filter(card => !removedCards.includes(card))
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			introState.value = 'complete'
			const backdrop = root.querySelector<HTMLElement>(selectors.backdrop)
			if (backdrop) backdrop.hidden = true
			for (const card of removedCards) card.hidden = true
			return
		}

		lockScroll()
		introState.value = 'playing'

		const images = cards.flatMap(card => {
			const image = card.querySelector<HTMLImageElement>('img')
			return image ? [image] : []
		})

		await nextTick()
		const [titleSplit] = await Promise.all([
			waitForTitleSplit(titleSplitSource),
			document.fonts.ready,
			Promise.all(images.map(waitForImage)),
		])
		if (disposed) return

		createMatchMedia(
			{
			desktop: '(min-width: 64rem)',
			mobile: '(max-width: 63.999rem)',
			reduceMotion: '(prefers-reduced-motion: reduce)',
			},
			context => {
				const backdrop = root.querySelector<HTMLElement>(selectors.backdrop)
				const header = root.querySelector<HTMLElement>(selectors.header)
				const mediaGrid = root.querySelector<HTMLElement>(selectors.mediaGrid)
				const title = root.querySelector<HTMLElement>(selectors.title)
				const titleWords = titleSplit?.words ?? []
				const titleLines = groupWordsByLine(titleWords)
				const animatedElements = [
					...(header ? [header] : []),
					...(title ? [title] : []),
					...titleWords,
					...cards,
					...(mediaGrid ? [mediaGrid] : []),
				]
				const reduceMotion = Boolean(context.conditions?.reduceMotion)

				if (introState.value === 'complete' || reduceMotion) {
					completeImmediately(backdrop, animatedElements, removedCards)
					return
				}

				if (!backdrop || !header || !mediaGrid || !title || !titleWords.length) {
					completeImmediately(backdrop, animatedElements, removedCards)
					return
				}

				const placementData = getPlacements(cards, mediaGrid)
				if (!placementData) {
					completeImmediately(backdrop, animatedElements, removedCards)
					return
				}

				const { placements, stackScale } = placementData
				const playPreloader = preloaderAvailable
				preloaderAvailable = false
				backdrop.hidden = false
				for (const card of removedCards) card.hidden = false

				gsap.set(backdrop, {
					autoAlpha: 1,
					scaleY: 1,
					transformOrigin: 'bottom center',
				})
				gsap.set(header, {
					autoAlpha: 0,
					pointerEvents: 'none',
					y: -24,
				})
				gsap.set(titleWords, {
					autoAlpha: 0,
					yPercent: 120,
				})
				gsap.set(title, { visibility: 'inherit' })
				gsap.set(mediaGrid, { zIndex: 70 })
				cards.forEach((card, index) => {
					const placement = placements[index]
					if (!placement) return

					gsap.set(card, {
						scale: playPreloader ? 0 : stackScale,
						visibility: 'inherit',
						willChange: 'transform',
						x: placement.startX,
						y: placement.startY,
						zIndex: index + 1,
						rotation: 0,
					})
				})

				const timeline = gsap.timeline({
					onComplete: () => {
						introState.value = 'complete'
						backdrop.hidden = true
						gsap.set(animatedElements, { clearProps: 'all' })
						for (const card of removedCards) card.hidden = true
						unlockScroll()
					},
				})

				if (playPreloader) {
					timeline.to(cards, {
						duration: 0.72,
						ease: 'power3.out',
						scale: stackScale,
						stagger: 0.11,
					})
					timeline.addLabel('travel', '+=0.16')
				} else {
					timeline.addLabel('travel', 0.08)
				}

				timeline.to(
					cards,
					{
						duration: 1.05,
						ease: 'power3.inOut',
						stagger: 0.08,
						x: index => placements[index]?.dockX ?? 0,
						y: index => placements[index]?.dockY ?? 0,
					},
					'travel',
				)
				timeline.to(
					cards,
					{
						duration: 0.45,
						ease: 'power2.in',
						scale: stackScale * 1.12,
						stagger: 0.08,
					},
					'travel',
				)
				timeline.to(
					cards,
					{
						duration: 0.6,
						ease: 'power2.out',
						scale: stackScale,
						stagger: 0.08,
					},
					'travel+=0.45',
				)
				timeline.addLabel('expand')
				timeline.set(removedCards, { visibility: 'hidden' }, 'expand')
				timeline.to(
					finalCards,
					{
						duration: 0.92,
						ease: 'power3.inOut',
						rotation: index =>
							Number(
								finalCards[index]?.dataset.homeIntroCardRotation ?? 0,
							),
						scale: 1.08,
						stagger: { each: 0.055, from: 'center' },
						x: 0,
						y: 0,
					},
					'expand',
				)
				timeline.to(
					backdrop,
					{
						duration: 0.9,
						ease: 'power3.inOut',
						scaleY: 0,
					},
					'expand',
				)
				timeline.to(
					header,
					{
						autoAlpha: 1,
						duration: 0.72,
						ease: 'power3.out',
						pointerEvents: 'auto',
						y: 0,
					},
					'expand+=0.08',
				)
				for (const line of titleLines) {
					timeline.to(
						line,
						{
							autoAlpha: 1,
							duration: 0.72,
							ease: 'power3.out',
							stagger: 0.055,
							yPercent: 0,
						},
						'expand+=0.08',
					)
				}
			},
			scope,
		)
	})

	onScopeDispose(() => {
		disposed = true
		unlockScroll()
	})

	return {
		introState: readonly(introState),
	}
}
