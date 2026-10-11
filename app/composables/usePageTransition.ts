export function usePageTransition() {
	const { $pageTransition } = useNuxtApp()

	return {
		deferCleanup: $pageTransition.deferCleanup,
		isActive: $pageTransition.isActive,
		pageKey: $pageTransition.pageKey,
		phase: $pageTransition.phase,
		waitForReveal: $pageTransition.waitForReveal,
	}
}
