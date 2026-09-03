<script setup lang="ts">
import { Button, ButtonIcon } from '@/components/ui/button'

const {
	body = 'Tell us what is stuck. You get a written point of view within three working days, free of charge and free of jargon.',
	heading = "Let's make noise.",
	primary = 'Mail us direct',
	secondary = 'Book 20 minutes',
} = defineProps<{
	body?: string
	heading?: string
	primary?: string
	secondary?: string
}>()
</script>

<template>
	<div id="contact">
		<section class="contact">
			<div class="contact-layout">
				<div class="contact-heading-wrap">
					<h2 class="contact-heading">{{ heading }}</h2>
				</div>
				<div class="contact-copy">
					<p>{{ body }}</p>
					<div class="contact-actions">
						<Button
							as="a"
							href="mailto:hello@byroose.com"
							variant="cream"
							size="cta-lg"
						>
							{{ primary }}
							<ButtonIcon tone="dark" />
						</Button>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
