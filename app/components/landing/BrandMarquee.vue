<script setup lang="ts">
const brands = [
  'Nova Dairy',
  'Kessler Tools',
  'Halden Clinics',
  'Marrow & Co',
  'Vestlund',
  'Piquant',
]
</script>

<template>
  <section class="brand-marquee">
    <div class="section-gutter">
      <span class="eyebrow">Brands we have worked with</span>
    </div>
    <div class="brand-marquee__viewport">
      <div class="brand-marquee__track">
        <div v-for="copy in 2" :key="copy" class="brand-marquee__group" :aria-hidden="copy === 2">
          <span v-for="brand in brands" :key="brand">{{ brand }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
