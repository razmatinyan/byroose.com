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
         "AI content creation and web development services from one team. Buy one or both, made to the same brief, so your views turn into leads.",
      label: "Services",
   },
   aiContentCreation: {
      path: "/services/ai-content-creation",
      name: "AI content creation",
      title: "AI content creation agency: videos, UGC ads, and visuals",
      description:
         "AI videos, UGC ads, reels, and product photography made for your brand and edited by humans. Content that stops the scroll and sends people to your site.",
      label: "Services",
   },
   webDevelopment: {
      path: "/services/web-development",
      name: "Web development",
      title: "Web development agency: websites and landing pages",
      description:
         "Conversion-focused websites and landing pages designed around your content. Fast, accessible, and easy to update. Built by the team that makes your AI content.",
      label: "Services",
   },
   work: {
      path: "/work",
      name: "Work",
      title: "AI content and web development case studies",
      description:
         "See our AI content and web development work: a virtual UGC creator, an AI animated series, and Sygen, our free color system tool.",
      label: "Work",
   },
   about: {
      path: "/about",
      name: "About",
      title: "About forrrow: AI creative agency",
      description:
         "Meet the founders of forrrow, an AI content and web development agency. A creative director and a software engineer building both halves of your funnel.",
      label: "About",
   },
   blog: {
      path: "/blog",
      name: "Blog",
      title: "Blog: AI content and web development insights",
      description:
         "Read practical forrrow articles about AI content creation, web development, and turning audience attention into action.",
      label: "Blog",
   },
   contact: {
      path: "/contact",
      name: "Contact",
      title: "Contact forrrow: start an AI content or web project",
      description:
         "Tell forrrow about your project. Share your name, email, and idea, and we'll reply with clear next steps for AI content creation or web development.",
      label: "Contact",
   },
   privacy: {
      path: "/privacy",
      name: "Privacy policy",
      title: "Privacy policy: how forrrow handles personal data",
      description:
         "Read how forrrow collects, uses, and protects personal data when you visit forrrow.com, send us a message, or work with us on a project.",
      label: "Legal",
   },
} as const satisfies Record<string, PageSeoCopy>;
