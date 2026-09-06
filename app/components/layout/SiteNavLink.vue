<script setup lang="ts">
import { useTemplateRef } from 'vue'

const { href, label } = defineProps<{
	href: string
	label: string
}>()

const link = useTemplateRef<HTMLAnchorElement>('link')

useHoverRollover(link, { speed: 1.4 })
</script>

<template>
	<a ref="link" class="site-nav-link" :href="href">
		<span class="site-nav-link-label" data-rollover-label>{{ label }}</span>
		<span
			class="site-nav-link-layer surface-pink"
			data-rollover-layer
			aria-hidden="true"
		/>
		<span
			class="site-nav-link-layer surface-orange"
			data-rollover-layer
			aria-hidden="true"
		/>
		<span
			class="site-nav-link-layer surface-dark"
			data-rollover-layer
			aria-hidden="true"
		>
			<span class="site-nav-link-label">{{ label }}</span>
		</span>
	</a>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-nav-link {
	@apply relative inline-flex items-center justify-center overflow-hidden rounded-md px-3 py-2.5 text-base font-medium text-foreground xl:px-4;
}

.site-nav-link-label {
	@apply inline-flex items-center;
}

.site-nav-link-layer {
	@apply absolute inset-0 flex items-center justify-center;
	border-radius: inherit;
	padding: inherit;
	transform: translateY(100%);
}
</style>
