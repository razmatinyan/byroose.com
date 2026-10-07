<script setup lang="ts">
const pageTransition = usePageTransitionMotion()
</script>

<template>
	<NuxtRouteAnnouncer />
	<NuxtLayout>
		<NuxtPage :transition="pageTransition" />
	</NuxtLayout>
</template>
