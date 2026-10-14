<script setup lang="ts">
import { ogImageTheme } from "@/lib/og-image-theme";
import { siteName, siteSlogan, siteUrl } from "@/lib/site";

const { title = "AI content creation and web development", label = "" } = defineProps<{
   title?: string;
   label?: string;
}>();

const siteHost = new URL(siteUrl).host;
</script>

<template>
   <div
      class="flex h-full w-full flex-col justify-between p-18"
      :style="{ backgroundColor: ogImageTheme.surface, color: ogImageTheme.ink, fontFamily: 'Switzer' }"
   >
      <div class="flex w-full items-center justify-between">
         <span class="text-5xl font-bold" :style="{ letterSpacing: '-0.05em' }">{{ siteName }}</span>
         <span class="text-2xl font-medium" :style="{ color: ogImageTheme.inkMuted }">{{ siteHost }}</span>
      </div>

      <div class="flex flex-col">
         <span v-if="label" class="mb-6 text-3xl font-semibold" :style="{ color: ogImageTheme.accent }">
            {{ label }}
         </span>
         <span
            class="text-8xl font-bold"
            :style="{ letterSpacing: '-0.05em', lineHeight: 0.95, lineClamp: 3 }"
         >
            {{ title }}
         </span>
      </div>

      <div class="flex w-full items-center justify-between">
         <span class="text-3xl font-medium" :style="{ color: ogImageTheme.inkMuted }">{{ siteSlogan }}</span>
         <span class="h-3 w-40 rounded-full" :style="{ backgroundColor: ogImageTheme.accent }" />
      </div>
   </div>
</template>
