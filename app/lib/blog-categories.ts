import { pageSeo } from "./page-seo";
import type { PageSeoCopy } from "./page-seo";

export type BlogCategory = "AI content creation" | "Web development";

export interface BlogCategoryPage {
   category: BlogCategory;
   label: string;
   titleWords: readonly string[];
   titleSize: string;
   description: string;
   seo: PageSeoCopy;
}

export interface BlogCategoryLink {
   label: string;
   path: string;
}

export const blogCategoryPages = {
   aiContent: {
      category: "AI content creation",
      label: "AI Content",
      titleWords: ["AI", "Content"],
      titleSize: "22.3cqi",
      description:
         "AI videos, UGC ads, hooks, and what's working on each platform.",
      seo: pageSeo.blogAiContent,
   },
   webDevelopment: {
      category: "Web development",
      label: "Web Development",
      titleWords: ["Web", "Development"],
      titleSize: "12.44cqi",
      description:
         "Landing page design, website structure, and making the click feel like a continuation.",
      seo: pageSeo.blogWebDevelopment,
   },
} as const satisfies Record<string, BlogCategoryPage>;

export const blogCategoryLinks: readonly BlogCategoryLink[] = [
   { label: "All", path: pageSeo.blog.path },
   ...Object.values(blogCategoryPages).map(({ label, seo }) => ({
      label,
      path: seo.path,
   })),
];
