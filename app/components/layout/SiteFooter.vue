<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from "vue";
import { useNow } from "@vueuse/core";
import { NuxtLink } from "#components";
import SiteNavLink from "@/components/layout/SiteNavLink.vue";
import SplitText from "@/components/shared/SplitText.vue";
import { Button } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import type { SplitTextResult } from "@/lib/split-text";

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

interface SloganSegment {
	text: string;
}

const sloganLines: SloganSegment[][] = [
	[{ text: "From" }, { text: "seen" }],
	[{ text: "to" }, { text: "chosen" }],
];
const sloganSegmentCount = sloganLines.flat().length;

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
const titleSplits = shallowRef<(SplitTextResult | undefined)[]>(
	Array.from({ length: sloganSegmentCount }, () => undefined),
);

useFooterMotion(footerRoot, titleSplits);

function getSplitIndex(lineIndex: number, segmentIndex: number) {
	return sloganLines.slice(0, lineIndex).flat().length + segmentIndex;
}

function setTitleSplit(index: number, parts: SplitTextResult) {
	titleSplits.value = titleSplits.value.with(index, parts);
}
</script>

<template>
	<footer ref="footerRoot" class="site-footer section-gutter">
		<div class="site-footer-top" data-footer-reveal>
			<div class="site-footer-lead">
				<p class="section-title site-footer-title">
					<span
						v-for="(line, lineIndex) in sloganLines"
						:key="lineIndex"
						class="site-footer-title-line"
					>
						<template
							v-for="(segment, segmentIndex) in line"
							:key="segment.text"
						>
							{{ segmentIndex ? " " : "" }}
							<SplitText
								class="site-footer-title-segment"
								aria="none"
								mask="words"
								:text="segment.text"
								@split="
									setTitleSplit(
										getSplitIndex(lineIndex, segmentIndex),
										$event,
									)
								"
							/>
						</template>
					</span>
					<span
						class="site-footer-title-line site-footer-title-action-row"
					>
						<span
							class="site-footer-title-action-icon"
							data-footer-rise-mask
						>
							<span
								class="site-footer-title-action-icon-rise"
								data-footer-rise="title"
							>
								<Icon :name="appIcons.arrowRight" aria-hidden="true" />
							</span>
						</span>
						<span class="site-footer-title-action" data-footer-rise-mask>
							<span
								class="site-footer-title-action-rise"
								data-footer-rise="title"
							>
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
					</span>
				</p>

				<div class="site-footer-email">
					<div data-footer-rise-mask>
						<p class="site-footer-email-label" data-footer-rise>
							Or write directly to
						</p>
					</div>
					<div class="site-footer-item-text" data-footer-rise-mask>
						<SiteNavLink
							:href="`mailto:${email}`"
							:label="email"
							size="inherit"
							data-footer-rise
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
						<div data-footer-rise-mask>
							<h2
								id="site-footer-navigation"
								class="site-footer-heading"
								data-footer-rise
							>
								Navigation
							</h2>
						</div>
						<ul class="site-footer-list site-footer-item-text">
							<li
								v-for="link in navigationLinks"
								:key="link.href"
								data-footer-rise-mask
							>
								<SiteNavLink
									:href="link.href"
									:label="link.label"
									size="inherit"
									data-footer-rise
								/>
							</li>
						</ul>
					</nav>

					<div class="site-footer-column">
						<div data-footer-rise-mask>
							<h2
								id="site-footer-socials"
								class="site-footer-heading"
								data-footer-rise
							>
								Socials
							</h2>
						</div>
						<ul
							class="site-footer-list site-footer-item-text"
							aria-labelledby="site-footer-socials"
						>
							<li
								v-for="link in socialLinks"
								:key="link.label"
								data-footer-rise-mask
							>
								<SiteNavLink
									:href="link.href"
									:label="link.label"
									size="inherit"
									data-footer-rise
								/>
							</li>
						</ul>
					</div>

					<div class="site-footer-column">
						<div data-footer-rise-mask>
							<h2 class="site-footer-heading" data-footer-rise>
								Located in
							</h2>
						</div>
						<div data-footer-rise-mask>
							<div class="site-footer-headquarters" data-footer-rise>
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
						</div>
						<nav class="site-footer-policy-links" aria-label="Legal">
							<ul class="site-footer-list site-footer-item-text">
								<li
									v-for="link in policyLinks"
									:key="link.href"
									data-footer-rise-mask
								>
									<SiteNavLink
										:href="link.href"
										:label="link.label"
										size="inherit"
										data-footer-rise
									/>
								</li>
							</ul>
						</nav>
					</div>
				</div>

				<div class="site-footer-credits site-footer-item-text">
					<div data-footer-rise-mask>
						<p data-footer-rise>
							Website by
							<SiteNavLink
								:href="creditHref"
								label="Razo Codes"
								size="inherit"
								target="_blank"
							/>
						</p>
					</div>
					<div data-footer-rise-mask>
						<p data-footer-rise>© 2026 All Rights Reserved</p>
					</div>
					<div data-footer-rise-mask>
						<p data-footer-rise>byroose inc.</p>
					</div>
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
	</footer>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-footer {
	@apply bg-paper pt-16 pb-0 text-paper-foreground md:pt-20 xl:pt-24;
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

.site-footer-title-action-row {
	@apply flex gap-[0.1em];
	width: 4.52em;
	margin-top: 0.2em;
}

.site-footer-title-action-icon {
	@apply flex shrink-0;
	width: max(2.75rem, 0.546em);
	height: max(2.75rem, 0.546em);
}

.site-footer-title-action-icon-rise {
	@apply grid size-full place-items-center;
}

.site-footer-title-action-icon-rise :deep(svg) {
	width: 100%;
	height: 100%;
}

.site-footer-title-action {
	@apply flex min-w-0 flex-1 tracking-normal;
	font-size: 0.78em;
	height: max(2.75rem, 0.7em);
}

.site-footer-title-action-rise {
	@apply flex h-full w-full;
}

.site-footer-cta {
	@apply h-full min-h-0 w-full bg-background text-foreground;
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

.site-footer-credits {
	@apply flex flex-col items-start gap-0.5;
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

.site-footer-title-segment:not(:has(.split-text-word)) {
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
	.site-footer-title-segment:not(:has(.split-text-word)) {
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
