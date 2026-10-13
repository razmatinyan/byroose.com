<script setup lang="ts">
import { computed } from "vue";
import type { MediaAsset } from "#shared/schemas/media";

const { asset, alt = "" } = defineProps<{
   asset: MediaAsset;
   alt?: string;
}>();

const mediaUrl = useMediaUrl();
const src = computed(() => mediaUrl(asset.key));
</script>

<template>
   <NuxtImg
      v-if="asset.kind === 'image'"
      :src="src"
      provider="none"
      :alt="alt"
      :width="asset.width"
      :height="asset.height"
      loading="lazy"
      class="media-preview"
   />
   <video
      v-else
      :src="src"
      :width="asset.width"
      :height="asset.height"
      :aria-label="alt || undefined"
      class="media-preview"
      autoplay
      muted
      loop
      playsinline
   />
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.media-preview {
   @apply block h-auto w-full;
}
</style>
