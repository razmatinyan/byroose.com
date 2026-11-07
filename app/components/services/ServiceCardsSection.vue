<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";
import { surfaceTones } from "@/lib/surfaces";
import type { SurfaceTone } from "@/lib/surfaces";
import { cn } from "@/lib/utils";

export interface ServiceCard {
  title: string;
  description: string;
  tone: SurfaceTone;
}

const { title, cards } = defineProps<{
  title: string;
  cards: readonly ServiceCard[];
}>();

const cardTilts = ["-3deg", "2.5deg", "-2deg", "3deg"] as const;

const sectionRoot = useTemplateRef<HTMLElement>("sectionRoot");
const titleSplit = shallowRef<SplitTextResult>();
useServiceCardsMotion(sectionRoot, titleSplit);

function setTitleSplit(parts: SplitTextResult) {
  titleSplit.value = parts;
}

function cardNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}
</script>

<template>
  <section ref="sectionRoot" class="service-cards" data-header-surface="dark">
    <div class="section-gutter">
      <SplitText
        class="section-title service-cards-title"
        data-service-cards-title
        as="h2"
        mask="words"
        :text="title"
        type="words"
        @split="setTitleSplit"
      />
    </div>

    <div class="service-cards-track section-gutter" data-service-cards-track>
      <svg
        class="service-cards-line"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          data-service-cards-line
          d="M-20 40 C 120 40, 160 170, 320 180 S 560 120, 760 130 S 1040 210, 1180 230 S 1380 270, 1460 280"
          fill="none"
          stroke="currentColor"
          stroke-width="6"
          stroke-linecap="round"
        />
      </svg>

      <ul class="service-cards-list">
        <li
          v-for="(card, index) in cards"
          :key="card.title"
          class="service-card"
          data-service-card
          :style="{
            '--service-card-tilt': cardTilts[index % cardTilts.length],
          }"
        >
          <div :class="cn('service-card-surface', surfaceTones[card.tone])">
            <span class="service-card-number">{{ cardNumber(index) }}</span>
            <div class="service-card-copy">
              <h3 class="service-card-title">{{ card.title }}</h3>
              <p class="service-card-description">{{ card.description }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.service-cards {
  @apply relative z-10 mt-12 overflow-x-clip rounded-[clamp(1.5rem,3vw,3rem)] bg-foreground py-section text-background md:mt-20 xl:mt-24;
}

.service-cards-title {
  @apply text-center text-balance;
}

.service-cards-title :deep(.split-text-word),
.service-cards-title :deep(.split-text-word-mask) {
  display: inline-block;
}

.service-cards-title :deep(.split-text-word-mask) {
  margin-block: -0.12em -0.18em;
  padding-block: 0.12em 0.18em;
}

.service-cards-title :deep(.split-text-word),
.service-card {
  visibility: hidden;
}

.service-cards-track {
  @apply relative mt-16 md:mt-24;
}

.service-cards-line {
  @apply pointer-events-none absolute inset-x-0 top-[12%] hidden h-[70%] w-full lg:block;
}

.service-cards-list {
  @apply relative m-0 grid list-none gap-6 p-0 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-6;
}

.service-card {
  @apply relative flex;
  --service-card-hover-ease: cubic-bezier(0.19, 1, 0.22, 1);
}

.service-card-surface {
  @apply flex min-h-72 w-full flex-col justify-between gap-12 rounded-2xl p-6 transition-[rotate,scale] duration-500 ease-(--service-card-hover-ease) motion-reduce:transition-none md:aspect-[4/5] md:min-h-0 xl:p-8;
  rotate: calc(var(--service-card-tilt) * 0.4);
}

@media (min-width: 48rem) {
  .service-card-surface {
    rotate: var(--service-card-tilt);
  }
}

@media (hover: hover) and (pointer: fine) {
  .service-card:hover {
    @apply z-10;
  }

  .service-card:hover .service-card-surface {
    rotate: 0deg;
    scale: 1.05;
  }
}

.service-card:nth-child(even) {
  @apply lg:translate-y-16;
}

.service-card-number {
  @apply text-6xl leading-none font-bold tracking-[-0.05em] tabular-nums xl:text-7xl;
}

.service-card-title {
  @apply m-0 text-3xl leading-[0.95] font-bold tracking-[-0.045em] text-balance xl:text-4xl;
}

.service-card-description {
  @apply m-0 mt-4 text-base leading-snug font-medium tracking-[-0.02em] opacity-80 xl:text-lg;
}
</style>
