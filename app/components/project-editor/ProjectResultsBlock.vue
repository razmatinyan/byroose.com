<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import { createResultItem } from "@/lib/project-editor-blocks";
import type { EditorResultItem, EditorResultsBlock } from "@/lib/project-editor-blocks";
import { surfaceTones } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { resultsBlockMaxItems } from "#shared/schemas/project-content";

const previewing = useProjectEditorPreview();
const block = defineModel<EditorResultsBlock>({ required: true });

const canAddItems = computed(() => block.value.items.length < resultsBlockMaxItems);
const valueTone = computed(() => surfaceTones[block.value.tone]);

function setItems(items: EditorResultItem[]) {
   block.value = { ...block.value, items };
}

function addItem() {
   if (canAddItems.value) setItems([...block.value.items, createResultItem()]);
}

function removeItem(id: string) {
   setItems(block.value.items.filter((item) => item.id !== id));
}

function updateItem(id: string, field: "value" | "label", event: Event) {
   if (!(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) return;

   const text = event.target.value;
   setItems(block.value.items.map((item) => (item.id === id ? { ...item, [field]: text } : item)));
}
</script>

<template>
   <div class="results-block">
      <h2 class="results-block-title">Results</h2>
      <div class="results-block-items">
         <div v-for="(item, index) in block.items" :key="item.id" class="results-block-item">
            <input
               :class="cn('results-block-value', valueTone)"
               :value="item.value"
               :aria-label="`Result ${index + 1} value`"
               :placeholder="previewing ? undefined : '3.2x'"
               :readonly="previewing"
               :size="Math.max(item.value.length, 3)"
               maxlength="20"
               @input="updateItem(item.id, 'value', $event)"
            />
            <textarea
               class="results-block-label"
               :value="item.label"
               :aria-label="`Result ${index + 1} label`"
               :placeholder="previewing ? undefined : 'What changed'"
               :readonly="previewing"
               rows="2"
               maxlength="80"
               @input="updateItem(item.id, 'label', $event)"
            />
            <Button
               v-if="!previewing && block.items.length > 1"
               variant="light"
               size="icon-sm"
               class="results-block-remove"
               :aria-label="`Remove result ${index + 1}`"
               @click="removeItem(item.id)"
            >
               <Icon :name="appIcons.close" aria-hidden="true" />
            </Button>
         </div>
         <Button
            v-if="!previewing && canAddItems"
            variant="outline"
            size="lg"
            class="results-block-add"
            @click="addItem"
         >
            <Icon :name="appIcons.plus" aria-hidden="true" />
            Add result
         </Button>
      </div>
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.results-block {
   @apply grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16;
}

.results-block-title {
   @apply text-4xl leading-none font-bold tracking-[-0.05em] md:text-5xl;
}

.results-block-items {
   @apply flex flex-wrap items-start gap-x-10 gap-y-8;
}

.results-block-item {
   @apply relative flex min-w-0 flex-col items-start gap-3;
}

.results-block-value {
   @apply m-0 max-w-full rounded-lg px-3 py-1.5 text-5xl leading-none font-extrabold tracking-[-0.05em] outline-none placeholder:opacity-50 focus-visible:ring-3 focus-visible:ring-ring/50 md:text-6xl;
   field-sizing: content;
}

.results-block-label {
   @apply m-0 w-[14ch] resize-none bg-transparent pb-[0.1em] text-lg leading-[1.05] font-semibold tracking-[-0.02em] outline-none placeholder:text-foreground/30 focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50 md:text-xl;
}

.results-block-remove {
   @apply absolute -top-3 -right-3 opacity-0 transition-opacity duration-200;
}

.results-block-item:hover .results-block-remove,
.results-block-item:focus-within .results-block-remove {
   @apply opacity-100;
}

.results-block-add {
   @apply self-center;
}
</style>
