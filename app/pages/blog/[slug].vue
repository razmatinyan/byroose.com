<script setup lang="ts">
import BlogPostPage from "@/components/blog/BlogPostPage.vue";
import type { BlogNextPostSummary } from "@/components/blog/BlogPostPage.vue";

const route = useRoute();
const includeDrafts = import.meta.dev;

const { data } = await useAsyncData(`blog-${route.path}`, async () => {
   const [post, posts] = await Promise.all([
      queryCollection("blog").path(route.path).first(),
      queryCollection("blog").select("path", "title", "cover", "date", "draft").order("date", "DESC").all(),
   ]);

   return { post, posts: posts.filter((entry) => includeDrafts || !entry.draft) };
});

const post = data.value?.post;

if (!post || (post.draft && !includeDrafts)) {
   throw createError({ statusCode: 404, statusMessage: "Article not found", fatal: true });
}

const nextPost = computed<BlogNextPostSummary | undefined>(() => {
   const posts = data.value?.posts ?? [];
   const index = posts.findIndex((entry) => entry.path === route.path);
   const candidate = posts[index + 1] ?? posts.find((entry) => entry.path !== route.path);

   return candidate ? { title: candidate.title, path: candidate.path, cover: candidate.cover } : undefined;
});
</script>

<template>
   <BlogPostPage :post="post" :next-post="nextPost" />
</template>
