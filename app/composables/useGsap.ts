import { getCurrentScope, onScopeDispose, shallowRef, toValue } from 'vue'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { gsap as coreGsap } from 'gsap'

const pluginLoaders = {
	Flip: () => import('gsap/Flip'),
	Observer: () => import('gsap/Observer'),
	ScrollToPlugin: () => import('gsap/ScrollToPlugin'),
	ScrollTrigger: () => import('gsap/ScrollTrigger'),
	SplitText: () => import('gsap/SplitText'),
	TextPlugin: () => import('gsap/TextPlugin'),
} as const

type LoadablePlugin = keyof typeof pluginLoaders
type AnimationScope = MaybeRefOrGetter<Element | null | undefined>
type MediaConditions = string | Record<string, string>

const loadedPlugins = new Map<LoadablePlugin, gsap.RegisterablePlugins>()

/**
 * Component-scoped GSAP toolkit.
 *
 * Create contexts after mount, scope selector strings to a component root, and
 * let this composable revert every context and media query on scope disposal.
 */
export function useGsap() {
	const gsapInstance = coreGsap
	const context: ShallowRef<gsap.Context | null> = shallowRef(null)
	const media: ShallowRef<gsap.MatchMedia | null> = shallowRef(null)
	const contexts = new Set<gsap.Context>()
	const mediaQueries = new Set<gsap.MatchMedia>()

	function createContext(setup: gsap.ContextFunc, scope?: AnimationScope) {
		if (!import.meta.client) return null

		const nextContext = gsapInstance.context(setup, scope ? toValue(scope) ?? undefined : undefined)
		contexts.add(nextContext)
		context.value = nextContext
		return nextContext
	}

	function createMatchMedia(
		conditions: MediaConditions,
		setup: gsap.ContextFunc,
		scope?: AnimationScope,
	) {
		if (!import.meta.client) return null

		const nextMedia = gsapInstance.matchMedia(scope ? toValue(scope) ?? undefined : undefined)
		nextMedia.add(conditions, setup)
		mediaQueries.add(nextMedia)
		media.value = nextMedia
		return nextMedia
	}

	async function loadPlugin(name: LoadablePlugin) {
		if (!import.meta.client) return null

		const cached = loadedPlugins.get(name)
		if (cached) return cached

		const module = await pluginLoaders[name]()
		const plugin = (module as unknown as Record<string, gsap.RegisterablePlugins>)[name]

		if (!plugin) throw new Error(`GSAP plugin "${name}" did not expose the expected export.`)

		gsapInstance.registerPlugin(plugin)
		loadedPlugins.set(name, plugin)
		return plugin
	}

	function cleanup() {
		for (const entry of mediaQueries) entry.revert()
		for (const entry of contexts) entry.revert()
		mediaQueries.clear()
		contexts.clear()
		media.value = null
		context.value = null
	}

	if (getCurrentScope()) onScopeDispose(cleanup)

	return {
		context,
		createContext,
		createMatchMedia,
		cleanup,
		gsap: gsapInstance,
		loadPlugin,
		media,
		getPlugin: (name: LoadablePlugin) => loadedPlugins.get(name),
	}
}
