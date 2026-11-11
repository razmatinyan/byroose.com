<script setup lang="ts">
import { computed, shallowRef } from "vue";
import PricingCard from "@/components/cards/PricingCard.vue";
import PricingFlexibleCard from "@/components/cards/PricingFlexibleCard.vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pricingCategories } from "@/lib/pricing";
import type { PricingCategoryId } from "@/lib/pricing";

const { defaultCategory = "ai-content", clearCurve = true } = defineProps<{
   defaultCategory?: PricingCategoryId;
   clearCurve?: boolean;
}>();

const title = "Plans and pricing";
const description =
   "Start with content, the website, or both services together. Every package has one fixed price, and we confirm the exact scope after one call.";
const switcherLabel = "Pricing by service";

const activeCategory = shallowRef<PricingCategoryId>(defaultCategory);
const hoveredIndex = shallowRef<number | null>(null);

const activeIndex = computed(() =>
   pricingCategories.findIndex(({ id }) => id === activeCategory.value),
);
const switcherStyle = computed(() => ({
   "--pricing-tab-count": pricingCategories.length,
   "--pricing-tab-active": activeIndex.value,
   "--pricing-tab-hover": hoveredIndex.value ?? activeIndex.value,
}));

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
</script>

<template>
   <section
      id="pricing"
      class="pricing section-gutter"
      :data-clear-curve="clearCurve || undefined"
   >
      <div class="pricing-heading">
         <h2 class="pricing-title">{{ title }}</h2>
         <p class="pricing-description">{{ description }}</p>
      </div>

      <Tabs
         class="pricing-tabs"
         :model-value="activeCategory"
         :unmount-on-hide="false"
         @update:model-value="selectCategory"
      >
         <div class="pricing-switcher-frame">
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

         <div class="pricing-panels">
            <TabsContent
               v-for="category in pricingCategories"
               :key="category.id"
               class="pricing-panel"
               :value="category.id"
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

            <PricingFlexibleCard class="pricing-flexible-card" />
         </div>
      </Tabs>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.pricing {
   @apply flex w-full flex-col items-center;
}

.pricing[data-clear-curve] {
   padding-top: calc(var(--spacing-section) * 2.5);
}

.pricing-heading {
   @apply flex flex-col items-center text-center;
}

.pricing-title {
   @apply m-0 text-display leading-[0.95] font-medium tracking-[-0.06em] text-balance;
}

.pricing-description {
   @apply m-0 mt-8 max-w-[44ch] text-base leading-snug font-medium text-current/70 md:mt-12 md:text-lg;
}

.pricing-tabs {
   @apply mt-10 w-full items-center gap-10 md:mt-12 md:gap-14;
}

.pricing-switcher-frame {
   @apply w-full md:w-auto;
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
   @apply relative min-h-13 rounded-full bg-transparent px-3 py-2 text-sm leading-tight font-medium whitespace-normal text-balance text-foreground/65 transition-colors duration-300 hover:text-foreground md:min-h-16 md:px-10 md:text-lg md:whitespace-nowrap;
}

.pricing-switcher :deep(.pricing-switcher-tab[data-state="active"]) {
   @apply bg-transparent text-background;
}

.pricing-panels {
   @apply mx-auto w-full max-w-xl pt-12 lg:max-w-7xl;
}

.pricing-grid {
   @apply m-0 grid list-none grid-cols-1 gap-16 p-0 lg:grid-cols-3 lg:gap-6;
}

.pricing-flexible-card {
   @apply mt-16 lg:mt-6;
}

.pricing-grid-item {
   @apply isolate min-w-0;
}

@media (min-width: 64rem) {
   .pricing-grid-item {
      grid-row: span 4;
      grid-template-rows: subgrid;
      @apply grid gap-y-0;
   }
}

@media (prefers-reduced-motion: reduce) {
   .pricing-switcher-pill {
      transition: none;
   }
}
</style>
