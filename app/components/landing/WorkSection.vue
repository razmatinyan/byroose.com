<script setup lang="ts">
import { defineAsyncComponent, shallowRef, useTemplateRef } from "vue";
import CaseStudyCard from "@/components/cards/CaseStudyCard.vue";
import cartoon from "@/data/projects/cartoon";
import sygen from "@/data/projects/sygen";
import ugcCreator from "@/data/projects/ugc-creator";
import type { ProjectCategory } from "@/lib/projects";
import MoreWorksPanel from "./MoreWorksPanel.vue";
import WorkLine from "./WorkLine.vue";
import { appIcons } from "@/lib/icons";
import { servicePagePaths } from "@/lib/services-anchors";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";
import type { SurfaceTone } from "@/lib/surfaces";

const TrailingTooltip = defineAsyncComponent(
   () => import("@/components/shared/TrailingTooltip.vue"),
);

interface CaseStudy {
   categories: readonly ProjectCategory[];
   client: string;
   description: string;
   href?: string;
   image: string;
   imageAlt: string;
   imageScale?: number;
   liveUrl?: string;
   results?: readonly { label: string; value: string }[];
   serviceLink?: { label: string; to: string };
   title: string;
   tone: SurfaceTone;
   video?: string;
}

const workTitle = "Case Studies";
const liveTooltipLabel = "Visit Live";

const caseStudies: CaseStudy[] = [
   {
      categories: ugcCreator.categories,
      client: "UGC Creator",
      description:
         "We built an AI-generated UGC creator to test how far virtual spokespeople can go: one consistent face, voice, and personality across every video. It's the same pipeline we use for client UGC ads.",
      href: "/work/ugc-creator",
      image: "/images/work/ugc-creator/cover.jpg",
      imageAlt:
         "The AI UGC creator getting ready in a yellow sweatshirt, wide-leg jeans, and a brown suede bag",
      imageScale: 1.05,
      serviceLink: {
         label: "Explore AI content creation",
         to: servicePagePaths.aiContent,
      },
      title: "AI UGC creator: a virtual spokesperson for brand videos",
      tone: "primary",
      video: "/images/work/ugc-creator/cover.mp4",
   },
   {
      categories: sygen.categories,
      client: "Sygen",
      description:
         "Sygen is our free tool for turning one brand color into an accessible light and dark color system, ready for code or Figma. We built it because we needed it ourselves.",
      href: "/work/sygen",
      image: "/images/work/sygen/cover.jpg",
      imageAlt:
         "Sygen home page on a desktop monitor, turning the brand color #2F5BEA into brand, neutral, and status scales",
      imageScale: 1.1,
      liveUrl: "https://sygenn.vercel.app/",
      title: "Sygen: a free color system generator built by forrrow",
      tone: "pink",
   },
   {
      categories: cartoon.categories,
      client: "Cartoon",
      description:
         "An animated series made with our AI pipeline, to show that brands can own a recurring character without a full animation studio.",
      href: "/work/cartoon",
      image: "/images/work/cartoon/cover.jpg",
      imageAlt:
         "The cartoon character in a grey knit sweater, leopard print cargo pants, yellow sneakers, and a black crossbody bag",
      imageScale: 1.05,
      title: "AI animated series: character content at social media speed",
      tone: "green",
      video: "/images/work/cartoon/cover.mp4",
   },
];

const tooltipPreload = caseStudies.map((item) => item.image);

const workRoot = useTemplateRef<HTMLElement>("workRoot");
const titleSplit = shallowRef<SplitTextResult>();
const {
   active: tooltipActive,
   hide: deactivateTooltip,
   icon: tooltipIcon,
   image: tooltipImage,
   label: tooltipLabel,
   shouldLoad: shouldLoadTooltip,
   show: showTooltip,
   size: tooltipSize,
} = useTrailingTooltip();

useWorkMotion(workRoot, { titleSplit });
useWorkLineMotion(workRoot);

function setTitleSplit(parts: SplitTextResult) {
   titleSplit.value = parts;
}

function activateTooltip(label: string) {
   showTooltip("", label, "compact", appIcons.arrowRight);
}
</script>

<template>
   <section id="work" ref="workRoot" class="work">
      <div class="work-content section-gutter">
         <SplitText
            class="section-title split-title work-title"
            as="h2"
            mask="chars"
            :text="workTitle"
            type="words,chars"
            @split="setTitleSplit"
         />

         <div class="case-list" data-work-case-list>
            <WorkLine />

            <CaseStudyCard
               v-for="item in caseStudies"
               :key="item.client"
               v-bind="item"
               @activate="activateTooltip(`View ${item.client} Case`)"
               @deactivate="deactivateTooltip"
            />
         </div>
      </div>

      <MoreWorksPanel
         @activate="activateTooltip('All Projects')"
         @deactivate="deactivateTooltip"
      />

      <TrailingTooltip
         v-if="shouldLoadTooltip"
         :active="tooltipActive"
         :icon="tooltipIcon"
         :image="tooltipImage"
         :label="tooltipLabel"
         :preload="tooltipPreload"
         :size="tooltipSize"
      />
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.work {
   @apply w-full pb-section;
   padding-top: calc(var(--spacing-section) * 2.5);
}

.work-content {
   @apply pb-section;
}

.work-title {
   @apply text-center font-semibold whitespace-nowrap;
   font-size: clamp(2rem, 11.6vw, 13rem);
   word-spacing: 0.15em;
}

.case-list {
   @apply relative mt-16 flex flex-col gap-20 md:mt-20 md:gap-28 xl:mt-24 xl:gap-32;
}
</style>
