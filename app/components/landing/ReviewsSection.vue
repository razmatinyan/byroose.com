<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import MediaPlaceholder from '@/components/shared/MediaPlaceholder.vue'
import { Card } from '@/components/ui/card'

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
	if (reviewTimer) clearInterval(reviewTimer)

	reviewTimer = setInterval(() => {
		selectedReview.value = (selectedReview.value + 1) % reviewData.length
	}, 6000)
}

function selectReview(index: number) {
	selectedReview.value = index
	restartTimer()
}

onMounted(restartTimer)
onBeforeUnmount(() => reviewTimer && clearInterval(reviewTimer))
</script>

<template>
	<section id="reviews" class="reviews section-gutter">
		<Card variant="plain" class="reviews-card">
			<div class="reviews-copy">
				<blockquote class="reviews-quote" aria-live="polite">
					<p>{{ activeReview.quote }}</p>
				</blockquote>
				<div class="reviews-author">
					<div class="reviews-name">{{ activeReview.name }}</div>
					<div class="reviews-role">{{ activeReview.role }}, {{ activeReview.company }}</div>
				</div>
				<div class="reviews-dots" aria-label="Select a review">
					<button
						v-for="(review, index) in reviewData"
						:key="review.name"
						class="reviews-dot"
						type="button"
						:aria-label="`Show review ${index + 1}`"
						:aria-current="index === selectedReview ? 'true' : undefined"
						@click="selectReview(index)"
					/>
				</div>
			</div>

			<MediaPlaceholder class="reviews-portrait" label="client portrait" />
		</Card>
	</section>
</template>
