<script setup lang="ts">
import { defineAsyncComponent, useTemplateRef } from "vue";
import DrawnLine from "@/components/shared/DrawnLine.vue";
import { aboutTeamLine } from "@/lib/about-line-path";
import { appIcons } from "@/lib/icons";
import { servicePagePaths } from "@/lib/services-anchors";
import AboutTeamMember from "./AboutTeamMember.vue";
import type {
   AboutMemberLink,
   AboutMemberPortrait,
   AboutMemberSocial,
} from "./AboutTeamMember.vue";
import AboutTitle from "./AboutTitle.vue";
import type { AboutTitleLine } from "./AboutTitle.vue";

const TrailingTooltip = defineAsyncComponent(
   () => import("@/components/shared/TrailingTooltip.vue"),
);

const titleLines: readonly AboutTitleLine[] = [
   { text: "Who are the" },
   { text: "forrrow founders", logo: "forrrow", underlined: "founders" },
];

const tooltipLabel = "More Info";

interface TeamMember {
   bio: readonly string[];
   link?: AboutMemberLink;
   name: string;
   portrait?: AboutMemberPortrait;
   role: string;
   socials: readonly AboutMemberSocial[];
}

const members: readonly TeamMember[] = [
   {
      bio: [
         "Ruzan leads AI content creation: the concepts, the visuals, and the videos that make people stop. She directs every asset and makes sure it looks like your brand, not like a prompt.",
      ],
      link: {
         label: "See AI content creation services",
         to: servicePagePaths.aiContent,
      },
      name: "Ruzan Darbinyan",
      portrait: {
         alt: "Ruzan Darbinyan, co-founder and creative director of forrrow",
         height: 1536,
         src: "/images/founder.jpg",
         width: 2048,
      },
      role: "Co-Founder and Creative Director",
      socials: [
         {
            href: "https://www.linkedin.com/in/ruzan-darbinian-b38855232/",
            icon: appIcons.linkedin,
            label: "LinkedIn",
         },
         {
            href: "https://www.instagram.com/withroose_/",
            icon: appIcons.instagram,
            label: "Instagram",
         },
      ],
   },
   {
      bio: [
         "Razmik leads web development: the websites, forms, and tracking that turn attention into leads. He builds sites that are fast, accessible, and easy to update.",
      ],
      link: {
         label: "See web development services",
         to: servicePagePaths.web,
      },
      name: "Razmik Matinyan",
      role: "Co-Founder and Senior Software Engineer",
      socials: [
         {
            href: "https://www.linkedin.com/in/razmatinyan/",
            icon: appIcons.linkedin,
            label: "LinkedIn",
         },
         {
            href: "https://www.instagram.com/razo.codes/",
            icon: appIcons.instagram,
            label: "Instagram",
         },
         {
            href: "https://github.com/razmatinyan",
            icon: appIcons.github,
            label: "GitHub",
         },
      ],
   },
];

const teamRoot = useTemplateRef<HTMLElement>("teamRoot");
const { titleRevealed } = useAboutSectionMotion(teamRoot);
const {
   active: tooltipActive,
   hide: hideTooltip,
   shouldLoad: shouldLoadTooltip,
   show: showTooltip,
} = useTrailingTooltip();
useDrawnLineMotion(teamRoot, aboutTeamLine);

function activateTooltip() {
   showTooltip();
}
</script>

<template>
   <section ref="teamRoot" class="about-team section-gutter">
      <DrawnLine class="about-team-line" />

      <AboutTitle :drawn="titleRevealed" :lines="titleLines" />

      <div class="about-team-members">
         <AboutTeamMember
            v-for="member in members"
            :key="member.name"
            class="about-team-member"
            :bio="member.bio"
            :link="member.link"
            :name="member.name"
            :portrait="member.portrait"
            :role="member.role"
            :socials="member.socials"
            @activate="activateTooltip"
            @deactivate="hideTooltip"
         />
      </div>

      <TrailingTooltip
         v-if="shouldLoadTooltip"
         :active="tooltipActive"
         :icon="appIcons.arrowUpRight"
         :label="tooltipLabel"
      />
   </section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-team {
   @apply relative z-10 rounded-t-[clamp(1.5rem,3vw,3rem)] bg-canvas-shade py-section text-canvas-shade-foreground;
   padding-bottom: calc(var(--spacing-section) * 2.25);
   --about-member-width: clamp(16rem, 34vw, 32rem);
   --about-member-inset: clamp(2rem, 8vw, 9rem);
}

.about-team-line {
   @apply inset-0 size-full overflow-hidden text-ribbon;
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
   .about-team-member:first-child {
      margin-right: var(--about-member-inset);
   }

   .about-team-member:last-child {
      margin-top: calc(var(--about-member-width) * -0.45);
      margin-left: var(--about-member-inset);
   }
}
</style>
