<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import { createGridItem, gridBlockMaxItems } from "@/lib/project-editor-blocks";
import type { EditorGridBlock } from "@/lib/project-editor-blocks";
import type { MediaAsset } from "#shared/schemas/media";
import ProjectMediaPreview from "./ProjectMediaPreview.vue";
import ProjectMediaUpload from "./ProjectMediaUpload.vue";

const block = defineModel<EditorGridBlock>({ required: true });

const canAddItems = computed(() => block.value.items.length < gridBlockMaxItems);
const isEmpty = computed(() => block.value.items.length === 0);

function addItem(asset: MediaAsset) {
   if (!canAddItems.value) return;
   block.value = { ...block.value, items: [...block.value.items, createGridItem(asset)] };
}

function removeItem(id: string) {
   block.value = { ...block.value, items: block.value.items.filter((item) => item.id !== id) };
}

function setAlt(id: string, event: Event) {
   if (!(event.target instanceof HTMLInputElement)) return;

   const alt = event.target.value;
   block.value = {
      ...block.value,
      items: block.value.items.map((item) => (item.id === id ? { ...item, alt } : item)),
   };
}
</script>

<template>
   <div class="grid-block" :data-columns="block.columns">
      <figure v-for="(item, index) in block.items" :key="item.id" class="grid-block-item">
         <div class="grid-block-frame">
            <ProjectMediaPreview :asset="item.asset" :alt="item.alt" />
            <Button
               variant="light"
               size="icon-sm"
               class="grid-block-remove"
               :aria-label="`Remove image ${index + 1}`"
               @click="removeItem(item.id)"
            >
               <Icon :name="appIcons.close" aria-hidden="true" />
            </Button>
         </div>
         <input
            class="grid-block-alt"
            :value="item.alt"
            :aria-label="`Image ${index + 1} description`"
            placeholder="Describe what it shows"
            maxlength="250"
            @input="setAlt(item.id, $event)"
         />
      </figure>
      <ProjectMediaUpload
         v-if="canAddItems"
         :kinds="['image']"
         :title="isEmpty ? 'Add images to the grid' : 'Add images'"
         multiple
         :compact="!isEmpty"
         :class="{ 'col-span-full': isEmpty }"
         @uploaded="addItem"
      />
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.grid-block {
   @apply grid grid-cols-1 items-start gap-4 sm:grid-cols-2;
}

.grid-block[data-columns="3"] {
   @apply lg:grid-cols-3;
}

.grid-block-item {
   @apply flex flex-col gap-2;
}

.grid-block-frame {
   @apply relative overflow-hidden rounded-2xl;
}

.grid-block-remove {
   @apply absolute top-3 right-3 opacity-0 transition-opacity duration-200;
}

.grid-block-item:hover .grid-block-remove,
.grid-block-item:focus-within .grid-block-remove {
   @apply opacity-100;
}

.grid-block-alt {
   @apply w-full bg-transparent py-1 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:text-foreground;
}
</style>
