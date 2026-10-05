import { nextTick, onScopeDispose, toValue, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { SplitTextResult } from '@/lib/split-text'
import {
	addWordReveal,
	wordRevealDuration,
	wordRevealEase,
	wordRevealOffset,
	wordRevealStart,
} from '@/lib/word-reveal'

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>
type SplitListSource = MaybeRefOrGetter<
	readonly (SplitTextResult | undefined)[]
>

const selectors = {
	group: '[data-footer-reveal]',
	rise: '[data-footer-rise]',
} as const

const revealedAttribute = 'data-footer-revealed'
const refreshPriority = -4
const titleWordStagger = 0.12
const riseStagger = 0.05
const itemsOverlapStart = titleWordStagger * 2

export function useFooterMotion(
	scope: MotionScope,
	titleSplits: SplitListSource,
) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap()
	const { refresh } = useSmoothScroll()
	let disposed = false
	let initialized = false

	function revealGroup(group: HTMLElement, words: HTMLElement[]) {
		const titleWords = words.filter(word => group.contains(word))
		const targets = [...group.querySelectorAll<HTMLElement>(selectors.rise)]
		const titleItems = targets.filter(isTitleItem)
		const items = targets.filter(target => !isTitleItem(target))
		const lastWordStart = Math.max(titleWords.length - 1, 0) * titleWordStagger
		const itemsStart = titleWords.length ? itemsOverlapStart : 0
		const riseTween = {
			duration: wordRevealDuration,
			ease: wordRevealEase,
			yPercent: 0,
		}

		gsap.set(targets, { y: 0, yPercent: wordRevealOffset })

		const timeline = gsap.timeline({
			scrollTrigger: {
				once: true,
				refreshPriority,
				start: wordRevealStart,
				trigger: group,
			},
		})

		addWordReveal(timeline, titleWords, { stagger: titleWordStagger })

		if (titleItems.length) timeline.to(titleItems, riseTween, lastWordStart)
		if (items.length) {
			timeline.to(items, { ...riseTween, stagger: riseStagger }, itemsStart)
		}

		timeline
			.call(() => markRevealed(group))
			.set(targets, { clearProps: 'transform' })
	}

	function isTitleItem(target: HTMLElement) {
		return target.dataset.footerRise === 'title'
	}

	function markRevealed(group: HTMLElement) {
		group.setAttribute(revealedAttribute, '')
	}

	async function initialize(words: HTMLElement[]) {
		if (initialized || disposed) return

		initialized = true
		await nextTick()
		const scrollTrigger = await loadPlugin('ScrollTrigger')
		if (!scrollTrigger || disposed) return

		const root = toValue(scope)
		if (!root) return

		const groups = [...root.querySelectorAll<HTMLElement>(selectors.group)]

		createMatchMedia(
			{
				motion: '(prefers-reduced-motion: no-preference)',
				reduceMotion: '(prefers-reduced-motion: reduce)',
			},
			context => {
				if (context.conditions?.reduceMotion) {
					if (words.length) gsap.set(words, { visibility: 'inherit' })
					groups.forEach(markRevealed)
					return
				}

				groups.forEach(group => revealGroup(group, words))
			},
			scope,
		)

		await refresh()
	}

	watch(
		() => toValue(titleSplits),
		splits => {
			if (splits.includes(undefined)) return

			return initialize(splits.flatMap(parts => parts?.words ?? []))
		},
		{ flush: 'post', immediate: true },
	)

	onScopeDispose(() => {
		disposed = true
	})
}
