<script setup lang="ts">
import ProjectEditor from "@/components/project-editor/ProjectEditor.vue";

definePageMeta({ middleware: "admin" });

useSeoMeta({
   robots: "noindex, nofollow",
   title: "New project | byroose",
});
</script>

<template>
   <ProjectEditor />
</template>
