<script setup lang="ts">
import LegalPage from "@/components/legal/LegalPage.vue";
import SiteErrorView from "@/components/layout/SiteErrorView.vue";
import { pageSeo } from "@/lib/page-seo";

const { data: policy } = await useAsyncData("legal-privacy", () =>
   queryCollection("legal").path(pageSeo.privacy.path).first(),
);

if (policy.value) {
   usePageSeo(pageSeo.privacy);
} else {
   const event = useRequestEvent();
   if (event) setResponseStatus(event, 404);
}
</script>

<template>
   <LegalPage v-if="policy" :document="policy" title-size="16.6cqi" />
   <SiteErrorView v-else />
</template>
