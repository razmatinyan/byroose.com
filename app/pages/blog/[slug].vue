const found = data.value?.post;
const post = found && (includeDrafts || !found.draft) ? found : null;

if (!post) {
   const event = useRequestEvent();
   if (event) setResponseStatus(event, 404);
}
<script setup lang="ts">
import BlogPostPage from "@/components/blog/BlogPostPage.vue";
import type { BlogNextPostSummary } from "@/components/blog/BlogPostPage.vue";
import SiteErrorView from "@/components/layout/SiteErrorView.vue";

const route = useRoute();
const includeDrafts = import.meta.dev;

const { data } = await useAsyncData(`blog-${route.path}`, async () => {
   const [post, posts] = await Promise.all([
      queryCollection("blog").path(route.path).first(),
      queryCollection("blog").select("path", "title", "cover", "date", "draft").order("date", "DESC").all(),
   ]);

   return { post, posts: posts.filter((entry) => includeDrafts || !entry.draft) };
});

const found = data.value?.post;
const post = found && (includeDrafts || !found.draft) ? found : null;

if (!post) {
   const event = useRequestEvent();
   if (event) setResponseStatus(event, 404);
}

const nextPost = computed<BlogNextPostSummary | undefined>(() => {
   const posts = data.value?.posts ?? [];
   const index = posts.findIndex((entry) => entry.path === route.path);
   const candidate = posts[index + 1] ?? posts.find((entry) => entry.path !== route.path);

   return candidate ? { title: candidate.title, path: candidate.path, cover: candidate.cover } : undefined;
});
</script>

<template>
   <BlogPostPage v-if="post" :post="post" :next-post="nextPost" />
   <SiteErrorView v-else />
</template>
