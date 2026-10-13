<script setup lang="ts">
import type { DropdownMenuItemProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { DropdownMenuItem, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const {
  class: className,
  inset = false,
  variant = "default",
  ...itemProps
} = defineProps<DropdownMenuItemProps & {
  class?: HTMLAttributes["class"]
  inset?: boolean
  variant?: "default" | "destructive"
}>()

const forwardedProps = useForwardProps(itemProps)
</script>

<template>
  <DropdownMenuItem
    data-slot="dropdown-menu-item"
    :data-inset="inset ? '' : undefined"
    :data-variant="variant"
    v-bind="forwardedProps"
    :class="cn(`relative flex cursor-default items-center gap-3 rounded-sm px-3 py-2.5 text-base outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-10 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!`, className)"
  >
    <slot />
  </DropdownMenuItem>
</template>
