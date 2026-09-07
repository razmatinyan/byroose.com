<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import SiteMenuLink from '@/components/layout/SiteMenuLink.vue'

interface NavItem {
	href: string
	label: string
}

const { navItems, open = false } = defineProps<{
	navItems: NavItem[]
	open?: boolean
}>()

const emit = defineEmits<{
	'update:open': [open: boolean]
}>()

const buttonLabel = computed(() =>
	open ? 'Close navigation' : 'Open navigation',
)
const {
	menuButton,
	menuLineBottom,
	menuLineTop,
	menuPanel,
	siteMenuRoot,
} = useSiteMenuMotion(() => open)

useHoverBounce(menuButton, { press: true })

function setOpen(nextOpen: boolean) {
	emit('update:open', nextOpen)
}

function toggleMenu() {
	setOpen(!open)
}

async function closeMenu(returnFocus = false) {
	if (!open) return

	setOpen(false)
	if (!returnFocus) return

	await nextTick()
	menuButton.value?.focus()
}

onClickOutside(
	menuPanel,
	() => {
		void closeMenu()
	},
	{ ignore: [siteMenuRoot] },
)

onKeyStroke(
	'Escape',
	event => {
		if (!open) return

		event.preventDefault()
		void closeMenu(true)
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
			:aria-expanded="open"
			aria-controls="site-menu-navigation"
			:aria-label="buttonLabel"
			@click="toggleMenu"
		>
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
			>
				<div class="site-menu-content">
					<p class="site-menu-heading site-menu-reveal" data-menu-reveal>
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
								@navigate="closeMenu()"
							/>
						</li>
					</ul>

					<div class="site-menu-footer site-menu-reveal" data-menu-reveal>
						<span class="site-menu-footer-label">Creative agency</span>
						<a
							class="site-menu-home"
							href="#top"
							aria-label="byroose home"
							@click="closeMenu()"
						>
							<NuxtImg
								class="site-menu-logo"
								src="/logo.svg"
								alt="byroose"
								width="651"
								height="187"
								format="svg"
							/>
						</a>
					</div>
				</div>
			</nav>
		</Teleport>
	</div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-menu {
	@apply relative size-[2.875rem];
}

.site-menu-button {
	@apply relative z-20 grid size-[2.875rem] shrink-0 place-items-center rounded-full border border-background/20 bg-foreground text-background outline-none focus-visible:ring-3 focus-visible:ring-ring/50;
}

.site-menu-icon {
	@apply relative block size-5;
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
	@apply invisible pointer-events-none fixed top-0 left-0 z-50 overflow-y-auto rounded-3xl border border-background/15 bg-foreground text-background shadow-xl;
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
	transform: translateY(0.5rem);
}

@media (hover: none) {
	.site-menu-button {
		@apply transition-transform active:scale-95 motion-reduce:transition-none;
	}
}
</style>
