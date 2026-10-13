<script setup lang="ts">
import { computed, reactive, shallowRef } from "vue";
import { isIncompleteBlock } from "@/lib/project-editor-blocks";
import type { EditorBlock } from "@/lib/project-editor-blocks";
import { createProjectSettings } from "@/lib/project-editor-settings";
import type { ProjectSettings } from "@/lib/project-editor-settings";
import type { MediaAsset } from "#shared/schemas/media";
import { projectSlugFromName } from "#shared/schemas/project-slug";
import ProjectBlockOrderDialog from "./ProjectBlockOrderDialog.vue";
import ProjectEditorBlocks from "./ProjectEditorBlocks.vue";
import ProjectEditorCover from "./ProjectEditorCover.vue";
import ProjectEditorHero from "./ProjectEditorHero.vue";
import ProjectEditorToolbar from "./ProjectEditorToolbar.vue";
import ProjectSettingsDialog from "./ProjectSettingsDialog.vue";

type ProjectStatus = "draft" | "published" | "archived";

interface ProjectDraft {
   status: ProjectStatus;
   name: string;
   description: string;
   serviceIds: string[];
   liveUrl: string;
   cover: MediaAsset | null;
   blocks: EditorBlock[];
   settings: ProjectSettings;
}

const draft = reactive<ProjectDraft>({
   status: "draft",
   name: "",
   description: "",
   serviceIds: [],
   liveUrl: "",
   cover: null,
   blocks: [],
   settings: createProjectSettings(),
});

const previewing = shallowRef(false);
const settingsOpen = shallowRef(false);
const orderOpen = shallowRef(false);

provideProjectEditorPreview(previewing);

const { data: serviceOptions } = await useFetch("/api/admin/categories", {
   default: () => [],
});

const slug = computed(() => projectSlugFromName(draft.name));

const missingForPublish = computed(() => {
   const missing: string[] = [];

   if (!draft.name.trim()) missing.push("A project name");
   else if (!slug.value) missing.push("A project name with Latin letters or numbers for the link");
   if (!draft.description.trim()) missing.push("A description");
   if (!draft.serviceIds.length) missing.push("At least one service");
   if (!draft.cover) missing.push("A cover image or video");
   if (draft.blocks.some(isIncompleteBlock)) {
      missing.push("Finish or remove empty blocks. A grid needs two images and every result a value and a label.");
   }

   return missing;
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
      <ProjectEditorToolbar
         v-model:previewing="previewing"
         :status="draft.status"
         :missing="missingForPublish"
         :can-reorder="draft.blocks.length > 1"
         @open-settings="settingsOpen = true"
         @open-order="orderOpen = true"
      />
      <ProjectBlockOrderDialog v-model:open="orderOpen" v-model:blocks="draft.blocks" />
      <ProjectSettingsDialog
         v-model:open="settingsOpen"
         v-model:settings="draft.settings"
         :description="draft.description"
      />
   </div>
</template>
