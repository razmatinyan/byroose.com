<script setup lang="ts">
import { shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import type { MediaAsset } from "#shared/schemas/media";
import ProjectMediaPreview from "./ProjectMediaPreview.vue";
import ProjectMediaUpload from "./ProjectMediaUpload.vue";

const cover = defineModel<MediaAsset | null>({ required: true });

const replacing = shallowRef(false);

function setCover(asset: MediaAsset) {
   cover.value = asset;
   replacing.value = false;
}

function removeCover() {
   cover.value = null;
   replacing.value = false;
}
</script>

<template>
   <section class="project-cover section-gutter" aria-label="Cover image or video">
      <figure v-if="cover && !replacing" class="project-cover-media">
         <ProjectMediaPreview :asset="cover" />
         <div class="project-cover-actions">
            <Button variant="light" size="sm" @click="replacing = true">Replace</Button>
            <Button variant="light" size="sm" @click="removeCover">Remove</Button>
         </div>
      </figure>

      <template v-else>
         <ProjectMediaUpload
            :kinds="['image', 'video']"
            title="Add the cover image or video"
            @uploaded="setCover"
         />
         <Button v-if="cover" variant="link" size="sm" class="mt-2 px-0" @click="replacing = false">
            Keep the current cover
         </Button>
      </template>
   </section>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.project-cover {
   @apply pb-6;
}

.project-cover-media {
   @apply relative overflow-hidden rounded-2xl;
}

.project-cover-actions {
   @apply absolute top-4 right-4 flex gap-2;
}
</style>
