<script setup lang="ts">
import { NuxtLink } from "#components";
import { Button, ButtonIcon } from "@/components/ui/button";

const { href } = defineProps<{
   href: string;
}>();
</script>

<template>
   <div class="article-cta">
      <Button :as="NuxtLink" :to="href" size="cta-lg" variant="dark">
         <slot mdc-unwrap="p" />
         <template #icon>
            <ButtonIcon />
         </template>
      </Button>
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.article-cta {
   @apply my-10 flex;
}
</style>
