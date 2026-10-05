<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { NuxtLink } from '#components'
import SiteNavLink from '@/components/layout/SiteNavLink.vue'
import SplitText from '@/components/shared/SplitText.vue'
import { Button, ButtonIcon } from '@/components/ui/button'
import { appIcons } from '@/lib/icons'
import type { SplitTextResult } from '@/lib/split-text'

interface FooterLink {
	href: string
	label: string
}

const contactRoute = '/contact'
const email = 'info@byroose.com'
const headquarters = 'Yerevan, Armenia'
const creditHref = 'https://www.linkedin.com/in/razmatinyan/'

const sloganLines = [
	{ text: 'From seen', tone: 'text-brand-blue' },
	{ text: 'to chosen', tone: 'text-primary' },
]
const brandName = 'byroose'

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

const footerRoot = useTemplateRef<HTMLElement>('footerRoot')
const titleSplits = shallowRef<(SplitTextResult | undefined)[]>(
	[...sloganLines, brandName].map(() => undefined),
)

useFooterMotion(footerRoot, titleSplits)

function setTitleSplit(index: number, parts: SplitTextResult) {
	titleSplits.value = titleSplits.value.with(index, parts)
}
</script>

<template>
	<footer ref="footerRoot" class="site-footer section-gutter">
		<div class="site-footer-top" data-footer-reveal>
			<div class="site-footer-lead">
				<p class="section-title site-footer-title">
					<SplitText
						v-for="(line, index) in sloganLines"
						:key="line.text"
						class="site-footer-title-line"
						:class="line.tone"
						aria="none"
						mask="words"
						:text="line.text"
						@split="setTitleSplit(index, $event)"
					/>
					<span class="site-footer-title-line site-footer-title-brand">
						<SplitText
							aria="none"
							mask="words"
							:text="brandName"
							@split="setTitleSplit(sloganLines.length, $event)"
						/>
						<span class="site-footer-title-action" data-footer-rise-mask>
							<span class="site-footer-title-action-rise" data-footer-rise>
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
					</span>
				</p>

				<div class="site-footer-email">
					<div data-footer-rise-mask>
						<p class="site-footer-email-label" data-footer-rise>
							If you prefer email
							<Icon :name="appIcons.arrowDown" class="size-4" aria-hidden="true" />
						</p>
					</div>
					<div data-footer-rise-mask>
						<SiteNavLink :href="`mailto:${email}`" :label="email" data-footer-rise />
					</div>
				</div>
			</div>

			<div class="site-footer-columns">
				<nav class="site-footer-column" aria-labelledby="site-footer-navigation">
					<div data-footer-rise-mask>
						<h2 id="site-footer-navigation" class="site-footer-heading" data-footer-rise>
							Navigation
						</h2>
					</div>
					<ul class="site-footer-list">
						<li v-for="link in navigationLinks" :key="link.href" data-footer-rise-mask>
							<SiteNavLink :href="link.href" :label="link.label" data-footer-rise />
						</li>
					</ul>
				</nav>

				<div class="site-footer-column">
					<div data-footer-rise-mask>
						<h2 id="site-footer-socials" class="site-footer-heading" data-footer-rise>
							Socials
						</h2>
					</div>
					<ul class="site-footer-list" aria-labelledby="site-footer-socials">
						<li v-for="link in socialLinks" :key="link.label" data-footer-rise-mask>
							<SiteNavLink :href="link.href" :label="link.label" data-footer-rise />
						</li>
					</ul>
				</div>

				<div class="site-footer-column">
					<div data-footer-rise-mask>
						<h2 class="site-footer-heading" data-footer-rise>Headquarters</h2>
					</div>
					<div data-footer-rise-mask>
						<p class="site-footer-location" data-footer-rise>{{ headquarters }}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="site-footer-brand" data-footer-reveal>
			<div data-footer-rise-mask>
				<NuxtImg
					class="site-footer-logo"
					src="/logo.svg"
					alt="byroose"
					width="651"
					height="187"
					format="svg"
					provider="none"
					loading="lazy"
					data-footer-rise
				/>
			</div>
			<div class="site-footer-legal">
				<div data-footer-rise-mask>
					<span class="block" data-footer-rise>
						© 2026 All Rights Reserved, byroose inc.
					</span>
				</div>
				<div data-footer-rise-mask>
					<span class="block" data-footer-rise>
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

.site-footer-title :deep(.split-text-word),
.site-footer-title :deep(.split-text-word-mask) {
	display: inline-block;
}

.site-footer-title :deep(.split-text-word) {
	visibility: hidden;
}

.site-footer-title :deep(.split-text-word-mask) {
	margin-block: -0.15em;
	padding-block: 0.15em;
}

.site-footer-title-brand {
	@apply flex flex-wrap items-center gap-x-[0.2em] gap-y-2;
}

.site-footer-title-action {
	@apply inline-flex tracking-normal;
	height: max(2.75rem, 0.7em);
}

.site-footer-title-action-rise {
	@apply flex h-full;
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

.site-footer-title-line:not(:has(.split-text-word)) {
	visibility: hidden;
}

[data-footer-reveal]:not([data-footer-revealed]) [data-footer-rise-mask] {
	clip-path: inset(0);
}

[data-footer-reveal]:not([data-footer-revealed]) :deep([data-footer-rise]) {
	transform: translateY(115%);
}

@media (prefers-reduced-motion: reduce) {
	.site-footer-title :deep(.split-text-word),
	.site-footer-title-line:not(:has(.split-text-word)) {
		visibility: inherit;
	}

	[data-footer-reveal]:not([data-footer-revealed]) [data-footer-rise-mask] {
		clip-path: none;
	}

	[data-footer-reveal]:not([data-footer-revealed]) :deep([data-footer-rise]) {
		transform: none;
	}
}
</style>
