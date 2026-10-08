<script setup lang="ts">
import { useTemplateRef } from "vue";
import AboutTeamMember from "./AboutTeamMember.vue";
import type { AboutMemberPortrait } from "./AboutTeamMember.vue";
import AboutTitle from "./AboutTitle.vue";
import type { AboutTitleLine } from "./AboutTitle.vue";

const titleLines: readonly AboutTitleLine[] = [
   { text: "Who stands" },
   { text: "behind byroose", underlined: "behind" },
];

interface TeamMember {
   name: string;
   portrait?: AboutMemberPortrait;
   role: string;
}

const members: readonly TeamMember[] = [
   {
      name: "Ruzan Darbinyan",
      portrait: {
         alt: "Ruzan Darbinyan kicking one leg high beside a lamppost on a sunny street corner",
         height: 1536,
         src: "/images/founder.jpg",
         width: 2048,
      },
      role: "Mer axper Ruzanna",
   },
   { name: "Razmik Matinyan", role: "Senior Web Developer" },
];

const teamRoot = useTemplateRef<HTMLElement>("teamRoot");
const { titleRevealed } = useAboutSectionMotion(teamRoot);
</script>

<template>
   <section ref="teamRoot" class="about-team section-gutter">
      <AboutTitle :drawn="titleRevealed" :lines="titleLines" />

      <div class="about-team-members">
         <AboutTeamMember
            v-for="member in members"
            :key="member.name"
            class="about-team-member"
            :name="member.name"
            :portrait="member.portrait"
            :role="member.role"
         />
      </div>
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-team {
   @apply relative z-10 rounded-t-[clamp(1.5rem,3vw,3rem)] bg-canvas-shade py-section text-canvas-shade-foreground;
   --about-member-width: clamp(16rem, 34vw, 32rem);
}

.about-team-members {
   @apply mt-16 flex flex-col gap-16 md:mt-20;
}

.about-team-member {
   @apply max-w-md md:max-w-none md:w-(--about-member-width);
}

.about-team-member:first-child {
   @apply self-end;
}

.about-team-member:last-child {
   @apply self-start;
}

@media (min-width: 48rem) {
   .about-team-member:last-child {
      margin-top: calc(var(--about-member-width) * -0.45);
   }
}
</style>
