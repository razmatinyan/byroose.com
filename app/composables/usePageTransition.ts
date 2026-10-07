export function usePageTransition() {
	const { $pageTransition } = useNuxtApp()

	return {
		deferCleanup: $pageTransition.deferCleanup,
		isActive: $pageTransition.isActive,
		phase: $pageTransition.phase,
		waitForReveal: $pageTransition.waitForReveal,
	}
}
