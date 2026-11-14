// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { listPublishedPosts } from "./config/blog-posts";
import {
   imageFormat,
   imageQuality,
   listInteractiveImageRoutes,
} from "./config/image-routes";
import { listPageLastmods } from "./config/page-lastmod";
import {
   siteDescription,
   siteEmail,
   siteHeadquarters,
   siteName,
   siteUrl,
} from "./app/lib/site";

const publishedPosts = listPublishedPosts();
const unlistedRoute = { robots: false, ogImage: false } as const;

export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   devtools: { enabled: false },

   app: {
      head: {
         htmlAttrs: { lang: "en" },
         meta: [
            { name: "theme-color", content: "#131110" },
            { property: "og:locale", content: "en_US" },
            { name: "twitter:card", content: "summary_large_image" },
         ],
         link: [{ rel: "icon", href: "/logo-small-dark.svg", sizes: "any" }],
      },
   },

   site: {
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      defaultLocale: "en",
      trailingSlash: false,
   },

   seo: {
      fallbackTitle: false,
      automaticTwitterTags: false,
   },

   sitemap: {
      urls: [
         ...listPageLastmods(),
         ...publishedPosts.map((post) => ({
            loc: post.path,
            lastmod: post.date,
         })),
      ],
   },

   content: {
      experimental: {
         sqliteConnector: "native",
      },
   },

   schemaOrg: {
      identity: {
         type: "Organization",
         name: siteName,
         url: siteUrl,
         logo: `${siteUrl}/logo.svg`,
         description: siteDescription,
         email: siteEmail,
         address: {
            addressLocality: siteHeadquarters.locality,
            addressCountry: siteHeadquarters.countryCode,
         },
      },
   },

   ogImage: {
      zeroRuntime: true,
      includeTwitter: false,
      defaults: {
         width: 1200,
         height: 630,
      },
   },

   runtimeConfig: {
      resendApiKey: process.env.RESEND_API_KEY ?? "",
      contactInboxEmail: process.env.CONTACT_INBOX_EMAIL ?? "",
   },

   routeRules: {
      "/**": { prerender: true },
      "/courses": unlistedRoute,
      "/services/ai-content-creation": unlistedRoute,
      "/services/web-development": unlistedRoute,
   },

   nitro: {
      prerender: {
         crawlLinks: true,
         routes: [
            "/",
            "/robots.txt",
            "/sitemap.xml",
            "/llms.txt",
            ...publishedPosts.map((post) => post.path),
            ...listInteractiveImageRoutes(),
         ],
      },
   },

   css: [
      "~/assets/css/tailwind.css",
      "lenis/dist/lenis.css",
      "~/assets/css/lenis.css",
   ],
   fonts: {
      families: [
         {
            name: "Switzer",
            provider: "fontshare",
            weights: [400, 500, 600, 700, 800],
            styles: ["normal"],
            subsets: ["latin"],
            global: true,
         },
      ],
   },
   icon: {
      mode: "svg",
      provider: "none",
      fallbackToApi: false,
      serverBundle: false,
      clientBundle: {
         scan: true,
         icons: [
            "lucide:loader-circle",
            "ph:arrow-down-bold",
            "ph:arrow-left-bold",
            "ph:arrow-right-bold",
            "ph:arrow-up-bold",
            "ph:arrow-up-right-bold",
            "ph:check-bold",
            "ph:corners-in-bold",
            "ph:corners-out-bold",
            "ph:github-logo-bold",
            "ph:instagram-logo-bold",
            "ph:linkedin-logo-bold",
            "ph:minus-bold",
            "ph:pause-bold",
            "ph:play-bold",
            "ph:plus-bold",
            "ph:share-network-bold",
            "ph:speaker-high-bold",
            "ph:speaker-low-bold",
            "ph:speaker-x-bold",
            "ph:x-bold",
         ],
      },
   },

   vite: {
      plugins: [tailwindcss()],
      optimizeDeps: {
         include: [
            "@vue/devtools-core",
            "@vue/devtools-kit",
            "@vueuse/core",
            "zod",
            "clsx",
            "tailwind-merge",
            "gsap",
            "gsap/CustomEase",
            "gsap/DrawSVGPlugin",
            "gsap/Flip",
            "gsap/Observer",
            "gsap/ScrollToPlugin",
            "gsap/ScrollTrigger",
            "gsap/SplitText",
            "gsap/TextPlugin",
            "gsap/all",
            "lenis",
            "reka-ui",
            "three",
            "class-variance-authority",
         ],
      },
   },

   modules: [
      "@nuxt/content",
      "@nuxt/fonts",
      "@nuxt/icon",
      "@nuxt/image",
      "@vueuse/nuxt",
      "shadcn-nuxt",
      "@nuxtjs/seo",
   ],

   image: {
      provider: "ipxStatic",
      quality: imageQuality,
      ipxStatic: {
         modifiers: { format: imageFormat },
      },
      none: {},
      screens: {
         sm: 640,
         md: 768,
         lg: 1024,
         xl: 1280,
         "2xl": 1536,
         portrait: 448,
         "portrait-2x": 896,
         viewer: 2560,
      },
   },

   $development: {
      image: {
         provider: "ipx",
         ipx: {
            modifiers: { format: imageFormat },
         },
      },
   },

   shadcn: {
      prefix: "Ui",
      componentDir: "@/components/ui",
   },
});
