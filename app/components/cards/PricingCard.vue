<script setup lang="ts">
import { computed } from "vue";
import { NuxtLink } from "#components";
import { Button, ButtonIcon } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import { formatPlanPrice, pricingBillingNotes } from "@/lib/pricing";
import type { PricingPlan } from "@/lib/pricing";

const {
   plan,
   previousPlanName,
   actionLabel = "Book a call",
   actionTo = "/contact",
} = defineProps<{
   plan: PricingPlan;
   previousPlanName?: string;
   actionLabel?: string;
   actionTo?: string;
}>();

const featuredLabel = "Most popular";
const price = computed(() => formatPlanPrice(plan.price));
const billingNote = computed(() => pricingBillingNotes[plan.billing]);
const actionName = computed(() => `${actionLabel} for the ${plan.name} plan`);
const featuresLabel = computed(() =>
   previousPlanName ? `Everything in ${previousPlanName}, plus:` : "Includes:",
);
</script>

<template>
   <article
      class="pricing-card"
      :data-featured="plan.featured || undefined"
      data-pricing-card
   >
      <header class="pricing-card-header">
         <h3 class="pricing-card-name">{{ plan.name }}</h3>
         <span v-if="plan.featured" class="pricing-card-badge">
            {{ featuredLabel }}
         </span>
      </header>

      <p class="pricing-card-price">
         <span class="pricing-card-amount">{{ price }}</span>
         <span class="pricing-card-billing">{{ billingNote }}</span>
      </p>

      <p class="pricing-card-description">{{ plan.description }}</p>

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

      <Button
         class="pricing-card-action"
         :as="NuxtLink"
         :to="actionTo"
         :variant="plan.featured ? 'default' : 'dark'"
         size="cta-lg"
         :aria-label="actionName"
      >
         {{ actionLabel }}
         <template #icon>
            <ButtonIcon :icon="appIcons.arrowUpRight" />
         </template>
      </Button>
   </article>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.pricing-card {
   @apply flex h-full flex-col rounded-3xl bg-canvas-shade p-6 text-canvas-shade-foreground md:p-8;
}

.pricing-card[data-featured] {
   @apply bg-foreground text-background;
}

.pricing-card-header {
   @apply flex items-center justify-between gap-4;
}

.pricing-card-name {
   @apply m-0 text-2xl leading-tight font-bold tracking-[-0.03em] md:text-3xl;
}

.pricing-card-badge {
   @apply shrink-0 rounded-full bg-ribbon px-3 py-1 text-xs font-semibold text-ribbon-foreground md:text-sm;
}

.pricing-card-price {
   @apply m-0 mt-8 flex flex-col gap-2 md:mt-10;
}

.pricing-card-amount {
   @apply text-5xl leading-none font-bold tracking-[-0.05em] tabular-nums md:text-6xl;
}

.pricing-card-billing {
   @apply text-sm font-medium text-current/55;
}

.pricing-card-description {
   @apply m-0 mt-6 max-w-[36ch] text-base leading-snug font-medium text-pretty text-current/70 md:text-lg;
}

.pricing-card-features {
   @apply mt-6 flex-1 border-t border-current/15 pt-6;
}

.pricing-card-features-label {
   @apply m-0 text-sm font-semibold;
}

.pricing-card-list {
   @apply m-0 mt-4 flex list-none flex-col gap-3 p-0;
}

.pricing-card-feature {
   @apply flex items-start gap-3 text-base leading-snug font-medium;
}

.pricing-card-check {
   @apply mt-0.5 size-4 shrink-0 text-current/55;
}

.pricing-card-action {
   @apply mt-10 w-full;
}
</style>
