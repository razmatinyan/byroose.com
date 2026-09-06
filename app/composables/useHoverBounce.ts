import { onMounted } from 'vue'
import { unrefElement } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'

const hoverCapableMotion = '(hover: hover) and (prefers-reduced-motion: no-preference)'

export function useHoverBounce(target: MaybeComputedElementRef) {
	const { createMatchMedia, gsap } = useGsap()

	onMounted(() => {
		createMatchMedia(hoverCapableMotion, () => {
			const element = unrefElement(target)
			if (!element) return

			let activeTween: gsap.core.Tween | null = null

			const scaleTo = (scale: number, duration: number, ease: string) => {
				activeTween?.kill()
				activeTween = gsap.to(element, { duration, ease, scale })
			}

			const handlePointerEnter = () => scaleTo(1.08, 0.8, 'elastic.out(1.3, 0.3)')
			const handlePointerLeave = () => scaleTo(1, 0.45, 'back.out(2.2)')

			element.addEventListener('pointerenter', handlePointerEnter)
			element.addEventListener('pointerleave', handlePointerLeave)

			return () => {
				element.removeEventListener('pointerenter', handlePointerEnter)
				element.removeEventListener('pointerleave', handlePointerLeave)
				activeTween?.kill()
				activeTween = null
				gsap.set(element, { clearProps: 'scale' })
			}
		})
	})
}
