<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { ComponentPublicInstance, HTMLAttributes } from "vue"
import type { ButtonVariants } from "."
import { useTemplateRef } from "vue"
import { Primitive } from "reka-ui"
import { cn } from "@/lib/utils"
import { buttonVariants } from "."

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
}

const {
  as = "button",
  asChild = false,
  class: className,
  size = "default",
  variant = "default",
} = defineProps<Props>()

const buttonElement = useTemplateRef<ComponentPublicInstance>("buttonElement")

useHoverBounce(() =>
  size === "cta-sm" || size === "cta-lg" ? buttonElement.value : null,
)
</script>

<template>
  <Primitive
    ref="buttonElement"
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), className)"
  >
    <slot />
  </Primitive>
</template>
