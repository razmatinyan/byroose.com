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

usePageSeo(pageSeo.webDevelopment);

const heroTitle =
   "Web development agency for websites that turn visitors into leads";
const heroDescription =
   "forrrow designs and builds websites, landing pages, web platforms, and CRMs, so every click from your content lands somewhere that matches what your visitor just watched. Fast, easy to update, and design is always included.";

const servicesTitle = "Web development services";
const services: readonly ServiceCard[] = [
   {
      title: "Landing page development",
      description:
         "Campaign and launch pages built around one offer and one action, matched to the ads and posts that send traffic to them.",
      tone: "green",
   },
   {
      title: "Company website development",
      description:
         "Full websites with clear service pages, case studies, and contact flows, designed to rank on Google and convert visitors.",
      tone: "pink",
   },
   {
      title: "Design systems that match your content",
      description:
         "Colours, type, and components that carry your social media look onto your website, so your brand feels like one thing.",
      tone: "blue",
   },
   {
      title: "SEO and performance built in",
      description:
         "Fast load times, clean code, structured data, and accessible markup from day one, not as an add-on.",
      tone: "primary",
   },
];

const storyBlocks: readonly ServiceStoryBlock[] = [
   {
      title: "Why Content-First Web Development Converts Better",
      description:
         "When a visitor taps a reel and lands on a page that looks nothing like it, they leave. We design your website around your content, so the click feels like a continuation, not a restart. That continuity is what turns traffic into enquiries.",
      offset: "start",
   },
   {
      title: "Built By Engineers, Not Just Designers",
      description:
         "Our co-founder and senior software engineer builds every site, so what you approve in design is exactly what goes live: fast, stable, and easy to maintain.",
      link: {
         label: "Meet the forrrow team",
         to: pageSeo.about.path,
      },
      offset: "middle",
   },
];

const processTitle = "Our web development process";
const processDescription =
   "Each stage overlaps the next, so your site moves from first review to launch without waiting on hand-offs.";
const processSteps: readonly ProcessStep[] = [
   {
      title: "Discovery",
      body: "We review your current site, your content, and your goals.",
   },
   {
      title: "Structure and copy",
      body: "Pages, offers, and calls to action, mapped to search and to your funnel.",
   },
   {
      title: "Design",
      body: "Layouts built around your content and brand.",
   },
   {
      title: "Development and launch",
      body: "A fast, accessible site, with tracking in place from day one.",
   },
];

const faqTitle = "Web development FAQ";
const faqs: readonly FaqItem[] = [
   {
      id: "timeline",
      question: "How long does a website take?",
      answer:
         "It depends on the scope. A landing page is the quickest to launch, and a full website takes longer. You get a clear timeline from us before we start.",
   },
   {
      id: "self-editing",
      question: "Can I update the website myself?",
      answer: "Yes. We build sites you can edit without a developer.",
   },
   {
      id: "web-only",
      question: "Do you only build websites for brands you make content for?",
      answer:
         "No. You can hire us for web development alone, but it works best with our AI content.",
      link: {
         label: "See AI content creation",
         to: servicePagePaths.aiContent,
      },
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
