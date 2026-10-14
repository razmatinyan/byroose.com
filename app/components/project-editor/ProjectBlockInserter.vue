<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appIcons } from "@/lib/icons";
import { editorBlockChoices } from "@/lib/project-editor-blocks";
import type { EditorBlockChoice } from "@/lib/project-editor-blocks";

const { persistent = false } = defineProps<{
   persistent?: boolean;
}>();

const emit = defineEmits<{
   add: [choice: EditorBlockChoice];
}>();
</script>

<template>
   <div class="block-inserter" :data-persistent="persistent || undefined">
      <span class="block-inserter-line" aria-hidden="true" />
      <DropdownMenu>
         <DropdownMenuTrigger as-child>
            <Button variant="dark" size="icon" class="block-inserter-trigger" aria-label="Add a block">
               <Icon :name="appIcons.plus" aria-hidden="true" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="center" class="min-w-52">
            <DropdownMenuItem
               v-for="choice in editorBlockChoices"
               :key="choice.id"
               @select="emit('add', choice.id)"
            >
               <Icon :name="choice.icon" aria-hidden="true" />
               {{ choice.label }}
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.block-inserter {
   @apply relative z-10 flex h-full items-center justify-center opacity-0 transition-opacity duration-200 hover:opacity-100 focus-within:opacity-100 has-[[data-state=open]]:opacity-100;
}

.block-inserter[data-persistent] {
   @apply h-24 opacity-100;
}

.block-inserter-line {
   @apply absolute inset-x-0 top-1/2 h-px bg-foreground/15;
}

.block-inserter-trigger {
   @apply relative rounded-full;
}
</style>
