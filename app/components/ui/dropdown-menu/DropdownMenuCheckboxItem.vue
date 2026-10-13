<script setup lang="ts">
import type { DropdownMenuCheckboxItemEmits, DropdownMenuCheckboxItemProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItemIndicator,
  useForwardPropsEmits,
} from "reka-ui"
import { appIcons } from "@/lib/icons"
import { cn } from "@/lib/utils"

const props = defineProps<DropdownMenuCheckboxItemProps & { class?: HTMLAttributes["class"] }>()
const emits = defineEmits<DropdownMenuCheckboxItemEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DropdownMenuCheckboxItem
    data-slot="dropdown-menu-checkbox-item"
    v-bind="forwarded"
    :class=" cn(
      `focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-3 rounded-sm py-2.5 pr-3 pl-10 text-base outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5`,
      props.class,
    )"
  >
    <span class="pointer-events-none absolute left-3 flex size-5 items-center justify-center">
      <DropdownMenuItemIndicator>
        <slot name="indicator-icon">
          <Icon :name="appIcons.check" class="size-5" />
        </slot>
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuCheckboxItem>
</template>
