<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import type { LegalCollectionItem } from "@nuxt/content";
import ListingHero from "@/components/shared/ListingHero.vue";
import { formatPublishDate } from "@/lib/utils";
import LegalSectionNav from "./LegalSectionNav.vue";
import type { LegalSection } from "./LegalSectionNav.vue";

const { document, titleSize } = defineProps<{
   document: LegalCollectionItem;
   titleSize?: string;
}>();

const titleWords = computed(() => document.title.split(" "));
const sections = computed<LegalSection[]>(() =>
   (document.body.toc?.links ?? []).map((link) => ({
      id: link.id,
      title: link.text,
   })),
);
const sectionIds = computed(() => sections.value.map((section) => section.id));

const body = useTemplateRef<HTMLElement>("body");
const { activeId } = useActiveSection(body, sectionIds);
</script>

<template>
   <div class="legal-page">
      <ListingHero
         :title-words="titleWords"
         :title-size="titleSize"
         :description="document.description"
      />

      <section class="legal-document section-gutter">
         <div class="legal-layout">
            <aside class="legal-aside">
               <LegalSectionNav
                  :label="`${document.title} sections`"
                  :sections="sections"
                  :active-id="activeId"
               />
            </aside>

            <div ref="body" class="legal-content">
               <p class="legal-updated">
                  Last updated
                  <time :datetime="document.updated">{{
                     formatPublishDate(document.updated)
                  }}</time>
               </p>
               <ContentRenderer :value="document" class="legal-body" />
            </div>
         </div>
      </section>
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.legal-page {
   @apply relative overflow-x-clip;
}

.legal-document {
   @apply relative z-10 rounded-t-[clamp(1.5rem,3vw,3rem)] bg-canvas-shade py-section text-canvas-shade-foreground;
}

.legal-layout {
   @apply grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-8;
}

.legal-aside {
   @apply lg:col-span-3;
}

.legal-content {
   @apply min-w-0 lg:col-span-8 lg:col-start-5 xl:col-span-7 xl:col-start-5;
}

.legal-updated {
   @apply mb-12 text-base font-medium text-muted-foreground;
}

.legal-body {
   @apply text-lg leading-relaxed font-medium text-brand-subtle md:text-xl;
}

.legal-body :deep(h2) {
   @apply mt-16 mb-6 scroll-mt-28 border-t border-foreground/15 pt-12 text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance text-foreground md:text-4xl;
}

.legal-body :deep(h2:first-child) {
   @apply mt-0 border-t-0 pt-0;
}

.legal-body :deep(h3) {
   @apply mt-10 mb-4 text-2xl leading-snug font-semibold tracking-[-0.02em] text-foreground;
}

.legal-body :deep(:is(h2, h3) a) {
   @apply text-inherit no-underline;
}

.legal-body :deep(p) {
   @apply mb-5;
}

.legal-body :deep(ul) {
   @apply mb-6 flex list-disc flex-col gap-2 ps-6;
}

.legal-body :deep(li::marker) {
   @apply text-foreground/40;
}

.legal-body :deep(strong) {
   @apply font-semibold text-foreground;
}

.legal-body :deep(:is(p, li) a) {
   @apply font-medium text-foreground underline underline-offset-4 hover:text-primary;
}
</style>
