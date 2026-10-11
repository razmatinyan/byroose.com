export interface ServicesImage {
   height: number;
   src: string;
   width: number;
}

export const servicesHeroInsetOpenProperty = "--services-hero-inset-open";
export const servicesHeroInsetContentScale = 1.3;

export const servicesHeroImages: readonly ServicesImage[] = [
   { height: 816, src: "/images/hero/1.png", width: 1456 },
   { height: 816, src: "/images/hero/2.png", width: 1456 },
   { height: 816, src: "/images/hero/3.png", width: 1456 },
   { height: 816, src: "/images/hero/4.png", width: 1456 },
];
