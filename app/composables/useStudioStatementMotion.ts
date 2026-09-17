import { nextTick, onScopeDispose, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import type { SplitTextResult } from "@/lib/split-text";

type MotionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;
type SplitSource = MaybeRefOrGetter<SplitTextResult | undefined>;

export function useStudioStatementMotion(
	scope: MotionScope,
	splitSource: SplitSource,
) {
	const { createMatchMedia, gsap, loadPlugin } = useGsap();
	const { refresh } = useSmoothScroll();
	let disposed = false;
	let initialized = false;

	async function initialize(parts: SplitTextResult) {
		if (initialized || disposed || !parts?.words.length) return;

		initialized = true;
		await nextTick();
		const ScrollTrigger = await loadPlugin("ScrollTrigger");
		if (!ScrollTrigger || disposed) return;

		const root = toValue(scope);
		if (!root) return;

		createMatchMedia(
			{
				motion: "(prefers-reduced-motion: no-preference)",
				reduceMotion: "(prefers-reduced-motion: reduce)",
			},
			(context) => {
				if (context.conditions?.reduceMotion) {
					gsap.set(parts.words, {
						clearProps: "transform",
						visibility: "inherit",
					});
					return;
				}

				gsap.set(parts.words, {
					visibility: "inherit",
					yPercent: 115,
				});

				gsap.to(parts.words, {
					duration: 0.8,
					ease: "power3.out",
					stagger: 0.02,
					scrollTrigger: {
						once: true,
						start: "top 82%",
						trigger: root,
					},
					yPercent: 0,
				});
			},
			scope,
		);

		await refresh();
	}

	watch(
		() => toValue(splitSource),
		(parts) => {
			if (parts !== undefined) return initialize(parts);
		},
		{ flush: "post", immediate: true },
	);

	onScopeDispose(() => {
		disposed = true;
	});
}
