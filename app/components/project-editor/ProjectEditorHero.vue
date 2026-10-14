<script setup lang="ts">
import { useTemplateRef } from "vue";
import { useTextareaAutosize } from "@vueuse/core";
import ProjectLiveLink from "./ProjectLiveLink.vue";
import ProjectServicesPicker from "./ProjectServicesPicker.vue";
import type { ServiceOption } from "./ProjectServicesPicker.vue";

const { serviceOptions } = defineProps<{
   serviceOptions: readonly ServiceOption[];
}>();

const name = defineModel<string>("name", { required: true });
const description = defineModel<string>("description", { required: true });
const serviceIds = defineModel<string[]>("serviceIds", { required: true });
const liveUrl = defineModel<string>("liveUrl", { required: true });

const previewing = useProjectEditorPreview();
const titleField = useTemplateRef<HTMLElement>("titleField");
const descriptionField = useTemplateRef<HTMLTextAreaElement>("descriptionField");

useFitText(titleField, { maxScale: 1 });
useTextareaAutosize({ element: descriptionField, input: description });

function updateName(event: Event) {
   if (event.target instanceof HTMLElement) {
      name.value = event.target.textContent?.replace(/\s+/g, " ").trimStart() ?? "";
   }
}
</script>

<template>
   <section class="project-hero section-gutter">
      <div class="project-hero-content">
         <h1 class="sr-only">{{ name || "New project" }}</h1>
         <div class="project-hero-title">
            <span
               ref="titleField"
               class="project-hero-title-field"
               :contenteditable="previewing ? 'false' : 'plaintext-only'"
               role="textbox"
               aria-label="Project name"
               :data-placeholder="previewing ? undefined : 'Project name'"
               spellcheck="false"
               @input="updateName"
               @keydown.enter.prevent
            />
         </div>

         <div class="project-hero-meta">
            <section
               v-if="!previewing || serviceIds.length"
               class="project-hero-meta-block"
               aria-labelledby="project-services-title"
            >
               <h2 id="project-services-title" class="project-hero-meta-title">Services</h2>
               <ProjectServicesPicker v-model="serviceIds" :options="serviceOptions" />
            </section>

            <div v-if="!previewing || liveUrl" class="project-hero-live">
               <ProjectLiveLink v-if="previewing" :href="liveUrl" />
               <div v-else class="project-hero-meta-block">
                  <label for="project-live-url" class="project-hero-meta-title">Live result link</label>
                  <input
                     id="project-live-url"
                     v-model.trim="liveUrl"
                     class="project-hero-link-field"
                     type="url"
                     inputmode="url"
                     placeholder="https://"
                     autocomplete="off"
                  />
               </div>
            </div>
         </div>

         <textarea
            ref="descriptionField"
            v-model="description"
            class="project-hero-description"
            aria-label="Project description"
            :placeholder="previewing ? undefined : 'Describe the project in a sentence or two.'"
            :readonly="previewing"
            rows="2"
            maxlength="300"
         />
      </div>
   </section>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.project-hero {
   @apply relative grid pt-10 pb-16 sm:pb-20;
   min-height: calc(100svh - 4.75rem - var(--project-hero-peek));
   --project-hero-peek: clamp(3rem, 9svh, 6rem);
}

.project-hero-content {
   @apply @container grid grid-rows-[auto_1fr] gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-x-16;
}

.project-hero-title {
   @apply col-span-full min-w-0 text-center;
}

.project-hero-title-field {
   @apply inline-block w-max pe-[0.05em] leading-[0.76] font-bold tracking-[-0.05em] whitespace-nowrap outline-none;
   font-size: calc(23.71cqi * var(--fit-text-scale, 1));
   margin-block: -0.2em 0.2em;
   padding-block: 0.2em;
}

.project-hero-title-field:empty::before {
   @apply text-foreground/20;
   content: attr(data-placeholder);
}

.project-hero-title-field:focus-visible {
   @apply rounded-sm ring-3 ring-ring/50;
}

.project-hero-meta {
   @apply order-last flex flex-col gap-10 self-end sm:flex-row sm:items-end sm:gap-16 lg:order-none;
}

.project-hero-meta-block {
   @apply flex min-w-0 flex-col items-start gap-4;
}

.project-hero-meta-title {
   @apply text-xl font-semibold tracking-[-0.04em] md:text-2xl;
}

.project-hero-live {
   @apply flex min-w-0 sm:flex-1 sm:justify-center;
}

.project-hero-link-field {
   @apply w-80 max-w-full border-b border-foreground/25 bg-transparent pb-3 text-xl tracking-[-0.03em] outline-none placeholder:text-foreground/30 focus-visible:border-foreground md:text-2xl;
}

.project-hero-description {
   @apply m-0 w-full max-w-[20em] resize-none self-end overflow-hidden bg-transparent text-2xl leading-[0.95] font-semibold tracking-[-0.04em] text-pretty outline-none placeholder:text-foreground/25 md:text-4xl lg:col-start-2 xl:text-5xl;
}

.project-hero-description:focus-visible {
   @apply rounded-sm ring-3 ring-ring/50;
}
</style>
