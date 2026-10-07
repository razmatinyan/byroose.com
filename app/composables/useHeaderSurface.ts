import { onMounted, onScopeDispose, readonly, shallowRef } from 'vue'
import { unrefElement, useEventListener } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'

const surfaceSelector = '[data-header-surface]'

function readSurfaceBehind(header: Element, probe: Element) {
	const bounds = probe.getBoundingClientRect()
	const x = bounds.left + bounds.width / 2
	const y = bounds.top + bounds.height / 2

	for (const element of document.elementsFromPoint(x, y)) {
		if (header.contains(element)) continue

		const surface = element.closest<HTMLElement>(surfaceSelector)
		if (surface) return surface.dataset.headerSurface
	}

	return undefined
}

export function useHeaderSurface(
	header: MaybeComputedElementRef,
	probe: MaybeComputedElementRef,
) {
	const onDarkSurface = shallowRef(false)
	const { onScroll } = useSmoothScroll()
	const nuxtApp = useNuxtApp()
	const cleanups: (() => void)[] = []

	function update() {
		const headerElement = unrefElement(header)
		const probeElement = unrefElement(probe)
		if (!headerElement || !probeElement) return

		onDarkSurface.value =
			readSurfaceBehind(headerElement, probeElement) === 'dark'
	}

	useEventListener('resize', update, { passive: true })

	onMounted(() => {
		update()
		cleanups.push(onScroll(update), nuxtApp.hook('page:transition:finish', update))
	})

	onScopeDispose(() => {
		for (const cleanup of cleanups) cleanup()
	})

	return {
		onDarkSurface: readonly(onDarkSurface),
	}
}
