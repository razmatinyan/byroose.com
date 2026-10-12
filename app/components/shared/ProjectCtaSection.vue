<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import { NuxtLink } from "#components";
import SplitText from "@/components/shared/SplitText.vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import type { SplitTextResult } from "@/lib/split-text";

const titleLines = ["Have an idea?", "Let's build it."];
const title = titleLines.join(" ");
const contactRoute = "/contact";
const actionLabel = "Start a project";

const ctaRoot = useTemplateRef<HTMLElement>("ctaRoot");
const titleSplits = shallowRef<(SplitTextResult | undefined)[]>(
   titleLines.map(() => undefined),
);

useServicesRevealMotion(ctaRoot, titleSplits);

function setTitleSplit(index: number, parts: SplitTextResult) {
   titleSplits.value = titleSplits.value.map((entry, entryIndex) =>
      entryIndex === index ? parts : entry,
   );
}
</script>

<template>
   <section
      ref="ctaRoot"
      class="project-cta section-gutter"
      data-header-surface="dark"
   >
      <h2 class="project-cta-title">
         <span class="sr-only">{{ title }}</span>
         <span aria-hidden="true">
            <SplitText
               v-for="(line, index) in titleLines"
               :key="line"
               class="project-cta-title-line"
               data-services-reveal-text
               aria="none"
               mask="lines"
               :text="line"
               type="lines"
               @split="setTitleSplit(index, $event)"
            />
         </span>
      </h2>
      <div class="project-cta-action-mask">
         <span class="project-cta-action-rise" data-services-reveal-rise>
            <Button
               class="project-cta-action"
               :as="NuxtLink"
               :to="contactRoute"
               variant="light"
               size="cta-lg"
               :bounce-on-hover="true"
            >
               {{ actionLabel }}
               <template #icon>
                  <ButtonIcon :icon="appIcons.arrowRight" />
               </template>
            </Button>
         </span>
      </div>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.project-cta {
   @apply flex min-h-svh flex-col items-center justify-center bg-foreground py-section text-center text-background;
}

.project-cta-title {
   @apply m-0 leading-[0.88] font-bold tracking-[-0.05em];
   font-size: min(clamp(3.5rem, 11vw, 12rem), 12vw);
}

.project-cta-title-line {
   @apply block whitespace-nowrap;
}

.project-cta-title :deep(.split-text-line),
.project-cta-title :deep(.split-text-line-mask) {
   display: block;
}

.project-cta-title :deep(.split-text-line-mask) {
   margin-block: -0.12em -0.18em;
   padding-block: 0.12em 0.18em;
}

.project-cta-title :deep(.split-text-line) {
   visibility: hidden;
}

.project-cta-action-mask {
   @apply mt-16 overflow-x-visible overflow-y-clip md:mt-24;
   padding: 0.5rem;
}

.project-cta-action-rise {
   @apply block;
   visibility: hidden;
}

.project-cta-action {
   gap: 0.6em;
   min-height: 2.6em;
   padding-inline: 1.1em;
   font-size: clamp(1.25rem, 2.2vw, 2rem);
}

.project-cta-action :deep(.button-icon),
.project-cta-action :deep(.button-icon svg) {
   width: 1em;
   height: 1em;
}
</style>
