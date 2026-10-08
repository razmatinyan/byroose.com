<template>
   <div class="about-media" data-about-media>
      <div class="about-media-layer" data-about-media-layer>
         <slot />
      </div>
   </div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-media {
   @apply relative overflow-hidden rounded-2xl bg-muted;
}

.about-media-layer {
   @apply absolute inset-0;
}

.about-media-layer > :deep(*) {
   @apply size-full object-cover select-none;
}
</style>
