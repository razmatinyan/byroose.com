<script setup lang="ts">
import { NuxtLink } from '#components'
import SiteNavLink from '@/components/layout/SiteNavLink.vue'
import { Button, ButtonIcon } from '@/components/ui/button'
import { appIcons } from '@/lib/icons'

interface FooterLink {
	href: string
	label: string
}

const contactRoute = '/contact'
const email = 'info@byroose.com'
const headquarters = 'Yerevan, Armenia'
const creditHref = 'https://www.linkedin.com/in/razmatinyan/'

const navigationLinks: FooterLink[] = [
	{ href: '/', label: 'Home' },
	{ href: '/about', label: 'About' },
	{ href: '/works', label: 'Works' },
	{ href: '/services', label: 'Services' },
	{ href: '/blog', label: 'Blog' },
	{ href: contactRoute, label: 'Contact' },
	{ href: '/terms', label: 'Terms & Conditions' },
	{ href: '/privacy', label: 'Privacy Policy' },
]

const socialLinks: FooterLink[] = [
	{ href: '#', label: 'LinkedIn' },
	{ href: '#', label: 'Instagram' },
	{ href: '#', label: 'X' },
]
</script>

<template>
	<footer class="site-footer section-gutter">
		<div class="site-footer-top">
			<div class="site-footer-lead">
				<p class="section-title">
					<span class="site-footer-title-line text-brand-blue">From seen</span>
					<span class="site-footer-title-line text-primary">to chosen</span>
					<span class="site-footer-title-line site-footer-title-brand">
						<span>byroose</span>
						<span class="site-footer-title-action">
							<Button
								class="site-footer-cta"
								:as="NuxtLink"
								:to="contactRoute"
								variant="dark"
								size="cta-lg"
							>
								Book a Call
								<template #icon>
									<ButtonIcon />
								</template>
							</Button>
						</span>
					</span>
				</p>

				<div class="site-footer-email">
					<p class="site-footer-email-label">
						If you prefer email
						<Icon :name="appIcons.arrowDown" class="size-4" aria-hidden="true" />
					</p>
					<SiteNavLink :href="`mailto:${email}`" :label="email" />
				</div>
			</div>

			<div class="site-footer-columns">
				<nav class="site-footer-column" aria-labelledby="site-footer-navigation">
					<h2 id="site-footer-navigation" class="site-footer-heading">Navigation</h2>
					<ul class="site-footer-list">
						<li v-for="link in navigationLinks" :key="link.href">
							<SiteNavLink :href="link.href" :label="link.label" />
						</li>
					</ul>
				</nav>

				<div class="site-footer-column">
					<h2 id="site-footer-socials" class="site-footer-heading">Socials</h2>
					<ul class="site-footer-list" aria-labelledby="site-footer-socials">
						<li v-for="link in socialLinks" :key="link.label">
							<SiteNavLink :href="link.href" :label="link.label" />
						</li>
					</ul>
				</div>

				<div class="site-footer-column">
					<h2 class="site-footer-heading">Headquarters</h2>
					<p class="site-footer-location">{{ headquarters }}</p>
				</div>
			</div>
		</div>

		<div class="site-footer-brand">
			<NuxtImg
				class="site-footer-logo"
				src="/logo.svg"
				alt="byroose"
				width="651"
				height="187"
				format="svg"
				provider="none"
				loading="lazy"
			/>
			<div class="site-footer-legal">
				<span>© 2026 All Rights Reserved, byroose inc.</span>
				<span>
					Website by
					<SiteNavLink
						:href="creditHref"
						label="Razo Codes"
						size="inherit"
						target="_blank"
					/>
				</span>
			</div>
		</div>
	</footer>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-footer {
	@apply bg-panel pt-16 pb-7 text-panel-foreground md:pt-20 xl:pt-24;
}

.site-footer-top {
	@apply grid gap-14 lg:grid-cols-2 lg:gap-8;
}

.site-footer-lead {
	@apply flex flex-col gap-10 md:gap-14;
}

.site-footer-title-line {
	@apply block;
}

.site-footer-title-brand {
	@apply flex flex-wrap items-center gap-x-[0.2em] gap-y-2;
}

.site-footer-title-action {
	@apply inline-flex tracking-normal;
	height: max(2.75rem, 0.7em);
}

.site-footer-cta {
	@apply h-full min-h-0;
}

.site-footer-email {
	@apply flex flex-col items-start gap-2;
}

.site-footer-email-label {
	@apply m-0 inline-flex items-center gap-1.5 text-sm text-muted-foreground;
}

.site-footer-columns {
	@apply grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3;
}

.site-footer-column {
	@apply flex flex-col gap-4;
}

.site-footer-heading {
	@apply m-0 text-sm font-medium text-muted-foreground;
}

.site-footer-list {
	@apply m-0 flex list-none flex-col items-start gap-2 p-0;
}

.site-footer-location {
	@apply m-0 text-lg font-semibold;
}

.site-footer-brand {
	@apply mt-16 md:mt-24 xl:mt-32;
}

.site-footer-logo {
	@apply block h-auto w-full;
}

.site-footer-legal {
	@apply mt-5 flex flex-wrap justify-between gap-3 text-sm text-muted-foreground;
}
</style>
