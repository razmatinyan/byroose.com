<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";

const { label, isFirst = false, isLast = false } = defineProps<{
   label: string;
   isFirst?: boolean;
   isLast?: boolean;
}>();

const previewing = useProjectEditorPreview();

const emit = defineEmits<{
   moveUp: [];
   moveDown: [];
   remove: [];
}>();
</script>

<template>
   <div class="block-frame" :data-previewing="previewing || undefined">
      <div
         v-if="!previewing"
         class="block-frame-toolbar" role="toolbar" :aria-label="`${label} block actions`">
         <slot name="controls" />
         <Button
            variant="outline"
            size="icon-sm"
            aria-label="Move block up"
            :disabled="isFirst"
            @click="emit('moveUp')"
         >
            <Icon :name="appIcons.arrowUp" aria-hidden="true" />
         </Button>
         <Button
            variant="outline"
            size="icon-sm"
            aria-label="Move block down"
            :disabled="isLast"
            @click="emit('moveDown')"
         >
            <Icon :name="appIcons.arrowDown" aria-hidden="true" />
         </Button>
         <Button variant="outline" size="icon-sm" aria-label="Remove block" @click="emit('remove')">
            <Icon :name="appIcons.trash" aria-hidden="true" />
         </Button>
      </div>
      <slot />
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.block-frame {
   @apply relative rounded-lg outline-1 outline-offset-8 outline-transparent transition-[outline-color] duration-200 hover:outline-foreground/15 focus-within:outline-foreground/15;
}

.block-frame[data-previewing] {
   @apply outline-transparent;
}

.block-frame-toolbar {
   @apply absolute -top-5 right-0 z-10 flex gap-1 rounded-[calc(var(--radius-action)+0.25rem)] border border-border bg-card p-1 opacity-0 shadow-sm transition-opacity duration-200;
}

.block-frame:hover .block-frame-toolbar,
.block-frame:focus-within .block-frame-toolbar {
   @apply opacity-100;
}
</style>
