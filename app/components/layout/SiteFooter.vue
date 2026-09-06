<script setup lang="ts">
import { computed } from 'vue'

interface FooterLink {
	href: string
	label: string
}

interface FooterGroup {
	heading: string
	lines?: string[]
	links?: FooterLink[]
}

const defaultGroups: FooterGroup[] = [
	{
		heading: 'Contact',
		lines: ['hello@byroose.com', '+31 6 22 41 08'],
	},
	{
		heading: 'Studio',
		lines: ['Havenstraat 14', '1013 AL Amsterdam'],
	},
	{
		heading: 'Menu',
		links: [
			{ href: '#services', label: 'Services' },
			{ href: '#work', label: 'Work' },
			{ href: '#courses', label: 'Courses' },
			{ href: '#faq', label: 'FAQ' },
		],
	},
	{
		heading: 'Follow',
		links: [
			{ href: '#contact', label: 'LinkedIn' },
			{ href: '#contact', label: 'Instagram' },
			{ href: '#contact', label: 'YouTube' },
		],
	},
]

const { groups } = defineProps<{
	groups?: FooterGroup[]
}>()

const resolvedGroups = computed(() => groups ?? defaultGroups)
</script>

<template>
	<footer class="site-footer">
		<div class="site-footer-grid section-gutter">
			<div v-for="group in resolvedGroups" :key="group.heading">
				<div class="site-footer-heading">{{ group.heading }}</div>
				<p v-if="group.lines" class="site-footer-copy">
					<template v-for="(line, index) in group.lines" :key="line">
						<br v-if="index">
						{{ line }}
					</template>
				</p>
				<nav v-else-if="group.links" class="site-footer-links" :aria-label="`${group.heading} links`">
					<a v-for="link in group.links" :key="link.label" class="site-footer-link" :href="link.href">
						{{ link.label }}
					</a>
				</nav>
			</div>
		</div>

		<div class="site-footer-brand section-gutter">
			<NuxtImg
				class="site-footer-logo"
				src="/logo.svg"
				alt="byroose"
				width="651"
				height="187"
				format="svg"
				loading="lazy"
			/>
			<div class="site-footer-legal">
				<span>© 2026 byroose</span>
				<span>Terms &amp; conditions · Privacy</span>
			</div>
		</div>
	</footer>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-footer {
	@apply bg-foreground pt-10 pb-7 text-background md:pt-14 xl:pt-18;
}

.site-footer-grid {
	@apply grid w-full grid-cols-2 gap-8 lg:grid-cols-4;
}

.site-footer-heading {
	@apply text-sm font-semibold text-primary;
}

.site-footer-copy {
	@apply mt-3 mb-0 text-sm leading-relaxed text-white/80 sm:text-base;
}

.site-footer-links {
	@apply mt-3 flex flex-col gap-2 text-sm sm:text-base;
}

.site-footer-link {
	@apply text-white/80 transition-colors hover:text-primary;
}

.site-footer-brand {
	@apply mt-9 md:mt-14 xl:mt-18;
}

.site-footer-logo {
	@apply block h-auto w-full invert;
}

.site-footer-legal {
	@apply mt-5 flex flex-wrap justify-between gap-3 text-xs tracking-[0.04em] text-white/65;
}
</style>
