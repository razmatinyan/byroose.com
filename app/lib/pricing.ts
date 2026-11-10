export type PricingCategoryId = "ai-content" | "web-development" | "combined";

export interface PricingPlan {
   id: string;
   name: string;
   price: number;
   regularPrice: number;
   description: string;
   actionLabel: string;
   features: readonly string[];
   featured?: boolean;
}

export interface PricingCategory {
   id: PricingCategoryId;
   label: string;
   plans: readonly PricingPlan[];
}

export const pricingCategories: readonly PricingCategory[] = [
   {
      id: "ai-content",
      label: "AI content creation",
      plans: [
         {
            id: "content-starter",
            name: "Starter",
            price: 1200,
            regularPrice: 1500,
            description:
               "A content pack for one channel that gets your brand moving.",
            actionLabel: "Book a call",
            features: [
               "12 short videos or reels",
               "20 AI product images",
               "One social platform",
               "A visual style guide for your brand",
               "One round of edits per asset",
            ],
         },
         {
            id: "content-growth",
            name: "Growth",
            price: 2900,
            regularPrice: 3800,
            featured: true,
            description:
               "Enough volume to test hooks and formats, and to find what works.",
            actionLabel: "Schedule a call",
            features: [
               "30 short videos or reels",
               "60 AI product images",
               "10 UGC style ad variations",
               "Up to three social platforms",
               "Two rounds of edits per asset",
            ],
         },
         {
            id: "content-scale",
            name: "Scale",
            price: 5900,
            regularPrice: 7400,
            description:
               "A full content library for brands that publish and advertise every day.",
            actionLabel: "Talk to our team",
            features: [
               "60 short videos or reels",
               "120 AI product images",
               "30 UGC style ad variations",
               "A dedicated creative director",
               "Priority turnaround",
            ],
         },
      ],
   },
   {
      id: "web-development",
      label: "Web development",
      plans: [
         {
            id: "web-launch",
            name: "Launch",
            price: 2400,
            regularPrice: 3000,
            description:
               "A focused site that explains your offer and turns visits into leads.",
            actionLabel: "Book a discovery call",
            features: [
               "Custom design and build",
               "Responsive and animated",
               "SEO and analytics setup",
               "Two rounds of revisions",
               "14 days of support after launch",
            ],
         },
         {
            id: "web-business",
            name: "Business",
            price: 5400,
            regularPrice: 6900,
            featured: true,
            description:
               "A complete site with a CMS, ready to grow with your brand.",
            actionLabel: "Plan a call with us",
            features: [
               "CMS for your blog or projects",
               "Technical SEO and structured data",
               "Conversion tracking from day one",
               "Contact and lead forms",
               "30 days of support after launch",
            ],
         },
         {
            id: "web-custom",
            name: "Custom",
            price: 10900,
            regularPrice: 13500,
            description:
               "A site with custom features, integrations, and motion.",
            actionLabel: "Talk through your project",
            features: [
               "Custom features and integrations",
               "Advanced motion and interactions",
               "Performance and accessibility audit",
               "CMS training and handover guide",
               "60 days of support after launch",
            ],
         },
      ],
   },
   {
      id: "combined",
      label: "Both services",
      plans: [
         {
            id: "combined-launch",
            name: "Launch",
            price: 3300,
            regularPrice: 4500,
            description:
               "A site and the content that sends people to it, built to one brief.",
            actionLabel: "Book an intro call",
            features: [
               "The Launch website",
               "The Starter content pack",
               "Tracking from first view to lead",
               "Funnel report after launch",
            ],
         },
         {
            id: "combined-growth",
            name: "Growth",
            price: 7600,
            regularPrice: 10700,
            featured: true,
            description:
               "A complete site and a content library that feed each other.",
            actionLabel: "Schedule a strategy call",
            features: [
               "The Business website",
               "The Growth content pack",
               "Conversion tests on key sections",
               "Review call after launch",
            ],
         },
         {
            id: "combined-scale",
            name: "Scale",
            price: 15000,
            regularPrice: 20900,
            description:
               "One team building your site, your content, and the funnel between them.",
            actionLabel: "Let's talk it through",
            features: [
               "The Custom website",
               "The Scale content pack",
               "A dedicated creative director",
               "Weekly strategy call during the project",
            ],
         },
      ],
   },
];

const priceFormat = new Intl.NumberFormat("en-US", {
   currency: "USD",
   maximumFractionDigits: 0,
   style: "currency",
   useGrouping: false,
});

export function formatPlanPrice(price: number) {
   return priceFormat.format(price);
}

export function planDiscountPercent({ price, regularPrice }: PricingPlan) {
   return Math.round(((regularPrice - price) / regularPrice) * 100);
}
