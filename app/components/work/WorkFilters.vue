<script setup lang="ts" generic="FilterId extends string">
import { computed } from "vue";
import { Button } from "@/components/ui/button";

export interface WorkFilterOption<Id extends string> {
   id: Id;
   label: string;
}

const { options, selected, summary } = defineProps<{
   options: readonly WorkFilterOption<FilterId>[];
   selected: FilterId;
   summary: string;
}>();

const emit = defineEmits<{
   select: [id: FilterId];
}>();

const groupLabel = "Filter projects";
const summaryWords = computed(() =>
   summary.split(" ").map((word, index) => ({
      chars: [...word],
      key: `${index}-${word}`,
   })),
);

function variantFor(id: FilterId) {
   return id === selected ? "dark" : "outline";
}
</script>

<template>
   <div class="work-filters" data-work-filters>
      <p
         :key="summary"
         class="work-filters-count"
         data-work-filters-count
         aria-hidden="true"
      >
         <template v-for="({ chars, key }, index) in summaryWords" :key="key">
            <template v-if="index">{{ " " }}</template>
            <span class="work-filters-word"
               ><span
                  v-for="(char, charIndex) in chars"
                  :key="charIndex"
                  class="work-filters-char"
                  data-work-filters-count-char
                  >{{ char }}</span
               ></span
            >
         </template>
      </p>
      <div class="work-filters-options" role="group" :aria-label="groupLabel">
         <div
            v-for="option in options"
            :key="option.id"
            class="work-filters-mask"
            data-work-filter-mask
         >
            <span class="work-filters-rise" data-work-filter-rise>
               <Button
                  class="work-filters-button"
                  type="button"
                  :variant="variantFor(option.id)"
                  size="cta-lg"
                  :rollover="false"
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
   @apply flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8;
}

.work-filters-count {
   @apply m-0 overflow-x-visible overflow-y-clip text-3xl leading-none font-bold tracking-[-0.05em] whitespace-nowrap md:text-4xl xl:text-5xl;
   margin-block: -0.15em;
   padding-block: 0.15em;
}

.work-filters-word,
.work-filters-char {
   @apply inline-block;
}

.work-filters-char {
   visibility: hidden;
}

.work-filters-options {
   @apply flex flex-wrap gap-2 md:justify-end;
}

@layer utilities {
   .work-filters-button {
      border-radius: 9999px !important;
   }

   @media (hover: hover) {
      .work-filters-button:hover {
         @apply border-foreground bg-foreground text-primary-foreground;
      }
   }
}

.work-filters-rise {
   @apply block;
   visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
   .work-filters-char,
   .work-filters-rise {
      visibility: inherit;
   }
}
</style>
