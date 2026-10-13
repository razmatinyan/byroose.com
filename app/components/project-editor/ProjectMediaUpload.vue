<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from "vue";
import { buttonVariants } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { mediaAcceptFor } from "#shared/schemas/media";
import type { MediaAsset, MediaKind } from "#shared/schemas/media";

const {
   kinds,
   title,
   multiple = false,
   compact = false,
} = defineProps<{
   kinds: readonly MediaKind[];
   title: string;
   multiple?: boolean;
   compact?: boolean;
}>();

const emit = defineEmits<{
   uploaded: [asset: MediaAsset];
}>();

const limitCopy: Record<MediaKind, string> = {
   image: "JPG, PNG, WebP, AVIF, or GIF up to 25 MB.",
   video: "MP4 or WebM up to 200 MB.",
};

const fileInput = useTemplateRef<HTMLInputElement>("fileInput");
const dragging = shallowRef(false);
const queue = shallowRef({ index: 0, total: 0 });
const { errorMessage, progress, status, upload } = useMediaUpload();

const accept = computed(() => mediaAcceptFor(kinds));
const hint = computed(() => kinds.map((kind) => limitCopy[kind]).join(" "));
const progressPercent = computed(() => Math.round(progress.value * 100));
const progressLabel = computed(() =>
   queue.value.total > 1
      ? `Uploading ${queue.value.index} of ${queue.value.total}, ${progressPercent.value}%`
      : `Uploading ${progressPercent.value}%`,
);

function chooseFiles() {
   fileInput.value?.click();
}

async function uploadFiles(files: File[]) {
   if (!files.length || status.value === "uploading") return;

   const selected = multiple ? files : files.slice(0, 1);

   for (const [index, file] of selected.entries()) {
      queue.value = { index: index + 1, total: selected.length };
      const asset = await upload(file, kinds);
      if (!asset) break;
      emit("uploaded", asset);
   }

   queue.value = { index: 0, total: 0 };
}

async function onFileChange(event: Event) {
   if (!(event.target instanceof HTMLInputElement)) return;

   const files = [...(event.target.files ?? [])];
   event.target.value = "";
   await uploadFiles(files);
}

async function onDrop(event: DragEvent) {
   dragging.value = false;
   await uploadFiles([...(event.dataTransfer?.files ?? [])]);
}
</script>

<template>
   <div class="media-upload" :data-compact="compact || undefined">
      <input
         ref="fileInput"
         class="sr-only"
         type="file"
         :accept="accept"
         :multiple="multiple"
         tabindex="-1"
         aria-hidden="true"
         @change="onFileChange"
      />

      <div v-if="status === 'uploading'" class="media-upload-frame">
         <div
            class="media-upload-progress"
            role="progressbar"
            :aria-label="title"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="progressPercent"
         >
            <span class="media-upload-progress-bar" :style="{ width: `${progressPercent}%` }" />
         </div>
         <p class="media-upload-hint">{{ progressLabel }}</p>
      </div>

      <button
         v-else
         type="button"
         class="media-upload-frame media-upload-dropzone"
         :data-dragging="dragging || undefined"
         @click="chooseFiles"
         @dragover.prevent="dragging = true"
         @dragleave="dragging = false"
         @drop.prevent="onDrop"
      >
         <Icon :name="compact ? appIcons.plus : appIcons.upload" class="media-upload-icon" aria-hidden="true" />
         <span class="media-upload-title">{{ title }}</span>
         <template v-if="!compact">
            <span class="media-upload-hint">{{ hint }}</span>
            <span :class="cn(buttonVariants({ variant: 'dark', size: 'lg' }), 'mt-2')">
               {{ multiple ? "Choose files" : "Choose file" }}
            </span>
         </template>
      </button>

      <p v-if="status === 'error'" role="alert" class="media-upload-error">
         {{ errorMessage }}
      </p>
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.media-upload-frame {
   @apply flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl bg-canvas-shade px-6 text-center;
}

.media-upload[data-compact] .media-upload-frame {
   @apply aspect-[4/3] gap-2 px-4;
}

.media-upload-dropzone {
   @apply cursor-pointer border-2 border-dashed border-foreground/15 transition-colors outline-none hover:border-foreground/35 focus-visible:border-foreground/50 focus-visible:ring-3 focus-visible:ring-ring/50;
}

.media-upload-dropzone[data-dragging] {
   @apply border-foreground/50 bg-muted;
}

.media-upload-icon {
   @apply size-8;
}

.media-upload[data-compact] .media-upload-icon {
   @apply size-6;
}

.media-upload-title {
   @apply text-2xl font-semibold tracking-[-0.03em];
}

.media-upload[data-compact] .media-upload-title {
   @apply text-base;
}

.media-upload-hint {
   @apply text-sm text-muted-foreground;
}

.media-upload-error {
   @apply mt-3 text-sm font-medium text-destructive;
}

.media-upload-progress {
   @apply h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-foreground/10;
}

.media-upload-progress-bar {
   @apply block h-full rounded-full bg-foreground transition-[width] duration-200 ease-out;
}
</style>
