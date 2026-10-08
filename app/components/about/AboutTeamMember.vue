<script setup lang="ts">
import MediaPlaceholder from "@/components/shared/MediaPlaceholder.vue";
import AboutMediaFrame from "./AboutMediaFrame.vue";

export interface AboutMemberPortrait {
   alt: string;
   height: number;
   src: string;
   width: number;
}

const { name, portrait, role } = defineProps<{
   name: string;
   portrait?: AboutMemberPortrait;
   role: string;
}>();
</script>

<template>
   <article class="about-member">
      <AboutMediaFrame class="about-member-portrait">
         <NuxtImg
            v-if="portrait"
            :src="portrait.src"
            :alt="portrait.alt"
            :width="portrait.width"
            :height="portrait.height"
            sizes="sm:1280px md:1024px lg:1280px xl:1536px"
            densities="x1"
            loading="lazy"
            draggable="false"
         />
         <MediaPlaceholder v-else />
      </AboutMediaFrame>

      <div class="about-member-meta" data-about-rise-group>
         <div class="about-member-mask about-member-name" data-about-rise-mask>
            <h3 class="about-member-text" data-about-rise>{{ name }}</h3>
         </div>
         <div class="about-member-mask about-member-role" data-about-rise-mask>
            <p class="about-member-text" data-about-rise>{{ role }}</p>
         </div>
      </div>
   </article>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-member {
   @apply flex w-full flex-col gap-5 md:gap-6;
}

.about-member-portrait {
   @apply aspect-5/6 w-full;
}

.about-member-meta {
   @apply flex flex-col gap-1;
}

.about-member-mask {
   margin-block: -0.12em -0.2em;
   padding-block: 0.12em 0.2em;
}

.about-member-text {
   @apply m-0;
}

.about-member-name {
   @apply text-3xl leading-none font-bold tracking-[-0.045em] md:text-4xl xl:text-5xl;
}

.about-member-role {
   @apply text-lg leading-tight font-semibold tracking-[-0.03em] text-muted-foreground md:text-xl;
}
</style>
