<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { NuxtLink } from '#components'
import BlogCard from '@/components/cards/BlogCard.vue'
import SplitText from '@/components/shared/SplitText.vue'
import { Button, ButtonIcon } from '@/components/ui/button'
import type { SplitTextResult } from '@/lib/split-text'

const blogRoute = '/blog'
const blogTitle = 'More Than a Blog'

const articles = [
	{
		title: 'What we learned shipping 400 AI-generated assets',
		category: 'AI content creation',
		publishedAt: '2026-09-22',
		image: '/images/hero/3.png',
		tone: 'pink' as const,
	},
	{
		title: 'Why AI video still looks stock, and how we fix it',
		category: 'AI content creation',
		publishedAt: '2026-09-08',
		image: '/images/hero/4.png',
		tone: 'yellow' as const,
	},
	{
		title: 'How we ship a website in five weeks',
		category: 'Web development',
		publishedAt: '2026-08-25',
		image: '/images/hero/6.png',
		tone: 'green' as const,
	},
]

const blogRoot = useTemplateRef<HTMLElement>('blogRoot')
const titleSplit = shallowRef<SplitTextResult>()
const cardTitleSplits = shallowRef<(SplitTextResult | undefined)[]>(
	articles.map(() => undefined),
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
					type="words"
					@split="setTitleSplit"
				/>
				<div data-blog-cta-mask>
					<span class="blog-action" data-blog-cta>
						<Button :as="NuxtLink" :to="blogRoute" variant="dark" size="cta-lg">
							All articles
							<template #icon>
								<ButtonIcon />
							</template>
						</Button>
					</span>
				</div>
			</div>

			<div class="blog-grid">
				<BlogCard
					v-for="(article, index) in articles"
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
	@apply rounded-2xl bg-card py-16 text-card-foreground md:py-20 xl:py-24;
}

.blog-heading {
	@apply flex flex-wrap items-end justify-between gap-6;
}

.blog-title {
	@apply text-[clamp(2.75rem,9vw,9rem)] leading-[0.92];
}

.blog-title :deep(.split-text-word),
.blog-title :deep(.split-text-word-mask) {
	display: inline-block;
}

.blog-title :deep(.split-text-word) {
	visibility: hidden;
}

.blog-title :deep(.split-text-word-mask) {
	margin-block: -0.15em;
	padding-block: 0.15em;
}

.blog-action {
	@apply block;
}

.blog-grid {
	@apply mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3 xl:mt-16 xl:gap-5;
}
</style>
