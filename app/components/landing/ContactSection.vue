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
							<template #icon>
								<ButtonIcon tone="dark" />
							</template>
						</Button>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.contact {
	@apply relative w-full overflow-hidden bg-primary px-page py-14 text-primary-foreground md:py-20 xl:py-28;
}

.contact-layout {
	@apply flex flex-wrap items-end justify-between gap-10;
}

.contact-heading-wrap {
	@apply max-w-[22ch];
}

.contact-heading {
	@apply mt-4 mb-0 text-5xl leading-[0.9] font-bold tracking-[-0.05em] sm:text-6xl md:text-7xl xl:text-8xl;
}

.contact-copy {
	@apply flex max-w-lg flex-col gap-6;
}

.contact-copy p {
	@apply m-0 text-base leading-relaxed text-current sm:text-lg;
}

.contact-actions {
	@apply flex flex-wrap gap-3;
}
</style>
