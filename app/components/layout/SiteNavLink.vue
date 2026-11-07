<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const {
	href,
	label,
	size = 'lg',
} = defineProps<{
	href: string
	label: string
	size?: 'lg' | 'inherit'
}>()

const link = useTemplateRef<ComponentPublicInstance>('link')

useNavLinkMotion(link)
</script>

<template>
	<NuxtLink
		ref="link"
		class="site-nav-link"
		:class="size === 'lg' && 'site-nav-link-lg'"
		:to="href"
	>
		<span class="site-nav-link-mask">
			<span class="site-nav-link-label" data-nav-label>{{ label }}</span>
			<span
				class="site-nav-link-label site-nav-link-label-copy"
				data-nav-label-copy
				aria-hidden="true"
			>
				{{ label }}
			</span>
		</span>
		<span class="site-nav-link-line" data-nav-line aria-hidden="true" />
	</NuxtLink>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-nav-link {
	@apply relative inline-grid rounded-xs py-[0.15em] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50;
}

.site-nav-link-lg {
	@apply text-lg font-semibold;
}

.site-nav-link-mask {
	@apply grid overflow-clip leading-[1.25];
}

.site-nav-link-label {
	@apply block whitespace-nowrap;
	grid-area: 1 / 1;
}

.site-nav-link-label-copy {
	@apply text-primary;
	transform: translateY(100%);
}

.site-nav-link-line {
	@apply pointer-events-none absolute top-full left-0 h-px w-full bg-primary;
	transform: scaleX(0);
	transform-origin: 50% 50%;
}
</style>
