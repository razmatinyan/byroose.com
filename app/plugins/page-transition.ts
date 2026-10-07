import { readonly, shallowRef } from 'vue'

type Cleanup = () => void

export default defineNuxtPlugin({
	name: 'page-transition',
	dependsOn: ['lenis-scroll'],
	setup(nuxtApp) {
		const isActive = shallowRef(false)
		const pendingCleanups: Cleanup[] = []
		const revealWaiters: Array<() => void> = []
		let isClaimed = false
		let releaseScroll: (() => void) | null = null
		let releaseRefresh: (() => Promise<void>) | null = null

		function begin() {
			isActive.value = true
			isClaimed = false
			releaseScroll = nuxtApp.$smoothScroll.lock()
			releaseRefresh = nuxtApp.$smoothScroll.holdRefresh()
		}

		function claim() {
			isClaimed = true
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
			isActive.value = false
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
					isActive: readonly(isActive),
					reveal,
					waitForReveal,
				},
			},
		}
	},
})
