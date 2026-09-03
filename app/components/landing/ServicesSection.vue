<script setup lang="ts">
import { computed, shallowRef } from 'vue'

interface ClientStory {
  quote: string
  name: string
  role: string
}

interface Service {
  title: string
  body: string
  cta: string
  visual: string
}

const storyData: ClientStory[] = [
  {
    quote:
      '“For years our site failed to show the work properly. Six weeks after relaunch we booked €180k in new business and get two or three qualified enquiries a week.”',
    name: 'Andrew Tynes',
    role: 'Owner, Mammoth Murals',
  },
  {
    quote:
      '“They rewrote our positioning in a fortnight. The sales team stopped explaining what we do and started closing.”',
    name: 'Ilse Warner',
    role: 'CMO, Nova Dairy',
  },
  {
    quote:
      '“Content output tripled without a single off-brand post going live. The review loop is the part nobody else offered.”',
    name: 'Tomas Brekke',
    role: 'Founder, Vestlund',
  },
]

const servicesData: Service[] = [
  {
    title: 'Content creation',
    body:
      'Studio and AI-assisted production: video, photo, editorial and design, planned as a quarterly slate instead of one-off requests.',
    cta: 'See the reel',
    visual: 'content grid',
  },
  {
    title: 'SM marketing',
    body:
      'Paid and organic social run as one system. Creative testing weekly, budget decisions monthly, a single dashboard you can read in a minute.',
    cta: 'See the numbers',
    visual: 'campaign dashboard',
  },
  {
    title: 'Brand strategy',
    body:
      'Positioning, naming and messaging built from customer interviews and market data, not a mood board. A story your whole team can repeat.',
    cta: 'See the method',
    visual: 'brand board',
  },
  {
    title: 'Web development',
    body:
      'Design and build in the same sprint. Headless CMS, clean analytics, accessibility that passes audit, a handover your team can maintain.',
    cta: 'See a build',
    visual: 'product screenshot',
  },
]

const selectedStory = shallowRef(0)
const selectedService = shallowRef(2)

const activeStory = computed(() => storyData[selectedStory.value]!)
const activeService = computed(() => servicesData[selectedService.value]!)
const storyCounter = computed(
  () =>
    `${String(selectedStory.value + 1).padStart(2, '0')}/${String(storyData.length).padStart(2, '0')}`,
)

function showPreviousStory() {
  selectedStory.value =
    (selectedStory.value - 1 + storyData.length) % storyData.length
}

function showNextStory() {
  selectedStory.value = (selectedStory.value + 1) % storyData.length
}
</script>

<template>
  <section id="services" class="services section-gutter">
    <h2 class="section-title services__title">What we can help with</h2>

    <div class="services__layout">
      <article class="client-story">
        <div class="client-story__controls">
          <div class="client-story__arrows">
            <button
              class="arrow-button"
              type="button"
              aria-label="Previous client story"
              @click="showPreviousStory"
            >
              ←
            </button>
            <button
              class="arrow-button"
              type="button"
              aria-label="Next client story"
              @click="showNextStory"
            >
              →
            </button>
          </div>
          <span class="client-story__counter">{{ storyCounter }}</span>
        </div>

        <span class="eyebrow client-story__eyebrow">(Real client stories)</span>
        <p class="client-story__quote">{{ activeStory.quote }}</p>

        <div class="client-story__person">
          <div class="client-story__avatar media-placeholder" aria-hidden="true" />
          <div>
            <div class="client-story__name">{{ activeStory.name }}</div>
            <div class="client-story__role">{{ activeStory.role }}</div>
          </div>
        </div>
      </article>

      <div class="service-picker">
        <div class="service-picker__list">
          <button
            v-for="(service, index) in servicesData"
            :key="service.title"
            class="service-picker__option"
            :class="{ 'is-active': index === selectedService }"
            type="button"
            @click="selectedService = index"
          >
            {{ service.title }}
          </button>
        </div>
        <p class="service-picker__description">{{ activeService.body }}</p>
      </div>

      <div class="service-visual media-placeholder">
        <span>{{ activeService.visual }}</span>
      </div>
    </div>
  </section>
</template>
