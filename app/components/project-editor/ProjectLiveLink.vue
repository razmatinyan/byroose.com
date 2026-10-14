<script setup lang="ts">
import { useTemplateRef } from "vue";
import { appIcons } from "@/lib/icons";

const { href, label = "Visit Live Website" } = defineProps<{
   href: string;
   label?: string;
}>();

const link = useTemplateRef<HTMLAnchorElement>("link");

useMenuLinkMotion(link);
useArrowSwapHover(link, { scale: false });
useUnderlineSweep(link);
</script>

<template>
   <a ref="link" :href="href" class="live-link" target="_blank" rel="noopener" :aria-label="label">
      <span class="live-link-texts" data-menu-texts aria-hidden="true">
         <span class="live-link-label" data-menu-label>{{ label }}</span>
         <span class="live-link-label live-link-label-copy" data-menu-label-copy>{{ label }}</span>
      </span>
      <span class="live-link-icon" aria-hidden="true">
         <span class="live-link-glyph" data-arrow-swap-glyph>
            <Icon :name="appIcons.arrowUpRight" />
         </span>
         <span class="live-link-glyph" data-arrow-swap-glyph-copy>
            <Icon :name="appIcons.arrowUpRight" />
         </span>
      </span>
      <span class="live-link-line" data-sweep-line aria-hidden="true" />
   </a>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.live-link {
   @apply relative flex w-full max-w-80 items-center justify-between gap-6 rounded-sm pb-3 text-xl tracking-[-0.03em] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:text-2xl;
}

.live-link-texts {
   @apply grid overflow-hidden py-0.5 whitespace-nowrap;
}

.live-link-label {
   @apply block;
   grid-area: 1 / 1;
   font-kerning: none;
   text-rendering: optimizeSpeed;
}

.live-link-label-copy {
   visibility: hidden;
}

.live-link-label :deep(.site-menu-character) {
   display: inline-block;
}

.live-link-icon {
   @apply grid size-5 shrink-0 overflow-hidden md:size-6;
}

.live-link-glyph {
   @apply col-start-1 row-start-1 grid place-items-center;
}

.live-link-glyph :deep(svg) {
   @apply size-full;
}

.live-link-glyph[data-arrow-swap-glyph-copy] {
   transform: translate(-200%, 150%);
}

.live-link-line {
   @apply absolute inset-x-0 bottom-0 h-px bg-foreground;
}
</style>
