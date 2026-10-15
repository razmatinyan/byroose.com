<script setup lang="ts">
import { shallowRef, useTemplateRef, watch } from "vue";
import ContactForm from "@/components/contact/ContactForm.vue";
import SplitText from "@/components/shared/SplitText.vue";
import { siteEmail } from "@/lib/site";
import type { SplitTextResult } from "@/lib/split-text";

const title = "Tell us what you want to build";
const description =
   "Share a few lines about your project and what it should achieve. We'll reply with clear next steps.";
const emailLead = "Prefer email?";

const emit = defineEmits<{
   revealed: [];
}>();

const heroRoot = useTemplateRef<HTMLElement>("heroRoot");
const titleSplit = shallowRef<SplitTextResult>();
const descriptionSplit = shallowRef<SplitTextResult>();
const { revealed } = useContactHeroMotion(
   heroRoot,
   titleSplit,
   descriptionSplit,
);

watch(revealed, () => emit("revealed"), { once: true });

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
      class="contact-hero section-gutter"
      :data-contact-hero-revealed="revealed || undefined"
   >
      <div class="contact-hero-intro">
         <SplitText
            class="contact-hero-title"
            data-contact-hero-reveal
            as="h1"
            mask="lines"
            :text="title"
            type="lines"
            @split="setTitleSplit"
         />
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
}

.contact-hero-copy {
   @apply grid gap-5;
}

.contact-hero-description {
   @apply m-0 max-w-[22em] text-xl leading-tight font-semibold tracking-[-0.04em] text-pretty md:text-2xl;
}

.contact-hero-title :deep(.split-text-line),
.contact-hero-title :deep(.split-text-line-mask),
.contact-hero-description :deep(.split-text-line),
.contact-hero-description :deep(.split-text-line-mask) {
   display: block;
}

.contact-hero-title :deep(.split-text-line-mask) {
   margin-block: 0 -0.36em;
   padding-block: 0.16em 0.2em;
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

@media (prefers-reduced-motion: reduce) {
   .contact-hero:not([data-contact-hero-revealed]) :deep([data-contact-hero-reveal]) {
      visibility: inherit;
   }
}
</style>
