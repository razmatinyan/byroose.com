<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { NuxtLink } from '#components'
import { cn } from '@/lib/utils'
import { Button, ButtonIcon } from '@/components/ui/button'
import type { ButtonVariant, RolloverTones } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import SplitText from '@/components/shared/SplitText.vue'
import type { SplitTextResult } from '@/lib/split-text'

type Theme = 'blue' | 'orange' | 'white'

const {
	action,
	body,
	class: className,
	image,
	number,
	theme = 'white',
	title,
} = defineProps<{
	action: string
	body: string
	class?: HTMLAttributes['class']
	image: string
	number: string
	theme?: Theme
	title: string
}>()

const servicesRoute = '/services'

const actionVariants: Record<Theme, ButtonVariant> = {
	blue: 'light',
	orange: 'light',
	white: 'dark',
}

const actionRolloverTones: Partial<Record<Theme, RolloverTones>> = {
	orange: ['blue', 'green', 'dark'],
}

const emit = defineEmits<{
	bodySplit: [parts: SplitTextResult]
	titleSplit: [parts: SplitTextResult]
}>()

const surfaceClasses: Record<Theme, string> = {
	blue: 'surface-blue',
	orange: 'surface-orange',
	white: 'surface-card',
}
</script>

<template>
	<Card
		as="article"
		variant="plain"
		:class="cn('journey-step', surfaceClasses[theme], className)"
	>
		<p
			:class="
				cn(
					'journey-step-number',
					theme === 'white' ? 'text-current/25' : 'text-current/40',
				)
			"
		>
			<span class="journey-step-number-text" data-journey-step-number>
				Step {{ number }}
			</span>
		</p>
		<SplitText
			class="journey-step-title"
			as="h3"
			auto-split
			mask="lines"
			:text="title"
			type="lines"
			data-journey-step-title
			@split="emit('titleSplit', $event)"
		/>
		<div class="journey-step-body">
			<SplitText
				class="journey-step-copy"
				as="p"
				auto-split
				mask="lines"
				:text="body"
				type="lines,words"
				data-journey-step-copy
				@split="emit('bodySplit', $event)"
			/>
			<div data-journey-step-cta-mask>
				<span class="journey-step-action" data-journey-step-cta>
					<Button
						:as="NuxtLink"
						:to="servicesRoute"
						:variant="actionVariants[theme]"
						:rollover-tones="actionRolloverTones[theme]"
						size="cta-lg"
					>
						{{ action }}
						<template #icon>
							<ButtonIcon />
						</template>
					</Button>
				</span>
			</div>
		</div>

		<div class="journey-step-media" data-journey-step-media>
			<NuxtImg
				class="journey-step-image"
				:src="image"
				alt=""
				width="1456"
				height="816"
				sizes="sm:1024px md:1280px lg:1536px"
				densities="x1"
				loading="lazy"
				draggable="false"
			/>
		</div>
	</Card>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.journey-step {
	--journey-step-display: min(var(--text-step), 20cqi);
	--journey-step-label: calc(var(--journey-step-display) * 0.75);
	--journey-step-row-gap: 2rem;
	@apply grid size-full grid-rows-[auto_auto_auto_minmax(0,1fr)] content-start gap-x-12 gap-y-(--journey-step-row-gap) overflow-hidden rounded-2xl p-6 md:grid-cols-2 md:grid-rows-[auto_auto] md:p-10 md:[--journey-step-display:min(var(--text-step),9.5cqi)] md:[--journey-step-row-gap:3rem] xl:p-14 xl:[--journey-step-row-gap:4rem];
	container-type: inline-size;
}

.journey-step-title,
.journey-step-number {
	@apply m-0 min-w-0 leading-[0.85] font-bold tracking-[-0.05em] wrap-break-word;
}

.journey-step-title {
	@apply row-start-1 text-(length:--journey-step-display) md:col-start-1;
}

.journey-step-number {
	@apply row-start-3 overflow-clip text-right text-(length:--journey-step-label) uppercase md:col-start-2 md:row-start-1 md:self-end;
	margin-block: -0.12em -0.2em;
	margin-inline-end: -0.15em;
	padding-block: 0.12em 0.2em;
	padding-inline-end: 0.15em;
}

.journey-step-number-text {
	@apply inline-block tabular-nums;
	visibility: hidden;
}

.journey-step-body {
	@apply row-start-2 flex flex-col items-start gap-8 md:col-start-1 md:row-start-2 md:gap-10 xl:gap-14;
}

.journey-step-action {
	@apply block;
}

.journey-step-copy {
	@apply m-0 max-w-[32ch] self-stretch text-xl leading-[1.05] font-medium tracking-[-0.045em] sm:text-2xl xl:text-3xl;
}

.journey-step-media {
	@apply relative row-start-4 min-h-0 overflow-hidden rounded-2xl md:col-start-2 md:row-start-2 md:aspect-16/11;
	margin-top: calc(
		-1 * (var(--journey-step-row-gap) + var(--journey-step-label) * 0.3)
	);
}

.journey-step-image {
	@apply pointer-events-none size-full object-cover select-none;
}

.journey-step-title :deep(.split-text-line),
.journey-step-title :deep(.split-text-line-mask),
.journey-step-copy :deep(.split-text-line),
.journey-step-copy :deep(.split-text-line-mask) {
	display: block;
}

.journey-step-title :deep(.split-text-line),
.journey-step-copy :deep(.split-text-line) {
	visibility: hidden;
	white-space: nowrap;
}

.journey-step-title :deep(.split-text-line-mask),
.journey-step-copy :deep(.split-text-line-mask) {
	margin-block: -0.12em -0.2em;
	margin-inline-end: -0.15em;
	padding-block: 0.12em 0.2em;
	padding-inline-end: 0.15em;
}
</style>
