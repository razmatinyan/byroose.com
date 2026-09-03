<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue'

const heroGrid = useTemplateRef<HTMLElement>('heroGrid')
const columnCount = shallowRef<1 | 2 | 4>(4)

function fitHeroGrid() {
  const width = heroGrid.value?.getBoundingClientRect().width ?? 0
  columnCount.value = width >= 960 ? 4 : width >= 480 ? 2 : 1
}

onMounted(() => {
  fitHeroGrid()
  window.addEventListener('resize', fitHeroGrid)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', fitHeroGrid)
})
</script>

<template>
  <section id="top" class="hero section-gutter">
    <div class="hero__intro">
      <h1 class="hero__title">Make noise. Make sense. Make money.</h1>
      <div class="hero__copy">
        <p class="hero__description">
          byroose is a creative agency for brands that are tired of shouting into the void.
          Strategy, marketing, web and AI content under one roof.
        </p>
        <a class="button button--large button--primary" href="#contact">
          Get a plan
          <span class="button__icon">→</span>
        </a>
      </div>
    </div>

    <div
      ref="heroGrid"
      class="hero-grid"
      :class="`hero-grid--${columnCount}`"
    >
      <article class="hero-card hero-card--green tilt tilt--minus-four">
        <div>
          <strong class="hero-card__number">18M+</strong>
          <span class="hero-card__label">Views earned</span>
        </div>
        <p class="hero-card__caption">Organic and paid, last twelve months.</p>
      </article>

      <div class="hero-card media-placeholder tilt tilt--plus-three">
        <span>shoot / behind the scenes</span>
      </div>

      <article class="hero-card hero-card--blue tilt tilt--minus-two">
        <div>
          <strong class="hero-card__number">64</strong>
          <span class="hero-card__label">Brands built</span>
        </div>
        <p class="hero-card__caption">From first positioning line to full launch.</p>
      </article>

      <div class="hero-card media-placeholder tilt tilt--plus-four">
        <span>shoot / behind the scenes</span>
      </div>
    </div>
  </section>
</template>
