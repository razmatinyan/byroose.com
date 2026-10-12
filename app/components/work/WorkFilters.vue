<script setup lang="ts" generic="FilterId extends string">
import SplitText from "@/components/shared/SplitText.vue";
import { Button } from "@/components/ui/button";
import type { SplitTextResult } from "@/lib/split-text";

export interface WorkFilterOption<Id extends string> {
   id: Id;
   label: string;
}

const { options, selected } = defineProps<{
   options: readonly WorkFilterOption<FilterId>[];
   selected: FilterId;
}>();

const emit = defineEmits<{
   select: [id: FilterId];
   split: [parts: SplitTextResult];
}>();

const labelId = "work-filters-label";
const label = "Filters";

function variantFor(id: FilterId) {
   return id === selected ? "dark" : "outline";
}
</script>

<template>
   <div class="work-filters" data-work-filters>
      <SplitText
         :id="labelId"
         class="split-title work-filters-label"
         as="p"
         mask="chars"
         :text="label"
         type="words,chars"
         @split="emit('split', $event)"
      />
      <div class="work-filters-options" role="group" :aria-labelledby="labelId">
         <div
            v-for="option in options"
            :key="option.id"
            class="work-filters-mask"
            data-work-filter-mask
         >
            <span class="work-filters-rise" data-work-filter-rise>
               <Button
                  type="button"
                  :variant="variantFor(option.id)"
                  size="cta-sm"
                  :aria-pressed="option.id === selected"
                  @click="emit('select', option.id)"
               >
                  {{ option.label }}
               </Button>
            </span>
         </div>
      </div>
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.work-filters {
   @apply flex flex-col gap-5 md:gap-6;
}

.work-filters-label {
   @apply m-0 text-3xl leading-none font-bold md:text-4xl xl:text-5xl;
   --split-title-tracking: -0.05em;
}

.work-filters-options {
   @apply flex flex-wrap gap-2;
}

.work-filters-rise {
   @apply block;
   visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
   .work-filters-rise {
      visibility: inherit;
   }
}
</style>
