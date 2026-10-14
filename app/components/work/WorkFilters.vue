<script setup lang="ts" generic="FilterId extends string">
import { Button } from "@/components/ui/button";

export interface WorkFilterOption<Id extends string> {
   id: Id;
   label: string;
}

const { count, options, selected } = defineProps<{
   count: number;
   options: readonly WorkFilterOption<FilterId>[];
   selected: FilterId;
}>();

const emit = defineEmits<{
   select: [id: FilterId];
}>();

const groupLabel = "Filter projects";
const countWords = ["Projects", "-"].map((word) => ({
   chars: [...word],
   word,
}));

function variantFor(id: FilterId) {
   return id === selected ? "dark" : "outline";
}
</script>

<template>
   <div class="work-filters" data-work-filters>
      <p class="work-filters-count" aria-hidden="true">
         <template v-for="{ chars, word } in countWords" :key="word">
            <span class="work-filters-word"
               ><span
                  v-for="(char, charIndex) in chars"
                  :key="charIndex"
                  class="work-filters-char"
                  data-work-filters-count-char
                  >{{ char }}</span
               ></span
            >{{ " " }}
         </template>
         <span
            class="work-filters-char work-filters-number"
            data-work-filters-count-char
            >{{ count }}</span
         >
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
   @apply m-0 overflow-x-visible overflow-y-clip leading-none font-bold tracking-[-0.05em] whitespace-nowrap;
   font-size: clamp(2.75rem, 7.5vw, 8rem);
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

.work-filters-number {
   @apply tabular-nums;
}

.work-filters-options {
   @apply flex flex-wrap gap-2 md:justify-end;
}

.work-filters-button {
   @apply h-15 min-h-15 border-2 border-foreground px-8 text-2xl;
   --radius-sm: 9999px;
}

@media (hover: hover) {
   .work-filters-button:hover {
      @apply bg-foreground text-primary-foreground;
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
