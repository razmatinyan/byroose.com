<script setup lang="ts">
import LandingPage from '@/components/landing/LandingPage.vue'
import { pageSeo } from '@/lib/page-seo'

usePageSeo(pageSeo.home)
</script>

<template>
	<LandingPage />
</template>
