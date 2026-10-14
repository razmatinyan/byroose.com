<template>
   <aside class="article-callout">
      <span class="article-callout-dot" aria-hidden="true" />
      <div class="article-callout-body">
         <slot mdc-unwrap="p" />
      </div>
   </aside>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.article-callout {
   @apply my-10 flex gap-4 rounded-lg bg-canvas-shade p-6 md:p-8;
}

.article-callout-dot {
   @apply mt-[0.55em] size-2.5 shrink-0 rounded-full bg-brand-green;
}

.article-callout-body {
   @apply font-medium text-foreground;
}
</style>
