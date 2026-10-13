<script setup lang="ts">
import { useTemplateRef } from "vue";
import { useSortable } from "@vueuse/integrations/useSortable";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogTitle,
} from "@/components/ui/dialog";
import { appIcons } from "@/lib/icons";
import { describeBlock } from "@/lib/project-editor-blocks";
import type { EditorBlock } from "@/lib/project-editor-blocks";

const open = defineModel<boolean>("open", { required: true });
const blocks = defineModel<EditorBlock[]>("blocks", { required: true });

const list = useTemplateRef<HTMLElement>("list");

useSortable(list, blocks, {
   watchElement: true,
   animation: 260,
   easing: "cubic-bezier(0.22, 1, 0.36, 1)",
   forceFallback: true,
   fallbackOnBody: true,
   fallbackTolerance: 3,
   ghostClass: "order-row-ghost",
   chosenClass: "order-row-chosen",
   fallbackClass: "order-row-drag",
});

function moveBlock(index: number, offset: -1 | 1) {
   const target = index + offset;
   const block = blocks.value[index];
   const other = blocks.value[target];
   if (!block || !other) return;

   blocks.value = blocks.value.with(index, other).with(target, block);
}
</script>

<template>
   <Dialog v-model:open="open">
      <DialogContent class="order-dialog" data-lenis-prevent>
         <DialogTitle class="text-2xl">Reorder blocks</DialogTitle>
         <DialogDescription>Drag a block to a new position, or use the arrows.</DialogDescription>

         <ol ref="list" class="order-list">
            <li v-for="(block, index) in blocks" :key="block.id" class="order-row">
               <Icon :name="appIcons.grip" class="order-row-grip" aria-hidden="true" />
               <Icon :name="describeBlock(block).icon" class="order-row-icon" aria-hidden="true" />
               <span class="order-row-text">
                  <span class="order-row-title">{{ describeBlock(block).title }}</span>
                  <span class="order-row-detail">{{ describeBlock(block).detail }}</span>
               </span>
               <span class="order-row-actions">
                  <Button
                     variant="ghost"
                     size="icon-sm"
                     :aria-label="`Move ${describeBlock(block).title} up`"
                     :disabled="index === 0"
                     @click="moveBlock(index, -1)"
                  >
                     <Icon :name="appIcons.arrowUp" aria-hidden="true" />
                  </Button>
                  <Button
                     variant="ghost"
                     size="icon-sm"
                     :aria-label="`Move ${describeBlock(block).title} down`"
                     :disabled="index === blocks.length - 1"
                     @click="moveBlock(index, 1)"
                  >
                     <Icon :name="appIcons.arrowDown" aria-hidden="true" />
                  </Button>
               </span>
            </li>
         </ol>
      </DialogContent>
   </Dialog>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.order-dialog {
   @apply max-h-[88svh] gap-5 overflow-y-auto sm:max-w-lg;
}

.order-list {
   @apply flex flex-col gap-2;
}

.order-row {
   @apply flex cursor-grab items-center gap-3 rounded-action border border-border bg-card px-3 py-2.5 select-none active:cursor-grabbing;
}

.order-row-grip {
   @apply size-5 shrink-0 text-muted-foreground;
}

.order-row-icon {
   @apply size-5 shrink-0;
}

.order-row-text {
   @apply flex min-w-0 flex-1 flex-col;
}

.order-row-title {
   @apply text-base font-semibold;
}

.order-row-detail {
   @apply truncate text-sm text-muted-foreground;
}

.order-row-actions {
   @apply flex shrink-0 gap-1;
}

.order-row-ghost {
   @apply border-dashed border-foreground/30 bg-canvas-shade opacity-60;
}

.order-row-chosen {
   @apply border-foreground/30;
}

.order-row-drag {
   @apply rotate-1 opacity-95! shadow-xl;
}
</style>
