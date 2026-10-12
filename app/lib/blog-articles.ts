export interface BlogArticle {
   category: string;
   image: string;
   publishedAt: string;
   title: string;
   tone: "green" | "pink" | "yellow";
}

export const blogArticles: readonly BlogArticle[] = [
   {
      title: "What we learned shipping 400 AI-generated assets",
      category: "AI content creation",
      publishedAt: "2026-09-22",
      image: "/images/hero/3.png",
      tone: "pink",
   },
   {
      title: "Why AI video still looks stock, and how we fix it",
      category: "AI content creation",
      publishedAt: "2026-09-08",
      image: "/images/hero/4.png",
      tone: "yellow",
   },
   {
      title: "How we ship a website in five weeks",
      category: "Web development",
      publishedAt: "2026-08-25",
      image: "/images/hero/6.png",
      tone: "green",
   },
];
