<template>
   <div class="article-table">
      <table>
         <slot />
      </table>
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.article-table {
   @apply my-10 overflow-x-auto rounded-lg;
}

.article-table table {
   @apply w-full min-w-120 border-collapse text-lg;
}
</style>
