export type PricingCategoryId = "ai-content" | "web-development" | "combined";

export type PricingBilling = "monthly" | "project";

export interface PricingPlan {
   id: string;
   name: string;
   price: number;
   billing: PricingBilling;
   description: string;
   features: readonly string[];
   featured?: boolean;
}

export interface PricingCategory {
   id: PricingCategoryId;
   label: string;
   plans: readonly PricingPlan[];
}

export const pricingBillingNotes: Record<PricingBilling, string> = {
   monthly: "per month, starting at",
   project: "one time, starting at",
};

export const pricingCategories: readonly PricingCategory[] = [
   {
      id: "ai-content",
      label: "AI content creation",
      plans: [
         {
            id: "content-starter",
            name: "Starter",
            price: 1500,
            billing: "monthly",
            description:
               "A steady stream of content for one channel, so your brand shows up every week.",
            features: [
               "12 short videos or reels a month",
               "20 AI product images",
               "One social platform",
               "A visual style guide for your brand",
               "One round of edits per asset",
            ],
         },
         {
            id: "content-growth",
            name: "Growth",
            price: 3500,
            billing: "monthly",
            featured: true,
            description:
               "Enough volume to test hooks and formats, and to keep doing more of what works.",
            features: [
               "30 short videos or reels a month",
               "60 AI product images",
               "10 UGC style ad variations",
               "Up to three social platforms",
               "Two rounds of edits per asset",
               "Monthly report and review call",
            ],
         },
         {
            id: "content-scale",
            name: "Scale",
            price: 7000,
            billing: "monthly",
            description:
               "A dedicated content team for brands that publish and advertise every day.",
            features: [
               "60 short videos or reels a month",
               "120 AI product images",
               "30 UGC style ad variations",
               "A dedicated creative director",
               "Weekly delivery and priority turnaround",
            ],
         },
      ],
   },
   {
      id: "web-development",
      label: "Web development",
      plans: [
         {
            id: "web-landing",
            name: "Landing page",
            price: 2500,
            billing: "project",
            description:
               "One page built to convert, for a launch, a product, or a campaign.",
            features: [
               "Design and build of one page",
               "Responsive and animated",
               "SEO and analytics setup",
               "Two rounds of revisions",
               "14 days of support after launch",
            ],
         },
         {
            id: "web-website",
            name: "Website",
            price: 6000,
            billing: "project",
            featured: true,
            description:
               "A complete site with a CMS, ready to grow with your brand.",
            features: [
               "Up to eight pages",
               "CMS for your blog or projects",
               "Technical SEO and structured data",
               "Conversion tracking from day one",
               "30 days of support after launch",
            ],
         },
         {
            id: "web-custom",
            name: "Custom build",
            price: 12000,
            billing: "project",
            description:
               "Larger sites with custom features, integrations, and motion.",
            features: [
               "Custom pages and integrations",
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
      label: "Content and web",
      plans: [
         {
            id: "combined-launch",
            name: "Launch",
            price: 3500,
            billing: "monthly",
            description:
               "A landing page and the content that sends people to it, built to one brief.",
            features: [
               "Landing page built in the first month",
               "Everything in the content Starter plan",
               "Tracking from first view to lead",
               "Monthly funnel report",
            ],
         },
         {
            id: "combined-growth",
            name: "Growth",
            price: 7500,
            billing: "monthly",
            featured: true,
            description:
               "A full website and a content engine that feed each other every month.",
            features: [
               "Website of up to eight pages",
               "Everything in the content Growth plan",
               "One new campaign page a month",
               "Conversion tests on key pages",
               "Monthly report and review call",
            ],
         },
         {
            id: "combined-scale",
            name: "Scale",
            price: 14000,
            billing: "monthly",
            description:
               "One team running your content, your site, and the funnel between them.",
            features: [
               "Custom build with integrations",
               "Everything in the content Scale plan",
               "Ongoing site updates and new sections",
               "A dedicated creative director",
               "Weekly strategy call",
            ],
         },
      ],
   },
];

const priceFormat = new Intl.NumberFormat("en-US", {
   currency: "USD",
   maximumFractionDigits: 0,
   style: "currency",
});

export function formatPlanPrice(price: number) {
   return priceFormat.format(price);
}
