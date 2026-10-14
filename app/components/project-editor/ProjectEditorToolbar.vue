<script setup lang="ts">
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appIcons } from "@/lib/icons";

type ProjectStatus = "draft" | "published" | "archived";

const {
   status,
   missing,
   canReorder = false,
   busy = false,
} = defineProps<{
   status: ProjectStatus;
   missing: readonly string[];
   canReorder?: boolean;
   busy?: boolean;
}>();

const previewing = defineModel<boolean>("previewing", { required: true });

const emit = defineEmits<{
   openSettings: [];
   openOrder: [];
   saveDraft: [];
   publish: [];
   unpublish: [];
   archive: [];
   delete: [];
}>();

const checkRequested = shallowRef(false);
const deleteOpen = shallowRef(false);

const showMissing = computed(() => checkRequested.value && missing.length > 0);
const previewLabel = computed(() => (previewing.value ? "Back to editing" : "Preview"));

function publish() {
   if (missing.length) {
      checkRequested.value = true;
      return;
   }

   checkRequested.value = false;
   emit("publish");
}

function confirmDelete() {
   deleteOpen.value = false;
   emit("delete");
}
</script>

<template>
   <div class="editor-toolbar">
      <div class="editor-toolbar-dock">
         <div v-if="showMissing" class="editor-toolbar-check" role="alert">
            <div class="editor-toolbar-check-head">
               <p class="font-semibold">Add these before publishing</p>
               <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close"
                  @click="checkRequested = false"
               >
                  <Icon :name="appIcons.close" aria-hidden="true" />
               </Button>
            </div>
            <ul class="editor-toolbar-check-list">
               <li v-for="item in missing" :key="item">{{ item }}</li>
            </ul>
         </div>

         <div class="editor-toolbar-inner" role="toolbar" aria-label="Project actions">
            <Button
               variant="ghost"
               size="icon-lg"
               class="rounded-full"
               aria-label="Project settings"
               title="Project settings"
               :disabled="busy"
               @click="emit('openSettings')"
            >
               <Icon :name="appIcons.settings" aria-hidden="true" />
            </Button>
            <Button
               variant="ghost"
               size="icon-lg"
               class="rounded-full"
               :aria-label="previewLabel"
               :title="previewLabel"
               :aria-pressed="previewing"
               @click="previewing = !previewing"
            >
               <Icon :name="previewing ? appIcons.eyeOff : appIcons.eye" aria-hidden="true" />
            </Button>
            <Button
               variant="ghost"
               size="icon-lg"
               class="rounded-full"
               aria-label="Reorder blocks"
               title="Reorder blocks"
               :disabled="busy || !canReorder"
               @click="emit('openOrder')"
            >
               <Icon :name="appIcons.arrowUpDown" aria-hidden="true" />
            </Button>
            <Button
               variant="ghost"
               size="icon-lg"
               class="rounded-full"
               aria-label="Save as draft"
               title="Save as draft"
               :disabled="busy"
               @click="emit('saveDraft')"
            >
               <Icon :name="appIcons.save" aria-hidden="true" />
            </Button>

            <div class="editor-toolbar-split">
               <Button variant="dark" size="lg" class="editor-toolbar-publish" :disabled="busy" @click="publish">
                  Publish
               </Button>
               <span class="editor-toolbar-divider" aria-hidden="true" />
               <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                     <Button
                        variant="dark"
                        size="lg"
                        class="editor-toolbar-more"
                        aria-label="More publishing options"
                        title="More publishing options"
                        :disabled="busy"
                     >
                        <Icon :name="appIcons.chevronDown" aria-hidden="true" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="end" class="min-w-56">
                     <DropdownMenuItem v-if="status === 'published'" @select="emit('unpublish')">
                        <Icon :name="appIcons.undo" aria-hidden="true" />
                        Unpublish
                     </DropdownMenuItem>
                     <DropdownMenuItem v-if="status !== 'archived'" @select="emit('archive')">
                        <Icon :name="appIcons.archive" aria-hidden="true" />
                        Archive
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem variant="destructive" @select="deleteOpen = true">
                        <Icon :name="appIcons.trash" aria-hidden="true" />
                        Delete project
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
      </div>

      <Dialog v-model:open="deleteOpen">
         <DialogContent class="max-w-md">
            <DialogTitle class="text-xl">Delete this project?</DialogTitle>
            <DialogDescription>
               The project and its content will be removed. This cannot be undone.
            </DialogDescription>
            <div class="mt-2 flex justify-end gap-2">
               <Button variant="outline" @click="deleteOpen = false">Cancel</Button>
               <Button variant="destructive" @click="confirmDelete">Delete project</Button>
            </div>
         </DialogContent>
      </Dialog>
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.editor-toolbar {
   @apply pointer-events-none fixed inset-x-0 bottom-0 z-60 flex justify-center p-3 sm:p-4;
}

.editor-toolbar-dock {
   @apply relative flex flex-col items-center;
}

.editor-toolbar-inner {
   @apply pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-card p-2 shadow-xl;
}

.editor-toolbar-check {
   @apply pointer-events-auto absolute right-0 bottom-full mb-3 w-72 rounded-3xl border border-border bg-card p-4 shadow-xl;
}

.editor-toolbar-check-head {
   @apply -mt-1 -mr-1 flex items-center justify-between gap-2;
}

.editor-toolbar-check-list {
   @apply mt-2 list-disc ps-5 text-sm text-muted-foreground;
}

.editor-toolbar-split {
   @apply ms-1 flex rounded-full bg-foreground;
}

.editor-toolbar-divider {
   @apply w-px self-stretch bg-primary-foreground/30;
}

.editor-toolbar-publish {
   @apply rounded-l-full rounded-r-none ps-6;
}

.editor-toolbar-more {
   @apply rounded-l-none rounded-r-full ps-3 pe-4;
}
</style>
