<script setup lang="ts">
import type { AccordionTriggerProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import {
  AccordionHeader,
  AccordionTrigger,
} from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<AccordionTriggerProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <AccordionHeader class="flex">
    <AccordionTrigger
      data-slot="accordion-trigger"
      v-bind="delegatedProps"
      :class="
        cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]_[data-slot=accordion-icon]]:rotate-180',
          props.class,
        )
      "
    >
      <slot />
      <slot name="icon">
        <span data-slot="accordion-icon" class="pointer-events-none grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform duration-200">
          <span aria-hidden="true" class="text-base leading-none">↓</span>
        </span>
      </slot>
    </AccordionTrigger>
  </AccordionHeader>
</template>
