<script setup lang="ts">
import { useTemplateRef } from "vue";
import ImageCycle from "@/components/shared/ImageCycle.vue";
import ProjectCtaSection from "@/components/shared/ProjectCtaSection.vue";
import { servicesAnchors } from "@/lib/services-anchors";
import {
   servicesHeroImages,
   servicesOfferImageSizes,
} from "@/lib/services-hero";
import type { ServicesImage } from "@/lib/services-hero";
import ServicesHero from "./ServicesHero.vue";
import ServicesOfferSection from "./ServicesOfferSection.vue";
import type { ServicesOfferBlock } from "./ServicesOfferSection.vue";
import ServicesStatementSection from "./ServicesStatementSection.vue";

const aiContentTitle = "AI Content Creation";
const aiContentDescription =
   "Visuals, video, reels and site imagery produced through an AI pipeline with a human editor on every asset. Planned as a quarterly slate instead of one-off requests.";

const aiImages: readonly ServicesImage[] = [
   { height: 1919, src: "/images/work/1.png", width: 1080 },
   { height: 1919, src: "/images/work/2.png", width: 1080 },
   { height: 1919, src: "/images/work/4.png", width: 1080 },
   { height: 1919, src: "/images/work/5.png", width: 1080 },
];

const aiContentBlocks: readonly ServicesOfferBlock[] = [
   {
      description:
         "Short vertical edits for Instagram, TikTok, and Shorts. We write the hook, generate the visuals through our AI pipeline, and cut every second by hand so the first frame earns the next ten.",
      flight: true,
      title: "Reels that stop the scroll",
      tone: "pink-tint",
   },
   {
      description:
         "Brand films, product spots, and explainers produced with AI generation and a human editor on every cut. Consistent characters, deliberate pacing, and sound that makes the message land.",
      images: [{ height: 816, src: "/images/hero/5.png", width: 1456 }],
      title: "Videos that carry your story",
      tone: "blue-tint",
   },
   {
      description:
         "Campaign visuals, product scenes, and site imagery generated in your brand's look, then art directed, retouched, and delivered in every size your channels need.",
      images: aiImages,
      title: "Images with AI, directed like a shoot",
      tone: "green-tint",
   },
];

const webTitle = "Website Development";
const webDescription =
   "Design and build in the same sprint. Headless CMS, clean analytics, accessibility that passes audit, a handover your team can maintain.";

const webBlocks: readonly ServicesOfferBlock[] = [
   {
      description:
         "Custom layouts and hand-written code, no templates. Every page is designed around your brand and built to load fast.",
      images: [
         { height: 1620, src: "/images/work/3.png", width: 1080 },
         { height: 1919, src: "/images/work/6.png", width: 1080 },
         { height: 1919, src: "/images/work/7.png", width: 1080 },
      ],
      title: "Designed and coded from scratch",
      tone: "orange-deep",
   },
   {
      description:
         "Landing pages, business websites, online stores, and web platforms, each shaped around the one action your visitors should take.",
      images: [{ height: 816, src: "/images/hero/6.png", width: 1456 }],
      title: "Sites that sell and scale",
      tone: "violet-deep",
   },
   {
      description:
         "CRM and API integrations that wire the site into your tools, with technical SEO built in from the first commit.",
      images: [{ height: 1919, src: "/images/work/4.png", width: 1080 }],
      title: "Connected and easy to find",
      tone: "yellow-deep",
   },
];

const pageRoot = useTemplateRef<HTMLElement>("pageRoot");
useServicesMediaFlight(pageRoot);
</script>

<template>
   <div ref="pageRoot" class="services-page">
      <ServicesHero />
      <ServicesStatementSection />
      <ServicesOfferSection
         :anchor="servicesAnchors.aiContent"
         :blocks="aiContentBlocks"
         :description="aiContentDescription"
         :title="aiContentTitle"
      />
      <ServicesOfferSection
         :anchor="servicesAnchors.web"
         :blocks="webBlocks"
         :description="webDescription"
         surface="dark"
         :title="webTitle"
      />
      <ProjectCtaSection />
      <div class="services-flight" data-services-flight aria-hidden="true">
         <ImageCycle
            class="services-flight-layer"
            data-services-flight-layer
            :images="servicesHeroImages"
            loading="eager"
            :sizes="servicesOfferImageSizes"
            densities="x1"
         />
      </div>
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.services-page {
   @apply relative overflow-x-clip;
}

.services-flight {
   @apply pointer-events-none invisible absolute top-0 left-0 z-5 size-0 overflow-hidden;
   contain: layout paint;
}

.services-flight-layer {
   @apply size-full;
}
</style>
