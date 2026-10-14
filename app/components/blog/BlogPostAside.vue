<script setup lang="ts">
import { computed, shallowRef } from "vue";
import { useClipboard, useShare } from "@vueuse/core";
import { Button } from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import { formatPublishDate } from "@/lib/utils";

const { title, date, author } = defineProps<{
   title: string;
   date: string;
   author?: { name: string; role?: string; image?: string };
}>();

const { share, isSupported: canShare } = useShare();
const { copy } = useClipboard({ legacy: true });
const shareStatus = shallowRef("");

const authorInitial = computed(() => author?.name.charAt(0).toUpperCase() ?? "");

async function copyLink(url: string) {
   await copy(url);
   shareStatus.value = "Link copied";
}

async function shareArticle() {
   const url = window.location.href;

   if (!canShare.value) {
      await copyLink(url);
      return;
   }

   try {
      await share({ title, url });
   } catch {
      await copyLink(url);
   }
}
</script>

<template>
   <aside class="post-aside" aria-label="Article details">
      <div class="post-aside-inner">
         <p v-if="author" class="post-aside-author">
            <NuxtImg
               v-if="author.image"
               :src="author.image"
               alt=""
               width="40"
               height="40"
               class="post-aside-avatar"
            />
            <span v-else class="post-aside-avatar post-aside-initial" aria-hidden="true">
               {{ authorInitial }}
            </span>
            <span class="flex flex-col">
               <span class="font-semibold">{{ author.name }}</span>
               <span v-if="author.role" class="post-aside-muted">{{ author.role }}</span>
            </span>
         </p>

         <div class="post-aside-article">
            <p class="post-aside-title">{{ title }}</p>
            <time class="post-aside-muted" :datetime="date">{{ formatPublishDate(date) }}</time>
         </div>

         <div class="post-aside-share">
            <Button
               variant="outline"
               size="icon"
               class="rounded-full"
               aria-label="Share this article"
               title="Share this article"
               @click="shareArticle"
            >
               <Icon :name="appIcons.share" aria-hidden="true" />
            </Button>
            <span class="post-aside-muted" role="status">{{ shareStatus }}</span>
         </div>
      </div>
   </aside>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.post-aside-inner {
   @apply flex flex-wrap items-center gap-x-8 gap-y-5 lg:sticky lg:top-28 lg:flex-col lg:items-start;
}

.post-aside-author {
   @apply flex items-center gap-3 text-base;
}

.post-aside-avatar {
   @apply size-10 shrink-0 rounded-full object-cover;
}

.post-aside-initial {
   @apply grid place-items-center bg-foreground font-semibold text-background;
}

.post-aside-article {
   @apply hidden flex-col gap-1 lg:flex;
}

.post-aside-title {
   @apply max-w-[16em] text-lg leading-snug font-semibold tracking-[-0.02em];
}

.post-aside-muted {
   @apply text-base text-muted-foreground;
}

.post-aside-share {
   @apply flex items-center gap-3;
}
</style>
