<script setup lang="ts">
import ListingHero from "@/components/shared/ListingHero.vue";

const titleWords = ["Our", "Work"] as const;
const description =
   "Reels that stop the scroll. Visuals directed like a shoot. Websites designed and coded from scratch. The proof is in our projects.";
</script>

<template>
   <ListingHero :title-words="titleWords" :description="description" />
</template>
