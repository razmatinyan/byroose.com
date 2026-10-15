<script setup lang="ts">
import ContactPage from "@/components/contact/ContactPage.vue";
import { pageSeo } from "@/lib/page-seo";

usePageSeo(pageSeo.contact);
</script>

<template>
	<ContactPage />
</template>
