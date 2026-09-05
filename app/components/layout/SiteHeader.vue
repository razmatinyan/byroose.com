<script setup lang="ts">
import { computed } from 'vue'
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

const resolvedNavItems = computed(() => navItems ?? defaultNavItems)
const {
	closeMenu,
	handleMenuButtonClick,
	headerMode,
	menuButtonLabel,
	menuOpen,
} = useSiteHeaderMotion()
</script>

<template>
	<header
		ref="headerRoot"
		class="site-header"
		:data-header-mode="headerMode"
	>
		<div class="site-header-inner">
			<a
				ref="logoLink"
				class="site-logo-link"
				href="#top"
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
			</a>

			<nav
				id="primary-navigation"
				ref="primaryNavigation"
				class="site-nav"
				aria-label="Main navigation"
			>
				<a
					v-for="item in resolvedNavItems"
					:key="item.href"
					class="site-nav-link"
					:href="item.href"
				>
					{{ item.label }}
				</a>
			</nav>

			<div class="site-header-actions">
				<span ref="headerCta" class="site-header-cta-wrap">
					<Button
						class="site-header-cta"
						as="a"
						:href="ctaHref"
						size="cta-sm"
						variant="dark"
					>
						{{ ctaLabel }}
						<ButtonIcon size="sm" />
					</Button>
				</span>

				<span ref="menuButton" class="site-menu-button-wrap">
					<button
						class="site-menu-button"
						type="button"
						:aria-expanded="menuOpen"
						aria-controls="primary-navigation mobile-navigation"
						:aria-label="menuButtonLabel"
						@click="handleMenuButtonClick"
					>
						<Icon :name="appIcons.menu" class="size-5" aria-hidden="true" />
					</button>
				</span>
			</div>

			<nav
				v-if="menuOpen"
				id="mobile-navigation"
				ref="mobileNavigation"
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
