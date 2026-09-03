<script setup lang="ts">
interface CaseStudy {
  client: string
  title: string
  metric: string
  theme: 'orange' | 'blue' | 'pink' | 'white'
  rotation: 'minus-two' | 'plus-two' | 'minus-three' | 'plus-three'
  offset: 'none' | 'small' | 'medium' | 'large' | 'extra-large'
}

interface CasePair {
  first: CaseStudy
  second: CaseStudy
}

const casePairs: CasePair[] = [
  {
    first: {
      client: 'Nova Dairy',
      title: 'From zero to full retail listing in eleven weeks',
      metric: '4 chains · 260 stores',
      theme: 'orange',
      rotation: 'minus-two',
      offset: 'none',
    },
    second: {
      client: 'Kessler Tools',
      title: 'Cut cost per lead by 41% and doubled deal size',
      metric: '€1.2M pipeline added',
      theme: 'blue',
      rotation: 'plus-two',
      offset: 'large',
    },
  },
  {
    first: {
      client: 'Halden Clinics',
      title: 'A rebrand that filled the calendar six weeks out',
      metric: '+38% bookings',
      theme: 'pink',
      rotation: 'plus-two',
      offset: 'medium',
    },
    second: {
      client: 'Marrow & Co',
      title: 'One landing page rebuilt, conversion up by half',
      metric: '3.1% → 4.7% CVR',
      theme: 'white',
      rotation: 'minus-three',
      offset: 'none',
    },
  },
  {
    first: {
      client: 'Vestlund',
      title: 'Forty assets a month, produced by four people',
      metric: '62% cheaper per asset',
      theme: 'blue',
      rotation: 'minus-three',
      offset: 'small',
    },
    second: {
      client: 'Piquant',
      title: 'A category story that unlocked two distributors',
      metric: '18M views earned',
      theme: 'orange',
      rotation: 'plus-three',
      offset: 'extra-large',
    },
  },
]
</script>

<template>
  <section id="work" class="work section-gutter">
    <div class="section-heading-row">
      <h2 class="section-title work__title">Success stories</h2>
      <p class="section-intro">Six engagements, same method, different starting points. Scroll on.</p>
    </div>

    <div class="case-list">
      <div v-for="(pair, index) in casePairs" :key="index" class="case-pair">
        <article
          v-for="item in [pair.first, pair.second]"
          :key="item.client"
          class="case-card tilt"
          :class="[
            `case-card--${item.theme}`,
            `tilt--${item.rotation}`,
            `case-card--offset-${item.offset}`,
          ]"
        >
          <div class="case-card__image media-placeholder">
            <span>case photo</span>
          </div>
          <div class="case-card__copy">
            <span class="case-card__client">{{ item.client }}</span>
            <p class="case-card__title">{{ item.title }}</p>
            <p class="case-card__metric">{{ item.metric }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
