<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from "vue";
import PricingCard from "@/components/cards/PricingCard.vue";
import SplitText from "@/components/shared/SplitText.vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pricingCategories } from "@/lib/pricing";
import type { PricingCategoryId } from "@/lib/pricing";
import type { SplitTextResult } from "@/lib/split-text";

const title = "Plans and pricing";
const description =
   "Start with content, the website, or both. Every package has one fixed price, and we confirm the exact scope after one call.";
const switcherLabel = "Pricing by service";

const pricingRoot = useTemplateRef<HTMLElement>("pricingRoot");
const activeCategory = shallowRef<PricingCategoryId>("ai-content");
const hoveredIndex = shallowRef<number | null>(null);
const titleSplit = shallowRef<SplitTextResult>();
const descriptionSplit = shallowRef<SplitTextResult>();

const activeIndex = computed(() =>
   pricingCategories.findIndex(({ id }) => id === activeCategory.value),
);
const switcherStyle = computed(() => ({
   "--pricing-tab-count": pricingCategories.length,
   "--pricing-tab-active": activeIndex.value,
   "--pricing-tab-hover": hoveredIndex.value ?? activeIndex.value,
}));

usePricingMotion(pricingRoot, {
   descriptionSplit,
   titleSplit,
});

function isPricingCategory(value: unknown): value is PricingCategoryId {
   return pricingCategories.some(({ id }) => id === value);
}

function selectCategory(value: unknown) {
   if (isPricingCategory(value)) activeCategory.value = value;
}

function startHover(index: number, event: PointerEvent) {
   if (event.pointerType !== "mouse") return;
   hoveredIndex.value = index;
}

function endHover() {
   hoveredIndex.value = null;
}

function setTitleSplit(parts: SplitTextResult) {
   titleSplit.value = parts;
}

function setDescriptionSplit(parts: SplitTextResult) {
   descriptionSplit.value = parts;
}
</script>

<template>
   <section id="pricing" ref="pricingRoot" class="pricing section-gutter">
      <div class="pricing-heading" data-pricing-heading>
         <SplitText
            class="section-title pricing-title"
            as="h2"
            mask="words"
            :text="title"
            type="words"
            @split="setTitleSplit"
         />
         <SplitText
            class="pricing-description"
            as="p"
            mask="lines"
            :text="description"
            type="lines"
            @split="setDescriptionSplit"
         />
      </div>

      <Tabs
         class="pricing-tabs"
         :model-value="activeCategory"
         :unmount-on-hide="false"
         @update:model-value="selectCategory"
      >
         <div class="pricing-switcher-frame" data-pricing-reveal>
            <TabsList
               class="pricing-switcher"
               :style="switcherStyle"
               :aria-label="switcherLabel"
               @pointerleave="endHover"
            >
               <span
                  class="pricing-switcher-pill pricing-switcher-hover"
                  :data-visible="hoveredIndex !== null || undefined"
                  aria-hidden="true"
               />
               <span
                  class="pricing-switcher-pill pricing-switcher-active"
                  aria-hidden="true"
               />
               <TabsTrigger
                  v-for="(category, index) in pricingCategories"
                  :key="category.id"
                  class="pricing-switcher-tab"
                  :value="category.id"
                  @pointerenter="startHover(index, $event)"
               >
                  {{ category.label }}
               </TabsTrigger>
            </TabsList>
         </div>

         <div class="pricing-panels" data-pricing-panels>
            <TabsContent
               v-for="category in pricingCategories"
               :key="category.id"
               class="pricing-panel"
               :value="category.id"
               data-pricing-panel
            >
               <ul class="pricing-grid">
                  <li
                     v-for="(plan, index) in category.plans"
                     :key="plan.id"
                     class="pricing-grid-item"
                  >
                     <PricingCard
                        :plan="plan"
                        :previous-plan-name="category.plans[index - 1]?.name"
                     />
                  </li>
               </ul>
            </TabsContent>
         </div>
      </Tabs>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.pricing {
   @apply flex w-full flex-col items-center;
   padding-top: calc(var(--spacing-section) * 2.5);
}

.pricing-heading {
   @apply flex flex-col items-center text-center;
}

.pricing-title {
   @apply leading-[0.92] tracking-[-0.05em] text-balance;
}

.pricing-title :deep(.split-text-word),
.pricing-title :deep(.split-text-word-mask) {
   display: inline-block;
}

.pricing-title :deep(.split-text-word-mask) {
   margin-block: -0.25em;
   padding-block: 0.25em;
}

.pricing-title :deep(.split-text-word) {
   visibility: hidden;
}

.pricing-description {
   @apply m-0 mt-6 max-w-[44ch] text-base leading-snug font-medium text-current/70 md:mt-8 md:text-lg;
}

.pricing-description :deep(.split-text-line),
.pricing-description :deep(.split-text-line-mask) {
   display: block;
}

.pricing-description :deep(.split-text-line) {
   visibility: hidden;
}

.pricing-tabs {
   @apply mt-10 w-full items-center gap-10 md:mt-12 md:gap-14;
}

.pricing-switcher-frame {
   @apply w-full md:w-auto;
   visibility: hidden;
}

.pricing-switcher {
   --pricing-switcher-inset: 0.25rem;
   @apply relative grid h-auto w-full auto-cols-fr grid-flow-col rounded-full bg-canvas-shade p-(--pricing-switcher-inset) md:w-auto;
}

.pricing-switcher-pill {
   @apply pointer-events-none absolute rounded-full;
   inset-block: var(--pricing-switcher-inset);
   left: var(--pricing-switcher-inset);
   width: calc(
      (100% - var(--pricing-switcher-inset) * 2) / var(--pricing-tab-count)
   );
   transition:
      translate 0.55s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.3s ease;
}

.pricing-switcher-hover {
   @apply bg-foreground/8 opacity-0;
   translate: calc(var(--pricing-tab-hover) * 100%) 0;
}

.pricing-switcher-hover[data-visible] {
   @apply opacity-100;
}

.pricing-switcher-active {
   @apply bg-foreground;
   translate: calc(var(--pricing-tab-active) * 100%) 0;
}

.pricing-switcher :deep(.pricing-switcher-tab) {
   @apply relative min-h-11 rounded-full bg-transparent px-3 py-2 text-sm leading-tight font-semibold whitespace-normal text-balance text-foreground/65 transition-colors duration-300 hover:text-foreground md:min-h-13 md:px-7 md:text-base md:whitespace-nowrap;
}

.pricing-switcher :deep(.pricing-switcher-tab[data-state="active"]) {
   @apply bg-transparent text-background;
}

.pricing-panels {
   @apply mx-auto w-full max-w-xl pt-3 lg:max-w-7xl;
}

.pricing-grid {
   @apply m-0 grid list-none grid-cols-1 gap-8 p-0 lg:grid-cols-3 lg:gap-6;
}

.pricing-grid-item {
   @apply min-w-0;
}

@media (min-width: 64rem) {
   .pricing-grid-item {
      grid-row: span 4;
      grid-template-rows: subgrid;
      @apply grid gap-y-0;
   }
}

.pricing-grid :deep([data-pricing-card]) {
   visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
   .pricing-switcher-pill {
      transition: none;
   }

   .pricing-title :deep(.split-text-word),
   .pricing-description :deep(.split-text-line),
   .pricing-switcher-frame,
   .pricing-grid :deep([data-pricing-card]) {
      visibility: inherit;
   }
}
</style>
