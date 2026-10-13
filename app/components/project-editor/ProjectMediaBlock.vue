<script setup lang="ts">
import { computed } from "vue";
import type { EditorMediaBlock } from "@/lib/project-editor-blocks";
import type { MediaAsset } from "#shared/schemas/media";
import ProjectMediaPreview from "./ProjectMediaPreview.vue";
import ProjectMediaUpload from "./ProjectMediaUpload.vue";

const block = defineModel<EditorMediaBlock>({ required: true });

const uploadTitle = computed(() =>
   block.value.kind === "image" ? "Add a full width image" : "Add a full width video",
);
const altLabel = computed(() =>
   block.value.kind === "image" ? "Image description" : "Video description",
);

function setAsset(asset: MediaAsset) {
   block.value = { ...block.value, asset };
}

function setAlt(event: Event) {
   if (event.target instanceof HTMLInputElement) {
      block.value = { ...block.value, alt: event.target.value };
   }
}
</script>

<template>
   <figure v-if="block.asset" class="media-block">
      <div class="media-block-frame">
         <ProjectMediaPreview :asset="block.asset" :alt="block.alt" />
      </div>
      <input
         class="media-block-alt"
         :value="block.alt"
         :aria-label="altLabel"
         placeholder="Describe what it shows for screen readers"
         maxlength="250"
         @input="setAlt"
      />
   </figure>
   <ProjectMediaUpload v-else :kinds="[block.kind]" :title="uploadTitle" @uploaded="setAsset" />
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.media-block {
   @apply flex flex-col gap-2;
}

.media-block-frame {
   @apply overflow-hidden rounded-2xl;
}

.media-block-alt {
   @apply w-full bg-transparent py-1 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:text-foreground;
}
</style>
