import { onMounted, onScopeDispose, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

type MotionTarget = MaybeRefOrGetter<HTMLElement | null | undefined>

interface FooterMotionTargets {
	content: MotionTarget
	root: MotionTarget
	shade: MotionTarget
}

const refreshPriority = -4
const contentLag = 0.5

export function useFooterRevealProgress() {
	return useState<number>('footer-reveal-progress', () => 0)
}

export function useFooterMotion({ content, root, shade }: FooterMotionTargets) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap()
	const { refresh } = useSmoothScroll()
	const revealProgress = useFooterRevealProgress()
	let disposed = false

	function getRevealDistance(footer: HTMLElement) {
		return Math.min(footer.offsetHeight, window.innerHeight)
	}

	function createReveal(
		footer: HTMLElement,
		footerContent: HTMLElement,
		footerShade: HTMLElement,
	) {
		gsap
			.timeline({
				defaults: { ease: 'none' },
				scrollTrigger: {
					end: () => `+=${getRevealDistance(footer)}`,
					invalidateOnRefresh: true,
					onUpdate: ({ progress, start }) => {
						revealProgress.value = start > 0 ? progress : 0
					},
					refreshPriority,
					scrub: true,
					start: 'top bottom',
					trigger: footer,
				},
			})
			.fromTo(
				footerContent,
				{ y: () => -getRevealDistance(footer) * contentLag },
				{ y: 0 },
				0,
			)
			.fromTo(footerShade, { opacity: 1 }, { opacity: 0 }, 0)
	}

	onMounted(async () => {
		const scrollTrigger = await loadPlugin('ScrollTrigger')
		if (!scrollTrigger || disposed) return

		const footer = toValue(root)
		const footerContent = toValue(content)
		const footerShade = toValue(shade)
		if (!footer || !footerContent || !footerShade) return

		createMatchMedia(
			'(prefers-reduced-motion: no-preference)',
			() => {
				createReveal(footer, footerContent, footerShade)

				return () => {
					revealProgress.value = 0
				}
			},
			root,
		)

		await refresh()
	})

	onScopeDispose(() => {
		disposed = true
	})
}
