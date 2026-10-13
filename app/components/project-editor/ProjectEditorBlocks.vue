<script setup lang="ts">
import { nextTick } from "vue";
import type { ComponentPublicInstance } from "vue";
import { Button } from "@/components/ui/button";
import {
   createEditorBlock,
   gridColumnOptions,
   textBlockAlignOptions,
} from "@/lib/project-editor-blocks";
import type { EditorBlock, EditorBlockChoice } from "@/lib/project-editor-blocks";
import ProjectBlockFrame from "./ProjectBlockFrame.vue";
import ProjectBlockInserter from "./ProjectBlockInserter.vue";
import ProjectGridBlock from "./ProjectGridBlock.vue";
import ProjectMediaBlock from "./ProjectMediaBlock.vue";
import ProjectTextBlock from "./ProjectTextBlock.vue";

const blocks = defineModel<EditorBlock[]>({ required: true });

const insertedBlockOffset = 160;
const blockElements = new Map<string, HTMLElement>();
const { resize, scrollTo } = useSmoothScroll();

const blockLabels: Record<EditorBlock["type"], string> = {
   text: "Text",
   media: "Media",
   grid: "Image grid",
};

function setBlockElement(id: string, element: Element | ComponentPublicInstance | null) {
   const resolved = element instanceof Element ? element : element?.$el;

   if (resolved instanceof HTMLElement) blockElements.set(id, resolved);
   else blockElements.delete(id);
}

async function insertBlock(index: number, choice: EditorBlockChoice) {
   const block = createEditorBlock(choice);
   blocks.value = blocks.value.toSpliced(index, 0, block);

   await nextTick();
   const element = blockElements.get(block.id);
   if (!element) return;

   resize();
   await scrollTo(element, { offset: -insertedBlockOffset });
}

function updateBlock(index: number, block: EditorBlock) {
   blocks.value = blocks.value.with(index, block);
}

function moveBlock(index: number, offset: -1 | 1) {
   const target = index + offset;
   const block = blocks.value[index];
   const other = blocks.value[target];
   if (!block || !other) return;

   blocks.value = blocks.value.with(index, other).with(target, block);
}

function removeBlock(index: number) {
   blocks.value = blocks.value.toSpliced(index, 1);
}
</script>

<template>
   <section class="project-blocks section-gutter" aria-label="Project content">
      <template v-for="(block, index) in blocks" :key="block.id">
         <ProjectBlockInserter @add="insertBlock(index, $event)" />
         <ProjectBlockFrame
            :ref="(element) => setBlockElement(block.id, element)"
            :label="blockLabels[block.type]"
            :is-first="index === 0"
            :is-last="index === blocks.length - 1"
            @move-up="moveBlock(index, -1)"
            @move-down="moveBlock(index, 1)"
            @remove="removeBlock(index)"
         >
            <template v-if="block.type === 'text'" #controls>
               <Button
                  v-for="option in textBlockAlignOptions"
                  :key="option.id"
                  variant="outline"
                  size="icon-sm"
                  :aria-label="option.label"
                  :aria-pressed="block.align === option.id"
                  :data-active="block.align === option.id || undefined"
                  class="project-blocks-option"
                  @click="updateBlock(index, { ...block, align: option.id })"
               >
                  <Icon :name="option.icon" aria-hidden="true" />
               </Button>
            </template>
            <template v-else-if="block.type === 'grid'" #controls>
               <Button
                  v-for="option in gridColumnOptions"
                  :key="option.id"
                  variant="outline"
                  size="icon-sm"
                  :aria-label="option.label"
                  :aria-pressed="block.columns === option.id"
                  :data-active="block.columns === option.id || undefined"
                  class="project-blocks-option"
                  @click="updateBlock(index, { ...block, columns: option.id })"
               >
                  <Icon :name="option.icon" aria-hidden="true" />
               </Button>
            </template>

            <ProjectTextBlock
               v-if="block.type === 'text'"
               :model-value="block"
               @update:model-value="updateBlock(index, $event)"
            />
            <ProjectMediaBlock
               v-else-if="block.type === 'media'"
               :model-value="block"
               @update:model-value="updateBlock(index, $event)"
            />
            <ProjectGridBlock
               v-else
               :model-value="block"
               @update:model-value="updateBlock(index, $event)"
            />
         </ProjectBlockFrame>
      </template>
      <ProjectBlockInserter persistent @add="insertBlock(blocks.length, $event)" />
   </section>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.project-blocks {
   @apply flex flex-col pb-24;
}

.project-blocks-option[data-active] {
   @apply bg-foreground text-background hover:bg-foreground hover:text-background;
}
</style>
