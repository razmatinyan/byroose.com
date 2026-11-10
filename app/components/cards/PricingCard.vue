<script setup lang="ts">
import { computed } from "vue";
import { NuxtLink } from "#components";
import { Button } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import { formatPlanPrice, planDiscountPercent } from "@/lib/pricing";
import type { PricingPlan } from "@/lib/pricing";

const {
   plan,
   previousPlanName,
   actionTo = "/contact",
} = defineProps<{
   plan: PricingPlan;
   previousPlanName?: string;
   actionTo?: string;
}>();

const featuredLabel = "Most popular";
const price = computed(() => formatPlanPrice(plan.price));
const regularPrice = computed(() => formatPlanPrice(plan.regularPrice));
const saving = computed(() => formatPlanPrice(plan.regularPrice - plan.price));
const discountLabel = computed(() => `${planDiscountPercent(plan)}% off`);
const actionName = computed(
   () => `${plan.actionLabel} about the ${plan.name} package`,
);
const featuresLabel = computed(() =>
   previousPlanName ? `Everything in ${previousPlanName}, plus:` : "Includes:",
);
</script>

<template>
   <article
      class="pricing-card"
      :data-featured="plan.featured || undefined"
   >
      <span v-if="plan.featured" class="pricing-card-badge">
         {{ featuredLabel }}
      </span>

      <header class="pricing-card-header">
         <div class="pricing-card-title">
            <h3 class="pricing-card-name">{{ plan.name }}</h3>
            <span class="pricing-card-discount">{{ discountLabel }}</span>
         </div>
         <p class="pricing-card-description">{{ plan.description }}</p>
      </header>

      <p class="pricing-card-price">
         <s class="pricing-card-regular">
            <span class="sr-only">Regular price</span>
            {{ regularPrice }}
         </s>
         <span class="pricing-card-amount">
            <span class="sr-only">Package price</span>
            {{ price }}
         </span>
      </p>

      <div class="pricing-card-action-block">
         <Button
            class="pricing-card-action"
            :as="NuxtLink"
            :to="actionTo"
            variant="dark"
            size="cta-lg"
            :aria-label="actionName"
         >
            {{ plan.actionLabel }}
         </Button>
         <p class="pricing-card-saving">
            <strong>Save {{ saving }}</strong> on the regular price
         </p>
      </div>

      <div class="pricing-card-features">
         <p class="pricing-card-features-label">{{ featuresLabel }}</p>
         <ul class="pricing-card-list">
            <li
               v-for="feature in plan.features"
               :key="feature"
               class="pricing-card-feature"
            >
               <Icon
                  :name="appIcons.check"
                  class="pricing-card-check"
                  aria-hidden="true"
               />
               {{ feature }}
            </li>
         </ul>
      </div>
   </article>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.pricing-card {
   @apply relative flex h-full flex-col rounded-3xl border border-border bg-card p-2.5 text-card-foreground;
}

@media (min-width: 64rem) {
   .pricing-card {
      grid-row: span 4;
      grid-template-rows: subgrid;
      @apply grid gap-y-0;
   }
}

.pricing-card[data-featured] {
   @apply border-foreground;
}

.pricing-card-badge {
   @apply absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground px-3 py-1 text-xs font-semibold whitespace-nowrap text-background;
}

.pricing-card-header {
   @apply px-4 pt-8 md:px-6 md:pt-10;
}

.pricing-card-title {
   @apply flex flex-wrap items-center gap-x-3 gap-y-2;
}

.pricing-card-name {
   @apply m-0 text-3xl leading-tight font-bold tracking-[-0.04em];
}

.pricing-card-discount {
   @apply rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary;
}

.pricing-card-description {
   @apply m-0 mt-3 text-base leading-snug font-medium text-pretty text-current/60;
}

.pricing-card-price {
   @apply m-0 mt-12 flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 lg:self-end md:mt-16 md:px-6;
}

.pricing-card-regular {
   @apply text-2xl font-semibold tracking-[-0.04em] text-current/30 md:text-3xl;
}

.pricing-card-amount {
   @apply text-6xl leading-none font-bold tracking-[-0.05em] tabular-nums lg:text-5xl xl:text-6xl;
}

.pricing-card-action-block {
   @apply mt-6 flex flex-col gap-3 rounded-2xl bg-canvas-shade p-2.5 pb-4;
}

.pricing-card-action {
   @apply w-full;
}

.pricing-card-saving {
   @apply m-0 text-center text-sm font-medium text-current/60;
}

.pricing-card-saving strong {
   @apply font-semibold text-foreground;
}

.pricing-card-features {
   @apply flex-1 px-4 pt-8 pb-8 md:px-6 md:pt-10 md:pb-10;
}

.pricing-card-features-label {
   @apply m-0 text-sm font-semibold;
}

.pricing-card-list {
   @apply m-0 mt-5 flex list-none flex-col gap-4 p-0;
}

.pricing-card-feature {
   @apply flex items-start gap-3 text-base leading-snug font-medium;
}

.pricing-card-check {
   @apply mt-0.5 size-4 shrink-0;
}
</style>
