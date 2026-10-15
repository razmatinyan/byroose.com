<script setup lang="ts">
import { shallowRef, useTemplateRef, watch } from "vue";
import ContactForm from "@/components/contact/ContactForm.vue";
import ImageCycle from "@/components/shared/ImageCycle.vue";
import SplitText from "@/components/shared/SplitText.vue";
import { siteEmail } from "@/lib/site";
import type { SplitTextResult } from "@/lib/split-text";

interface ContactTitleLine {
   insetWord?: string;
   lead: string;
}

const titleLines: readonly ContactTitleLine[] = [
   { lead: "Tell us what" },
   { lead: "you want to" },
   { insetWord: "build", lead: "" },
];
const titleImages = [
   { height: 816, src: "/images/hero/5.png", width: 1456 },
   { height: 816, src: "/images/hero/6.png", width: 1456 },
   { height: 816, src: "/images/hero/3.png", width: 1456 },
   { height: 816, src: "/images/hero/4.png", width: 1456 },
] as const;
function lineText({ insetWord = "", lead }: ContactTitleLine) {
   return `${lead}${insetWord}`;
}

const title = titleLines.map(lineText).join(" ");
const description =
   "Share a few lines about your project and what it should achieve. We'll reply with clear next steps.";
const emailLead = "Prefer email?";

const emit = defineEmits<{
   revealed: [];
}>();

const heroRoot = useTemplateRef<HTMLElement>("heroRoot");
const descriptionSplit = shallowRef<SplitTextResult>();
const { revealed } = useContactHeroMotion(heroRoot, descriptionSplit);

watch(revealed, () => emit("revealed"), { once: true });

function setDescriptionSplit(parts: SplitTextResult) {
   descriptionSplit.value = parts;
}
</script>

<template>
   <section
      ref="heroRoot"
      class="contact-hero section-gutter"
      :data-contact-hero-revealed="revealed || undefined"
   >
      <div class="contact-hero-intro">
         <div class="contact-hero-title" data-contact-hero-reveal>
            <h1 class="sr-only">{{ title }}</h1>
            <span
               v-for="line in titleLines"
               :key="lineText(line)"
               class="contact-hero-title-mask"
               data-contact-hero-title-mask
               aria-hidden="true"
            >
               <span
                  class="contact-hero-title-line"
                  data-contact-hero-title-line
                  >{{ line.lead
                  }}<span v-if="line.insetWord" class="contact-hero-inset-word"
                     >{{ line.insetWord
                     }}<span class="contact-hero-inset" data-contact-hero-inset
                        ><span
                           class="contact-hero-inset-content"
                           data-contact-hero-inset-content
                           ><ImageCycle
                              class="contact-hero-images"
                              :images="titleImages"
                              loading="eager"
                              sizes="sm:448px" /></span></span></span
               ></span>
            </span>
         </div>
         <div class="contact-hero-copy">
            <SplitText
               class="contact-hero-description"
               data-contact-hero-reveal
               as="p"
               mask="lines"
               :text="description"
               type="lines"
               @split="setDescriptionSplit"
            />
            <p
               class="contact-hero-email"
               data-contact-hero-reveal
               data-contact-hero-field
            >
               {{ emailLead }}
               <a class="contact-hero-email-link" :href="`mailto:${siteEmail}`">{{
                  siteEmail
               }}</a>
            </p>
         </div>
      </div>

      <ContactForm />
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.contact-hero {
   @apply grid items-start gap-14 pt-10 pb-section md:pt-14 lg:grid-cols-2 lg:gap-x-16;
}

.contact-hero-intro {
   @apply grid content-start gap-8 md:gap-10;
}

.contact-hero-title {
   @apply m-0 max-w-[7.5em] leading-[0.86] font-bold tracking-[-0.05em];
   font-size: clamp(3rem, 7.5vw, 8rem);
   margin-top: -0.16em;
   --contact-hero-inset-height: 0.8em;
   --contact-hero-inset-width: calc(var(--contact-hero-inset-height) * 16 / 9);
}

.contact-hero-title-mask,
.contact-hero-title-line {
   @apply block;
}

.contact-hero-title-mask {
   margin-block: 0 -0.36em;
   padding-block: 0.16em 0.2em;
}

.contact-hero-inset-word {
   @apply whitespace-nowrap;
}

.contact-hero-inset {
   @apply relative inline-block overflow-hidden rounded-[0.06em];
   height: var(--contact-hero-inset-height);
   margin-inline-start: calc(0.12em * var(--contact-hero-inset-open));
   vertical-align: -0.06em;
   width: calc(
      var(--contact-hero-inset-width) * var(--contact-hero-inset-open)
   );
   --contact-hero-inset-open: 1;
}

.contact-hero-inset-content {
   @apply absolute top-0 left-1/2 h-full -translate-x-1/2;
   width: var(--contact-hero-inset-width);
}

.contact-hero-images {
   @apply size-full;
}

.contact-hero-copy {
   @apply grid gap-5;
}

.contact-hero-description {
   @apply m-0 max-w-[22em] text-xl leading-tight font-semibold tracking-[-0.04em] text-pretty md:text-2xl;
}

.contact-hero-description :deep(.split-text-line),
.contact-hero-description :deep(.split-text-line-mask) {
   display: block;
}

.contact-hero-description :deep(.split-text-line-mask) {
   margin-block: -0.12em -0.18em;
   padding-block: 0.12em 0.18em;
}

.contact-hero-email {
   @apply m-0 text-lg font-medium text-muted-foreground md:text-xl;
}

.contact-hero-email-link {
   @apply text-foreground underline underline-offset-4 transition-colors hover:text-primary;
}

.contact-hero:not([data-contact-hero-revealed]) :deep([data-contact-hero-reveal]) {
   visibility: hidden;
}

.contact-hero:not([data-contact-hero-revealed]) .contact-hero-inset {
   --contact-hero-inset-open: 0;
}

@media (prefers-reduced-motion: reduce) {
   .contact-hero:not([data-contact-hero-revealed]) :deep([data-contact-hero-reveal]) {
      visibility: inherit;
   }

   .contact-hero:not([data-contact-hero-revealed]) .contact-hero-inset {
      --contact-hero-inset-open: 1;
   }
}
</style>
