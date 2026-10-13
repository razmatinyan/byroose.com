<script setup lang="ts">
import type { DropdownMenuRadioItemEmits, DropdownMenuRadioItemProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import {
  DropdownMenuItemIndicator,
  DropdownMenuRadioItem,
  useForwardPropsEmits,
} from "reka-ui"
import { appIcons } from "@/lib/icons"
import { cn } from "@/lib/utils"

const props = defineProps<DropdownMenuRadioItemProps & { class?: HTMLAttributes["class"] }>()

const emits = defineEmits<DropdownMenuRadioItemEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DropdownMenuRadioItem
    data-slot="dropdown-menu-radio-item"
    v-bind="forwarded"
    :class="cn(
      `focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-3 rounded-sm py-2.5 pr-3 pl-10 text-base outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5`,
      props.class,
    )"
  >
    <span class="pointer-events-none absolute left-3 flex size-5 items-center justify-center">
      <DropdownMenuItemIndicator>
        <slot name="indicator-icon">
          <Icon :name="appIcons.circle" class="size-2.5 fill-current" />
        </slot>
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuRadioItem>
</template>
