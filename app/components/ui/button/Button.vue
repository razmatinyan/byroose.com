<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { ComponentPublicInstance, HTMLAttributes } from "vue"
import type { ButtonVariants, RolloverTones } from "."
import { computed, useTemplateRef } from "vue"
import { Primitive } from "reka-ui"
import { surfaceTones } from "@/lib/surfaces"
import { cn } from "@/lib/utils"
import { buttonVariants, variantRolloverTones } from "."

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
  rolloverTones?: RolloverTones
}

const {
  as = "button",
  asChild = false,
  class: className,
  rolloverTones,
  size = "default",
  variant = "default",
} = defineProps<Props>()

const buttonElement = useTemplateRef<ComponentPublicInstance>("buttonElement")
const isCallToAction = computed(
  () => size === "cta-sm" || size === "cta-lg",
)
const rolloverLayers = computed(() => {
  if (!isCallToAction.value) return null

  const tones = rolloverTones ?? variantRolloverTones[variant ?? "default"]
  if (!tones) return null

  return {
    entry: surfaceTones[tones[0]],
    middle: surfaceTones[tones[1]],
    final: surfaceTones[tones[2]],
  }
})
const actionClasses = computed(() => {
  const classes = buttonVariants({ variant, size })
  if (!rolloverLayers.value) return classes

  return classes
    .split(" ")
    .filter((entry) => !entry.includes("hover:"))
    .join(" ")
})

const bounceTarget = () =>
  isCallToAction.value ? buttonElement.value : null
const rolloverTarget = () =>
  rolloverLayers.value ? buttonElement.value : null

useHoverBounce(bounceTarget)
useHoverRollover(rolloverTarget)
</script>

<template>
  <Primitive
    ref="buttonElement"
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :class="cn(actionClasses, className)"
  >
    <template v-if="rolloverLayers">
      <span class="button-rollover-label" data-rollover-label>
        <slot />
      </span>
      <span
        class="button-rollover-layer"
        :class="rolloverLayers.entry"
        data-rollover-layer
        aria-hidden="true"
      />
      <span
        class="button-rollover-layer"
        :class="rolloverLayers.middle"
        data-rollover-layer
        aria-hidden="true"
      />
      <span
        class="button-rollover-layer"
        :class="rolloverLayers.final"
        data-rollover-layer
        aria-hidden="true"
      >
        <span class="button-rollover-copy">
          <slot />
          <span class="button-rollover-reserve">
            <slot name="icon" />
          </span>
        </span>
      </span>
      <span class="button-rollover-icon" data-rollover-icon>
        <slot name="icon" />
      </span>
    </template>
    <template v-else>
      <slot />
      <slot name="icon" />
    </template>
  </Primitive>
</template>

<style scoped>
@reference '../../../assets/css/tailwind.css';

.button-rollover-label,
.button-rollover-copy {
  @apply inline-flex items-center;
  gap: inherit;
}

.button-rollover-layer {
  @apply absolute inset-0 flex items-center justify-center;
  border-radius: inherit;
  gap: inherit;
  padding: inherit;
  transform: translateY(100%);
}

.button-rollover-reserve {
  @apply invisible inline-flex items-center;
}

.button-rollover-icon {
  @apply relative inline-flex items-center;
}
</style>
