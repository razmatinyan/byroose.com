<script setup lang="ts">
import { computed } from 'vue'
import SiteCookieBanner from '@/components/layout/SiteCookieBanner.vue'
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
		<SiteHeader data-home-intro-header data-page-transition-header />
		<main>
			<slot />
		</main>
		<SiteFooter data-page-transition-follow />
		<div
			data-page-transition-shade
			class="page-transition-shade"
			aria-hidden="true"
		/>
		<SiteCookieBanner v-if="layoutIntroState === 'complete'" />
	</div>
</template>

<style scoped>
@reference '../assets/css/tailwind.css';

.page-transition-shade {
	@apply pointer-events-none invisible fixed inset-0 z-10 bg-foreground opacity-0;
}

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
