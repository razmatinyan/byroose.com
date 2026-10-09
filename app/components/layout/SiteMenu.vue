<script setup lang="ts">
import { nextTick, shallowRef, watch } from 'vue'
import {
	onClickOutside,
	onKeyStroke,
	useEventListener,
	useTimeoutFn,
} from '@vueuse/core'
import SiteMenuLink from '@/components/layout/SiteMenuLink.vue'

interface NavItem {
	href: string
	label: string
}

type MenuOpenMode = 'click' | 'hover'

const hoverCloseDelay = 200

const {
	bordered = false,
	navItems,
	open = false,
} = defineProps<{
	bordered?: boolean
	navItems: NavItem[]
	open?: boolean
}>()

const emit = defineEmits<{
	'update:open': [open: boolean]
}>()

const { menuButton, menuLineBottom, menuLineTop, menuPanel, siteMenuRoot } =
	useSiteMenuMotion(() => open)
const route = useRoute()
const { isActive: isTransitionActive, phase: transitionPhase } =
	usePageTransition()

useHoverBounce(menuButton, { hover: false, press: true })

function setOpen(nextOpen: boolean) {
	emit('update:open', nextOpen)
}

const openMode = shallowRef<MenuOpenMode | null>(null)

const hoverClose = useTimeoutFn(
	() => {
		if (openMode.value === 'hover') closeMenu()
	},
	hoverCloseDelay,
	{ immediate: false },
)

watch(
	() => open,
	isOpen => {
		if (isOpen) return

		openMode.value = null
		hoverClose.stop()
	},
)

function toggleMenu() {
	hoverClose.stop()

	if (open && openMode.value === 'hover') {
		openMode.value = 'click'
		return
	}

	openMode.value = open ? null : 'click'
	setOpen(!open)
}

function openOnHover(event: PointerEvent) {
	if (event.pointerType !== 'mouse' || open) return

	openMode.value = 'hover'
	setOpen(true)
}

function isPointerInside(element: HTMLElement | null, event: PointerEvent) {
	if (!element) return false

	const bounds = element.getBoundingClientRect()
	return (
		event.clientX >= bounds.left &&
		event.clientX <= bounds.right &&
		event.clientY >= bounds.top &&
		event.clientY <= bounds.bottom
	)
}

function isHoverPointer(event: PointerEvent) {
	return openMode.value === 'hover' && event.pointerType === 'mouse'
}

async function closeMenu(returnFocus = false) {
	if (!open) return

	setOpen(false)
	if (!returnFocus) return

	await nextTick()
	menuButton.value?.focus()
}

function handleNavigate(href: string, event: MouseEvent) {
	const startsTransition =
		event.defaultPrevented &&
		href !== route.path &&
		!isTransitionActive.value

	if (!startsTransition) closeMenu()
}

watch(transitionPhase, phase => {
	if (phase !== 'preparing') closeMenu()
})

useEventListener(
	'pointermove',
	(event: PointerEvent) => {
		if (!isHoverPointer(event)) return

		if (
			isPointerInside(menuButton.value, event) ||
			isPointerInside(menuPanel.value, event)
		) {
			hoverClose.stop()
			return
		}

		if (!hoverClose.isPending.value) hoverClose.start()
	},
	{ passive: true },
)

useEventListener('pointerout', (event: PointerEvent) => {
	if (!isHoverPointer(event) || event.relatedTarget) return

	hoverClose.start()
})

onClickOutside(
	menuPanel,
	() => {
		closeMenu()
	},
	{ ignore: [siteMenuRoot] },
)

onKeyStroke(
	'Escape',
	event => {
		if (!open) return

		event.preventDefault()
		closeMenu(true)
	},
	{ dedupe: true },
)
</script>

<template>
	<div ref="siteMenuRoot" class="site-menu" :data-open="open">
		<button
			ref="menuButton"
			class="site-menu-button"
			type="button"
			:data-bordered="bordered || undefined"
			:aria-expanded="open"
			aria-controls="site-menu-navigation"
			@click="toggleMenu"
			@pointerenter="openOnHover"
		>
			<span class="site-menu-button-label">Menu</span>
			<span class="site-menu-icon" aria-hidden="true">
				<span
					ref="menuLineTop"
					class="site-menu-line site-menu-line-top"
				/>
				<span
					ref="menuLineBottom"
					class="site-menu-line site-menu-line-bottom"
				/>
			</span>
		</button>

		<Teleport to="#teleports">
			<nav
				id="site-menu-navigation"
				ref="menuPanel"
				class="site-menu-panel"
				aria-label="Expanded navigation"
				:aria-hidden="!open"
				:inert="!open"
				data-lenis-prevent
				data-page-transition-overlay
			>
				<div class="site-menu-content">
					<p
						class="site-menu-heading site-menu-reveal"
						data-menu-reveal
					>
						Navigation
					</p>

					<ul class="site-menu-links">
						<li
							v-for="item in navItems"
							:key="item.href"
							class="site-menu-reveal"
							data-menu-reveal
						>
							<SiteMenuLink
								:href="item.href"
								:label="item.label"
								@navigate="handleNavigate(item.href, $event)"
							/>
						</li>
					</ul>

					<div
						class="site-menu-footer site-menu-reveal"
						data-menu-reveal
					>
						<span class="site-menu-footer-label"
							>Creative agency</span
						>
						<NuxtLink
							class="site-menu-home"
							to="/"
							aria-label="byroose home"
							@click="handleNavigate('/', $event)"
						>
							<NuxtImg
								class="site-menu-logo"
								src="/logo.svg"
								alt="byroose"
								width="651"
								height="187"
								format="svg"
								provider="none"
							/>
						</NuxtLink>
					</div>
				</div>
			</nav>
		</Teleport>
	</div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-menu {
	@apply relative inline-flex;
}

.site-menu-button {
	@apply relative z-20 inline-flex h-11 w-11 shrink-0 items-center justify-center gap-2.5 rounded-action border transition-[border-color] duration-300 motion-reduce:transition-none aria-expanded:border-background/20 data-bordered:border-background/20 bg-foreground text-sm font-semibold text-primary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-26 sm:text-base;
}

.site-menu-button-label {
	@apply sr-only leading-none sm:not-sr-only;
}

.site-menu-icon {
	@apply relative block size-5 shrink-0;
}

.site-menu-line {
	@apply absolute top-1/2 left-0 block h-px w-full bg-current;
}

.site-menu-line-top {
	transform: translateY(-3px);
}

.site-menu-line-bottom {
	transform: translateY(3px);
}

.site-menu-panel {
	@apply invisible pointer-events-none scrollbar-none fixed top-0 left-0 z-50 overflow-y-auto rounded-action border border-background/15 bg-foreground text-background shadow-xl;
	width: min(22.5rem, calc(100vw - 2rem));
	height: min(36rem, calc(100dvh - 2rem));
}

.site-menu-content {
	@apply flex min-h-full flex-col px-5 pt-20 pb-5;
}

.site-menu-heading,
.site-menu-footer-label {
	@apply text-xs font-medium text-background/45;
}

.site-menu-links {
	@apply mt-4 grid list-none gap-0 p-0;
}

.site-menu-footer {
	@apply mt-auto flex items-end justify-between gap-6 border-t border-background/15 pt-5;
}

.site-menu-home {
	@apply block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-background/70;
}

.site-menu-logo {
	@apply block h-auto w-28;
	filter: invert(1);
}

.site-menu-reveal {
	visibility: hidden;
	opacity: 0;
}

@media (hover: none) {
	.site-menu-button {
		@apply transition-[border-color,transform] active:scale-95 motion-reduce:transition-none;
	}
}
</style>
