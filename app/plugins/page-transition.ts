import { computed, readonly, shallowRef } from 'vue'
import { isNavigationFailure, NavigationFailureType } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

type Cleanup = () => void
type PageTransitionPhase = 'idle' | 'moving' | 'preparing'

export default defineNuxtPlugin({
	name: 'page-transition',
	dependsOn: ['lenis-scroll'],
	setup(nuxtApp) {
		const phase = shallowRef<PageTransitionPhase>('idle')
		const isActive = computed(() => phase.value !== 'idle')
		const pendingCleanups: Cleanup[] = []
		const revealWaiters: Array<() => void> = []
		const replayCount = shallowRef(0)
		let isClaimed = false
		let releaseScroll: (() => void) | null = null
		let releaseRefresh: (() => Promise<void>) | null = null

		function begin() {
			phase.value = 'preparing'
			isClaimed = false
			releaseScroll = nuxtApp.$smoothScroll.lock()
			releaseRefresh = nuxtApp.$smoothScroll.holdRefresh()
		}

		function replay() {
			begin()
			replayCount.value += 1
		}

		function pageKey(route: RouteLocationNormalizedLoaded) {
			return `${route.path}:${replayCount.value}`
		}

		function claim() {
			isClaimed = true
		}

		function move() {
			if (phase.value === 'preparing') phase.value = 'moving'
		}

		function reveal() {
			for (const resolve of revealWaiters.splice(0)) resolve()
		}

		function finish() {
			if (!isActive.value) return

			for (const cleanup of pendingCleanups.splice(0)) cleanup()
			nuxtApp.$smoothScroll.reset()
			releaseScroll?.()
			releaseRefresh?.()
			releaseScroll = null
			releaseRefresh = null
			phase.value = 'idle'
			reveal()
		}

		function deferCleanup(cleanup: Cleanup) {
			if (isActive.value) {
				pendingCleanups.push(cleanup)
				return
			}

			cleanup()
		}

		function waitForReveal() {
			if (!isActive.value) return Promise.resolve()

			return new Promise<void>(resolve => {
				revealWaiters.push(resolve)
			})
		}

		if (import.meta.client) {
			nuxtApp.$router.beforeEach(
				(to, from) => !isActive.value || to.path === from.path,
			)
			nuxtApp.$router.afterEach((to, from, failure) => {
				if (
					isNavigationFailure(failure, NavigationFailureType.duplicated) &&
					!isActive.value
				) {
					replay()
					return
				}

				if (failure || !from.matched.length || to.path === from.path) return

				begin()
			})
			nuxtApp.hook('page:finish', () => {
				if (!isClaimed) finish()
			})
			nuxtApp.hook('app:error', finish)
		}

		return {
			provide: {
				pageTransition: {
					claim,
					deferCleanup,
					finish,
					isActive,
					move,
					pageKey,
					phase: readonly(phase),
					reveal,
					waitForReveal,
				},
			},
		}
	},
})
