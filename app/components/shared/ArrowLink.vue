<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import type { ComponentPublicInstance } from "vue";
import { unrefElement } from "@vueuse/core";
import { NuxtLink } from "#components";
import { appIcons } from "@/lib/icons";

const {
   to,
   label,
   external = false,
   size = "md",
} = defineProps<{
   to?: string;
   label: string;
   external?: boolean;
   size?: "sm" | "md" | "lg";
}>();

const triggerSelector = "[data-arrow-link-trigger]";

const link = useTemplateRef<ComponentPublicInstance | HTMLElement>("link");

const linkAttributes = computed(() => {
   if (!to) return {};

   return {
      to,
      external,
      target: external ? "_blank" : undefined,
      rel: external ? "noopener noreferrer" : undefined,
      "aria-label": label,
   };
});

function findTrigger() {
   const element = unrefElement(link);
   if (!(element instanceof HTMLElement)) return undefined;
   if (to) return element;

   return element.closest<HTMLElement>(triggerSelector) ?? element;
}

useMenuLinkMotion(link, { trigger: findTrigger });
useArrowSwapHover(link, { scale: false, trigger: findTrigger });
useUnderlineSweep(link, { trigger: findTrigger });
</script>

<template>
   <component :is="to ? NuxtLink : 'span'" ref="link" v-bind="linkAttributes" class="arrow-link" :data-size="size">
      <span v-if="!to" class="sr-only">{{ label }}</span>
      <span class="arrow-link-texts" data-menu-texts aria-hidden="true">
         <span class="arrow-link-label" data-menu-label>{{ label }}</span>
         <span class="arrow-link-label arrow-link-label-copy" data-menu-label-copy>{{ label }}</span>
      </span>
      <span class="arrow-link-icon" aria-hidden="true">
         <span class="arrow-link-glyph" data-arrow-swap-glyph>
            <Icon :name="appIcons.arrowUpRight" />
         </span>
         <span class="arrow-link-glyph" data-arrow-swap-glyph-copy>
            <Icon :name="appIcons.arrowUpRight" />
         </span>
      </span>
      <span class="arrow-link-line" data-sweep-line aria-hidden="true" />
   </component>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.arrow-link {
   @apply relative flex items-center justify-between rounded-sm font-medium tracking-[-0.03em] outline-none focus-visible:ring-3 focus-visible:ring-ring/50;
}

.arrow-link[data-size="sm"] {
   @apply gap-3 pb-2 text-lg md:text-xl;
}

.arrow-link[data-size="md"] {
   @apply w-full max-w-80 gap-6 pb-3 text-xl md:text-2xl;
}

.arrow-link[data-size="lg"] {
   @apply w-full gap-8 pb-4 text-5xl leading-tight font-semibold tracking-[-0.05em] md:pb-5 md:text-6xl lg:text-7xl xl:pb-6 xl:text-8xl 2xl:text-9xl;
}

.arrow-link-texts {
   @apply grid min-w-0 overflow-hidden py-0.5 pe-[0.08em] whitespace-nowrap;
}

.arrow-link-label {
   @apply block;
   grid-area: 1 / 1;
   font-kerning: none;
   text-rendering: optimizeSpeed;
}

.arrow-link-label-copy {
   visibility: hidden;
}

.arrow-link-label :deep(.site-menu-character) {
   display: inline-block;
}

.arrow-link-icon {
   @apply grid shrink-0 overflow-hidden;
}

.arrow-link[data-size="sm"] .arrow-link-icon {
   @apply size-4 md:size-5;
}

.arrow-link[data-size="md"] .arrow-link-icon {
   @apply size-5 md:size-6;
}

.arrow-link[data-size="lg"] .arrow-link-icon {
   @apply size-10 md:size-12 xl:size-16 2xl:size-20;
}

.arrow-link-glyph {
   @apply col-start-1 row-start-1 grid place-items-center;
}

.arrow-link-glyph :deep(svg) {
   @apply size-full;
}

.arrow-link-glyph[data-arrow-swap-glyph-copy] {
   transform: translate(-200%, 150%);
}

.arrow-link-line {
   @apply absolute inset-x-0 bottom-0 h-px bg-current;
}
</style>
