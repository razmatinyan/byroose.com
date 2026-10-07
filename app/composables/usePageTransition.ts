export function usePageTransition() {
	const { $pageTransition } = useNuxtApp()

	return {
		deferCleanup: $pageTransition.deferCleanup,
		isActive: $pageTransition.isActive,
		waitForReveal: $pageTransition.waitForReveal,
	}
}
