import { onMounted, readonly, shallowRef, useTemplateRef, watch } from 'vue'
import { unrefElement } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'
import {
	addWordReveal,
	navRevealStagger,
	revealMaskClip,
} from '@/lib/word-reveal'

const navItemSelector = '[data-home-intro-nav-item]'
const riseSelector = '[data-header-rise]'
const riseMaskSelector = '[data-header-rise-mask]'

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
	const navRevealed = shallowRef(false)
	const headerRoot = useTemplateRef<HTMLElement>('headerRoot')
	const navLayer = useTemplateRef<HTMLElement>('navLayer')
	const logoLayer = useTemplateRef<HTMLElement>('logoLayer')
	const { createContext, gsap } = useGsap()
	const introState = useHomeIntroState()
	const route = useRoute()

	watch(introState, state => {
		if (state === 'complete') navRevealed.value = true
	})

	function revealNavigation() {
		const roots = [
			resolveElement(headerRoot),
			resolveElement(navLayer),
			resolveElement(logoLayer),
		].filter(root => root !== null)
		const { items, masks } = getHeaderRevealParts(roots)
		const reduceMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches

		if (!items.length || reduceMotion) {
			navRevealed.value = true
			return
		}

		createContext(() => {
			gsap.set(masks, { clipPath: revealMaskClip })
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
	})

	return {
		headerRoot,
		navRevealed: readonly(navRevealed),
	}
}
