# byroose creative agency

byroose.com is the digital home of byroose, a creative agency for brands that are tired of shouting into the void. The agency brings AI content creation and web development into one connected practice.

The site is designed to turn a clear point of view into measurable action. It presents the agency's work, services, process, learning products, insights, and contact paths in a bold editorial experience that remains fast, accessible, and easy to use on every screen.

## Project status

The current foundation is a responsive Nuxt landing page converted from the original visual template. It includes a source-owned component system, semantic design tokens, reusable Tailwind class groups, Lucide icons, Lenis smooth scrolling, an SSR-safe GSAP integration, a two-column hero whose title, description, and call to action rise line by line in a route-aware home intro, a scrubbed hero-to-Studio image transition on larger screens, a green ribbon that draws itself behind the Studio section with the scroll on larger screens and stays hidden on mobile, a case study section with per-case reveals, a faint grey line that draws itself behind the case studies with the scroll on larger screens, image parallax, a trailing project preview, and a pinned dark panel that leads to the work route, a services section that blurs its pinned title into focus, grows each service image with the scroll, and opens a link beside each description to that service's section on the Services route, a full-width "Why Choose Us" title that the services section's dark curve spawns character by character, six reason cards in a staggered two-column masonry that rise into place and reveal their titles word by word and their copy line by line, with short notes filling the masonry's open corners, a warm sand blog panel whose title, action, and three tinted article cards reveal on scroll, an FAQ accordion whose items rise in sequence and whose answers expand and reveal line by line, an About route with a centered hero that rises line by line and opens a cycling image slider before "byroose", leaves a trail of work images behind a moving mouse, and drifts behind a grey team section whose member cards open a profile dialog, a green line that draws itself through the team section and a faint grey line that draws itself behind the statement sections and passes under the call to action on larger screens, and two statement sections with cycling images, a Services route whose centered hero title rises line by line and then opens an About link and a cycling image slider inside its lines, followed by a full-width statement that rises line by line and brightens word by word with the scroll an AI Content Creation section of tinted blocks whose first image is the hero slider, carried there under the statement by the scroll, a Website Development section whose dark surface grows open like the home services panel, a Work route whose one-line title reveals character by character above its description and drifts behind a grey projects section that shows a live project count, raises its All, AI Content, and Website Development filter buttons, and fades between filtered two-column project cards whose image scales and whose trailing tooltip reads View Project on hover, a Blog route that shares the Work hero composition and places three neutral article cards per desktop row on a rounded grey listing section, a Contact route that pairs a call to write in with a validated name, email, and idea form, rises line by line and field by field, and repeats the home FAQ below, focused Courses, Terms, and Privacy routes that hand over to each other through an overlap page transition, a dark "Have an idea? Let's build it." call to action that closes every route over a drifting Three.js smoke background that the mouse pushes aside, and a footer that pairs the slogan and a call to action with navigation, social, and headquarters columns and rises out from under the last section of every route in a shared site layout. A cookie notice in that layout records its consent in a cookie, so the banner stays dismissed across visits. Each Work project has its own page built from a data file in the repository, and every project page shares one layout: a centered project name, the services and a Visit Live Website link beside the description, the cover, and a story of text, image, video, image grid, and results blocks. Content systems, case studies, forms, analytics, SEO expansion, and additional motion will be added as the project grows.

## Technology

- Nuxt 4 and Vue 3
- TypeScript
- Tailwind CSS v4
- Shadcn Vue with Reka UI
- Nuxt Icon with Lucide
- Nuxt Image
- Nuxt Fonts with Switzer from Fontshare
- VueUse
- Lenis
- GSAP
- Three.js
- Zod
- Nuxt SEO: site config, sitemap, robots, Schema.org, SEO utilities, OG images, and link checker
- Takumi for rendering OG images
- Nuxt Content for Markdown blog posts

## Local development

Requirements:

- A current Node.js LTS release
- npm

Install dependencies and start the development server:

~~~bash
npm install
npm run dev
~~~

The application is available at http://localhost:3000 by default. The site
has no database or media storage, and Work projects are files in the
repository.

The Contact form needs a Resend API key to send mail. Copy `.env.example` to
`.env` and set `RESEND_API_KEY`, and set the same variable on every deployment.
Without it the form answers that it is unavailable. `CONTACT_INBOX_EMAIL`
adds a private inbox that receives a copy of every Contact message. Keep it
out of the repository. Deployments can also set
these optional variables:

- `NUXT_SITE_URL` overrides the canonical site address, `https://byroose.com`
  by default, which every canonical link, sitemap entry, and OG image URL uses.
- `NUXT_SITE_ENV` set to anything other than `production`, such as `preview`,
  marks a deployment as not indexable, so robots.txt and every page block
  search engines.

## Adding a Work project

Each Work project is a typed data file and a page that renders it with the
shared project layout:

1. Put the project's images and videos in `public/images/work/<slug>/`.
2. Create `app/data/projects/<slug>.ts` that exports
   `defineProject({ ... })` from `app/lib/projects.ts`, with the name,
   description, categories, optional live link, cover, and content blocks.
3. Add the project to the list in `app/data/projects/index.ts`.
4. Create `app/pages/work/<slug>.vue`, which imports the data file and renders
   `ProjectPage`. The file name is the project's address, `/work/<slug>`.

See [Architecture](docs/ARCHITECTURE.md#work-projects) for the block types.
The project appears in the sitemap and in `llms.txt` automatically, and its
cover becomes its social sharing image when the cover is an image.

## Adding a blog post

1. Put the cover and inline images in `public/images/blog/<slug>/`.
2. Create `content/blog/<slug>.md`. The file name is the address,
   `/blog/<slug>`. Start it with frontmatter for `title`, `description`,
   `date` as `YYYY-MM-DD`, `category` (`AI content creation` or
   `Web development`), and `cover` with `src`, `width`, `height`, and `alt`.
   `author` with a `name` and optional `role` and `image` is optional.
3. Write the article in Markdown. Use `## Heading` for sections, add an inline
   image's size as `![Alt text](/images/blog/slug/photo.jpg){width="1600" height="900"}`,
   and use `::cta{href="/contact"}`, `::callout`, and `::divider` blocks,
   each closed with `::`.
4. Add `draft: true` to see the post only in the dev server while writing.
   Remove it to publish.

`content/blog/layout-sample.md` shows every element. The post appears in the
sitemap and `llms.txt` automatically.

## SEO

Search and sharing metadata is configured in `nuxt.config.ts` and set per page
through `usePageSeo`. The site serves `/robots.txt`, `/sitemap.xml`, and
`/llms.txt`, and every page gets a canonical link, Open Graph and Twitter card
tags, and Schema.org data. Every page, share image, and text route is
prerendered at build time. See
[Architecture](docs/ARCHITECTURE.md#seo) for how each part is produced.

## Available commands

~~~bash
npm run dev
npm run typecheck
npm run build
npm run generate
npm run preview
~~~

## Project structure

~~~text
app/
  assets/css/       Theme tokens, base styles, and shared Tailwind utilities
  components/       Landing, contact, layout, card, project, shared, and UI components with scoped styles
  composables/      Reusable stateful and side-effect behavior
  data/projects/    One data file per Work project and the project list
  lib/              Pure helpers, shared constants, types, and icon names
  pages/            Routes, including one page per Work project
  plugins/          Nuxt runtime integrations
content/blog/       One Markdown file per blog post
docs/               Architecture, rules, design system, content, and workflow
public/             Static public assets
server/api/         API routes such as the Contact form endpoint
server/routes/      Generated text routes such as llms.txt
server/utils/       Server-only helpers such as the Contact email sender
~~~

See [Architecture](docs/ARCHITECTURE.md) for dependency boundaries and placement rules.

## Documentation

- [AI agent guide](AGENTS.md)
- [Project rules](docs/RULES.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Content and SEO guide](docs/CONTENT_GUIDE.md)
- [AI workflow and Git delivery](docs/AI_WORKFLOW.md)
- [Claude Code guide](CLAUDE.md)

## Contributing

Keep changes focused, reuse established patterns, and verify the affected behavior before delivery. Review and update the relevant documentation after every feature, refactor, bug fix, dependency update, configuration change, or design-system change. Keep documentation and implementation in the same focused conventional commit, then follow the push policy in [AI workflow and Git delivery](docs/AI_WORKFLOW.md).
