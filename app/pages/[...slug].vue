<script setup lang="ts">
import SiteErrorView from "@/components/layout/SiteErrorView.vue";

const event = useRequestEvent();
if (event) setResponseStatus(event, 404);
</script>

<template>
   <SiteErrorView />
</template>
