<script setup lang="ts">
import { computed } from "vue";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogTitle,
} from "@/components/ui/dialog";
import type { ProjectSettings } from "@/lib/project-editor-settings";

const { description } = defineProps<{
   description: string;
}>();

const open = defineModel<boolean>("open", { required: true });
const settings = defineModel<ProjectSettings>("settings", { required: true });

const seoDescriptionLimit = 160;

const seoPlaceholder = computed(
   () => description.trim() || "Leave empty to use the project description",
);
const seoLength = computed(() => settings.value.seoDescription.length);

function update<Key extends keyof ProjectSettings>(key: Key, value: ProjectSettings[Key]) {
   settings.value = { ...settings.value, [key]: value };
}

function inputValue(event: Event) {
   return event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement
      ? event.target.value
      : "";
}
</script>

<template>
   <Dialog v-model:open="open">
      <DialogContent class="settings-dialog" data-lenis-prevent>
         <DialogTitle class="text-2xl">Project settings</DialogTitle>
         <DialogDescription>How the project appears in search results.</DialogDescription>

         <label class="settings-field">
            <span class="settings-label">Search description</span>
            <textarea
               class="settings-input settings-textarea"
               :value="settings.seoDescription"
               :placeholder="seoPlaceholder"
               :maxlength="seoDescriptionLimit"
               rows="3"
               @input="update('seoDescription', inputValue($event))"
            />
            <span class="settings-hint">{{ seoLength }} of {{ seoDescriptionLimit }} characters</span>
         </label>

         <label class="settings-field">
            <span class="settings-label">Keywords</span>
            <input
               class="settings-input"
               :value="settings.keywords"
               placeholder="branding, website, reels"
               @input="update('keywords', inputValue($event))"
            />
            <span class="settings-hint">Separate keywords with commas.</span>
         </label>
      </DialogContent>
   </Dialog>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.settings-dialog {
   @apply max-h-[88svh] gap-6 overflow-y-auto sm:max-w-xl;
}

.settings-field {
   @apply flex flex-col gap-2;
}

.settings-label {
   @apply text-sm font-semibold;
}

.settings-hint {
   @apply text-sm text-muted-foreground;
}

.settings-input {
   @apply h-11 w-full min-w-0 rounded-action border border-input bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50;
}

.settings-textarea {
   @apply h-auto resize-none py-2.5;
}
</style>
