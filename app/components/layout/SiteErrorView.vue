<script setup lang="ts">
import { computed } from "vue";
import { NuxtLink } from "#components";
import { Button, ButtonIcon } from "@/components/ui/button";

const { statusCode = 404, clearsError = false } = defineProps<{
   statusCode?: number;
   clearsError?: boolean;
}>();

const isNotFound = computed(() => statusCode === 404);
const title = computed(() => (isNotFound.value ? "This page took a wrong turn" : "Something went wrong on our side"));
const description = computed(() =>
   isNotFound.value
      ? "The page you are looking for moved or never existed. Head back home or see what we have been building."
      : "We could not load this page. Try again in a moment, or head back home.",
);

useSeoMeta({
   title: () => (isNotFound.value ? "Page not found" : "Something went wrong"),
   robots: "noindex, nofollow",
});

async function leave(event: MouseEvent, path: string) {
   if (!clearsError) return;

   event.preventDefault();
   await clearError({ redirect: path });
}
</script>

<template>
   <section class="error-view section-gutter" aria-labelledby="error-view-title">
      <p class="error-view-code" aria-hidden="true">{{ statusCode }}</p>
      <h1 id="error-view-title" class="error-view-title">{{ title }}</h1>
      <p class="error-view-description">{{ description }}</p>
      <div class="error-view-actions">
         <Button :as="NuxtLink" to="/" size="cta-lg" variant="dark" @click="leave($event, '/')">
            Back to home
            <template #icon>
               <ButtonIcon />
            </template>
         </Button>
         <Button
            v-if="isNotFound"
            :as="NuxtLink"
            to="/work"
            size="cta-lg"
            variant="outline"
            @click="leave($event, '/work')"
         >
            See our work
            <template #icon>
               <ButtonIcon />
            </template>
         </Button>
      </div>
   </section>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.error-view {
   @apply flex flex-col items-center justify-center gap-6 py-16 text-center;
   min-height: calc(100svh - 4.75rem);
}

.error-view-code {
   @apply m-0 leading-[0.8] font-bold tracking-[-0.06em];
   font-size: clamp(8rem, 30vw, 26rem);
}

.error-view-title {
   @apply max-w-[16em] text-4xl leading-[1.02] font-semibold tracking-[-0.045em] text-balance md:text-6xl;
}

.error-view-description {
   @apply max-w-[32em] text-xl leading-relaxed font-medium text-muted-foreground text-pretty;
}

.error-view-actions {
   @apply mt-4 flex flex-wrap justify-center gap-3;
}
</style>
