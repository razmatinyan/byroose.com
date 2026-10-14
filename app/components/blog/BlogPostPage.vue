<script setup lang="ts">
import type { BlogCollectionItem } from "@nuxt/content";
import { siteUrl } from "@/lib/site";
import BlogNextPost from "./BlogNextPost.vue";
import BlogPostAside from "./BlogPostAside.vue";
import BlogPostHero from "./BlogPostHero.vue";

export interface BlogNextPostSummary {
   title: string;
   path: string;
   cover: BlogCollectionItem["cover"];
}

const { post, nextPost } = defineProps<{
   post: BlogCollectionItem;
   nextPost?: BlogNextPostSummary;
}>();

usePageSeo({
   title: post.title,
   description: post.description,
   label: post.category,
   image: post.cover,
});

useSchemaOrg([
   defineBreadcrumb({
      itemListElement: [
         { name: "Home", item: "/" },
         { name: "Blog", item: "/blog" },
         { name: post.title, item: post.path },
      ],
   }),
   defineArticle({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      image: new URL(post.cover.src, siteUrl).href,
      datePublished: post.date,
      ...(post.author ? { author: { name: post.author.name } } : {}),
   }),
]);
</script>

<template>
   <div>
      <article class="post-page">
         <BlogPostHero :title="post.title" :cover="post.cover" />

         <div class="post-layout section-gutter">
            <BlogPostAside :title="post.title" :date="post.date" :author="post.author" class="post-layout-aside" />
            <ContentRenderer :value="post" class="post-body" />
         </div>
      </article>

      <BlogNextPost v-if="nextPost" :title="nextPost.title" :path="nextPost.path" :cover="nextPost.cover" />
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.post-layout {
   @apply grid grid-cols-1 gap-y-10 pt-14 pb-25 md:pt-20 lg:grid-cols-12;
}

.post-layout-aside {
   @apply lg:col-span-3 lg:col-start-1 lg:row-start-1;
}

.post-body {
   @apply min-w-0 text-xl leading-relaxed font-medium text-foreground lg:col-span-6 lg:col-start-4 lg:row-start-1;
}

.post-body :deep(p) {
   @apply mb-6;
}

.post-body :deep(h2) {
   @apply mt-16 mb-6 border-t border-foreground/15 pt-12 text-4xl leading-tight font-semibold tracking-[-0.03em] text-balance text-foreground md:text-5xl;
}

.post-body :deep(.article-divider + h2) {
   @apply mt-0 border-t-0 pt-0;
}

.post-body :deep(h3) {
   @apply mt-10 mb-4 text-3xl leading-snug font-semibold tracking-[-0.02em] text-foreground;
}

.post-body :deep(:is(p, li, td, blockquote) a) {
   @apply font-medium text-foreground underline underline-offset-4 hover:text-primary;
}

.post-body :deep(strong) {
   @apply font-semibold text-foreground;
}

.post-body :deep(ul),
.post-body :deep(ol) {
   @apply mb-6 flex flex-col gap-2 ps-6;
}

.post-body :deep(ul) {
   @apply list-disc;
}

.post-body :deep(ol) {
   @apply list-decimal;
}

.post-body :deep(blockquote) {
   @apply my-10 border-s-2 border-brand-green ps-6 text-2xl font-medium text-foreground;
}

.post-body :deep(th) {
   @apply bg-canvas-shade px-4 py-3 text-left font-semibold text-foreground;
}

.post-body :deep(td) {
   @apply border-b border-foreground/10 px-4 py-3 align-top;
}
</style>
