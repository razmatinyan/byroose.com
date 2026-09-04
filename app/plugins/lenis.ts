import { computed, nextTick, readonly, shallowRef } from 'vue'
import type Lenis from 'lenis'
import type { ScrollCallback, ScrollToOptions } from 'lenis'

type ScrollTarget = Parameters<Lenis['scrollTo']>[0]
type GsapInstance = typeof import('gsap')['gsap']
type ScrollTriggerInstance = typeof import('gsap/ScrollTrigger')['ScrollTrigger']

export default defineNuxtPlugin({
	name: 'lenis-scroll',
	setup(nuxtApp) {
		const instance = shallowRef<Lenis | null>(null)
		const isReady = computed(() => instance.value !== null)
		const scrollCallbacks = new Set<ScrollCallback>()
		let gsapInstance: GsapInstance | null = null
		let scrollTriggerInstance: ScrollTriggerInstance | null = null
		let tickerCallback: ((time: number) => void) | null = null
		let unsubscribeScroll: (() => void) | null = null
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
				const [lenisModule, gsapModule, scrollTriggerModule] = await Promise.all([
					import('lenis'),
					import('gsap'),
					import('gsap/ScrollTrigger'),
				])

				if (isDestroyed) return

				const nextGsapInstance = gsapModule.gsap
				const nextScrollTriggerInstance = scrollTriggerModule.ScrollTrigger
				const nextInstance = new lenisModule.default({
					anchors: true,
					autoRaf: false,
					autoResize: true,
					lerp: 0.1,
					respectReducedMotion: true,
					smoothWheel: true,
					stopInertiaOnNavigate: true,
					syncTouch: false,
				})
				const nextTickerCallback = (time: number) => nextInstance.raf(time * 1000)

				nextGsapInstance.registerPlugin(nextScrollTriggerInstance)
				nextGsapInstance.ticker.add(nextTickerCallback)
				nextGsapInstance.ticker.lagSmoothing(0)

				gsapInstance = nextGsapInstance
				scrollTriggerInstance = nextScrollTriggerInstance
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

		async function scrollTo(target: ScrollTarget, options?: ScrollToOptions) {
			await initialize()
			instance.value?.scrollTo(target, options)
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

			if (gsapInstance && tickerCallback) {
				gsapInstance.ticker.remove(tickerCallback)
			}

			instance.value?.destroy()
			scrollCallbacks.clear()
			unsubscribeScroll = null
			tickerCallback = null
			scrollTriggerInstance = null
			gsapInstance = null
			instance.value = null
		}

		if (import.meta.client) {
			nuxtApp.hook('app:mounted', async () => {
				await initialize()
				await refresh()
				void document.fonts.ready.then(refresh)
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
