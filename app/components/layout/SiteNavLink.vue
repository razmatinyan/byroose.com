<script setup lang="ts">
import { useTemplateRef } from 'vue'

const { href, label } = defineProps<{
	href: string
	label: string
}>()

const link = useTemplateRef<HTMLAnchorElement>('link')

useHoverBounce(link, { press: true })
useHoverRollover(link, { speed: 1.4 })
</script>

<template>
	<a ref="link" class="site-nav-link" :href="href">
		<span
			class="site-nav-link-layers"
			data-rollover-layers
			aria-hidden="true"
		>
			<span
				class="site-nav-link-layer surface-pink"
				data-rollover-layer
			/>
			<span
				class="site-nav-link-layer surface-orange"
				data-rollover-layer
			/>
			<span
				class="site-nav-link-layer surface-dark"
				data-rollover-layer
			/>
		</span>
		<span class="site-nav-link-texts" data-rollover-texts>
			<span class="site-nav-link-label" data-rollover-label>{{
				label
			}}</span>
			<span
				class="site-nav-link-label site-nav-link-label-copy text-primary-foreground"
				data-rollover-label-copy
				aria-hidden="true"
			>
				{{ label }}
			</span>
		</span>
	</a>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-nav-link {
	--site-nav-link-radius: calc(var(--radius) * 0.8);
	@apply relative inline-flex items-center justify-center overflow-hidden px-3 py-2.5 text-base font-medium text-foreground xl:px-4;
	border-radius: var(--site-nav-link-radius);
	clip-path: inset(0 round var(--site-nav-link-radius));
}

.site-nav-link:focus-visible {
	clip-path: none;
}

.site-nav-link-layers {
	@apply pointer-events-none absolute inset-0;
	border-radius: inherit;
}

.site-nav-link-layer {
	@apply absolute -inset-px;
	border-radius: inherit;
	transform: translateY(100%);
}

.site-nav-link-texts {
	@apply relative grid items-center;
}

.site-nav-link-label {
	--rollover-text-angle: 0deg;
	--rollover-text-y: 0em;
	display: block;
	grid-area: 1 / 1;
	rotate: 1 1 0.45 var(--rollover-text-angle);
	transform-origin: 0 0;
	translate: 0 var(--rollover-text-y) 0;
	will-change: translate, rotate, opacity, color;
}

.site-nav-link-label-copy {
	--rollover-text-angle: -30deg;
	--rollover-text-y: 2em;
	opacity: 0;
	rotate: 1 1 0.5 var(--rollover-text-angle);
	transform-origin: top right;
}
</style>
