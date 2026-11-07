export interface SiteCtaCopy {
   description?: string;
   titleLines: readonly string[];
}

export const defaultSiteCta: SiteCtaCopy = {
   description:
      "Tell us what you're building, and we'll show you how AI content and a website made together can turn your views into leads.",
   titleLines: ["Turn your social media", "views into leads?"],
};

const routeSiteCta: Readonly<Record<string, SiteCtaCopy>> = {
   "/services": {
      description:
         "Tell us what you're building, and we'll recommend AI content, web development, or both.",
      titleLines: ["Not sure which marketing", "service you need?"],
   },
   "/services/ai-content-creation": {
      titleLines: ["Get AI content that", "turns views into leads"],
   },
   "/services/web-development": {
      titleLines: ["Get a website that turns", "your views into leads"],
   },
};

export function siteCtaFor(path: string): SiteCtaCopy {
   return routeSiteCta[path] ?? defaultSiteCta;
}
