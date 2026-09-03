<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from "vue"
import type { CardVariants } from '.'
import { Primitive } from 'reka-ui'
import { cn } from "@/lib/utils"
import { cardVariants } from '.'

interface Props extends PrimitiveProps {
  class?: HTMLAttributes["class"]
  variant?: CardVariants['variant']
}

const {
	as = 'div',
	asChild = false,
	class: className,
	variant = 'default',
} = defineProps<Props>()
</script>

<template>
  <Primitive
    data-slot="card"
    :as="as"
    :as-child="asChild"
    :data-variant="variant"
    :class="cn(cardVariants({ variant }), className)"
  >
    <slot />
  </Primitive>
</template>
