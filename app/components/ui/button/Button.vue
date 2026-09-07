<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { ComponentPublicInstance, HTMLAttributes } from "vue"
import type { ButtonVariants, RolloverTones } from "."
import { computed, useTemplateRef } from "vue"
import { Primitive } from "reka-ui"
import { surfaceForegroundTones, surfaceTones } from "@/lib/surfaces"
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
    finalText: surfaceForegroundTones[tones[2]],
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

const rolloverTarget = () =>
  rolloverLayers.value ? buttonElement.value : null

useHoverBounce(buttonElement, { hover: isCallToAction, press: true })
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
      <span
        class="button-rollover-layers"
        data-rollover-layers
        aria-hidden="true"
      >
        <span
          class="button-rollover-layer"
          :class="rolloverLayers.entry"
          data-rollover-layer
        />
        <span
          class="button-rollover-layer"
          :class="rolloverLayers.middle"
          data-rollover-layer
        />
        <span
          class="button-rollover-layer"
          :class="rolloverLayers.final"
          data-rollover-layer
        />
      </span>
      <span class="button-rollover-texts" data-rollover-texts>
        <span class="button-rollover-label" data-rollover-label>
          <slot />
        </span>
        <span
          class="button-rollover-label button-rollover-copy"
          :class="rolloverLayers.finalText"
          data-rollover-label-copy
          aria-hidden="true"
        >
          <slot />
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

.button-rollover-layers {
  @apply pointer-events-none absolute inset-0;
  border-radius: inherit;
}

.button-rollover-layer {
  @apply absolute inset-0;
  border-radius: inherit;
  transform: translateY(100%);
}

.button-rollover-texts {
  @apply relative grid items-center;
}

.button-rollover-label {
  --rollover-text-angle: 0deg;
  --rollover-text-y: 0em;
  display: block;
  grid-area: 1 / 1;
  rotate: 1 1 0.45 var(--rollover-text-angle);
  transform-origin: 0 0;
  translate: 0 var(--rollover-text-y) 0;
  will-change: translate, rotate, opacity, color;
}

.button-rollover-copy {
  --rollover-text-angle: -30deg;
  --rollover-text-y: 2em;
  opacity: 0;
  rotate: 1 1 0.5 var(--rollover-text-angle);
  transform-origin: top right;
}

.button-rollover-icon {
  @apply relative inline-flex items-center;
}
</style>
