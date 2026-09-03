<script setup lang="ts">
interface Course {
  title: string
  length: string
  price: string
  body: string
  theme: 'white' | 'blue' | 'orange'
  visual: string
}

const courses: Course[] = [
  {
    title: 'Social that sells',
    length: '4 weeks · live',
    price: '€890',
    body:
      'Build a creative testing loop your team can run without us. Hooks, formats, budget rules and the reporting that keeps it honest.',
    theme: 'white',
    visual: 'course workbook',
  },
  {
    title: 'Brand in a room',
    length: '2 days · on site',
    price: '€1,400',
    body:
      'The positioning workshop we open every engagement with, taught to your marketing and product leads in one intense sprint.',
    theme: 'blue',
    visual: 'workshop deck',
  },
  {
    title: 'AI content, no slop',
    length: '3 weeks · online',
    price: '€690',
    body:
      'Set up a voice-trained pipeline with a human review loop. Prompts, guardrails, editing standards and the publishing checklist.',
    theme: 'orange',
    visual: 'pipeline diagram',
  },
]
</script>

<template>
  <section id="courses" class="courses section-gutter">
    <div class="section-heading-row">
      <h2 class="section-title courses__title">Our courses</h2>
      <p class="section-intro">
        The same playbooks we run for clients, taught to your team over four weeks.
      </p>
    </div>

    <div class="courses__grid">
      <article
        v-for="course in courses"
        :key="course.title"
        class="course-card"
        :class="`course-card--${course.theme}`"
      >
        <div class="course-card__meta">
          <span>{{ course.length }}</span>
          <strong>{{ course.price }}</strong>
        </div>
        <div class="course-card__visual media-placeholder">
          <span>{{ course.visual }}</span>
        </div>
        <h3 class="course-card__title">{{ course.title }}</h3>
        <p class="course-card__description">{{ course.body }}</p>
        <a class="course-card__link" href="#contact">
          Join the next cohort
          <span class="course-card__icon">→</span>
        </a>
      </article>
    </div>
  </section>
</template>
