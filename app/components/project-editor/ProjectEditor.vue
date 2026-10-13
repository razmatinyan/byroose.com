<script setup lang="ts">
import { reactive } from "vue";
import type { EditorBlock } from "@/lib/project-editor-blocks";
import type { MediaAsset } from "#shared/schemas/media";
import ProjectEditorBlocks from "./ProjectEditorBlocks.vue";
import ProjectEditorCover from "./ProjectEditorCover.vue";
import ProjectEditorHero from "./ProjectEditorHero.vue";

interface ProjectDraft {
   name: string;
   description: string;
   serviceIds: string[];
   liveUrl: string;
   cover: MediaAsset | null;
   blocks: EditorBlock[];
}

const draft = reactive<ProjectDraft>({
   name: "",
   description: "",
   serviceIds: [],
   liveUrl: "",
   cover: null,
   blocks: [],
});

const { data: serviceOptions } = await useFetch("/api/admin/categories", {
   default: () => [],
});
</script>

<template>
   <div class="project-editor">
      <ProjectEditorHero
         v-model:name="draft.name"
         v-model:description="draft.description"
         v-model:service-ids="draft.serviceIds"
         v-model:live-url="draft.liveUrl"
         :service-options="serviceOptions"
      />
      <ProjectEditorCover v-model="draft.cover" />
      <ProjectEditorBlocks v-model="draft.blocks" />
   </div>
</template>
