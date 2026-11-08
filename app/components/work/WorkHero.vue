<script setup lang="ts">
import ListingHero from "@/components/shared/ListingHero.vue";

const titleWords = ["Case", "studies"] as const;
const description =
   "Our studio projects and tools, each one a test of the pipeline behind our client work: AI content that stops the scroll and websites built from scratch.";
</script>

<template>
   <ListingHero
      :title-words="titleWords"
      :description="description"
      title-size="18.13cqi"
   />
</template>
