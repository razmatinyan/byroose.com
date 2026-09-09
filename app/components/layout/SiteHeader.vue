<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import SiteMenu from '@/components/layout/SiteMenu.vue'
import SiteNavLink from '@/components/layout/SiteNavLink.vue'
import { Button, ButtonIcon } from '@/components/ui/button'

interface NavItem {
	href: string
	label: string
}

const defaultNavItems: NavItem[] = [
	{ href: '/about', label: 'About' },
	{ href: '/works', label: 'Works' },
	{ href: '/services', label: 'Services' },
	{ href: '/journey', label: 'Journey' },
	{ href: '/courses', label: 'Courses' },
	{ href: '/blog', label: 'Blog' },
	{ href: '/contact', label: 'Contact' },
]

const {
	ctaHref = '/contact',
	ctaLabel = 'Start a project',
	navItems,
} = defineProps<{
	ctaHref?: string
	ctaLabel?: string
	navItems?: NavItem[]
}>()

const resolvedNavItems = computed(() => navItems ?? defaultNavItems)
const menuOpen = shallowRef(false)
const headerCtaVariant = computed(() => (menuOpen.value ? 'default' : 'dark'))
const isDesktop = useMediaQuery('(min-width: 64rem)')
const { headerMode } = useSiteHeaderMotion()

function setMenuOpen(open: boolean) {
	menuOpen.value = open
}

function closeMenu() {
	setMenuOpen(false)
}

watch([headerMode, isDesktop], ([mode, desktop]) => {
	if (mode === 'full' && desktop) closeMenu()
})
</script>

<template>
	<header ref="headerRoot" class="site-header" :data-header-mode="headerMode">
		<div class="site-header-inner">
			<NuxtLink
				ref="logoLink"
				class="site-logo-link"
				to="/"
				aria-label="byroose home"
				@click="closeMenu"
			>
				<NuxtImg
					class="site-logo"
					src="/logo.svg"
					alt="byroose"
					width="651"
					height="187"
					format="svg"
				/>
			</NuxtLink>

			<nav
				id="primary-navigation"
				ref="primaryNavigation"
				class="site-nav"
				aria-label="Main navigation"
			>
				<SiteNavLink
					v-for="item in resolvedNavItems"
					:key="item.href"
					:href="item.href"
					:label="item.label"
				/>
			</nav>

			<div class="site-header-actions">
				<span ref="headerCta" class="site-header-cta-wrap">
					<Button
						class="site-header-cta"
						as="a"
						:href="ctaHref"
						size="cta-sm"
						:variant="headerCtaVariant"
					>
						{{ ctaLabel }}
						<template #icon>
							<ButtonIcon size="sm" />
						</template>
					</Button>
				</span>

				<span ref="menuButton" class="site-menu-button-wrap">
					<SiteMenu
						:nav-items="resolvedNavItems"
						:open="menuOpen"
						@update:open="setMenuOpen"
					/>
				</span>
			</div>
		</div>
	</header>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-header {
	@apply sticky top-0 z-60 isolate;
}

.site-header-inner {
	@apply relative z-10 grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-page py-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6;
}

.site-logo-link {
	@apply col-start-1 row-start-1 flex shrink-0 items-center justify-self-start text-foreground hover:text-foreground;
	will-change: transform, opacity;
}

.site-logo {
	@apply block h-7 w-auto sm:h-8.5;
}

.site-nav {
	@apply hidden items-center gap-1 rounded-lg bg-card px-2 py-1 lg:col-start-2 lg:row-start-1 lg:flex shadow-lg shadow-black/4;
	will-change: transform, opacity;
}

.site-header-actions {
	@apply relative col-start-2 row-start-1 flex items-center justify-self-end gap-2 lg:col-start-3;
}

.site-header-cta-wrap,
.site-menu-button-wrap {
	@apply inline-flex shrink-0;
	will-change: transform, opacity;
}

.site-header-cta-wrap {
	@apply relative z-30 lg:translate-x-13;
}

.site-header-cta {
	transition-duration: 440ms;
	transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.site-menu-button-wrap {
	@apply relative z-20 lg:pointer-events-none lg:invisible;
}

@media (prefers-reduced-motion: reduce) {
	.site-header-cta {
		transition-duration: 0ms;
	}
}
</style>
