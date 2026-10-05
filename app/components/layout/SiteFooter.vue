<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useNow } from "@vueuse/core";
import { NuxtLink } from "#components";
import SiteNavLink from "@/components/layout/SiteNavLink.vue";
import { Button } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";

interface FooterLink {
	href: string;
	label: string;
}

const contactRoute = "/contact";
const email = "info@byroose.com";
const headquarters = "Yerevan, Armenia";
const creditHref = "https://www.linkedin.com/in/razmatinyan/";
const now = useNow({ interval: 60_000 });
const armeniaTimeFormatter = new Intl.DateTimeFormat("en-US", {
	hour: "2-digit",
	minute: "2-digit",
	hour12: true,
	timeZone: "Asia/Yerevan",
});
const armeniaTime = computed(
	() => `${armeniaTimeFormatter.format(now.value)} (GMT +4)`,
);
const armeniaDateTime = computed(() => now.value.toISOString());

const sloganLines = ["From seen", "to chosen"];

const navigationLinks: FooterLink[] = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/works", label: "Works" },
	{ href: "/services", label: "Services" },
	{ href: "/blog", label: "Blog" },
	{ href: contactRoute, label: "Contact" },
];

const policyLinks: FooterLink[] = [
	{ href: "/terms", label: "Terms & Conditions" },
	{ href: "/privacy", label: "Privacy Policy" },
];

const socialLinks: FooterLink[] = [
	{ href: "#", label: "X" },
	{ href: "#", label: "LinkedIn" },
	{ href: "#", label: "Instagram" },
];

const footerRoot = useTemplateRef<HTMLElement>("footerRoot");
const footerContent = useTemplateRef<HTMLElement>("footerContent");
const footerShade = useTemplateRef<HTMLElement>("footerShade");
const backToTop = useTemplateRef<HTMLElement>("backToTop");
const { scrollTo } = useSmoothScroll();

useFooterMotion({
	content: footerContent,
	root: footerRoot,
	shade: footerShade,
});
useArrowSwapHover(backToTop, { direction: "up", scale: false });

function scrollToTop() {
	scrollTo(0);
}
</script>

<template>
	<footer ref="footerRoot" class="site-footer">
		<div ref="footerContent" class="site-footer-content section-gutter">
			<div class="site-footer-top">
				<div class="site-footer-lead">
					<p class="section-title site-footer-title">
						<span
							v-for="line in sloganLines"
							:key="line"
							class="site-footer-title-line"
						>
							{{ line }}
						</span>
						<span
							class="site-footer-title-line site-footer-title-action-row"
						>
							<span class="site-footer-title-action-icon">
								<Icon :name="appIcons.arrowRight" aria-hidden="true" />
							</span>
							<span class="site-footer-title-action">
								<Button
									class="site-footer-cta"
									:as="NuxtLink"
									:to="contactRoute"
									variant="light"
									size="cta-lg"
								>
									Book a Call
								</Button>
							</span>
						</span>
					</p>

					<div class="site-footer-email">
						<p class="site-footer-email-label">Or write directly to</p>
						<div class="site-footer-item-text">
							<SiteNavLink
								:href="`mailto:${email}`"
								:label="email"
								size="inherit"
							/>
						</div>
					</div>
				</div>

				<div class="site-footer-side">
					<div class="site-footer-columns">
						<nav
							class="site-footer-column"
							aria-labelledby="site-footer-navigation"
						>
							<h2
								id="site-footer-navigation"
								class="site-footer-heading"
							>
								Navigation
							</h2>
							<ul class="site-footer-list site-footer-item-text">
								<li v-for="link in navigationLinks" :key="link.href">
									<SiteNavLink
										:href="link.href"
										:label="link.label"
										size="inherit"
									/>
								</li>
							</ul>
						</nav>

						<div class="site-footer-column">
							<h2 id="site-footer-socials" class="site-footer-heading">
								Social Media
							</h2>
							<ul
								class="site-footer-list site-footer-item-text"
								aria-labelledby="site-footer-socials"
							>
								<li v-for="link in socialLinks" :key="link.label">
									<SiteNavLink
										:href="link.href"
										:label="link.label"
										size="inherit"
									/>
								</li>
							</ul>
						</div>

						<div class="site-footer-column">
							<h2 class="site-footer-heading">Located in</h2>
							<div class="site-footer-headquarters">
								<p class="site-footer-location site-footer-item-text">
									{{ headquarters }}
								</p>
								<ClientOnly>
									<time
										class="site-footer-time"
										:datetime="armeniaDateTime"
									>
										{{ armeniaTime }}
									</time>
									<template #fallback>
										<span class="site-footer-time"
											>--:-- -- (GMT +4)</span
										>
									</template>
								</ClientOnly>
							</div>
							<nav class="site-footer-policy-links" aria-label="Legal">
								<ul class="site-footer-list site-footer-item-text">
									<li v-for="link in policyLinks" :key="link.href">
										<SiteNavLink
											:href="link.href"
											:label="link.label"
											size="inherit"
										/>
									</li>
								</ul>
							</nav>
						</div>
					</div>

					<div class="site-footer-bottom site-footer-item-text">
						<div class="site-footer-credits">
							<p>
								Website by
								<SiteNavLink
									:href="creditHref"
									label="Razo Codes"
									size="inherit"
									target="_blank"
								/>
							</p>
							<p>© 2026 All Rights Reserved</p>
							<p>byroose inc.</p>
						</div>

						<button
							ref="backToTop"
							class="site-footer-back-to-top"
							type="button"
							@click="scrollToTop"
						>
							Back to Top
							<span
								class="site-footer-back-to-top-icon"
								aria-hidden="true"
							>
								<span
									class="site-footer-back-to-top-glyph"
									data-arrow-swap-glyph
								>
									<Icon :name="appIcons.arrowUp" />
								</span>
								<span
									class="site-footer-back-to-top-glyph"
									data-arrow-swap-glyph-copy
								>
									<Icon :name="appIcons.arrowUp" />
								</span>
							</span>
						</button>
					</div>
				</div>
			</div>

			<div class="site-footer-brand">
				<NuxtImg
					class="site-footer-logo"
					src="/logo.svg"
					alt="byroose"
					width="680"
					height="192"
					format="svg"
					provider="none"
					loading="lazy"
				/>
			</div>
		</div>

		<div ref="footerShade" class="site-footer-shade" aria-hidden="true" />
	</footer>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-footer {
	@apply relative overflow-hidden bg-linear-to-b from-paper from-20% to-background text-paper-foreground;
}

.site-footer-content {
	@apply pt-16 pb-0 md:pt-20 xl:pt-24;
}

.site-footer-shade {
	@apply pointer-events-none absolute inset-0 bg-paper-foreground/40 opacity-0;
}

.site-footer-top {
	@apply grid gap-14 lg:grid-cols-2 lg:gap-8;
}

.site-footer-lead {
	@apply flex flex-col justify-between gap-16 md:gap-20;
	container-type: inline-size;
}

.site-footer-title {
	font-size: min(18cqi, 6.5rem);
}

.site-footer-title-line {
	@apply block;
}

.site-footer-title-action-row {
	@apply flex gap-[0.1em];
	width: 4.52em;
	margin-top: 0.2em;
}

.site-footer-title-action-icon {
	@apply grid shrink-0 place-items-center;
	width: max(2.75rem, 0.546em);
	height: max(2.75rem, 0.546em);
}

.site-footer-title-action-icon :deep(svg) {
	width: 100%;
	height: 100%;
}

.site-footer-title-action {
	@apply flex min-w-0 flex-1 tracking-normal;
	font-size: 0.78em;
	height: max(2.75rem, 0.7em);
}

.site-footer-cta {
	@apply h-full min-h-0 w-full;
	gap: 0.6em;
	padding-inline: 1em;
	font-size: max(0.25em, 0.875rem);
}

.site-footer-email {
	@apply flex flex-col items-start gap-0.5;
}

.site-footer-email-label {
	@apply m-0 text-base font-semibold tracking-[-0.03em] text-muted-foreground md:text-lg;
}

.site-footer-side {
	@apply flex flex-col justify-between gap-16 md:gap-20;
}

.site-footer-columns {
	@apply grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3;
}

.site-footer-column {
	@apply flex flex-col gap-4;
}

.site-footer-heading {
	@apply m-0 text-xl font-semibold tracking-[-0.03em] text-paper-foreground md:text-2xl;
}

.site-footer-item-text {
	@apply text-xl leading-tight font-semibold tracking-[-0.03em] md:text-2xl;
}

.site-footer-list {
	@apply m-0 flex list-none flex-col items-start gap-0.5 p-0;
}

.site-footer-location {
	@apply m-0;
}

.site-footer-headquarters {
	@apply flex flex-col gap-1;
}

.site-footer-time {
	@apply block text-base leading-tight font-semibold tracking-[-0.02em] md:text-lg;
}

.site-footer-policy-links {
	@apply mt-8;
}

.site-footer-bottom {
	@apply flex flex-wrap items-start justify-between gap-x-8 gap-y-6;
}

.site-footer-credits {
	@apply flex flex-col items-start gap-0.5;
}

.site-footer-back-to-top {
	@apply inline-flex cursor-pointer items-center gap-[0.25em] rounded-xs bg-transparent p-0 text-paper-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50;
}

.site-footer-back-to-top-icon {
	@apply grid size-[0.9em] overflow-hidden;
}

.site-footer-back-to-top-glyph {
	@apply col-start-1 row-start-1 grid place-items-center;
}

.site-footer-back-to-top-glyph :deep(svg) {
	@apply size-full;
}

.site-footer-back-to-top-glyph[data-arrow-swap-glyph-copy] {
	transform: translateY(100%);
}

.site-footer-credits p {
	@apply m-0;
}

.site-footer-brand {
	@apply mt-16 overflow-hidden md:mt-24 xl:mt-32;
	aspect-ratio: 680 / 128;
}

.site-footer-logo {
	@apply block h-auto w-full;
}
</style>
