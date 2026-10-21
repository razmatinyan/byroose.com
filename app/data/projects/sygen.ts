import { defineProject } from "@/lib/projects";

export default defineProject({
   slug: "sygen",
   name: "Sygen",
   description:
      "A free color tool that turns one brand color into a complete, accessible UI color system for light and dark mode, ready to paste into code or Figma.",
   categories: ["Web Development", "UI/UX Design"],
   liveUrl: "https://sygenn.vercel.app/",
   surface: { color: "oklch(0.943 0.1021 117.72)", ink: "dark" },
   cover: {
      kind: "image",
      src: "/images/work/sygen/cover.jpg",
      width: 2560,
      height: 1440,
      alt: "Sygen home page on a desktop monitor, turning the brand color #2F5BEA into brand, neutral, and status scales",
   },
   blocks: [
      {
         type: "text",
         title: "From palette to system",
         align: "right",
         paragraphs: [
            "Sygen started in 2023 as ColorGen, a random palette generator like many others. In October 2026 we rebuilt it from scratch and gave it a new name.",
            "The rebuild changed the question it answers. Not \"give me some nice colors\", but \"I'm building a product and need a complete, accessible color system for its UI, light and dark, ready to paste into code or Figma.\"",
            "Only the public URLs stayed, so search rankings survived the move. The color engine, the design, the architecture, and the name are all new.",
         ],
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/sygen/image-1.jpg",
               width: 1600,
               height: 1200,
               alt: "Sygen feature overview in light mode: every scale from one color, neutrals that carry the brand, light and dark tokens, 34 of 34 checks passing, and room for a second brand",
            },
            {
               kind: "image",
               src: "/images/work/sygen/image-2.jpg",
               width: 1600,
               height: 1200,
               alt: "Sygen feature overview in dark mode, with brand, neutral, success, warning, danger, and info scales generated from #2F5BEA",
            },
         ],
      },
      {
         type: "text",
         title: "Design system builder",
         align: "right",
         paragraphs: [
            "The builder runs as one flow. Type a brand color in any CSS format, or pick one, and every color becomes a full 50 to 950 scale, generated in OKLCH so each step looks even.",
            "Brand, neutral, and status scales arrive together. Grays carry a touch of the brand hue, and success, warning, danger, and info lean toward it while staying recognizable.",
            "Every token in the shadcn set points to a step, separately for light and dark mode. A gallery of real components, from buttons and forms to charts and alerts, shows the result before anything ships.",
         ],
      },
      {
         type: "media",
         media: {
            kind: "image",
            src: "/images/work/sygen/image-5.jpg",
            width: 2560,
            height: 1440,
            alt: "Design system builder with a purple brand color set by Lightness, Intensity, and Hue sliders, beside a component preview split between dark and light mode",
         },
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/sygen/image-6.jpg",
               width: 1600,
               height: 1200,
               alt: "Scales view in dark mode with brand, neutral, success, warning, danger, and info scales from 50 to 950, each step labeled with its hex value",
            },
            {
               kind: "image",
               src: "/images/work/sygen/image-3.jpg",
               width: 1600,
               height: 1200,
               alt: "Dark component preview with buttons, a form, revenue and churn stats, invoices, alerts, and a setup checklist rendered in the brand colors",
            },
         ],
      },
      {
         type: "text",
         title: "Readable by default",
         align: "right",
         paragraphs: [
            "Every system is checked as it's built. Seventeen text and control pairs are tested against WCAG 2.2, with the APCA score shown alongside for reference.",
            "When a pair fails, Fix moves the token to the nearest step that passes, so the brand stays intact. Fix all repairs every pair at once.",
            "A color blindness check simulates four types of vision and warns when two colors would look alike, such as success and danger for green-blind users.",
         ],
      },
      {
         type: "media",
         media: {
            kind: "image",
            src: "/images/work/sygen/image-10.jpg",
            width: 2560,
            height: 1440,
            alt: "Contrast checker in dark mode with the vision menu open to see colors as red-blind, green-blind, blue-blind, or with no color",
         },
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/sygen/image-7.jpg",
               width: 1600,
               height: 1200,
               alt: "Contrast checker testing #276ED2 on white at 4.94:1, with WCAG 2.2 results, an APCA Lc 74 score, and Make it pass suggestions",
            },
            {
               kind: "image",
               src: "/images/work/sygen/image-4.jpg",
               width: 1600,
               height: 1200,
               alt: "Readable by default section with a pair moved to Neutral 600 to reach a 6.88 ratio, above a globals.css export preview in OKLCH",
            },
         ],
      },
      {
         type: "text",
         title: "Paste it where you work",
         align: "right",
         paragraphs: [
            "One system, four formats: Tailwind v4 with shadcn, plain CSS variables, Figma variables, and W3C design tokens, in OKLCH or HEX. The export warns you if a readability check still fails.",
            "It works in reverse too. Import a CSS file, a token file, or a Tailwind config, and Sygen rebuilds it as full scales, then shows which values stayed the same, came close, or changed.",
         ],
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/sygen/image-11.jpg",
               width: 1600,
               height: 1200,
               alt: "Export dialog with Tailwind and shadcn, CSS, Figma, and design token formats, previewing a 196 line theme file in OKLCH",
            },
            {
               kind: "image",
               src: "/images/work/sygen/image-12.jpg",
               width: 1600,
               height: 1200,
               alt: "Check the import dialog with the imported brand, neutral, and status colors and 62 token values compared as same, close, or changed",
            },
         ],
      },
      {
         type: "text",
         title: "Tools that stand alone",
         align: "right",
         paragraphs: [
            "Palette, Scale, Contrast, Convert, Gradient, and Image colors each work on their own, and each can send its result to the builder in one click.",
            "Image colors finds the main colors in a photo and suggests a brand color to start from. The image never leaves the browser.",
            "About 1,150 color pages, one for every Tailwind and CSS named color, each with its own title, summary, and share image, give the tool a steady way to be found in search.",
         ],
      },
      {
         type: "grid",
         columns: 2,
         images: [
            {
               kind: "image",
               src: "/images/work/sygen/image-8.jpg",
               width: 1600,
               height: 1200,
               alt: "Image color extractor waiting for a photo, with a note that the image never leaves the device",
            },
            {
               kind: "image",
               src: "/images/work/sygen/image-9.jpg",
               width: 1600,
               height: 1200,
               alt: "Image color extractor showing six muted colors pulled from a living room photo, each with its hex value and share of the image",
            },
         ],
      },
      {
         type: "text",
         title: "Under the hood",
         align: "right",
         paragraphs: [
            "There are no accounts and no AI features. Every result comes from deterministic color math in the browser, and the URL is the save file, so a link reproduces exactly what you see.",
            "The engine is pure TypeScript on culori, kept apart from Vue and Nuxt so it can later power a Figma plugin or a browser extension. Gamut mapping reduces only chroma, so lightness and hue stay exact.",
            "Around 370 test cases in 44 files cover every engine module, importer, and exporter, including the round trip from export back to import.",
         ],
      },
   ],
   seo: {
      title: "Sygen: Accessible Design System Color Builder",
      description:
         "How byroose rebuilt Sygen, a free tool that turns one brand color into an accessible light and dark color system for Tailwind, shadcn, CSS, and Figma.",
   },
});
