import { siteUrl } from "@/lib/site";

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
}

function absoluteUrl(path: string) {
   return new URL(path, siteUrl).href;
}

export function usePageSeo({ title, description, label, image }: PageSeo) {
   useSeoMeta({
      title,
      description,
      ogTitle: title,
      ogDescription: description,
      twitterTitle: title,
      twitterDescription: description,
   });

   if (!image) {
      defineOgImage("BrandCard", { title, label });
      return;
   }

   const imageUrl = absoluteUrl(image.src);

   useSeoMeta({
      ogImage: { url: imageUrl, width: image.width, height: image.height, alt: image.alt },
      twitterCard: "summary_large_image",
      twitterImage: { url: imageUrl, alt: image.alt },
   });
}
