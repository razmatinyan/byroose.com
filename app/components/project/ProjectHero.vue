<script setup lang="ts">
import { useTemplateRef } from "vue";
import type { ProjectCategory } from "@/lib/projects";
import ProjectLiveLink from "./ProjectLiveLink.vue";

const { name, description, categories, liveUrl } = defineProps<{
   name: string;
   description: string;
   categories: readonly ProjectCategory[];
   liveUrl?: string;
}>();

const title = useTemplateRef<HTMLElement>("title");

useFitText(title, { maxScale: 1 });
</script>

<template>
   <section class="project-hero section-gutter">
      <div class="project-hero-content">
         <div class="project-hero-title">
            <h1 ref="title" class="project-hero-title-text">{{ name }}</h1>
         </div>

         <div class="project-hero-meta">
            <section v-if="categories.length" class="project-hero-services" aria-labelledby="project-services-title">
               <h2 id="project-services-title" class="project-hero-services-title">Services</h2>
               <ul class="project-hero-services-list">
                  <li v-for="category in categories" :key="category">{{ category }}</li>
               </ul>
            </section>

            <div v-if="liveUrl" class="project-hero-live">
               <ProjectLiveLink :href="liveUrl" />
            </div>
         </div>

         <p class="project-hero-description">{{ description }}</p>
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

.project-hero-title-text {
   @apply inline-block w-max pe-[0.05em] leading-[0.76] font-bold tracking-[-0.05em] whitespace-nowrap;
   font-size: calc(23.71cqi * var(--fit-text-scale, 1));
   margin-block: -0.2em 0.2em;
   padding-block: 0.2em;
}

.project-hero-meta {
   @apply order-last flex flex-col gap-10 self-end sm:flex-row sm:items-end sm:gap-16 lg:order-none;
}

.project-hero-services {
   @apply flex min-w-0 flex-col items-start gap-4;
}

.project-hero-services-title {
   @apply text-xl font-semibold tracking-[-0.04em] md:text-2xl;
}

.project-hero-services-list {
   @apply flex flex-col gap-0.5 text-2xl leading-tight font-medium tracking-[-0.05em] md:text-3xl;
}

.project-hero-live {
   @apply flex min-w-0 sm:flex-1 sm:justify-center;
}

.project-hero-description {
   @apply m-0 w-full max-w-[20em] self-end text-2xl leading-[0.95] font-semibold tracking-[-0.04em] text-pretty md:text-4xl lg:col-start-2 xl:text-5xl;
}
</style>
