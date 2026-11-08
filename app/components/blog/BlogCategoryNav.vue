<script setup lang="ts">
import { NuxtLink } from "#components";
import { Button } from "@/components/ui/button";
import { blogCategoryLinks } from "@/lib/blog-categories";

const { activePath } = defineProps<{
   activePath: string;
}>();

const navLabel = "Blog categories";

function isActive(path: string) {
   return path === activePath;
}
</script>

<template>
   <nav class="blog-category-nav" :aria-label="navLabel">
      <div
         v-for="link in blogCategoryLinks"
         :key="link.path"
         class="blog-category-nav-mask"
         data-blog-cta-mask
      >
         <span class="blog-category-nav-rise" data-blog-cta>
            <Button
               class="blog-category-nav-link"
               :as="NuxtLink"
               :to="link.path"
               :variant="isActive(link.path) ? 'dark' : 'outline'"
               size="cta-lg"
               :rollover="false"
               :aria-current="isActive(link.path) ? 'page' : undefined"
               :data-active="isActive(link.path) || undefined"
            >
               {{ link.label }}
            </Button>
         </span>
      </div>
   </nav>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.blog-category-nav {
   @apply flex flex-wrap gap-2 md:justify-end;
}

.blog-category-nav-rise {
   @apply block;
}

.blog-category-nav-link {
   @apply h-15 min-h-15 border-2 border-foreground px-8 text-2xl;
   --radius-sm: 9999px;
}

.blog-category-nav-link:not([data-active]) {
   @apply bg-transparent;
}

@media (hover: hover) {
   .blog-category-nav-link:hover {
      @apply bg-foreground text-primary-foreground;
   }
}
</style>
