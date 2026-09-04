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
		instance: $smoothScroll.instance,
		isReady: $smoothScroll.isReady,
		onScroll,
		ready: $smoothScroll.ready,
		refresh: $smoothScroll.refresh,
		resize: $smoothScroll.resize,
		scrollTo: $smoothScroll.scrollTo,
		start: $smoothScroll.start,
		stop: $smoothScroll.stop,
	}
}
