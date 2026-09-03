<script setup lang="ts">
import { shallowRef } from 'vue'

interface Faq {
  question: string
  answer: string
}

const faqs: Faq[] = [
  {
    question: 'How fast can you start?',
    answer:
      'Kickoff within ten working days of a signed scope. Sprints can start sooner if the brief is tight.',
  },
  {
    question: 'Do you work with in-house teams?',
    answer:
      'Most of the time. We plug into your stand-ups, use your tools, and hand over everything we build with documentation.',
  },
  {
    question: 'What does the AI content actually mean?',
    answer:
      'A model tuned on your voice, offers and proof points, running inside a human review loop. Nothing publishes without an editor signing off.',
  },
  {
    question: 'Can we buy one service on its own?',
    answer:
      'Yes. Content, marketing, brand and web are sold separately, though they compound when run together.',
  },
  {
    question: 'How do you report results?',
    answer:
      'One dashboard, weekly written readouts, and a monthly decision meeting where we cut what is not paying.',
  },
  {
    question: 'Is there a minimum commitment?',
    answer:
      'Ninety days on retainers, so there is enough runway to learn something. After that it is month to month.',
  },
]

const openQuestion = shallowRef(0)

function toggleQuestion(index: number) {
  openQuestion.value = openQuestion.value === index ? -1 : index
}
</script>

<template>
  <section id="faq" class="faq section-gutter">
    <div>
      <h2 class="section-title faq__title">Questions, answered.</h2>
      <p class="faq__intro">
        Anything else, mail <a href="mailto:hello@byroose.com">hello@byroose.com</a>
        and you get a human reply the same day.
      </p>
    </div>

    <div class="faq__list">
      <article v-for="(faq, index) in faqs" :key="faq.question" class="faq-item">
        <button
          class="faq-item__question"
          type="button"
          :aria-expanded="openQuestion === index"
          :aria-controls="`faq-answer-${index}`"
          @click="toggleQuestion(index)"
        >
          <span>{{ faq.question }}</span>
          <span class="faq-item__sign">{{ openQuestion === index ? '–' : '+' }}</span>
        </button>
        <p
          v-if="openQuestion === index"
          :id="`faq-answer-${index}`"
          class="faq-item__answer"
        >
          {{ faq.answer }}
        </p>
      </article>
    </div>
  </section>
</template>
