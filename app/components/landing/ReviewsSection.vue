<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'

interface Review {
  quote: string
  name: string
  role: string
  company: string
}

const reviewData: Review[] = [
  {
    quote: 'They killed two channels we loved and were right about both. Revenue moved within a quarter.',
    name: 'Ilse Warner',
    role: 'CMO',
    company: 'Nova Dairy',
  },
  {
    quote: 'The AI pipeline sounds like a gimmick until forty on-brand assets land in a single month.',
    name: 'Tomas Brekke',
    role: 'Founder',
    company: 'Vestlund',
  },
  {
    quote: 'Site rebuild shipped in five weeks and our procurement team had no notes. That never happens.',
    name: 'Ana Costa',
    role: 'Head of Digital',
    company: 'Kessler Tools',
  },
  {
    quote: 'First agency that showed us the maths behind a recommendation before asking for budget.',
    name: 'Peter Halden',
    role: 'Managing Director',
    company: 'Halden Clinics',
  },
]

const selectedReview = shallowRef(0)
const activeReview = computed(() => reviewData[selectedReview.value]!)
let reviewTimer: ReturnType<typeof setInterval> | undefined

function restartTimer() {
  if (reviewTimer) {
    clearInterval(reviewTimer)
  }

  reviewTimer = setInterval(() => {
    selectedReview.value = (selectedReview.value + 1) % reviewData.length
  }, 6000)
}

function selectReview(index: number) {
  selectedReview.value = index
  restartTimer()
}

onMounted(restartTimer)

onBeforeUnmount(() => {
  if (reviewTimer) {
    clearInterval(reviewTimer)
  }
})
</script>

<template>
  <section id="reviews" class="reviews section-gutter">
    <div class="reviews__card">
      <div class="reviews__copy">
        <span class="eyebrow">Reviews</span>
        <blockquote class="reviews__quote">
          <p>{{ activeReview.quote }}</p>
        </blockquote>
        <div class="reviews__author">
          <div class="reviews__name">{{ activeReview.name }}</div>
          <div class="reviews__role">
            {{ activeReview.role }}, {{ activeReview.company }}
          </div>
        </div>
        <div class="reviews__dots" aria-label="Select a review">
          <button
            v-for="(review, index) in reviewData"
            :key="review.name"
            class="reviews__dot"
            :class="{ 'is-active': index === selectedReview }"
            type="button"
            :aria-label="`Show review ${index + 1}`"
            :aria-current="index === selectedReview ? 'true' : undefined"
            @click="selectReview(index)"
          />
        </div>
      </div>

      <div class="reviews__portrait media-placeholder">
        <span>client portrait</span>
      </div>
    </div>
  </section>
</template>
