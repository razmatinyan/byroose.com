export const servicesAnchors = {
   aiContent: "ai-content-creation",
   web: "website-development",
} as const;

export type ServicesAnchor =
   (typeof servicesAnchors)[keyof typeof servicesAnchors];

export function servicesSectionPath(anchor: ServicesAnchor) {
   return `/services#${anchor}`;
}
