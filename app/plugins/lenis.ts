import { computed, nextTick, readonly, shallowRef } from 'vue'
import type Lenis from 'lenis'
import type { ScrollCallback, ScrollToOptions } from 'lenis'
import {
	getSwapScrollDuration,
	swapEase,
	swapScrollDuration,
} from '@/lib/swap-timing'

type ScrollTarget = Parameters<Lenis['scrollTo']>[0]

const pageStartTargets = new Set(['top', 'left', 'start', '#'])
const pageEndTargets = new Set(['bottom', 'right', 'end'])
type GsapInstance = (typeof import('gsap'))['gsap']
type ScrollTriggerInstance =
	(typeof import('gsap/ScrollTrigger'))['ScrollTrigger']

export default defineNuxtPlugin({
	name: 'lenis-scroll',
	setup(nuxtApp) {
		const instance = shallowRef<Lenis | null>(null)
		const isReady = computed(() => instance.value !== null)
		const scrollCallbacks = new Set<ScrollCallback>()
		let gsapInstance: GsapInstance | null = null
		let scrollTriggerInstance: ScrollTriggerInstance | null = null
		let swapScrollOptions: ScrollToOptions = {}
		let tickerCallback: ((time: number) => void) | null = null
		let unsubscribeScroll: (() => void) | null = null
		let removeNavigationGuard: (() => void) | null = null
		let initializationPromise: Promise<void> | null = null
		let isDestroyed = false

		const handleScroll: ScrollCallback = lenis => {
			scrollTriggerInstance?.update()
			for (const callback of scrollCallbacks) callback(lenis)
		}

		async function initialize() {
			if (!import.meta.client || instance.value || isDestroyed) return
			if (initializationPromise) return initializationPromise

			initializationPromise = (async () => {
				const [lenisModule, gsapModule, scrollTriggerModule] =
					await Promise.all([
						import('lenis'),
						import('gsap'),
						import('gsap/ScrollTrigger'),
					])

				if (isDestroyed) return

				const nextGsapInstance = gsapModule.gsap
				const nextScrollTriggerInstance =
					scrollTriggerModule.ScrollTrigger
				const nextSwapScrollOptions = {
					duration: swapScrollDuration,
					easing: nextGsapInstance.parseEase(swapEase),
				}
				const nextInstance = new lenisModule.default({
					anchors: nextSwapScrollOptions,
					autoRaf: false,
					autoResize: true,
					lerp: 0.2,
					respectReducedMotion: true,
					smoothWheel: true,
					stopInertiaOnNavigate: true,
					syncTouch: false,
				})
				const nextTickerCallback = (time: number) =>
					nextInstance.raf(time * 1000)

				nextGsapInstance.registerPlugin(nextScrollTriggerInstance)
				nextGsapInstance.ticker.add(nextTickerCallback)
				nextGsapInstance.ticker.lagSmoothing(0)

				gsapInstance = nextGsapInstance
				scrollTriggerInstance = nextScrollTriggerInstance
				swapScrollOptions = nextSwapScrollOptions
				tickerCallback = nextTickerCallback
				unsubscribeScroll = nextInstance.on('scroll', handleScroll)
				instance.value = nextInstance
			})()

			return initializationPromise
		}

		async function refresh() {
			await nextTick()
			instance.value?.resize()
			scrollTriggerInstance?.refresh()
		}

		function findScrollTargetElement(target: string) {
			if (target.startsWith('#')) {
				return document.getElementById(target.slice(1))
			}

			return document.querySelector<HTMLElement>(target)
		}

		function getScrollDistance(lenis: Lenis, target: ScrollTarget) {
			if (typeof target === 'number') {
				return Math.abs(target - lenis.animatedScroll)
			}

			if (typeof target === 'string') {
				if (pageStartTargets.has(target)) return lenis.animatedScroll
				if (pageEndTargets.has(target)) {
					return lenis.limit - lenis.animatedScroll
				}
			}

			const element =
				typeof target === 'string' ? findScrollTargetElement(target) : target

			return element ? Math.abs(element.getBoundingClientRect().top) : 0
		}

		async function scrollTo(
			target: ScrollTarget,
			options?: ScrollToOptions,
		) {
			await initialize()

			const lenis = instance.value
			if (!lenis) return

			const duration = getSwapScrollDuration(
				getScrollDistance(lenis, target),
				window.innerHeight,
			)

			lenis.scrollTo(target, { ...swapScrollOptions, duration, ...options })
		}

		function resetScrollPosition() {
			instance.value?.scrollTo(0, {
				force: true,
				immediate: true,
			})
			window.scrollTo(0, 0)
		}

		function onScroll(callback: ScrollCallback) {
			scrollCallbacks.add(callback)
			if (instance.value) callback(instance.value)

			return () => {
				scrollCallbacks.delete(callback)
			}
		}

		function destroy() {
			isDestroyed = true
			unsubscribeScroll?.()
			removeNavigationGuard?.()

			if (gsapInstance && tickerCallback) {
				gsapInstance.ticker.remove(tickerCallback)
			}

			instance.value?.destroy()
			scrollCallbacks.clear()
			unsubscribeScroll = null
			removeNavigationGuard = null
			tickerCallback = null
			scrollTriggerInstance = null
			gsapInstance = null
			instance.value = null
		}

		if (import.meta.client) {
			history.scrollRestoration = 'manual'
			resetScrollPosition()
			removeNavigationGuard = nuxtApp.$router.afterEach(
				(to, from, failure) => {
					const destinationPage = to.fullPath.split('#')[0]
					const currentPage = from.fullPath.split('#')[0]
					if (!failure && destinationPage !== currentPage) {
						resetScrollPosition()
					}
				},
			)
			nuxtApp.hook('app:mounted', async () => {
				await initialize()
				resetScrollPosition()
				await refresh()
				document.fonts.ready.then(refresh)
			})
			nuxtApp.hook('page:finish', refresh)
			nuxtApp.vueApp.onUnmount(destroy)
		}

		return {
			provide: {
				smoothScroll: {
					instance: readonly(instance),
					isReady,
					onScroll,
					ready: initialize,
					refresh,
					resize: () => instance.value?.resize(),
					scrollTo,
					start: () => instance.value?.start(),
					stop: () => instance.value?.stop(),
				},
			},
		}
	},
})
