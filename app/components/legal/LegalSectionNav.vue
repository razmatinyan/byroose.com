<script setup lang="ts">
export interface LegalSection {
   id: string;
   title: string;
}

const { label, sections, activeId } = defineProps<{
   label: string;
   sections: readonly LegalSection[];
   activeId: string;
}>();
</script>

<template>
   <nav class="legal-nav" :aria-label="label">
      <p class="legal-nav-title">On this page</p>
      <ol class="legal-nav-list">
         <li v-for="section in sections" :key="section.id">
            <a
               class="legal-nav-link"
               :href="`#${section.id}`"
               :aria-current="section.id === activeId ? 'location' : undefined"
            >
               {{ section.title }}
            </a>
         </li>
      </ol>
   </nav>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.legal-nav {
   @apply flex flex-col gap-5 lg:sticky lg:top-28;
}

.legal-nav-title {
   @apply text-lg font-semibold tracking-[-0.02em] text-foreground;
}

.legal-nav-list {
   @apply m-0 flex list-none flex-col border-s border-foreground/15 p-0;
}

.legal-nav-link {
   @apply relative block py-1 ps-5 text-base leading-snug font-medium tracking-[-0.01em] text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none;
}

.legal-nav-link::before {
   @apply absolute inset-y-1 -start-px w-0.5 origin-center scale-y-0 rounded-full bg-primary transition-transform duration-300 content-[''] motion-reduce:transition-none;
}

.legal-nav-link[aria-current] {
   @apply text-foreground;
}

.legal-nav-link[aria-current]::before {
   @apply scale-y-100;
}
</style>
