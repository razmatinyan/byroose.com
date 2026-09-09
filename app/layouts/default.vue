<script setup lang="ts">
import { computed } from 'vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'

const route = useRoute()
const homeIntroState = useHomeIntroState()
const layoutIntroState = computed(() =>
	route.path === '/' ? homeIntroState.value : 'complete',
)
</script>

<template>
	<div class="site-layout" :data-home-intro-state="layoutIntroState">
		<SiteHeader data-home-intro-header />
		<main>
			<slot />
		</main>
		<SiteFooter />
	</div>
</template>

<style scoped>
.site-layout:not([data-home-intro-state='complete'])
	:deep([data-home-intro-header]) {
	visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
	.site-layout:not([data-home-intro-state='complete'])
		:deep([data-home-intro-header]) {
		visibility: inherit;
	}
}
</style>
