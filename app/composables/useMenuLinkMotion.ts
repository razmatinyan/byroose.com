import { onMounted } from 'vue'
import { unrefElement } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'

const menuLinkMotionConditions = {
	hover: '(hover: hover)',
	motion: '(prefers-reduced-motion: no-preference)',
}

export function useMenuLinkMotion(target: MaybeComputedElementRef) {
	const { createMatchMedia, gsap } = useGsap()

	onMounted(() => {
		createMatchMedia(menuLinkMotionConditions, context => {
			if (!context.conditions?.hover || !context.conditions?.motion) return

			const element = unrefElement(target)
			if (!(element instanceof HTMLElement)) return

			const characters = Array.from(
				element.querySelectorAll<HTMLElement>('[data-menu-character]'),
			)
			let activeTween: gsap.core.Tween | null = null

			const rotateCharacters = () => {
				activeTween?.kill()
				gsap.set(characters, { willChange: 'transform' })
				activeTween = gsap.to(characters, {
					duration: 0.52,
					ease: 'power3.inOut',
					onComplete: () => {
						gsap.set(characters, { clearProps: 'willChange' })
					},
					overwrite: 'auto',
					rotationX: '+=360',
					stagger: 0.026,
					transformOrigin: '50% 50% -0.18em',
				})
			}

			const handleFocus = () => {
				if (element.matches(':focus-visible')) rotateCharacters()
			}

			element.addEventListener('focus', handleFocus)
			element.addEventListener('pointerenter', rotateCharacters)

			return () => {
				element.removeEventListener('focus', handleFocus)
				element.removeEventListener('pointerenter', rotateCharacters)
				activeTween?.kill()
				gsap.set(characters, {
					clearProps: 'transform,transformOrigin,willChange',
				})
			}
		})
	})
}
