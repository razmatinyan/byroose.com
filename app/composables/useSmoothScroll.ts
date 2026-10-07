import { getCurrentScope, onScopeDispose } from 'vue'
import type { ScrollCallback } from 'lenis'

export function useSmoothScroll() {
	const { $smoothScroll } = useNuxtApp()

	function onScroll(callback: ScrollCallback) {
		const unsubscribe = $smoothScroll.onScroll(callback)

		if (getCurrentScope()) onScopeDispose(unsubscribe)

		return unsubscribe
	}

	return {
		holdRefresh: $smoothScroll.holdRefresh,
		instance: $smoothScroll.instance,
		isReady: $smoothScroll.isReady,
		lock: $smoothScroll.lock,
		onScroll,
		ready: $smoothScroll.ready,
		refresh: $smoothScroll.refresh,
		reset: $smoothScroll.reset,
		resize: $smoothScroll.resize,
		scrollTo: $smoothScroll.scrollTo,
	}
}
