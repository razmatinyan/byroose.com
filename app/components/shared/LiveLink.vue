<script setup lang="ts">
import ArrowLink from "./ArrowLink.vue";

const { href, label = "Visit Live Website" } = defineProps<{
   href: string;
   label?: string;
}>();
</script>

<template>
   <ArrowLink :to="href" :label="label" external />
</template>
