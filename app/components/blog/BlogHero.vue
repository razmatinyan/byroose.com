<script setup lang="ts">
import ListingHero from "@/components/shared/ListingHero.vue";

const titleWords = ["Our", "Blog"] as const;
const description =
   "Practical thinking on AI content creation, web development, and turning attention into action.";
</script>

<template>
   <ListingHero :title-words="titleWords" :description="description" />
</template>
