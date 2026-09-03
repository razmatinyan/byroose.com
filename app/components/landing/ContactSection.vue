<script setup lang="ts">
const {
  heading = "Let's make noise.",
  body = 'Tell us what is stuck. You get a written point of view within three working days, free of charge and free of jargon.',
  primary = 'Mail us direct',
  secondary = 'Book 20 minutes',
} = defineProps<{
  heading?: string
  body?: string
  primary?: string
  secondary?: string
}>()
</script>

<template>
  <div id="contact">
    <section class="contact section-gutter">
      <div class="contact__layout">
        <div class="contact__heading-wrap">
          <h2 class="contact__heading">{{ heading }}</h2>
        </div>
        <div class="contact__copy">
          <p>{{ body }}</p>
          <div class="contact__actions">
            <a class="button button--large button--cream" href="mailto:hello@byroose.com">
              {{ primary }}
              <span class="button__icon button__icon--dark">→</span>
            </a>
            <a class="button button--large button--light-outline" href="#top">
              {{ secondary }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
