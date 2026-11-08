<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import BlogCard from "@/components/cards/BlogCard.vue";
import SplitText from "@/components/shared/SplitText.vue";
import { blogArticles } from "@/lib/blog-articles";
import type { BlogCategory } from "@/lib/blog-categories";
import type { SplitTextResult } from "@/lib/split-text";
import BlogCategoryNav from "./BlogCategoryNav.vue";

const { category } = defineProps<{
   category?: BlogCategory;
}>();

const route = useRoute();
const articles = category
   ? blogArticles.filter((article) => article.category === category)
   : blogArticles;
const sectionTitle = `Articles - ${articles.length}`;
const emptyMessage = "No articles in this category yet.";
const sectionRoot = useTemplateRef<HTMLElement>("sectionRoot");
const titleSplit = shallowRef<SplitTextResult>();
const cardTitleSplits = shallowRef<(SplitTextResult | undefined)[]>(
   articles.map(() => undefined),
);

useBlogMotion(sectionRoot, { cardTitleSplits, titleSplit });

function setTitleSplit(parts: SplitTextResult) {
   titleSplit.value = parts;
}

function setCardTitleSplit(index: number, parts: SplitTextResult) {
   cardTitleSplits.value = cardTitleSplits.value.with(index, parts);
}
</script>

<template>
   <section ref="sectionRoot" class="blog-articles section-gutter">
      <div class="blog-articles-heading" data-blog-heading>
         <SplitText
            class="blog-articles-title"
            as="h2"
            mask="words"
            :text="sectionTitle"
            type="words,chars"
            @split="setTitleSplit"
         />
         <BlogCategoryNav :active-path="route.path" />
      </div>
      <ul v-if="articles.length" class="blog-articles-grid">
         <li v-for="(article, index) in articles" :key="article.title">
            <BlogCard
               v-bind="article"
               href="/blog"
               surface="neutral"
               @title-split="setCardTitleSplit(index, $event)"
            />
         </li>
      </ul>
      <p v-else class="blog-articles-empty">{{ emptyMessage }}</p>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.blog-articles {
   @apply relative z-10 rounded-t-[clamp(1.5rem,3vw,3rem)] bg-canvas-shade py-section text-canvas-shade-foreground;
}

.blog-articles-heading {
   @apply flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8;
}

.blog-articles-title {
   @apply m-0 overflow-x-visible overflow-y-clip leading-none font-bold tracking-[-0.05em] whitespace-nowrap;
   font-size: clamp(2.75rem, 7.5vw, 8rem);
   margin-block: -0.15em;
   padding-block: 0.15em;
}

.blog-articles-title :deep(.split-text-word),
.blog-articles-title :deep(.split-text-word-mask) {
   display: inline-block;
}

.blog-articles-title :deep(.split-text-char) {
   display: inline-block;
   visibility: hidden;
}

.blog-articles-title :deep(.split-text-word-mask) {
   margin-block: -0.15em;
   padding-block: 0.15em;
}

.blog-articles-grid {
   @apply m-0 mt-12 grid list-none grid-cols-1 gap-4 p-0 md:mt-16 md:grid-cols-3 xl:mt-20 xl:gap-5;
}

.blog-articles-empty {
   @apply m-0 mt-12 text-2xl font-medium text-canvas-shade-foreground/60 md:mt-16;
}
</style>
