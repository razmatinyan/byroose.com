export const servicesAnchors = {
   aiContent: "ai-content-creation",
   web: "website-development",
} as const;

export type ServicesAnchor =
   (typeof servicesAnchors)[keyof typeof servicesAnchors];

export function servicesSectionPath(anchor: ServicesAnchor) {
   return `/services#${anchor}`;
}

export const servicePagePaths = {
   aiContent: "/services/ai-content-creation",
   web: "/services/web-development",
} as const;
