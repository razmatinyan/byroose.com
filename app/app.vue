<script setup lang="ts">
const pageTransition = usePageTransitionMotion()
const { pageKey } = usePageTransition()
</script>

<template>
	<NuxtRouteAnnouncer />
	<NuxtLayout>
		<NuxtPage :transition="pageTransition" :page-key="pageKey" />
	</NuxtLayout>
</template>
