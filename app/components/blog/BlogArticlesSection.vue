<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import BlogCard from "@/components/cards/BlogCard.vue";
import SplitText from "@/components/shared/SplitText.vue";
import { blogArticles } from "@/lib/blog-articles";
import type { SplitTextResult } from "@/lib/split-text";

const sectionTitle = `Articles - ${blogArticles.length}`;
const sectionRoot = useTemplateRef<HTMLElement>("sectionRoot");
const titleSplit = shallowRef<SplitTextResult>();
const cardTitleSplits = shallowRef<(SplitTextResult | undefined)[]>(
   blogArticles.map(() => undefined),
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
      <div data-blog-heading>
         <SplitText
            class="blog-articles-title"
            as="h2"
            mask="words"
            :text="sectionTitle"
            type="words,chars"
            @split="setTitleSplit"
         />
      </div>
      <ul class="blog-articles-grid">
         <li v-for="(article, index) in blogArticles" :key="article.title">
            <BlogCard
               v-bind="article"
               href="/blog"
               surface="neutral"
               @title-split="setCardTitleSplit(index, $event)"
            />
         </li>
      </ul>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.blog-articles {
   @apply relative z-10 rounded-t-[clamp(1.5rem,3vw,3rem)] bg-canvas-shade py-section text-canvas-shade-foreground;
}

.blog-articles-title {
   @apply m-0 overflow-x-visible overflow-y-clip leading-none font-bold tracking-[-0.05em];
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
</style>
