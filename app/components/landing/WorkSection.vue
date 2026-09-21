<script setup lang="ts">
import { useMediaQuery, useMounted, useTimeoutFn } from "@vueuse/core";
import {
   computed,
   defineAsyncComponent,
   shallowRef,
   useTemplateRef,
} from "vue";
import CaseStudyCard from "@/components/cards/CaseStudyCard.vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";
import type { SurfaceTone } from "@/lib/surfaces";

const TrailingTooltip = defineAsyncComponent(
   () => import("@/components/shared/TrailingTooltip.vue"),
);

interface CaseStudy {
   client: string;
   description: string;
   image: string;
   imageAlt: string;
   resultLabel: string;
   resultValue: string;
   revealTones: readonly SurfaceTone[];
   tone: SurfaceTone;
}

const workTitle = "What we've done";

const caseStudies: CaseStudy[] = [
   {
      client: "Nova Dairy",
      description:
         "A launch film and sixty cutdowns produced in one sprint, cut for every placement the brand actually buys.",
      image: "/images/hero/1.png",
      imageAlt: "Nova Dairy project visual",
      resultLabel: "Views earned across the launch",
      resultValue: "11M",
      revealTones: ["blue", "green", "yellow", "primary"],
      tone: "primary",
   },
   {
      client: "Kessler Tools",
      description:
         "A product site rebuilt around how buyers actually search, from the category pages down to the specs they compare.",
      image: "/images/hero/2.png",
      imageAlt: "Kessler Tools project visual",
      resultLabel: "More qualified enquiries",
      resultValue: "41%",
      revealTones: ["pink", "primary", "blue", "yellow"],
      tone: "yellow",
   },
   {
      client: "Halden Clinics",
      description:
         "A booking flow rebuilt in five weeks, with the questions patients could not answer taken out of the way.",
      image: "/images/hero/3.png",
      imageAlt: "Halden Clinics project visual",
      resultLabel: "Increase in completed bookings",
      resultValue: "+38%",
      revealTones: ["green", "yellow", "primary", "pink"],
      tone: "pink",
   },
   {
      client: "Marrow & Co",
      description:
         "One landing page rebuilt around a single offer, with the proof moved above the decision.",
      image: "/images/hero/4.png",
      imageAlt: "Marrow and Co project visual",
      resultLabel: "Conversion rate, up from 3.1%",
      resultValue: "4.7%",
      revealTones: ["yellow", "blue", "pink", "green"],
      tone: "green",
   },
   {
      client: "Vestlund",
      description:
         "Forty assets a month produced by four people, through an AI pipeline with human editing on every frame.",
      image: "/images/hero/5.png",
      imageAlt: "Vestlund project visual",
      resultLabel: "Lower cost per asset",
      resultValue: "62%",
      revealTones: ["primary", "pink", "green", "blue"],
      tone: "blue",
   },
   {
      client: "Piquant",
      description:
         "A reel format built to survive repetition, then run for nine months without losing its audience.",
      image: "/images/hero/6.png",
      imageAlt: "Piquant project visual",
      resultLabel: "Views earned in nine months",
      resultValue: "18M",
      revealTones: ["blue", "yellow", "pink", "primary"],
      tone: "primary",
   },
];

const workRoot = useTemplateRef<HTMLElement>("workRoot");
const titleSplit = shallowRef<SplitTextResult>();
const tooltipActive = shallowRef(false);
const tooltipImage = shallowRef("");
const mounted = useMounted();
const supportsFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
const shouldLoadTooltip = computed(
   () => mounted.value && supportsFinePointer.value,
);
const { start: scheduleTooltipClose, stop: cancelTooltipClose } = useTimeoutFn(
   () => {
      tooltipActive.value = false;
   },
   200,
   { immediate: false },
);

useWorkMotion(workRoot, { titleSplit });

function setTitleSplit(parts: SplitTextResult) {
   titleSplit.value = parts;
}

function activateTooltip(item: CaseStudy) {
   cancelTooltipClose();
   tooltipImage.value = item.image;
   tooltipActive.value = true;
}

function deactivateTooltip() {
   scheduleTooltipClose();
}
</script>

<template>
   <section id="work" ref="workRoot" class="work section-gutter">
      <SplitText
         class="section-title work-title"
         as="h2"
         mask="words"
         :text="workTitle"
         type="words"
         @split="setTitleSplit"
      />

      <div class="case-list">
         <CaseStudyCard
            v-for="item in caseStudies"
            :key="item.client"
            v-bind="item"
            @activate="activateTooltip(item)"
            @deactivate="deactivateTooltip"
         />
      </div>

      <TrailingTooltip
         v-if="shouldLoadTooltip"
         :active="tooltipActive"
         :image="tooltipImage"
      />
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.work {
   @apply w-full pb-section;
}

.work-title {
   @apply mx-auto max-w-[16ch] text-center;
   font-size: clamp(3.5rem, 12vw, 13rem);
}

.work-title :deep(.split-text-word),
.work-title :deep(.split-text-word-mask) {
   display: inline-block;
}

.work-title :deep(.split-text-word) {
   visibility: hidden;
}

.case-list {
   @apply mt-16 flex flex-col gap-20 md:mt-20 md:gap-28 xl:mt-24 xl:gap-32;
}
</style>
