import { siteName, siteUrl } from "@/lib/site";

export interface PageSeoImage {
   src: string;
   width: number;
   height: number;
   alt: string;
}

export interface PageSeo {
   title: string;
   description: string;
   label?: string;
   image?: PageSeoImage;
   type?: "website" | "article";
   publishedTime?: string;
}

function absoluteUrl(path: string) {
   return new URL(path, siteUrl).href;
}

export function usePageSeo({
   title,
   description,
   label,
   image,
   type = "website",
   publishedTime,
}: PageSeo) {
   useSeoMeta({
      title,
      description,
      ogTitle: title,
      ogDescription: description,
      ogType: type,
      articlePublishedTime: publishedTime,
   });

   if (!image) {
      defineOgImage("BrandCard", { title, label }, { alt: `${siteName}: ${title}` });
      return;
   }

   const imageUrl = absoluteUrl(image.src);

   useSeoMeta({
      ogImage: { url: imageUrl, width: image.width, height: image.height, alt: image.alt },
   });
}
