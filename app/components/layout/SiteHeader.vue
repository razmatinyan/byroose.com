<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Button, ButtonIcon } from '@/components/ui/button'
import { appIcons } from '@/lib/icons'

interface NavItem {
	href: string
	label: string
}

const defaultNavItems: NavItem[] = [
	{ href: '#studio', label: 'Studio' },
	{ href: '#services', label: 'Services' },
	{ href: '#work', label: 'Work' },
	{ href: '#courses', label: 'Courses' },
	{ href: '#blog', label: 'Blog' },
	{ href: '#faq', label: 'FAQ' },
]

const {
	ctaHref = '#contact',
	ctaLabel = 'Start a project',
	navItems,
} = defineProps<{
	ctaHref?: string
	ctaLabel?: string
	navItems?: NavItem[]
}>()

const menuOpen = shallowRef(false)
const resolvedNavItems = computed(() => navItems ?? defaultNavItems)

function closeMenu() {
	menuOpen.value = false
}
</script>

<template>
	<header class="site-header">
		<div class="site-header-inner">
			<a
				class="site-logo-link"
				href="#top"
				aria-label="byroose home"
				@click="closeMenu"
			>
				<img class="site-logo" src="/logo.svg" alt="byroose" />
			</a>

			<nav class="site-nav" aria-label="Main navigation">
				<a
					v-for="item in resolvedNavItems"
					:key="item.href"
					class="site-nav-link"
					:href="item.href"
				>
					{{ item.label }}
				</a>
			</nav>

			<div class="flex items-center gap-2">
				<Button
					class="site-header-cta hidden sm:inline-flex"
					as="a"
					:href="ctaHref"
					size="cta-sm"
					variant="dark"
				>
					{{ ctaLabel }}
					<ButtonIcon size="sm" />
				</Button>

				<Button
					class="site-menu-button lg:hidden"
					variant="outline"
					size="icon"
					:aria-expanded="menuOpen"
					aria-controls="mobile-navigation"
					:aria-label="
						menuOpen ? 'Close navigation' : 'Open navigation'
					"
					@click="menuOpen = !menuOpen"
				>
					<Icon
						:name="menuOpen ? appIcons.close : appIcons.menu"
						class="size-5"
					/>
				</Button>
			</div>

			<nav
				v-if="menuOpen"
				id="mobile-navigation"
				class="site-mobile-nav"
				aria-label="Mobile navigation"
			>
				<a
					v-for="item in resolvedNavItems"
					:key="item.href"
					class="site-mobile-link"
					:href="item.href"
					@click="closeMenu"
				>
					{{ item.label }}
				</a>
				<Button
					as="a"
					:href="ctaHref"
					size="cta-sm"
					class="mt-1 sm:hidden"
					@click="closeMenu"
				>
					{{ ctaLabel }}
					<ButtonIcon size="sm" />
				</Button>
			</nav>
		</div>
	</header>
</template>
