<script setup lang="ts">
import { NuxtLink } from "#components";
import { Button } from "@/components/ui/button";
import type { RolloverTones } from "@/components/ui/button";

const { actionTo = "/contact" } = defineProps<{
   actionTo?: string;
}>();

const label = "Flexible Package";
const title = "A package shaped around your brand";
const lead = "For bigger or unusual briefs.";
const description =
   "Mix content and web work, set your own pace, and scale the scope up or down as you grow. We shape the package with you on one call.";
const actionLabel = "Plan a flexible package";
const actionRolloverTones: RolloverTones = ["blue", "pink", "primary"];
</script>

<template>
   <article class="pricing-flexible">
      <span class="pricing-flexible-label">{{ label }}</span>
      <h3 class="pricing-flexible-title">{{ title }}</h3>
      <p class="pricing-flexible-description">
         <strong>{{ lead }}</strong>
         {{ description }}
      </p>

      <Button
         class="pricing-flexible-action"
         :as="NuxtLink"
         :to="actionTo"
         variant="dark"
         :rollover-tones="actionRolloverTones"
         size="cta-lg"
      >
         {{ actionLabel }}
      </Button>
   </article>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.pricing-flexible {
   @apply flex flex-col items-center rounded-xl border border-border bg-card px-6 py-12 text-center text-card-foreground md:px-12 md:py-16;
}

.pricing-flexible-label {
   @apply rounded-full bg-canvas-shade px-6 py-2.5 text-lg font-semibold md:text-xl tracking-tight;
}

.pricing-flexible-title {
   @apply m-0 mt-5 max-w-[14ch] text-4xl leading-[0.95] font-semibold tracking-[-0.05em] text-balance md:text-6xl;
}

.pricing-flexible-description {
   @apply m-0 mt-6 max-w-[46ch] text-lg leading-snug font-medium tracking-tight text-pretty text-current/60;
}

.pricing-flexible-description strong {
   @apply font-semibold text-foreground;
}

.pricing-flexible-action {
   @apply mt-10 min-h-16 w-full px-8 sm:w-auto sm:min-w-80 sm:text-2xl;
}
</style>
