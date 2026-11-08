<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import { NuxtLink } from "#components";
import SplitText from "@/components/shared/SplitText.vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import type { SplitTextResult } from "@/lib/split-text";

const {
  title,
  description,
  actionLabel = "Start a project",
} = defineProps<{
  title: string;
  description: string;
  actionLabel?: string;
}>();

const heroRoot = useTemplateRef<HTMLElement>("heroRoot");
const titleSplit = shallowRef<SplitTextResult>();
const descriptionSplit = shallowRef<SplitTextResult>();
const { revealed } = useServiceHeroMotion(
  heroRoot,
  titleSplit,
  descriptionSplit,
);

function setTitleSplit(parts: SplitTextResult) {
  titleSplit.value = parts;
}

function setDescriptionSplit(parts: SplitTextResult) {
  descriptionSplit.value = parts;
}
</script>

<template>
  <section
    ref="heroRoot"
    class="service-hero section-gutter"
    :data-service-hero-revealed="revealed || undefined"
  >
    <div class="service-hero-content">
      <SplitText
        class="service-hero-title"
        as="h1"
        mask="lines"
        :text="title"
        type="lines"
        @split="setTitleSplit"
      />
      <div class="service-hero-copy">
        <SplitText
          class="service-hero-description"
          as="p"
          mask="lines"
          :text="description"
          type="lines"
          @split="setDescriptionSplit"
        />
        <div class="service-hero-action-mask">
          <span class="service-hero-action" data-service-hero-action>
            <Button :as="NuxtLink" to="/contact" variant="dark" size="cta-lg">
              {{ actionLabel }}
              <template #icon>
                <ButtonIcon />
              </template>
            </Button>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.service-hero {
  @apply pt-10 pb-section lg:pt-14;
}

.service-hero-content {
  @apply grid content-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-12;
}

.service-hero-title {
  @apply m-0 leading-[0.88] font-bold tracking-[-0.05em] lg:col-start-2 lg:row-start-1;
  font-size: clamp(2.5rem, 7.4vw, 8rem);
  margin-top: -0.24em;
  max-width: 9.2em;
}

.service-hero-copy {
  @apply flex max-w-md flex-col items-start gap-6 lg:col-start-1 lg:row-start-1 lg:max-w-none lg:pt-3;
}

.service-hero-description {
  @apply m-0 text-xl leading-tight font-semibold tracking-[-0.04em] text-balance text-foreground lg:text-wrap;
}

@media (min-width: 64rem) {
  .service-hero-description {
    font-size: clamp(1.0625rem, 1.5vw, 1.5rem);
    max-width: 17em;
  }
}

.service-hero-action-mask {
  @apply -m-1 overflow-hidden p-1;
}

.service-hero-action {
  @apply block;
}

.service-hero :deep(.split-text-line),
.service-hero :deep(.split-text-line-mask) {
  display: block;
}

.service-hero-title :deep(.split-text-line-mask) {
  margin-bottom: -0.3em;
  margin-inline: -0.12em;
  padding-block: 0.12em 0.18em;
  padding-inline: 0.12em;
}

.service-hero-description :deep(.split-text-line-mask) {
  margin-bottom: -0.3em;
  padding-block: 0.1em 0.2em;
}

.service-hero:not([data-service-hero-revealed]) .service-hero-title,
.service-hero:not([data-service-hero-revealed]) .service-hero-description,
.service-hero:not([data-service-hero-revealed]) .service-hero-action {
  visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .service-hero:not([data-service-hero-revealed]) .service-hero-title,
  .service-hero:not([data-service-hero-revealed]) .service-hero-description,
  .service-hero:not([data-service-hero-revealed]) .service-hero-action {
    visibility: inherit;
  }
}
</style>
