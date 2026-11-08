export interface SiteCtaCopy {
   description?: string;
   titleLines: readonly string[];
   titleScale?: number;
}

export const defaultSiteCta: SiteCtaCopy = {
   description:
      "Tell us what you're building, and we'll show you how AI content and a website made together can turn your views into leads.",
   titleLines: ["Turn your social media", "views into leads?"],
};

const routeSiteCta: Readonly<Record<string, SiteCtaCopy>> = {
   "/about": {
      titleLines: ["Work with an AI content", "and web development agency"],
      titleScale: 0.85,
   },
   "/services": {
      description:
         "Tell us what you're building, and we'll recommend AI content, web development, or both.",
      titleLines: ["Not sure which marketing", "service you need?"],
   },
   "/work": {
      titleLines: ["Want work like this", "for your brand?"],
   },
   "/services/ai-content-creation": {
      titleLines: ["Get AI content that", "turns views into leads"],
   },
   "/services/web-development": {
      titleLines: ["Get a website that turns", "your views into leads"],
   },
};

const blogSiteCta: SiteCtaCopy = {
   description:
      "We make the AI content and build the website, so nothing leaks in between.",
   titleLines: ["Want this done", "for your brand?"],
};

function isBlogPath(path: string) {
   return path === "/blog" || path.startsWith("/blog/");
}

export function siteCtaFor(path: string): SiteCtaCopy {
   if (isBlogPath(path)) return blogSiteCta;

   return routeSiteCta[path] ?? defaultSiteCta;
}
