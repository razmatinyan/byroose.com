<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { NuxtLink } from '#components'
import BlogCard from '@/components/cards/BlogCard.vue'
import SplitText from '@/components/shared/SplitText.vue'
import { Button, ButtonIcon } from '@/components/ui/button'
import { blogArticles } from '@/lib/blog-articles'
import type { SplitTextResult } from '@/lib/split-text'

const blogRoute = '/blog'
const blogTitle = 'Our Blog'

const blogRoot = useTemplateRef<HTMLElement>('blogRoot')
const titleSplit = shallowRef<SplitTextResult>()
const cardTitleSplits = shallowRef<(SplitTextResult | undefined)[]>(
	blogArticles.map(() => undefined),
)

useBlogMotion(blogRoot, { cardTitleSplits, titleSplit })

function setTitleSplit(parts: SplitTextResult) {
	titleSplit.value = parts
}

function setCardTitleSplit(index: number, parts: SplitTextResult) {
	cardTitleSplits.value = cardTitleSplits.value.with(index, parts)
}
</script>

<template>
	<section id="blog" ref="blogRoot" class="blog">
		<div class="blog-panel section-gutter">
			<div class="blog-heading" data-blog-heading>
				<SplitText
					class="section-title blog-title"
					as="h2"
					mask="words"
					:text="blogTitle"
					type="words,chars"
					@split="setTitleSplit"
				/>
				<div data-blog-cta-mask>
					<span class="blog-action" data-blog-cta>
						<Button
							:as="NuxtLink"
							:to="blogRoute"
							class="blog-action-button"
							variant="dark"
							size="cta-icon"
							aria-label="All articles"
						>
							<template #icon>
								<ButtonIcon />
							</template>
						</Button>
					</span>
				</div>
			</div>

			<div class="blog-grid">
				<BlogCard
					v-for="(article, index) in blogArticles"
					:key="article.title"
					v-bind="article"
					:href="blogRoute"
					@title-split="setCardTitleSplit(index, $event)"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.blog {
	@apply w-full px-[clamp(1rem,2vw,1.5rem)] pb-section;
}

.blog-panel {
	@apply rounded-2xl bg-panel py-16 text-panel-foreground md:py-20 xl:py-24;
}

.blog-heading {
	--blog-title-size: clamp(2.75rem, 9vw, 9rem);
	--blog-title-leading: 0.92;
	@apply flex flex-wrap items-end justify-between gap-6;
}

.blog-title {
	@apply text-(length:--blog-title-size) leading-(--blog-title-leading);
}

.blog-title :deep(.split-text-word),
.blog-title :deep(.split-text-word-mask) {
	display: inline-block;
}

.blog-title :deep(.split-text-char) {
	display: inline-block;
	visibility: hidden;
}

.blog-title :deep(.split-text-word-mask) {
	margin-block: -0.15em;
	padding-block: 0.15em;
}

.blog-action {
	@apply block;
}

.blog-action-button {
	@apply size-[calc(var(--blog-title-leading)*1em)] text-(length:--blog-title-size);
}

.blog-action-button :deep(.button-icon-glyph > *) {
	@apply size-[0.4em];
}

.blog-grid {
	@apply mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3 xl:mt-16 xl:gap-5;
}
</style>
