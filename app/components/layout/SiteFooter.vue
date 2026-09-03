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
			<img class="site-footer-logo" src="/logo.svg" alt="byroose">
			<div class="site-footer-legal">
				<span>© 2026 byroose</span>
				<span>Terms &amp; conditions · Privacy</span>
			</div>
		</div>
	</footer>
</template>
