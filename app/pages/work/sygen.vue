<script setup lang="ts">
import ProjectPage from "@/components/project/ProjectPage.vue";
import { getNextProject } from "@/data/projects";
import project from "@/data/projects/sygen";
</script>

<template>
   <ProjectPage :project="project" :next-project="getNextProject(project)" />
</template>
