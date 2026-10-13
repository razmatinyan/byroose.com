<script setup lang="ts">
import type { DropdownMenuSubTriggerProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import {
  DropdownMenuSubTrigger,
  useForwardProps,
} from "reka-ui"
import { appIcons } from "@/lib/icons"
import { cn } from "@/lib/utils"

const props = defineProps<DropdownMenuSubTriggerProps & { class?: HTMLAttributes["class"], inset?: boolean }>()

const delegatedProps = reactiveOmit(props, "class", "inset")
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DropdownMenuSubTrigger
    data-slot="dropdown-menu-sub-trigger"
    v-bind="forwardedProps"
    :data-inset="inset ? '' : undefined"
    :class="cn(
      `relative flex cursor-default items-center gap-3 rounded-sm px-3 py-2.5 text-base outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-10 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!`,
      props.class,
    )"
  >
    <slot />
    <Icon :name="appIcons.chevronRight" class="ml-auto size-5" />
  </DropdownMenuSubTrigger>
</template>
