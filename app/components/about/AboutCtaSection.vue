<script setup lang="ts">
import { useTemplateRef } from "vue";
import { NuxtLink } from "#components";
import { Button, ButtonIcon } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import AboutTitle from "./AboutTitle.vue";
import type { AboutTitleLine } from "./AboutTitle.vue";

const titleLines: readonly AboutTitleLine[] = [
   { text: "Become chosen" },
   { text: "byroose" },
];
const contactRoute = "/contact";
const actionLabel = "Start Now";

const ctaRoot = useTemplateRef<HTMLElement>("ctaRoot");
useAboutSectionMotion(ctaRoot);
</script>

<template>
   <section ref="ctaRoot" class="about-cta section-gutter">
      <div class="about-cta-content">
         <AboutTitle :lines="titleLines" size="display" />
         <div class="about-cta-action-group" data-about-rise-group>
            <div data-about-rise-mask>
               <span class="about-cta-action-rise" data-about-rise>
                  <Button
                     class="about-cta-action"
                     :as="NuxtLink"
                     :to="contactRoute"
                     variant="dark"
                     size="cta-lg"
                  >
                     {{ actionLabel }}
                     <template #icon>
                        <ButtonIcon :icon="appIcons.arrowRight" />
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

.about-cta {
   @apply grid min-h-svh place-items-center rounded-t-[clamp(1.5rem,3vw,3rem)] bg-ribbon py-section text-center text-ribbon-foreground;
}

.about-cta-content {
   @apply flex flex-col items-center;
}

.about-cta-content :deep(.about-title-display) {
   font-size: min(clamp(3.5rem, 11vw, 12rem), 12vw);
}

.about-cta-action-group {
   @apply mt-16 md:mt-24;
}

.about-cta-action-rise {
   @apply block;
}

.about-cta-action {
   gap: 0.6em;
   min-height: 2.6em;
   padding-inline: 1.1em;
   font-size: clamp(1.25rem, 2.2vw, 2rem);
}

.about-cta-action :deep(.button-icon),
.about-cta-action :deep(.button-icon svg) {
   width: 1em;
   height: 1em;
}
</style>
