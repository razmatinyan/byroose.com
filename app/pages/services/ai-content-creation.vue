<script setup lang="ts">
import ServiceCardsSection from "@/components/services/ServiceCardsSection.vue";
import type { ServiceCard } from "@/components/services/ServiceCardsSection.vue";
import ServiceHero from "@/components/services/ServiceHero.vue";
import FaqSection from "@/components/shared/FaqSection.vue";
import type { FaqItem } from "@/components/shared/FaqSection.vue";
import ProcessSection from "@/components/shared/ProcessSection.vue";
import type { ProcessStep } from "@/components/shared/ProcessSection.vue";
import ServiceStorySection from "@/components/services/ServiceStorySection.vue";
import type { ServiceStoryBlock } from "@/components/services/ServiceStorySection.vue";
import { servicePagePaths } from "@/lib/services-anchors";
import { pageSeo } from "@/lib/page-seo";

usePageSeo(pageSeo.aiContentCreation);

const heroTitle =
  "AI content creation agency for brands that want leads, not just likes";
const heroDescription =
  "forrrow creates AI videos, reels, UGC ads, and product visuals for Instagram, TikTok, LinkedIn, and paid social. Every asset is directed, generated, and then edited by a human, so it looks like your brand, not like AI. And every piece points somewhere: to a page built to turn that attention into a lead.";

const servicesTitle = "AI content creation services";
const services: readonly ServiceCard[] = [
  {
    title: "AI video ads and reels",
    description:
      "Short-form videos built around a hook that holds the first three seconds, cut for each platform's format and pacing.",
    tone: "green",
  },
  {
    title: "AI UGC ads and virtual creators",
    description:
      "UGC-style ads with consistent AI creators and spokespeople, so you can test dozens of angles without booking dozens of influencers.",
    tone: "pink",
  },
  {
    title: "AI product photography and campaign visuals",
    description:
      "Product shots, lifestyle scenes, and campaign imagery in your brand's look, without a studio day for every new product.",
    tone: "blue",
  },
  {
    title: "Social media content sets",
    description:
      "Monthly content sets for Instagram, TikTok, and LinkedIn, planned as a series so your feed tells one story.",
    tone: "primary",
  },
];

const storyBlocks: readonly ServiceStoryBlock[] = [
  {
    title: "Why our AI content stops the scroll",
    description:
      "AI gives us speed and volume. People give it taste. Our creative director sets the concept and the brand look, AI tools generate options, and human editors choose, fix, and finish every asset. You get content at social media speed that still looks considered.",
    offset: "start",
  },
  {
    title: "AI content that leads somewhere",
    description:
      "Most AI content agencies stop at the post. We also build the landing page it links to, so the viewer lands somewhere that continues what they just watched. That's how views become leads.",
    link: {
      label: "See our web development services",
      to: servicePagePaths.web,
    },
    offset: "middle",
  },
];

const processTitle = "AI Content Creation Process";
const processDescription =
  "Each stage overlaps the next, so your content moves from first brief to publishing without waiting on hand-offs.";
const processSteps: readonly ProcessStep[] = [
  {
    title: "Discovery",
    body: "We learn your brand, your audience, and your goals.",
  },
  {
    title: "Concept and brand look",
    body: "We define the hooks, formats, and visual style.",
  },
  {
    title: "Production",
    body: "AI generation, then human direction and editing.",
  },
  {
    title: "Publish and measure",
    body: "We track which content brings visitors and leads, and make more of what works.",
  },
];

const faqTitle = "AI content creation questions";
const faqs: readonly FaqItem[] = [
  {
    id: "premium-brand",
    question: "Is AI content good enough for a premium brand?",
    answer:
      "Yes, when people direct and edit it. Every forrrow asset is checked by a human editor for brand fit, detail, and quality before it goes live.",
  },
  {
    id: "ownership",
    question: "Who owns the content?",
    answer: "You do. Everything we make for you is yours to use.",
  },
  {
    id: "monthly-volume",
    question: "How much content do we get per month?",
    answer:
      "It depends on your plan. Each plan sets a monthly number of videos and visuals, and we agree on it with you before we start.",
  },
];
</script>

<template>
  <div class="service-page">
    <ServiceHero :title="heroTitle" :description="heroDescription" />
    <ServiceCardsSection :title="servicesTitle" :cards="services" />
    <ServiceStorySection :blocks="storyBlocks" />
    <ProcessSection
      :title="processTitle"
      :description="processDescription"
      :steps="processSteps"
      :uppercase="false"
      title-reveal="words"
    />
    <FaqSection :title="faqTitle" :items="faqs" />
  </div>
</template>
