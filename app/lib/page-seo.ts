import { siteDescription } from "./site";

export interface PageSeoCopy {
   path: string;
   name: string;
   title: string;
   description: string;
   label?: string;
}

export const pageSeo = {
   home: {
      path: "/",
      name: "Home",
      title: "AI content creation and web development agency",
      description: siteDescription,
   },
   services: {
      path: "/services",
      name: "Services",
      title: "AI content creation and web development services",
      description:
         "byroose creates AI content and builds websites in one connected practice, from visuals, videos, and reels to clear, fast sites designed to convert.",
      label: "Services",
   },
   work: {
      path: "/work",
      name: "Work",
      title: "Our work: AI content and website projects",
      description:
         "Browse byroose projects: reels, video, and AI imagery alongside websites designed and coded from scratch. Filter by AI content or website development.",
      label: "Work",
   },
   about: {
      path: "/about",
      name: "About",
      title: "About byroose: AI content and web development team",
      description:
         "Meet the team behind byroose, a creative agency that pairs AI content creation with web development so brands get seen, trusted, and chosen.",
      label: "About",
   },
   blog: {
      path: "/blog",
      name: "Blog",
      title: "Blog: AI content and web development insights",
      description:
         "Read practical byroose articles about AI content creation, web development, and turning audience attention into action.",
      label: "Blog",
   },
   contact: {
      path: "/contact",
      name: "Contact",
      title: "Contact byroose: start an AI content or web project",
      description:
         "Tell byroose about your project. Share your name, email, and idea, and we'll reply with clear next steps for AI content creation or web development.",
      label: "Contact",
   },
} as const satisfies Record<string, PageSeoCopy>;
