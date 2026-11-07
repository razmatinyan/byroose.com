<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import ArrowLink from "@/components/shared/ArrowLink.vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { ServicesAnchor } from "@/lib/services-anchors";
import type { SplitTextResult } from "@/lib/split-text";

const {
   anchor,
   description,
   linkLabel,
   linkTo,
   surface = "light",
   title,
} = defineProps<{
   anchor: ServicesAnchor;
   description: string;
   linkLabel: string;
   linkTo: string;
   surface?: "dark" | "light";
   title: string;
}>();

const offerRoot = useTemplateRef<HTMLElement>("offerRoot");
const textSplits = shallowRef<(SplitTextResult | undefined)[]>([
   undefined,
   undefined,
]);

useServicesRevealMotion(offerRoot, textSplits);

function setTextSplit(index: number, parts: SplitTextResult) {
   textSplits.value = textSplits.value.with(index, parts);
}
</script>

<template>
   <section
      :id="anchor"
      ref="offerRoot"
      class="services-offer"
      :data-surface="surface"
   >
      <div
         v-if="surface === 'dark'"
         class="services-offer-backdrop"
         data-services-reveal-backdrop
         data-header-surface="dark"
         aria-hidden="true"
      />
      <div class="services-offer-intro section-gutter">
         <SplitText
            class="services-offer-title"
            data-services-reveal-text
            as="h2"
            mask="lines"
            :text="title"
            type="lines"
            @split="setTextSplit(0, $event)"
         />
         <div class="services-offer-summary">
            <SplitText
               class="services-offer-description"
               data-services-reveal-text
               as="p"
               mask="lines"
               :text="description"
               type="lines"
               @split="setTextSplit(1, $event)"
            />
            <div class="services-offer-link-mask">
               <div class="services-offer-link" data-services-reveal-rise>
                  <ArrowLink :to="linkTo" :label="linkLabel" />
               </div>
            </div>
         </div>
      </div>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.services-offer {
   @apply pb-section text-foreground;
}

.services-offer[data-surface="light"] {
   padding-bottom: calc(var(--spacing-section) * 2);
}

.services-offer[data-surface="dark"] {
   @apply relative text-background;
}

.services-offer-backdrop {
   @apply absolute inset-x-0 -bottom-px -z-10 bg-foreground;
   top: calc(var(--services-reveal-backdrop-lead, 0) * -100svh);
}

.services-offer-intro {
   @apply flex flex-col pt-section;
}

.services-offer[data-surface="light"] .services-offer-intro {
   @apply relative z-10 bg-background;
}

.services-offer-title {
   @apply m-0 text-service font-bold tracking-[-0.045em] text-balance;
}

.services-offer-summary {
   @apply mt-4 flex w-full flex-col items-start md:mt-8 md:w-2/3 md:self-end xl:mt-12;
}

.services-offer-description {
   @apply m-0 w-full text-2xl leading-[0.9] font-semibold tracking-[-0.04em] text-pretty md:text-4xl xl:text-5xl 2xl:text-6xl;
}

.services-offer[data-surface="dark"] .services-offer-title,
.services-offer[data-surface="dark"] .services-offer-description {
   @apply mix-blend-difference;
}

.services-offer-link-mask {
   @apply mt-10 overflow-hidden p-1 md:mt-14;
}

.services-offer-link {
   visibility: hidden;
}

.services-offer-link :deep(.arrow-link) {
   @apply w-fit max-w-full;
}

.services-offer :deep(.split-text-line),
.services-offer :deep(.split-text-line-mask) {
   display: block;
}

.services-offer :deep(.split-text-line-mask) {
   margin-block: -0.12em -0.18em;
   padding-block: 0.12em 0.18em;
}

.services-offer :deep(.split-text-line) {
   visibility: hidden;
}

</style>
