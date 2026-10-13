<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useTextareaAutosize } from "@vueuse/core";
import type { EditorTextBlock } from "@/lib/project-editor-blocks";

const block = defineModel<EditorTextBlock>({ required: true });

const titleField = useTemplateRef<HTMLTextAreaElement>("titleField");
const bodyField = useTemplateRef<HTMLTextAreaElement>("bodyField");

const title = computed({
   get: () => block.value.title,
   set: (value: string) => {
      block.value = { ...block.value, title: value.replace(/\s*\n\s*/g, " ") };
   },
});

const body = computed({
   get: () => block.value.body,
   set: (value: string) => {
      block.value = { ...block.value, body: value };
   },
});

useTextareaAutosize({ element: titleField, input: title });
useTextareaAutosize({ element: bodyField, input: body });
</script>

<template>
   <div class="text-block" :data-align="block.align">
      <div class="text-block-content">
         <textarea
            ref="titleField"
            v-model="title"
            class="text-block-title"
            aria-label="Subtitle"
            placeholder="Subtitle"
            rows="1"
            maxlength="200"
         />
         <textarea
            ref="bodyField"
            v-model="body"
            class="text-block-body"
            aria-label="Text"
            placeholder="Write the text. Leave an empty line between paragraphs."
            rows="3"
            maxlength="10000"
         />
      </div>
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.text-block {
   @apply flex flex-col;
}

.text-block[data-align="center"] {
   @apply items-center;
}

.text-block[data-align="right"] {
   @apply items-end;
}

.text-block-content {
   @apply flex w-full max-w-3xl flex-col gap-6;
}

.text-block-title,
.text-block-body {
   @apply w-full resize-none overflow-hidden bg-transparent outline-none focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50;
}

.text-block-title {
   @apply text-2xl leading-snug font-medium tracking-[-0.02em] text-foreground placeholder:text-foreground/30 md:text-3xl;
}

.text-block-body {
   @apply text-xl leading-snug tracking-[-0.01em] text-brand-soft placeholder:text-brand-soft/50 md:text-2xl;
}
</style>
