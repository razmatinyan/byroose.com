<script setup lang="ts">
import type { NuxtError } from "#app";
import SiteErrorView from "@/components/layout/SiteErrorView.vue";

const { error } = defineProps<{
   error: NuxtError;
}>();
</script>

<template>
   <NuxtLayout>
      <SiteErrorView :status-code="error.statusCode || 500" clears-error />
   </NuxtLayout>
</template>
