<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { NuxtLink } from '#components'
import { Button, ButtonIcon } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import SplitText from '@/components/shared/SplitText.vue'
import type { SplitTextResult } from '@/lib/split-text'
import { appIcons } from '@/lib/icons'
import { cn } from '@/lib/utils'

const {
	class: className,
	href,
	image,
	title,
} = defineProps<{
	class?: HTMLAttributes['class']
	href: string
	image: string
	title: string
}>()

const emit = defineEmits<{
	titleSplit: [parts: SplitTextResult]
}>()
</script>

<template>
	<Card
		:as="NuxtLink"
		:to="href"
		variant="plain"
		data-blog-card
		:class="cn('blog-card', className)"
	>
		<div class="blog-card-media">
			<NuxtImg
				class="blog-card-image"
				:src="image"
				alt=""
				width="1456"
				height="816"
				sizes="sm:768px md:1024px lg:640px xl:768px 2xl:1024px"
				densities="x1"
				loading="lazy"
				draggable="false"
			/>
			<span class="blog-card-overlay" aria-hidden="true">
				<span class="blog-card-action">
					<Button as="span" variant="dark" size="cta-lg">
						Read Article
						<template #icon>
							<ButtonIcon :icon="appIcons.arrowRight" />
						</template>
					</Button>
				</span>
			</span>
		</div>

		<SplitText
			class="blog-card-title"
			as="h3"
			auto-split
			mask="lines"
			:text="title"
			type="lines,words"
			@split="emit('titleSplit', $event)"
		/>
	</Card>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.blog-card {
	--blog-card-hover-ease: cubic-bezier(0.19, 1, 0.22, 1);
	@apply flex h-full flex-col gap-5 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:gap-6;
}

.blog-card-media {
	@apply relative aspect-4/3 overflow-hidden rounded-xl;
}

.blog-card-image {
	@apply size-full object-cover transition-[filter,scale] duration-500 ease-(--blog-card-hover-ease) select-none motion-reduce:transition-none;
	filter: blur(0);
}

.blog-card-overlay {
	@apply pointer-events-none absolute inset-0 grid place-items-center;
}

.blog-card-action {
	@apply inline-flex rounded-action shadow-xl shadow-foreground/25 translate-y-4 scale-90 opacity-0 transition-[opacity,translate,scale] duration-500 ease-(--blog-card-hover-ease) motion-reduce:transition-none;
}

.blog-card:focus-visible .blog-card-image {
	@apply scale-110;
	filter: blur(12px);
}

.blog-card:focus-visible .blog-card-action {
	@apply translate-y-0 scale-100 opacity-100;
}

@media (hover: hover) {
	.blog-card:hover .blog-card-image {
		@apply scale-110;
		filter: blur(12px);
	}

	.blog-card:hover .blog-card-action {
		@apply pointer-events-auto translate-y-0 scale-100 opacity-100;
	}
}

.blog-card-title {
	@apply m-0 text-2xl leading-[0.95] font-semibold tracking-[-0.045em] md:text-xl lg:text-3xl xl:text-4xl;
}

.blog-card-title :deep(.split-text-line),
.blog-card-title :deep(.split-text-line-mask) {
	display: block;
}

.blog-card-title :deep(.split-text-word) {
	display: inline-block;
}

.blog-card-title :deep(.split-text-line) {
	visibility: hidden;
	white-space: nowrap;
}

.blog-card-title :deep(.split-text-line-mask) {
	margin-block: -0.12em -0.2em;
	margin-inline-end: -0.15em;
	padding-block: 0.12em 0.2em;
	padding-inline-end: 0.15em;
}
</style>
