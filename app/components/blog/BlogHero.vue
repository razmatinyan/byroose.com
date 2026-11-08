<script setup lang="ts">
import ListingHero from "@/components/shared/ListingHero.vue";

const {
   titleWords = ["Our", "Blog"],
   titleSize = "27.15cqi",
   description = "What we're learning about AI content that stops the scroll, websites that keep people, and the numbers in between.",
} = defineProps<{
   titleWords?: readonly string[];
   titleSize?: string;
   description?: string;
}>();
</script>

<template>
   <ListingHero
      :title-words="titleWords"
      :title-size="titleSize"
      :description="description"
   />
</template>
