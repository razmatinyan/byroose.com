# Application architecture

This document defines where code belongs, which layers may depend on each other, and how the architecture should grow. It describes the current application and marks future backend structure as planned rather than implemented.

## Architecture goals

- Keep page composition easy to understand.
- Keep reusable behavior independent from page content.
- Keep source-owned UI primitives generic and accessible.
- Keep styling consistent through tokens, variants, and semantic class groups.
- Keep server rendering deterministic and hydration-safe.
- Add complexity only when a real feature requires it.

## Current structure

~~~text
app/
  app.vue
  error.vue
  assets/
    css/
      lenis.css
      tailwind.css
  components/
    about/
    blog/
    contact/
    content/
    cards/
    landing/
    layout/
    legal/
    OgImage/
    project/
    services/
    shared/
    ui/
    work/
  composables/
    useAboutHeroMotion.ts
    useAboutHeroTrail.ts
    useAboutApproachMotion.ts
    useAboutSectionMotion.ts
    useActiveSection.ts
    useArrowSwapHover.ts
    useBlogMotion.ts
    useBlogPostHeroMotion.ts
    useContactHeroMotion.ts
    useDrawnLineMotion.ts
    useFaqMotion.ts
    useFitText.ts
    useFooterMotion.ts
    useHomeHeroScrollMotion.ts
    useImagesLoaded.ts
    useHomeIntroMotion.ts
    useGsap.ts
    useHeaderSurface.ts
    useHoverBounce.ts
    useHoverRollover.ts
    useJourneyMotion.ts
    useMenuLinkMotion.ts
    useMoreWorksMotion.ts
    useNavLinkMotion.ts
    usePageTransition.ts
    usePageSeo.ts
    usePageTransitionMotion.ts
    useProjectGallery.ts
    useProjectMarquee.ts
    useServicesHeroMotion.ts
    useServiceCardsMotion.ts
    useServiceHeroMotion.ts
    useServiceStoryMotion.ts
    useServicesMotion.ts
    useServicesRevealMotion.ts
    useServicesStatementMotion.ts
    useSiteCtaMotion.ts
    useSiteHeaderMotion.ts
    useSiteMenuMotion.ts
    useSmoothScroll.ts
    useStudioMotion.ts
    useStudioRibbonMotion.ts
    useTrailingTooltip.ts
    useUnderlineSweep.ts
    useListingHeroMotion.ts
    useMainThreadQueue.ts
    useWhyChooseMotion.ts
    useWorkLineMotion.ts
    useWorkMotion.ts
    useWorkProjectsMotion.ts
  lib/
    about-line-path.ts
    char-reveal.ts
    contact-form.ts
    drawn-line-path.ts
    icons.ts
    image-parallax.ts
    og-image-theme.ts
    page-seo.ts
    projects.ts
    ribbon-path.ts
    scroll-curve.ts
    services-anchors.ts
    site.ts
    slide-ease.ts
    blog-articles.ts
    blog-categories.ts
    services-hero.ts
    split-text.ts
    stack-reveal.ts
    surfaces.ts
    swap-timing.ts
    utils.ts
    word-reveal.ts
    work-line-path.ts
  data/
    projects/
      index.ts
      <slug>.ts
  layouts/
    default.vue
  pages/
    about.vue
    blog/
      index.vue
      [slug].vue
    contact.vue
    courses.vue
    index.vue
    [...slug].vue
    privacy.vue
    services.vue
    work/
      index.vue
      <slug>.vue
  plugins/
    lenis.ts
    page-transition.ts
    ssr-width.ts
  router.options.ts
docs/
public/
server/
  api/
    contact.post.ts
  routes/
    llms.txt.get.ts
  utils/
    contact-mail.ts
    rate-limit.ts
content/
  blog/
    <slug>.md
  legal/
    privacy.md
content.config.ts
config/
  blog-posts.ts
nuxt.config.ts
components.json
package.json
~~~

## Layer responsibilities

### Application entry

app/pages/[...slug].vue renders SiteErrorView for every unknown route with a 404 status, as a normal page so page transitions run. app/error.vue renders SiteErrorView inside the default layout for other errors. app/app.vue owns the root application shell and renders NuxtLayout around NuxtPage, which receives the page transition hooks from usePageTransitionMotion. app/layouts/default.vue owns the persistent site header, main landmark, site call to action, footer, and page transition shade around every route. app/pages/index.vue owns the home route and composes the landing experience. app/pages/about.vue renders the About experience from app/components/about, app/pages/services.vue renders the Services experience from app/components/services, app/pages/work/index.vue renders the Work experience from app/components/work, each app/pages/work/<slug>.vue renders one Work project through ProjectPage from app/components/project, app/pages/blog/index.vue renders the Blog experience from app/components/blog, app/pages/blog/ai-content.vue and app/pages/blog/web-development.vue render its two category pages through the same BlogPage, and app/pages/contact.vue renders the Contact experience from app/components/contact. app/pages/privacy.vue loads the privacy policy from the `legal` content collection and renders it through LegalPage from app/components/legal. app/pages/courses.vue owns the Courses route as a focused route-level placeholder. The site has no terms and conditions page. Keep app.vue focused on providers, NuxtLayout, and NuxtPage as routes are introduced.

### Landing components

app/components/landing contains sections that are specific to the landing experience. A landing section may own static section content and compose cards, shared components, layouts, and UI primitives.

A landing section should not become a general component merely because it contains several elements. Extract only the parts that have a stable reusable contract.

### About components

app/components/about contains the About route's sections. AboutPage composes
AboutHero, AboutCombinedSection, AboutTeamSection, AboutApproachSection,
AboutTrustSection, and
AboutBrandsSection, and
app/pages/about.vue renders it with the route metadata. AboutPage wraps the
trust and brands sections in an isolated `about-story` block that holds their
shared DrawnLine and marks the brands root with `data-drawn-line-anchor`. AboutTeamSection holds its
own DrawnLine.
AboutTitle renders a title from explicit lines, each in its own mask, with an
optional underlined word that carries a WaveUnderline, every other text
fragment in a `data-about-title-text` span that an owner can style, and an optional
`images` list that opens a `data-about-title-inset` ImageCycle frame before the
line's text. A line's optional `logo` names the word, such as "forrrow", that
renders as the site logo in a masked `data-about-title-text` span, beside any
underlined word, while the full line text still feeds the `sr-only` heading
label. AboutMediaFrame wraps
any image or placeholder in a frame and a parallax layer. AboutStatement is the
large split statement, placed in the right two thirds of its section, shared by
the trust and brands sections, and
AboutSectionHeading pairs a title with a cycling image. AboutTeamMember shows a
portrait, or a placeholder when it receives none, a name, a role, and a round
action. It owns a Dialog whose open state both the action and a click anywhere
on the card set, locks the smooth scroll while it is open, and emits `activate`
and `deactivate` on pointer enter and leave. AboutMemberDialog renders the
dialog content: the portrait, the name, the role, the social links, the bio,
an optional service link, and the close action. AboutTeamSection owns the
member data, including each bio, service link, and social link, and the shared TrailingTooltip the cards drive. The sections own their copy. They do not depend
on landing sections.

### Services components

app/components/services contains the Services route's sections. The route is
a hub: short service summaries that link to the planned full service pages.
ServicesPage composes ServicesHero, ServicesStatementSection, a light
ServicesOfferSection for AI Content Creation, and a dark one for Website
Development, and app/pages/services.vue renders it with the route metadata.
ServicesPage owns both summaries' copy. ServicesHero owns the title lines, the
About link, and its TrailingTooltip. A title line can carry one
`data-services-hero-inset` frame placed inline in the line: the link frame, a
NuxtLink to `/about`, or the media frame, which holds an ImageCycle of the
hero images. ServicesStatementSection owns the statement copy and its split.
ServicesOfferSection receives an `anchor` from app/lib/services-anchors.ts,
which becomes its section id, a title, a description, a link label and path,
and a `surface` of `light` or `dark`. The link points to the service's own
page from `servicePagePaths` in the same module. The dark surface adds a
`data-services-reveal-backdrop` layer at `-z-10` without isolating the
section, so the intro text can blend with it and the page behind it.
app/lib/services-hero.ts holds the hero images and the inset open property,
content scale, and open duration that the hero motion and the home service
links share. The sections own their copy and do not depend on landing or
About components.

The service pages live in app/pages/services, with the hub at index.vue. A
built service page composes ServiceHero, which takes a title and description
and reveals through useServiceHeroMotion, and ServiceCardsSection, which takes
a title and a list of cards, each with a title, description, and surface tone,
and reveals its title, line, and cards through useServiceCardsMotion, and
ServiceStorySection, which takes a list of story blocks, each with a title,
description, optional link, and a `start` or `middle` offset, and reveals
them through useServiceStoryMotion. The AI content creation and web
development pages both follow them with the shared ProcessSection and a
FaqSection with their own title and items.
The page owns its copy and its metadata from `pageSeo`.

### Work components

app/components/work contains the Work route's sections. WorkPage composes
WorkHero and WorkProjectsSection, and
app/pages/work/index.vue renders it with the route metadata. WorkHero supplies the
Work title and description to the shared ListingHero.
WorkProjectsSection owns the project data, the category to service map, the
filter options, and two filter states: `selectedFilter`, which presses its
button at once, and `shownFilter`, which decides the visible projects and
changes only inside the swap that useWorkProjectsMotion runs. Every project
stays in the list, and `v-show` hides the ones outside the shown filter, so
the server output always holds every project. A project matches a service
filter when any of its categories maps to that service, so one project can
appear under both. The section also owns the polite live status that counts
the shown projects and the shared TrailingTooltip the cards drive. WorkFilters
renders "Projects -" split into `data-work-filters-count-char` characters in
its template, followed by the `count` it receives, the number of projects for
the shown filter, as one more character element whose text simply changes. It also renders one
toggle Button per option, with `rollover` off, `aria-pressed`, and a `select`
emit, inside a group named "Filter projects". ProjectCard renders one project's image frame, name, and
categories and emits `activate` and `deactivate` on pointer enter and leave.
The sections own their copy and do not depend on landing, About, or Services
components.

### Project components

app/components/project renders one Work project page from a typed `Project`.
See Work projects for the data files, the page convention, and each
component's role.

### Blog components

app/components/blog contains the Blog route's sections. BlogPage composes
BlogHero and BlogArticlesSection, and app/pages/blog/index.vue renders it with
the route metadata. Each category page, app/pages/blog/ai-content.vue and
app/pages/blog/web-development.vue, passes BlogPage its entry from
`blogCategoryPages` in app/lib/blog-categories.ts as `categoryPage`. That module
owns each category's content value, link label, hero title words, measured
first-paint `titleSize`, hero description, and its `pageSeo` entry, and
`blogCategoryLinks` lists All and both categories for the navigation. Static
page files take precedence over `app/pages/blog/[slug].vue`, so no post may use
the slug `ai-content` or `web-development`. BlogHero supplies the Blog title and
description to the shared ListingHero, or a category's when BlogPage passes
them. BlogArticlesSection owns the article count heading, keeps only the
articles of its optional `category`, renders the shared article content from
app/lib/blog-articles.ts in a three-column grid from `md`, shows an empty
message when a category has no articles, and requests the neutral BlogCard
surface. BlogCategoryNav sits beside the count and renders All and the two
categories as links, not filters, marking the link of the current path with
`aria-current="page"`. useBlogMotion rises every `data-blog-cta` in the
heading after the title characters with the navigation stagger, so the same
hook serves the home section's single action and these links. The home BlogSection consumes
the same article content with the default tinted BlogCard surface.

### Legal components

app/components/legal renders legal documents from the `legal` content
collection. LegalPage passes the document title and description to the shared
ListingHero, then renders a rounded `canvas-shade` section with LegalSectionNav
on the left and the Markdown body through `ContentRenderer` on the right, with
the last updated date above it. The section list comes from the document's
table of contents, one entry per `##` heading. LegalSectionNav renders those
entries as same-page anchor links, which Lenis scrolls to while honoring the
headings' `scroll-margin-top`, and marks the current one with
`aria-current="location"`. useActiveSection owns which section is current: on
scroll and resize, at most once per animation frame, it picks the last heading
inside the body whose top has passed 30 percent of the viewport height, and it
falls back to the first section above that line. app/pages/privacy.vue passes
a `titleSize` measured for "Privacy policy" and renders SiteErrorView with a
404 status if the document is missing.

### Contact components

app/components/contact contains the Contact route's sections. ContactPage
composes ContactHero and the shared FaqSection, and app/pages/contact.vue
renders it. ContactHero emits `revealed` once its reveal completes, and
ContactPage passes that state to FaqSection's `revealReady`, so the FAQ never
reveals before the hero. app/pages/contact.vue sets the metadata from
`pageSeo.contact`, and ContactPage adds the `ContactPage` Schema.org node. ContactHero owns the title, the description, the email fallback
link, the explicit title lines with the image inset after "build", and the
description split that useContactHeroMotion reveals,
and places ContactForm in its right column from `lg`. ContactForm owns the
field list, the form values, the submit status, and the field errors. It
validates with `contactFormSchema` from app/lib/contact-form.ts, which requires
a name, a valid email, and an idea of up to 2000 characters and also
exports the value and payload types, so `/api/contact` validates the same
contract on the server. Errors appear only after the first submit attempt,
then follow every change, and a failed attempt focuses the first invalid
field. A valid submit posts the trimmed payload and the hidden `website`
honeypot to `/api/contact`, and any failure points the reader to the site
email. A success clears the form and opens ContactSentDialog, which binds its
open state through `defineModel` and locks the smooth scroll while it is open.

### Contact email

`server/api/contact.post.ts` handles the Contact form. It reads the body,
answers a filled `website` honeypot with the normal success response without
sending anything, validates the rest with `contactFormSchema` and answers
`400` with the field errors when it fails, then allows five messages per
client IP in ten minutes and answers `429` past that. Without a Resend key
it answers `503`. Otherwise `sendContactMail` from
`server/utils/contact-mail.ts` sends a plain text email through the Resend
REST API with `$fetch`, so no SDK is installed. It goes from
`forrrow website <contact@hello.forrrow.com>` to the site email and, when
`runtimeConfig.contactInboxEmail` is set, to that private inbox too, with the
sender's address as `reply_to`, so replying in the inbox answers the person
directly. The `Idempotency-Key` is a SHA-256 hash of the payload, so Resend
sends a resubmitted identical message only once within its 24 hour window.
A Resend failure is logged with its status and error name, never the
message or the address, and answers `502`. A success answers `{ sent: true }`.

The Resend key lives in the server-only `runtimeConfig.resendApiKey`, which
`nuxt.config.ts` fills from `RESEND_API_KEY` at build time.
`NUXT_RESEND_API_KEY` overrides it at runtime. The private inbox comes from
`CONTACT_INBOX_EMAIL` the same way and stays out of the repository, which is
public. The site email is `contact@hello.forrrow.com` until a
`hello@forrrow.com` inbox exists. The sending domain,
`hello.forrrow.com`, must be verified in Resend before mail is delivered.

### Layout components

app/components/layout contains site-wide structure such as SiteHeader, SiteMenu,
SiteMenuLink, SiteNavLink, SiteNavServices, SiteScrollbar, SiteCtaSection, and SiteFooter. Layout components
may use shared components and UI primitives. They should not depend on a landing
section.

SiteCtaSection is the light call to action that closes every route. It is a
two-column split from `lg`: the copy on the left and a projects marquee on the
right. Below `lg` the marquee follows the copy. It reads its title lines and
description for the current route from `siteCtaFor` in app/lib/site-cta.ts,
which falls back to the default "Turn your social media views into leads?"
copy, so a route such as `/services` can ask its own question. `/blog` and
every path under it share one Blog copy. An optional
`titleScale`, `0.85` by default, sets a route's title size, both its base
size and the width it fits to. The description is optional, and a route without one renders no
description paragraph. It fits its title to the copy column's width with
useFitText. The layout renders it inside the main landmark after the page, so
no page owns a copy. It owns its link to `/contact` and reveals through
useSiteCtaMotion.

The marquee reads `projects` from app/data/projects, leaves out the project
whose page is open, and repeats the rest until a set holds at least four
cards. It renders that set twice for a seamless loop inside a `nav` named "Our
projects", and each card is a ProjectMarqueeCard linking to `/work/<slug>`.
Only the first card of each project is focusable and exposed to assistive
technology, so a keyboard or screen reader meets every project once.
useProjectMarquee moves the track. Hovering a card shows the shared
TrailingTooltip with "View" followed by the project name and "Case", such as
"View Sygen Case", through useTrailingTooltip, which loads it
only on fine-pointer devices. Like the footer, the section carries
`data-page-transition-follow`, so it leaves with the outgoing page. Because the
layout persists, the layout keys it and bumps that key through the page
transition's `deferCleanup` whenever `pageKey` changes, so a fresh copy mounts
after the leaving page has been removed and every route reveals it again.

The site sets no cookies and runs no analytics or tracking, so the layout
renders no cookie notice. Adding any tool that stores information on the
visitor's device requires a consent notice and a privacy policy update first.

SiteScrollbar owns the overlay scroll thumb that replaces the hidden root
scrollbar. It measures native scroll and document geometry only after mount, so
it adds nothing to the server output. It routes thumb dragging through
useSmoothScroll rather than writing the scroll position itself.

### Card components

app/components/cards contains reusable content presentation such as case studies, projects, courses, articles, reasons, and statistics. Cards receive typed content and variants through props. BlogCard exposes tinted and neutral surfaces so the home and Blog route can share one layout without sharing the same color treatment. ProjectMarqueeCard renders one project's cover as a link to its page for the site call to action's marquee. It loads its image lazily and, for a video cover, sets the video's source and plays it muted only while the card is within half a viewport of the screen, pausing it once it leaves. Reduced motion keeps the poster. Its `duplicate` prop hides a repeated card from assistive technology and the tab order. PricingCard renders one package from app/lib/pricing.ts: its name with the discount percent, an optional "Most popular" band on a brand orange frame that wraps the card, the description, the struck regular price beside the package price, its own call label as a link to the Contact route with the saving below it, and the features under "Includes:" or "Everything in <previous package>, plus:". From `lg` it spans four rows of its grid through `subgrid`, so the price, action, and features rows line up across the three cards. PricingFlexibleCard renders the flexible package block below the package grid on every pricing tab, with a call to plan a flexible package on the Contact route and no price. Cards do not fetch their own page data.

### Shared components

app/components/shared contains small project-wide composition patterns such as BrandLogomark, FaqSection, ListingHero, SectionHeading, MediaPlaceholder, SplitText, and TrailingTooltip. ListingHero owns the fitted one-line title, semantic `h1`, description split, and shared listing-page hero layout used by Work, Blog, and the Privacy policy. Its optional `titleSize`, `23.71cqi` by default as measured for "Our Work", sets the title's first-paint size, so a longer phrase passes its own measured size, as WorkHero does with `18.13cqi` for "Case studies". SplitText renders its complete text during SSR, applies the GSAP SplitText plugin after mount through `queueMainThreadTask`, one split per browser task, and emits typed runtime parts for component-owned animation. With a `media` query that does not match at mount it keeps the server text unsplit and emits `null`, as the home hero does below `lg`, where its text has no intro to animate and a late split would repaint the page's largest text. With the default `aria` of `auto`, a heading keeps its text through GSAP's `aria-label`, because a heading may carry one. A paragraph, `div`, or `span` may not, so after every split SplitText hides the split pieces from assistive technology and prepends an `sr-only` copy of the text, which the next revert removes. Text that sits in a hidden rest state before its reveal therefore stays readable to screen readers. It reverts its split through the page transition's deferred cleanup, so a leaving page keeps its split text until the incoming page covers it. TrailingTooltip renders through Nuxt's shared teleport target, receives its active state, image, and optional label from its owner, and owns its fine-pointer tracking, reduced-motion state, thumbnail layer list, and GSAP cleanup. It keeps the outgoing thumbnail mounted until the incoming one has loaded and finished revealing, so the owner still passes a single image string and never manages the transition. An empty image string drops every thumbnail layer, so the text-only form never keeps the previous image. It keeps a label layer list the same way: when the label changes while the tooltip stays open, the outgoing label slides up out of a clipping mask while the incoming one slides up from below and the mask eases to the new width, on the shared slide ease from app/lib/slide-ease.ts, and each finished slide drops the layers beneath it. Its owner loads it asynchronously only after mount when the primary input supports both hover and fine pointing, so touch-first devices do not request or mount the component. ImageCycle cuts through a list of decorative images on an interval, `750ms` by default, without a crossfade. It cycles only while it is on screen, only after all of its images have loaded, and never under reduced motion. Its images load lazily unless the owner passes `loading="eager"`, as the Services hero does for its above-the-fold frame. DrawnLine renders the empty decorative SVG and path that useDrawnLineMotion fills and draws, with the shared stroke width, round caps, hidden resting state, reduced-motion visibility, and below-`lg` hiding. Its path strokes `currentColor`, so each owner sets the color, opacity, position, size, and overflow on the root. FaqSection owns the default FAQ copy, its `FAQPage` schema, and its motion, and the home and Contact routes both render it. Its optional `title` and `items` props replace the default title and questions, so each service page renders its own FAQ and schema. An item's optional `link` renders an ArrowLink below its answer. The home page renders it as `LazySharedFaqSection`, and BlogSection as `LazyLandingBlogSection`, both with `hydrate-on-visible` and a one-viewport `rootMargin`, so they hydrate just before they scroll into view instead of during startup. The schema still ships, because Schema.org renders only on the server in production. Its `structuredData` prop defaults to `true` and turns the schema off for a repeated copy. Shared components must remain independent of a single landing section.

### UI primitives

app/components/ui contains source-owned Shadcn Vue primitives. These components own generic behavior, accessibility, states, sizes, slots, and variants. They must not contain forrrow page copy or feature-specific data. ButtonIcon is the one primitive that imports a shared component: without an `icon` it renders the BrandLogomark, so every CTA shows the brand mark by default. The dialog primitives wrap the Reka UI Dialog: DialogContent portals itself with its overlay, keeps the Shadcn close button behind a `showCloseButton` prop that defaults to `true`, and accepts an `overlayClass`. Input, Textarea, and Label are the Shadcn new-york form primitives: Input and Textarea bind `v-model` through `useVModel` and style `aria-invalid`, and Label wraps the Reka UI Label. The tabs primitives, Tabs, TabsList, TabsTrigger, and TabsContent, wrap the Reka UI Tabs with the Shadcn new-york defaults, so a consumer gets roving focus, arrow key navigation, and the tab, tablist, and tabpanel roles, and restyles them through `class`. The popover primitives, Popover, PopoverTrigger, PopoverAnchor, and PopoverContent, wrap the Reka UI Popover with the Shadcn new-york defaults. PopoverContent portals itself, defaults to `align="center"` and a `sideOffset` of `4`, and sits at `z-70`, above the header. SiteNavServices owns the header's Services link, which anchors the services popover, the popover's hover and keyboard focus open modes, and its two service links.

Preserve Reka UI integration, attribute forwarding, data-slot values, keyboard behavior, focus behavior, and CVA contracts when modifying this layer.

### Composables

app/composables contains reusable reactive state, lifecycle behavior, and side-effect integrations.

Use a composable when logic:

- Uses Vue reactivity or lifecycle
- Coordinates a browser or framework integration
- Needs automatic cleanup
- Is reused by multiple components

The existing useGsap composable is the integration boundary for component-owned GSAP animation. Components own their animation intent. The composable owns plugin loading, scoped contexts, media matching, and cleanup.

useHomeIntroMotion owns the home route's entry sequence, geometry measurements, native and Lenis scroll lock, responsive timeline, shared layout-header reveal state, and cleanup. Its preloader stage builds on the shared stack-reveal recipe in app/lib/stack-reveal.ts. It receives the hero title and description splits from LandingPage and reveals them with the hero call to action. It shows every `data-home-intro-header` element, which covers the header and its separate logo layer, and rises their pieces from `getHeaderRevealParts` in visual order without fading the header. Below `lg` it marks the intro complete at mount and only hides the preloader cards, while LandingPage and the default layout show the hero copy, the retained cards, and the header at rest in CSS below `lg`, so phones paint them without waiting for JavaScript. It runs the preloader and the center expansion only while Nuxt is hydrating a direct home request from `lg` upward. A client-side entry arrives through a page transition: it shows the hero cards at rest in their grid immediately, lowers the header pieces into their masks, and builds its reveal timeline only when usePageTransition reports the reveal point, so the timeline starts at its own beginning instead of absorbing the incoming page's mount work. It holds the scroll through the shared Lenis lock rather than stopping Lenis directly, and marks the intro complete if the page is left before the intro finishes, so the header never stays hidden on the next route.

useHomeHeroScrollMotion owns the scroll-linked transition between the home hero
and the section after it, currently the work section. It waits for the intro to complete and lets the hero leave
through normal document scrolling. From the first scroll, one scrubbed
timeline slows the featured retained card from page speed into a hold at the
viewport center, moves it to the horizontal center, expands it until the
transition space ends, and releases it back to page speed. Every property
follows a velocity matched curve from app/lib/scroll-curve.ts, so nothing
stops or changes speed abruptly. The card's resting offset from the home intro
is part of the measured path. The transition runs only from `lg` upward, where
LandingPage supplies an empty scroll space one and a half viewports tall before that section. Below `lg`
the space collapses and the composable creates no animation. Responsive
measurements, the reduced-motion outcome, ScrollTrigger lifecycle, and route
cleanup remain inside the composable.

useStudioMotion owns the Studio section's entrance: the statement words, the
founder photo's frame clip reveal and image parallax, and the copy paragraph
words. It waits until the shared
SplitText component has reported every statement and copy paragraph split, then
creates the section-scoped ScrollTriggers in page order. It resolves reduced
motion to visible content and removes animation state when the section scope is
disposed.

useStudioRibbonMotion owns the Studio section's decorative ribbon. StudioRibbon
renders the empty SVG, its segment paths, and their shade gradients, and
StudioSection marks the statement and the grid with `data-studio-ribbon-statement`
and `data-studio-ribbon-grid`. After mount the composable measures those
anchors, writes the path data and the shade lines, samples every segment's
length, and scrubs one DrawSVG timeline through the segments in draw order.
The first drawing reuses the startup measurement, because sampling the
segments is expensive. It rebuilds the geometry and the drawing inside the same
GSAP media context only when the section's size changes. Reduced motion keeps the measured ribbon fully drawn
through CSS.

useWorkMotion owns the work section: the centered title characters, each
case study's scrubbed image parallax, and the staggered rise of its masked
text lines. The case study images have no entry reveal. WorkSection supplies the section scope
and the title split; the case study card supplies the `data-work-case`,
`data-work-case-image`, and `data-work-case-reveal` hooks the composable
resolves inside that scope. Reduced motion resolves the
title to visible characters and leaves every card in its resting state. It also
owns the handoff from the last card to the MoreWorksPanel. It slows and fades
the `data-work-case-list` element and brings in the `data-work-more-panel`
surface inside the `data-work-more` track, because that handoff choreographs
WorkSection's own cards against its closing panel. The handoff ends where the
track pins, and its trigger carries `refreshPriority: 2`, above the pin's `1`,
so it measures the track before the pin applies its state. A refresh made
while the page sits below the panel, such as when the lazy Blog and FAQ
sections hydrate after a scrollbar jump, would otherwise measure the track at
its pinned end, one viewport lower, and play the handoff during the pin.

useDrawnLineMotion owns a single scroll-drawn line. It receives a scope and a
DrawnLine, the path builder and optional head lead from a lib artwork module,
and finds the `data-drawn-line` SVG inside that scope. After mount it measures
the SVG and the tops of every `data-drawn-line-anchor` inside the scope relative
to the SVG, writes the path data, samples its length, and scrubs one DrawSVG
tween with the scroll through the shared ribbon draw timing. It observes the
SVG itself and rebuilds the geometry and the drawing inside the same GSAP media
context whenever the SVG resizes. Reduced motion keeps the measured line fully
drawn through CSS.

useWorkLineMotion passes the work line to useDrawnLineMotion. WorkLine renders
DrawnLine inside `data-work-case-list`, so the line moves and fades with the
list during the handoff. AboutTeamSection and AboutPage call useDrawnLineMotion
directly with the team and story lines.

useMoreWorksMotion owns the MoreWorksPanel's internal motion: the pin, the
scrubbed reveal that brings the words in from their sides as each character
fades and scales in, while the image scales up from zero, and the on-screen
state that drives image cycling. The panel component owns the image list and
the cycling interval, and the composable only reports whether cycling should
run. The panel emits its hover state with its current image and label, and
WorkSection feeds them to the same TrailingTooltip the case cards use.

useServicesMotion owns the services section's motion: the pinned intro panel's
blurred word reveal and, for each `data-service-panel`, the slowed travel of
the children of its `data-service-content` block, and the description line rise
anchored to the static service title. The content keeps one constant slowed
speed throughout. The panels have no images. It also owns the dark panel's card rise, a scrubbed
scale of its `data-service-card`, which holds the dark fill and the content,
from a rounded `0.92` scale to full bleed, the pin and blur of the panel it covers, which skips the slowed travel,
and the dark panel's curved exit that reaches down toward the journey title as
the panel leaves. Because the content block moves, those triggers are scroll
positions computed from untransformed layout rather than trigger elements. On
touch devices its media context drops the slowed travel, the card scale, and
the pin, so the content stays in place and the dark panel is shown at rest.
The same text timeline opens each panel's `data-service-title-inset` and
`data-service-link` by tweening their `--service-title-inset-open` and
`--service-link-open` properties, and settles their
`data-service-title-inset-content` and `data-service-link-content` from the
hero inset's content scale, and raises each panel's `data-service-rise` route
link `0.3s` after the description starts. The slowed travel moves the `data-service-title`
through `top` and the other content children through a transform, so the
title's blended text fragments stay unisolated. ServicesSection owns the copy, the
square service links and their tooltip handlers. Each link routes to
the service's own page from `servicePagePaths`. The composable waits until the intro
lines and every description have reported their splits.
Reduced motion resolves every reveal to visible content without the pin.

useJourneyMotion owns the journey section's motion: the one-time reveal of the
`data-journey-heading` title and description beneath the services section's
exiting dark curve, and one chart timeline that draws the `data-journey-line`
columns, raises the `data-journey-number` labels, and wipes in the
`data-journey-bar` bars in overlapping waves when the `data-journey-chart`
enters. From `md` the same timeline continues into each `data-journey-step`
title and description so the text overlaps the bars; below `md` each step
reveals on its own trigger. It waits for the title, description, and every
step's title and description splits, and shows everything at rest under
reduced motion. ProcessSection, in app/components/shared, takes the title,
description, and steps as props and emits those splits. LandingPage passes the
"Work Process" steps and renders it after the pricing section, and both
service pages pass their own process.

PricingSection, in app/components/shared, renders the pricing section on the
home page, the Services hub, both service pages, the Work route and every
project page, the About route, the Contact route, and the Blog routes. Its plans and categories
live in app/lib/pricing.ts as typed data: three categories, AI content
creation, web development, and both services, each with three one-time
packages with a USD price, a regular price, a call label, and an optional
`featured` flag, plus `formatPlanPrice`, a fixed `en-US` formatter without
digit grouping that renders the same string on the server and the client, and
`planDiscountPercent`. Its `defaultCategory` prop picks the tab that opens first and defaults to
`ai-content`, and its `clearCurve` prop, `true` by default, adds the tall top
padding that clears a dark services curve above it. The section owns the
active category and the
hovered tab index and passes them to its switcher as CSS custom properties.
Every panel renders on the server through `unmount-on-hide="false"`, so all
nine plans ship in the HTML while the inactive panels stay `hidden`.
Every page renders it as `LazySharedPricingSection` with the same
`hydrate-on-visible` area as the blog and FAQ sections: LandingPage between
the services section and the work process, ServicesPage after the Website
Development panel with `combined` and a `pb-section` class, because nothing
follows it before the site call to action, and the AI content creation and
web development pages between their story blocks and their process with
`ai-content` or `web-development` and `clearCurve` off, because the story
section already ends with section spacing. WorkPage, BlogPage, which also
renders the blog category pages, ProjectPage, and BlogPostPage render it last,
just before the site call to action, and AboutPage after its story block, all
with the default tab, `clearCurve` off, and spacing classes that suit the
section above: `py-section` after the grey projects and articles panels and
after the Next Project block, and `pb-section` where the section above already
ends with spacing. On About it also takes `relative bg-background`, so the
story's drawn line passes under it as it passed under the call to action.
ContactPage renders it between the hero and the FAQ with `pb-section`. The section has no
reveal motion: its heading, switcher, and cards render at rest from the server,
and switching categories only toggles the panels. LandingPage
currently keeps WhyChooseSection disabled.

useWhyChooseMotion owns the Why Choose Us section's motion: the one-time
character spawn of the `data-why-title` heading beneath the services
section's exiting dark curve, the line rise of each `data-why-note`, and for
each `data-reason` wrapper the rise of its `data-reason-card` followed by the
card's number, title word, and description line reveals. It waits for the
title's character split and every note, card title, and card description
split, rebuilds a note or card reveal when its lines re-split before it plays,
and shows everything at rest under reduced motion.
WhyChooseSection owns the reasons, the notes, the title, and the staggered
masonry placement, and ReasonCard owns the card layout and its surface tone
and emits its title and description splits.

useBlogMotion owns the blog section's reveal: the heading's title characters and
the `data-blog-cta` action rising from its `data-blog-cta-mask`, and for each
`data-blog-card` the title line rise and the `data-blog-card-meta` rise. The
cards themselves stay at rest. Cards that share a layout row are staggered from
their measured `offsetTop` when they enter. It waits for the title's character split
and every card title's line split, rebuilds a card's reveal when its title
re-splits before it plays, and shows everything at rest under reduced motion.
BlogSection owns the article content and collects the card title splits, and
BlogCard owns the card layout and emits its title split.

useFaqMotion owns the FAQ section's motion: the `data-faq-title` line reveal,
the staggered rise of each `data-faq-item`'s `data-faq-rise` question and icon
with its `data-faq-divider` draw, and the accordion toggle. It watches the
open item index and tweens the force-mounted `data-faq-content` region's
height and the `data-faq-icon-cross` bar's rotation, then reveals that item's
answer lines. It waits for the title's line split and an optional
`revealReady` signal, which FaqSection receives as a prop that defaults to
`true`, so an owner can hold the reveal until an earlier section has finished.
It rebuilds the title reveal
when the lines re-split before it plays, and resolves every reveal and toggle
instantly under reduced motion. FaqSection owns the copy, the controlled
accordion value, and the title and answer splits.

useContactHeroMotion owns the Contact hero reveal. It waits for the
description split, the fonts, and the page transition's reveal point, then
rises the `data-contact-hero-title-line` lines from their clipped masks, the
description lines, and each `data-contact-hero-field` group, and opens the
`data-contact-hero-inset` with its content settling from the Services hero
scale, in one timeline. Every `data-contact-hero-reveal` element stays hidden in CSS
until the reveal starts, and reduced motion shows everything at rest.

useAboutHeroMotion owns the About hero. It waits for the description split
and the page transition's reveal point, then rises the title lines through
masks clipped with `overflow` and a relative `top` offset, so no stacking
context isolates the blended title text, and, just
before they land, the description lines, opens every `data-about-title-inset`
frame on the swap ease by tweening its `--about-title-inset-open` property, and
scrubs the hero content's `top` down at half the
scroll speed while it fades every title text fragment, the image frame, and the
description one by one as the hero leaves, so no transform or opacity isolates
the blended text from the image trail, so the team section covers it. It returns
`revealed`, which lifts the hero's hidden CSS rest state.

useAboutHeroTrail owns the About hero's cursor image trail. After the page
transition's reveal point, inside a GSAP media context that matches only a fine
hover pointer with motion allowed, it returns `armed` as true and listens to
mouse pointer movement on the hero. It adds up the travelled distance and,
each time it passes a third of the viewport width, plays the next
`data-about-hero-trail-item` of the `data-about-hero-trail` layer at the
pointer. AboutHero owns the image list and renders that layer only while
`armed` is true, so the server output and touch devices never request it.

useServicesHeroMotion owns the Services hero. After the fonts load and the
page transition's reveal point, it rises the title lines, then opens every
`data-services-hero-inset` frame, each starting shortly after the one before
so they overlap, by tweening its `--services-hero-inset-open` property from `0`
to `1` and settling its `data-services-hero-inset-content` from a larger
scale, and scrubs the hero
content down at half the scroll speed while it fades out, as the About hero
does. It returns `revealed`, which lifts the hero's hidden CSS rest state.

useServicesRevealMotion owns the scroll reveals of ServicesOfferSection. It waits for every `data-services-reveal-text` split,
then rises each text's lines, or its words when it is split into words only,
once with the shared line reveal timing when it enters, and rises every `data-services-reveal-rise` item once with the word
reveal timing, and opens every `data-services-reveal-inset` square link once
by tweening its `--services-offer-inset-open` clip to `1` on the swap ease while
its `data-services-reveal-inset-content` settles from the hero inset scale. When
the scope has a `data-services-reveal-backdrop` layer, it
extends the layer one viewport above the section and scrubs its clip path from
a rounded point at the bottom center of the viewport to the full width, over
`0.8` of a viewport of scroll, as useServicesMotion does for the home dark
panel. Reduced motion shows the text, the square links, and the backdrop at rest.

useServicesStatementMotion owns the Services statement. It waits for the
statement's line and word split, rises the lines once with the shared line
reveal timing, and scrubs every word from a dimmed opacity to full with the
scroll. Reduced motion shows the lines at rest at full opacity.

useListingHeroMotion owns the shared Work and Blog listing hero and the Work
project hero. It waits for the description split and
the page transition's reveal point, then rises the `data-listing-hero-title-char`
characters one by one inside their clipped mask with the shared character
reveal duration and ease at a wider `0.07s` stagger and, `0.35s` later, the description lines with the About hero
timing. At the same point every `data-listing-hero-rise` element rises from
`115` percent with a `0.06s` stagger inside its `data-listing-hero-mask`,
which is clipped only while the reveal runs. It scrubs the hero content down
at half the scroll speed while it fades out, as the Services hero does, unless
it is called with `drift: false`. It returns `revealed`, which lifts the
hero's hidden CSS rest state.

useWorkProjectsMotion owns the Work projects section's motion. After mount
it reveals the `data-work-filters` block once: the count characters with the
shared character rise and the `data-work-filter-rise` buttons from their
`data-work-filter-mask` wrappers. The project cards have no scroll reveal. It
returns `swapProjects`, which receives the owner's state update. It fades the
shown items out, applies the update, refreshes the scroll measurements, and rises the newly
shown items in. A newer swap
interrupts an older one, which then stops without applying its update. Reduced
motion applies the update at once and shows everything at rest.

useSiteCtaMotion owns the site call to action's reveal. It waits for every
title line's line split, then builds one timeline on the title's
`data-site-cta-title` trigger that rises the title lines one after the other
with the shared word reveal and the `titleLineRevealStagger`, then the
description lines, and rises the `data-site-cta-action` one stagger step after
the last line. The owner passes `null` for the description split when the
route has no description, and the action then follows the title lines
directly. Reduced motion shows the lines and the action at rest.

useProjectMarquee owns the site call to action's projects marquee. It
receives the marquee viewport, its track, and the card count, and loops the
track by half its length, the length of one set, with a linear GSAP tween at
`5s` per card in a set. From `lg` the track moves up, and below `lg` it moves
left. Pointer hover or keyboard focus inside the marquee eases the loop to a
stop and releases it on leave. The loop plays only while the marquee is within
a quarter of a viewport of the screen. Reduced motion creates no loop, and the
mobile row then scrolls natively.

useAboutApproachMotion owns AboutApproachSection's motion. It waits for the
title's word split, rises the `data-about-approach-title` words with the shared
word reveal, and rises each `data-about-approach-item`'s
`data-about-approach-rise` title and description from their
`data-about-approach-rise-mask` when the item enters. Reduced motion shows
everything at rest.

useAboutSectionMotion owns the scroll reveals of one About section. Inside its
scope it reveals the `data-about-title` lines, clip reveals and parallaxes
every `data-about-media` frame through its `data-about-media-layer`, rises the
`data-about-rise` items of every `data-about-rise-group` from their
`data-about-rise-mask`, and rises the lines of every `data-about-text` split,
matched by order to the `textSplits` it receives. An optional `titleSplit`
replaces the title's explicit `AboutTitle` lines with a `SplitText` line split,
as AboutCombinedSection's wrapping title uses, and the reveal waits for it. It
returns `titleRevealed`,
which the section feeds to its title underline.

useFooterMotion owns the site footer's scroll reveal. It receives the footer
root, the content wrapper, and the shade overlay as template refs and builds
one scrubbed timeline that moves the content from a trailing offset to rest
and fades the shade out while the footer enters. It recomputes the distance on
every refresh and refreshes after earlier pinned sections, so it follows each
route's layout. SiteFooter owns the markup, the clipping, and the CSS rest
state, so reduced motion needs no extra branch. The same file exports
useFooterRevealProgress, the `footer-reveal-progress` shared state. The reveal
writes its scroll progress there only when its start lies below the first
screen and resets it to zero when the reveal is reverted. SiteHeader reads it
to fade its actions and logo, so the header never queries footer markup.

useFitText fits a single line of text to the full content width of its parent.
It watches the text's box and writes a `--fit-text-scale` multiplier on the
element, which the component's own font size must multiply. An optional
`maxScale` caps the multiplier, so short text stops growing at the base size
and only longer text shrinks to fit. An optional `fill` fraction
fits the text to that share of the width instead, which SiteCtaSection sets
from the route's `titleScale`. WhyChooseSection uses it for its title,
WorkHero for its title, and ProjectHero for the project name with a
`maxScale` of `1`.

useMainThreadQueue exports `queueMainThreadTask`, which runs queued tasks in
order, each in its own browser task, and resolves once its task has run. It
keeps startup work such as text splitting out of one long main-thread task.

useImagesLoaded reports through `loaded` whether every image inside a root
has loaded. After mount it checks each image's completed state, so images that
loaded before hydration count, and otherwise waits for their load events. A
failed image keeps `loaded` false. The same file exports `whenImageLoaded`,
which resolves `true` on load and `false` on error for one image. ImageCycle
and MoreWorksPanel gate their cycling on `loaded`, and TrailingTooltip waits
on `whenImageLoaded` before showing a new thumbnail layer.

useTrailingTooltip owns the shared TrailingTooltip state: the active flag, the
image, label, size, and mark flag, the 200ms close delay, and whether the fine-pointer tooltip
should load. WorkSection, ServicesSection, AboutTeamSection, ServicesHero, and WorkProjectsSection compose it and
keep their own TrailingTooltip instance. `show` takes an optional image, so a
text-only tooltip opens without one, and an optional fourth argument shows
the logomark on the left of the label when there is no image.

useSiteHeaderMotion owns the header reveal on routes other than home and the `navRevealed` flag
that lifts the hidden CSS rest state of the links, the logo, and the actions
once a reveal has finished, whether it ran there or in the home intro. It
exports `getHeaderRevealParts`, which collects the `data-home-intro-nav-item`
links and `data-header-rise` targets from the header, navigation layer, and logo layer in visual
order along with their `data-header-rise-mask` wrappers, so both reveals rise
the same pieces. The header has no scroll states. It composes
useGsap so the layout component remains focused on header
structure and navigation content. It also returns the header root ref, so the
header can hand it to useHeaderSurface without registering a second template
ref with the same key.

useHeaderSurface reports whether a dark block sits behind the header actions.
Blocks opt in by carrying `data-header-surface="dark"` on the element that
actually paints the dark surface. On mount, on every shared Lenis scroll
callback, on resize, and on `page:transition:finish`, it hit tests the center of a probe
element with `document.elementsFromPoint`, skips everything inside the header,
and resolves the first element that is or sits inside a marked surface. Hit
testing respects `clip-path`, so a surface that is still clipping its way in,
such as the services dark card, only counts once it actually reaches the probe.
Mark the painted surface rather than a transparent wrapper, because a wrapper's
box is hit even where nothing dark is painted.

useSiteMenuMotion owns the menu panel's trigger-relative fixed
geometry, measured from the trigger's untransformed layout bounds, translated two-stage scale reveal, staggered content entrance,
two-line toggle morph, resize correction, and reduced-motion states. It closes
the panel instantly while a page transition is active. SiteMenu
teleports the panel into Nuxt's shared overlay target so the trigger can stay in
the header action group without containing the expanded navigation. It marks the
panel with `data-page-transition-overlay`, keeps the menu open when a link starts
a page transition, and closes it once the transition leaves its `preparing` phase.
useMenuLinkMotion lazily splits the expanded navigation link's two visual text
copies into characters, then owns their vertical rollover and its forward-ordered
return on hover and visible keyboard focus. Both composables scope their GSAP work and cleanup
to their consuming layout components.

useNavLinkMotion owns the primary navigation link hover: the resting label
slides up out of its mask while its copy slides up from below, both on a `nav-link-slide` CustomEase
of `cubic-bezier(0.16, 1, 0.35, 1)` over `0.65s`. app/lib/slide-ease.ts owns
that ease and duration, so TrailingTooltip's label swap moves on the same curve. It tracks pointer and visible keyboard focus together and
resolves instantly under reduced motion. SiteNavLink owns the markup.

useHoverBounce owns the hover and press scale states of action surfaces. It
receives a target plus optional hover and press behavior, composes useGsap, and
keeps its listeners and tweens inside a motion media context. The button
primitive calls it only when its `bounceOnHover` prop is set, then enables press
feedback for every size and hover bounce for call to action sizes, and SiteMenu enables press feedback only on the menu
control. This leaves generic markup, variant contracts, and
accessibility behavior in their owning components.

useHoverRollover owns the layered hover rollover. It reads independent text and
layer groups from a target through their data attributes, coordinates their GSAP
timelines, and tracks pointer and focus state together. It only animates elements
the consuming components render. Those components own the markup, the semantic
layer and copied-text colors, the paired glyphs, and the clipped positioning
host. The text group is optional: an icon-only host animates its layers and
glyphs and takes its covered icon color from the final layer. It reads the
resting and covered text colors each time a rollover starts and clears the
inline color once the text returns, so a host whose variant changes, such as a
Work filter button, always rests in its current variant's ink.

useArrowSwapHover owns the arrow swap hover: a slow-fast-slow scale and a swap
between the glyphs marked `data-arrow-swap-glyph` and
`data-arrow-swap-glyph-copy`. Both run on one shared `power4.inOut` timing. Its
options choose a `diagonal` swap, the default used by the More works circle, or
an `up` swap, and can turn the scale off, as the footer Back to Top button does. It
tracks pointer and focus state together, scales only for hover-capable
pointers with motion allowed, and resolves the swap instantly under reduced
motion. It stays separate from useHoverBounce and useHoverRollover so the
elastic CTA contract stays untouched. ArrowLink, and LiveLink through it,
also uses the diagonal swap without the scale.

useUnderlineSweep owns a link's underline sweep. On each change between rest
and hover or visible keyboard focus, the element marked `data-sweep-line`
shrinks out through its right end and grows back from its left, each half
taking half of `swapDuration`. A sweep that is still running finishes rather
than restarting, so a quick pass never jumps the line. It runs only for
hover-capable pointers with motion allowed and clears its transforms on
cleanup.

useMenuLinkMotion, useArrowSwapHover, and useUnderlineSweep each take an
optional `trigger` element. They animate the parts inside their target but
listen for pointer and focus changes on the trigger, which defaults to the
target. ArrowLink uses it when it renders inside a larger link, so the whole
link drives its motion.

useSmoothScroll is the component-facing contract for the global Lenis instance. It exposes readiness, scrolling, the scroll lock, the scroll reset, refresh behavior, the refresh hold, and scope-cleaned scroll subscriptions without allowing components to create competing Lenis instances. `lock` returns a release function, and Lenis only runs while no lock is held, so the page transition and the home intro can hold the scroll at the same time without either one restarting it early.

usePageTransition is the component-facing contract for the page transition plugin. It exposes `isActive`, `phase`, which is `preparing` from the navigation until the pages start moving, `moving` while they move, and `idle` otherwise, `deferCleanup`, which runs a cleanup immediately or, while a transition runs, after the leaving page has been covered and removed, and `waitForReveal`, which resolves at the transition's reveal point or immediately when no transition runs. useGsap routes its scope cleanup through `deferCleanup`, so a leaving page keeps every animation, pin, and inline style in place while it is visible.

usePageTransitionMotion owns the overlap page transition choreography and returns the Vue transition hooks that app.vue passes to NuxtPage. When the leaving page is handed over, before the incoming page mounts, it freezes the leaving scene: it pauses every ScrollTrigger without reverting it, anchors active pins to the page, copies the header and every visible `data-page-transition-overlay` element, such as the open site menu panel, offsets the leaving page and its followers by the current scroll position, and resets the scroll to the top. The incoming page therefore builds its scroll-linked motion against the scroll position it will land at, and the paused triggers that outlive the leaving page, such as the footer reveal, resume through `deferCleanup` before the final refresh. It sets the incoming page up as a fixed surface before insertion, moves the leaving page and every `data-page-transition-follow` element together, replaces every `data-page-transition-header` element with an inert static copy that leaves with them while the real header rises with the incoming page, fades the layout's `data-page-transition-shade` element, and restores normal flow in one task when the timeline ends.

### Library modules

app/lib contains pure helpers, shared constants, and stable names.

- char-reveal.ts owns the shared character rise recipe. It appends a set and a
  staggered rise to a timeline it is handed, so any character title can share
  the work title's timing from one definition. Like stack-reveal.ts, it never
  queries the DOM or creates its own timeline.
- icons.ts is the canonical map for shared icon names: Phosphor bold icons and the Lucide spinner.
- services-anchors.ts owns the Services route's section ids, `servicesAnchors`,
  and `servicePagePaths`, the two service page routes that the home services
  section and the home UGC creator case study link to.
- split-text.ts defines the stable typed result contract shared by SplitText and its animation consumers.
- image-parallax.ts holds the shared image parallax values: the `1.3` hold
  scale, the `14` percent travel, and the trigger range. The work case images
  and the founder photo both read them.
- ribbon-path.ts owns the Studio ribbon's artwork: the hand-drawn SVG path
  data and the anchor lines it was drawn against, the parser that turns the
  path into cubic Bézier pieces, the anchor projection `projectRibbonPieces`
  that maps those pieces onto the live Studio anchors or any other anchor pairs, the segment and paint order, the lead-in under the
  hero card, the crossing search and shade line for every segment that passes
  under another, and the draw timing that turns
  scroll progress into drawn length. It takes measured numbers and never
  queries the DOM.
- work-line-path.ts owns the work line's artwork: the hand-drawn SVG path
  data, the projection that scales it to the live case list frame, and the
  head lead the work line passes to the shared ribbon draw timing, exported
  together as `workLine`. It reuses the ribbon parser and path formatter and
  never queries the DOM.
- drawn-line-path.ts owns the DrawnLine contract and `createDrawnLinePath`,
  which parses an artwork once and maps it onto a live frame: x by the width
  ratio, y piecewise between the artwork's top, anchor, and bottom lines and
  the frame's measured ones. It reuses the ribbon parser, projection, and path
  formatter and never queries the DOM.
- about-line-path.ts owns the About route's two line artworks and their
  DrawnLine definitions, `aboutTeamLine` and `aboutStoryLine`.
- slide-ease.ts owns `slideDuration` and `registerSlideEase`, which creates or
  reuses the `nav-link-slide` CustomEase from a loaded CustomEase plugin.
  useNavLinkMotion and TrailingTooltip share it.
- stack-reveal.ts owns the shared stacked scale-up recipe. It appends the lead
  and follower tweens to a timeline it is handed, so the home preloader keeps its
  timing in one definition. It
  never queries the DOM or creates its own timeline, which keeps trigger and
  lifecycle ownership with the calling composable.
- scroll-curve.ts owns `sampleCurve` and `curveEase`. They read cubic Hermite
  curves through keys of position, value, and slope, so a scrubbed property can
  change speed gradually without a velocity jump. `curveEase` turns a key
  getter into a GSAP compatible ease and rereads the keys on every call, so
  curves built from measurements follow each ScrollTrigger refresh.
  useHomeHeroScrollMotion builds its scrubbed motion on it. It takes numbers
  only and never queries the DOM.
- projects.ts owns the Work project types, the category to service map, and
  `defineProject`. See Work projects.
- surfaces.ts is the canonical map for semantic surface and foreground tone names.
- swap-timing.ts owns the named swap timing: `swapDuration` and `swapEase` for
  hovers and toggles, and the programmatic scroll bounds `swapScrollDuration`
  and `swapScrollMaxDuration` with `getSwapScrollDuration`, a pure function
  that turns a scroll distance and viewport height into a duration.
  useArrowSwapHover, useNavLinkMotion, useUnderlineSweep, useFaqMotion,
  useServicesHeroMotion,
  and the Lenis plugin import it instead of repeating the values.
- word-reveal.ts owns the shared masked word rise recipe, its `top 82%` start,
  and its two staggers. Callers may override the stagger, the duration, and
  the ease. The Studio section and the services panels both append it to their
  own timelines, so their word reveals share one recipe. It also exports
  `navRevealStagger`, which the home intro and the site header share for the
  navigation link rise, and the line reveal timing, `lineRevealDuration`,
  `lineRevealEase`, and `lineRevealStagger`, which the services descriptions
  and the blog card titles share. `titleLineRevealOffset` and
  `titleLineRevealStagger` hold the padded title line rise, `150` percent
  with a `0.1s` stagger, which the About titles use. `revealMaskClip`,
  `inset(0 -0.5em)`, is the clip every reveal mask takes while it rises, so
  the mask cuts only above and below and never the last letter's overhang.
- utils.ts contains pure class and value helpers. `formatPublishDate` formats
  an ISO date in fixed `en-US` long style at UTC, so the server and the client
  render the same blog card date.

Library modules must not access the DOM, Vue lifecycle, request state, or component instances.

### Assets and global CSS

app/assets/css/tailwind.css owns:

- Tailwind CSS v4 imports
- OKLCH theme variables
- Shadcn semantic token mappings
- Type and spacing tokens
- Cross-component semantic class groups
- Shared surface, pattern, and motion utilities
- Global base behavior
- The fixed canvas grain layer described in DESIGN_SYSTEM.md

Vue single-file components own their component-specific recipes in scoped style
blocks. Scoped blocks use Tailwind's `@reference` directive to access the global
theme and utilities without duplicating their output. Vue templates own local
structure and short one-off utility groups. Repeated cross-component recipes move
to the global component layer or a component variant.

### Plugins

app/plugins contains Nuxt runtime integrations that must run as part of application setup. Keep plugins small. A plugin should configure an integration, not become a general utility collection.

lenis.ts owns the single application Lenis instance and its GSAP ScrollTrigger bridge. It disables browser scroll restoration and synchronizes the native and Lenis positions to the document top during client startup. After a page route navigation, usePageTransitionMotion resets them through the exposed `reset` when it freezes the leaving page, and the page transition plugin resets them again once the incoming page has replaced the outgoing one. Hash-only navigation remains available for Lenis section anchors. Its `scrollTo` and the Lenis anchor handling default to the swap scroll timing. `scrollTo` resolves the distance to a numeric, keyword, selector, or element target and passes it to `getSwapScrollDuration`, and a caller option such as `duration` or `immediate` still overrides the result. Lenis also owns touch scrolling through `syncTouch`, so touch scroll positions and scrubbed ScrollTrigger transforms update in the same GSAP ticker frame. The plugin initializes after the application mounts, drives Lenis from the GSAP ticker, updates ScrollTrigger from Lenis scroll events, refreshes measurements after mount and font loading, and tears everything down with the Vue application. While a refresh hold is active, `refresh` calls wait and resolve after one shared measurement when the last hold is released.

page-transition.ts owns the page transition lifecycle. A successful navigation to a different path begins a transition: it takes a Lenis lock and a refresh hold, so nothing scrolls or remeasures while two pages overlap, and it blocks further page navigations until the transition finishes. Finishing runs the deferred cleanups of the leaving page, resets the scroll to the top, releases the lock, and releases the hold, which refreshes Lenis and ScrollTrigger once against the final layout. If no transition hook claims a navigation by `page:finish`, or the app errors, it finishes immediately so the lock can never stick. A link to the current location ends in a duplicated navigation failure and never starts a transition. The plugin scrolls through `scrollTo` instead, to the element that the route's hash names when there is one and to the top of the page otherwise, so the page stays mounted. The `pageKey` it exposes through usePageTransition is the route path, and app.vue passes it to NuxtPage. When the route carries a hash that matches an element id, the plugin scrolls to that element through `scrollTo` once the finishing refresh resolves, and on `app:mounted` for a direct request, after the Lenis plugin's own startup refresh.

app/router.options.ts disables the Nuxt router scroll behavior, because the router would otherwise scroll the window while the leaving page is still visible. The page transition owns the scroll position after every page change, so the browser back button also lands at the top of the page.

The default scroller is the browser window. This keeps native scrolling, sticky positioning, anchors, and accessibility behavior. Do not add ScrollTrigger.scrollerProxy for this configuration. Reevaluate the integration only if the application adopts a custom scroll wrapper.

### Public assets

public contains source assets served from root-relative URLs, including images,
the logo, favicon, and robots file. Render images through NuxtImg or NuxtPicture
so Nuxt Image owns responsive sizing and optimization. Raster images go through
the `ipxStatic` provider, which writes every variant into `.output/public/_ipx`
at build time as WebP at the central quality of 80. Because every route is
prerendered, the output works on any static or edge host, including Vercel,
Cloudflare, and a plain Node server, without a runtime image optimizer.
The dev server never registers the `/_ipx` route for `ipxStatic`, so a
`$development` override in nuxt.config.ts switches the dev server to the live
`ipx` provider with the same WebP format. Both providers build the same URLs.
`config/image-routes.ts` owns `imageQuality` and `imageFormat`, which
nuxt.config.ts reads.

The build only generates the variants that appear in prerendered HTML. An image
that renders only after an interaction needs its variant added to the prerender
routes, which `listInteractiveImageRoutes` in `config/image-routes.ts` does for
two cases: the square 448px and 896px thumbnails of every raster file under
`public/images` for the trailing tooltip, and the 1024px, 1536px, and 2560px
variants of every project gallery image for the project image viewer. The About
member dialog reuses the `sizes` of the member card portrait so it reads the
variants the page already loaded. A new interaction-only image must follow one
of these patterns, or its variants return 404 in production. The config loads
`app/data/projects` and `app/lib/projects.ts` outside Nuxt, so those files and
their imports use relative paths instead of the `@/` alias. SVG
brand assets use the registered `none` provider so they bypass the optimizer,
which does not process SVG. Repeating decorative textures such as the canvas
grain tile are the exception. They are referenced by root-relative URL from the
global stylesheet and do not pass through Nuxt Image.

## Dependency direction

Dependencies flow down through the component system:

~~~text
app entry or pages
  -> landing and layout components
    -> card and shared components
      -> UI primitives
        -> library helpers and tokens
~~~

Additional rules:

- UI primitives must not import cards, shared components, layouts, or landing sections.
- Shared components must not import landing sections.
- Cards must not import landing sections.
- Composables may import pure library modules, but they must not import page or feature components.
- Library modules must remain framework-independent unless the module has an explicit Nuxt or Vue integration purpose.
- A section may compose lower layers but should not reach into another section's internal state.

## Component contract decisions

Create or extend a UI primitive when the need is generic behavior or a reusable state and variant contract.

Create a shared component when the same composition appears across multiple features.

Create a card when structured content needs a stable visual presentation.

Keep markup local when it is short, appears once, and has no independent behavior.

Prefer slots for flexible markup regions. Prefer typed props for data and controlled variants. Prefer emits for owner-controlled state changes.

## Data ownership

- Keep static page content close to the section that owns it while the content has one consumer.
- Move repeated content into a typed content module when multiple sections or routes consume it.
- Use useAsyncData or useFetch when data comes from an API or content source and participates in server rendering.
- Keep server response types and validation schemas close to the server boundary. Move them to shared only when both client and server need the contract.
- Do not make leaf visual components responsible for remote data fetching.
- Do not duplicate server data in local reactive state unless the user is editing a draft.

## State ownership

Use the smallest state scope:

1. Local ref for one component
2. Prop and emit for a parent-owned value
3. Provide and inject for a tightly related component tree
4. useState for simple SSR-safe application state
5. Pinia only when domain state, actions, devtools, or broad coordination justify a store

Do not introduce global state for convenience.

## Server rendering boundaries

- The first client render must match the server output.
- Initial page data belongs in SSR-aware Nuxt data composables.
- Browser APIs and DOM measurement begin after mount or inside a client-only plugin.
- Stable keys come from data identity.
- Randomized visual behavior must use deterministic input or begin after hydration.
- Theme and viewport behavior must have a deterministic server fallback.
- Heavy client-only modules should load lazily at the component that needs them.

Every route is prerendered at build time. The `/**` route rule sets
`prerender: true`, and Nitro prerenders `/`, `/robots.txt`, `/sitemap.xml`,
and `/llms.txt`, follows every internal link, and adds every page file,
including Work project pages that nothing links to yet. It also prerenders the
interaction-only image variants described in Public assets. A new page therefore ships as
static HTML without any configuration. Code that reads request data at
runtime does not work on a prerendered route.

Nitro uses its default dependency handling: the build bundles what it can and
traces the remaining server dependencies into `.output/server/node_modules`.
Do not set `nitro.noExternals`. It made every unresolved optional import fail
the build, and the hosts gain nothing from it: Vercel traces dependencies
itself, and the Node server runs from the traced `.output/server/node_modules`.

## Work projects

Work projects are files in the repository. There is no database, media
storage, admin area, or editor. Adding or changing a project is a code change.

- `app/lib/projects.ts` owns the `Project` type, its block types, the
  `ProjectCategory` names with `projectCategoryServices`, which maps each
  category to the `ai-content` or `website-development` service that the Work
  filters group by. Image, Reel, and Video are AI content, and Development,
  E-commerce, UI/UX Design, Web Design, and Web Development are website
  development. It also owns `defineProject`, an identity helper that type-checks a
  project file, `getProjectGallery`, which lists the cover, media block, and
  grid images and videos of a project in page order for the viewer, and
  `getProjectCoverImage`, which returns the cover, or the poster of a video
  cover at the video's size and alternative text.
- `app/data/projects/<slug>.ts` holds one project as the default export of
  `defineProject`: its slug, name, description, categories, optional live link,
  surface, cover, content blocks, and an optional search title and description that
  fall back to the name and the description.
- `app/data/projects/index.ts` lists every project, so listings can read them
  without a request. Its `getNextProject` returns the project after a given
  one in that list, wrapping from the last to the first, or nothing when the
  list holds a single project.
- `app/pages/work/<slug>.vue` imports one data file and renders `ProjectPage`
  with it and `getNextProject` of it as `nextProject`.
  The page file name is the route, so a project is reachable at
  `/work/<slug>` as soon as its page exists. The file name, the `slug` field,
  and the media folder must match.
- Project media lives in `public/images/work/<slug>/`. Each image and video
  carries its intrinsic width and height and its alternative text in the data
  file. A cover is a 16:9 image or video, normally 2560 by 1440 for an image
  and 1920 by 1080 for a video. A video cover requires a `poster`, a separate
  still image at the video's pixel size, which shows before the video plays
  and becomes the page's sharing image because crawlers cannot read a video.

The content blocks are:

- `text`: an optional subtitle and one or more paragraphs, placed `left`,
  `center`, or `right`, which defaults to `left`.
- `title`: one large centered section heading with no body copy.
- `media`: one full width image or video.
- `grid`: two or more images in two or three columns, which defaults to two.
- `results`: one or more results, each a value and a label, shown in one of
  the `primary`, `blue`, `green`, `pink`, `yellow`, or `dark` surface tones,
  which defaults to `primary`. It carries no heading, so a `title` block
  normally precedes it.

`app/components/project` renders a project. Its components read typed props
only and own no data.

- `ProjectPage` composes the hero, the cover, the blocks, and, when it
  receives a `nextProject`, `ProjectNext`, and sets the page title,
  description, and social metadata from the project.
- `ProjectNext` renders the Next Project block from the next project's slug,
  name, surface, and cover as one NuxtLink marked `data-arrow-link-trigger`,
  with an "All Works" link to `/work` placed beside it, and owns a
  TrailingTooltip through `useTrailingTooltip`. It renders the cover itself
  instead of through `ProjectMedia`, so the next project's cover never opens
  the current page's viewer. It shows the cover image, or the poster of a
  video cover, and a video cover plays through `HoverVideo` while the block
  is hovered. When it is present, `ProjectPage` drops
  its bottom padding so the block meets the site call to action.
- `ProjectHero` repeats the Work hero frame. The name is the page H1, centered
  on one line, and `useFitText` shrinks a long name to the full width, capped at
  the Work hero title size. The services list, the live link, and the
  description follow. It reveals through `useListingHeroMotion` with
  `drift: false`.
- The shared `ArrowLink` in `app/components/shared` renders the underlined
  arrow link in an `sm`, `md`, or `lg` size through NuxtLink. It composes
  `useMenuLinkMotion`, `useArrowSwapHover`, and `useUnderlineSweep` for its
  hover motion. With `external` it opens in a new tab with
  `rel="noopener noreferrer"`. Without a `to` it renders a span with an
  `sr-only` label for use inside a larger link, and its motion listens on the
  closest `data-arrow-link-trigger` ancestor. The shared `LiveLink` renders it
  as the external Visit Live Website link, which the project hero and the home
  case study cards use, and `ProjectNext` uses it for the next project's name
  and the All Works link.
- The shared `HoverVideo` in `app/components/shared` renders a muted,
  looping, decorative video that plays while its `active` prop is true and
  pauses and rewinds when it turns false. It sets its source on the first
  play, so a page downloads none of the video until a reader hovers. It plays
  only for `(hover: hover)` pointers and never under reduced motion.
  `ProjectCard`, `CaseStudyCard`, and `ProjectNext` stack it over their
  image.
- `ProjectMedia` renders an image through NuxtImg or a muted, looping,
  autoplaying video, with the given responsive sizes and loading intent. The
  cover loads eagerly and every other media item lazily. The cover and media
  blocks span the page gutter and use its default per-breakpoint sizes, which
  top out at the 1536px screen, and only grid images pass their own. When a
  project gallery is provided, an image or video renders inside a button that
  opens it in the viewer, and hovering a video shows the page's "Watch with
  sound" hint.
- `ProjectPage` collects the gallery with `getProjectGallery`, owns the viewer
  index and a TrailingTooltip for the video hint, and provides `open`,
  `showVideoHint`, and `hideVideoHint` through `provideProjectGallery`.
  `ProjectMedia` reads them with `useProjectGallery`, so the blocks between
  them pass nothing down. An item that appears twice opens at the position it
  was clicked, because the lookup compares the item object before its source.
- `ProjectImageViewer` renders the gallery in a full-screen Dialog with close,
  previous, and next actions, arrow key and touch swipe navigation, and a
  counter. It holds the smooth scroll lock while open. It sizes its frame from
  the item's intrinsic width and height, so it never waits for the file to
  measure, and GSAP tweens the frame to each new size. A video slide renders
  `ProjectVideoPlayer`, a custom player built on VueUse `useMediaControls`
  and `useFullscreen` with the source-owned shadcn `Slider` in
  `app/components/ui/slider`, a Reka UI slider whose optional `thumbLabel`
  names its thumb.
- `ProjectBlocks` renders the blocks in order and places a spacer before each
  one, so the spacing is owned by the list rather than by the blocks.
  `ProjectTextBlock`, `ProjectTitleBlock`, `ProjectGridBlock`, and `ProjectResultsBlock` render their
  block types, and a media block renders `ProjectMedia` directly.

The Work listing and the home case studies still keep their cards as local
data in `WorkProjectsSection` and `WorkSection`. Both show only the real
projects, UGC Creator, Sygen, and Cartoon, in the order of
`app/data/projects/index.ts`. Each card passes an `href` to its project page,
which turns `ProjectCard` into a NuxtLink and adds a NuxtLink covering
`CaseStudyCard`, so the case card's `liveUrl` link can sit above it without
nesting. A new project needs a card in both lists. The Work listing reads its
category names and the category to service map from `app/lib/projects.ts`.

## Legal documents

Legal documents are Markdown files in `content/legal/`, read into the `legal`
page collection with a `/` prefix, so `content/legal/privacy.md` has the path
`/privacy`. Its frontmatter requires a `title`, a `description` that the hero
shows, and an `updated` date as `YYYY-MM-DD`. Each `##` heading becomes one
entry in the section navigation. Each document needs its own page file, and its
search title and description live in `app/lib/page-seo.ts`. Change the
`updated` date with every content change.

## Blog posts

Blog posts are Markdown files managed by Nuxt Content v3, which reads them into
a SQLite database at build time through Node's built-in `node:sqlite`
(`sqliteConnector: 'native'`), so no native database package is installed.

- `content.config.ts` defines the `blog` page collection from
  `content/blog/*.md`. Its schema requires the title and description, a
  `YYYY-MM-DD` `date`, a `category` of `AI content creation` or
  `Web development`, and a `cover` with its source, size, and alternative
  text. An `author` with a name, optional role, and optional image, and a
  `draft` flag are optional. A missing or invalid field fails the build.
- `app/pages/blog/[slug].vue` loads the post and the published posts by date,
  renders SiteErrorView with a 404 status for an unknown post or, outside
  development, a draft, and otherwise
  renders `BlogPostPage` with the next older post, or the newest other post
  when it is the oldest.
- `BlogPostPage` renders `BlogPostHero`, which holds the title and cover and
  reveals them through `useBlogPostHeroMotion`, then `BlogPostAside` and the Markdown
  body through `ContentRenderer`, and owns the body typography. It sets the
  page metadata with the cover as the sharing image, a Home, Blog, and post
  `BreadcrumbList`, and a `BlogPosting` with the author only when the post has
  one. `BlogPostAside` shows the author, title, date, and a share action that
  uses the native share sheet when available and otherwise copies the link.
  `BlogNextPost` renders the next article card.
- `app/components/content` holds the Markdown components: `::cta{href}`
  for a call to action button, `::callout` for a highlighted takeaway, and
  `::divider` for a grey line across the text column, plus `ProseImg`, which renders inline
  images through NuxtImg, and `ProseTable`, which wraps tables so they scroll
  on narrow screens.
- `config/blog-posts.ts` lists published posts from the files at config time.
  `nuxt.config.ts` adds them to the prerender routes and the sitemap with
  their date as `lastmod`, because a dynamic route is not discovered from
  page files. `llms.txt` lists them through `queryCollection`.
- A post with `draft: true` renders only in the dev server. It is never
  prerendered, listed in the sitemap or `llms.txt`, or served in production.
  `content/blog/layout-sample.md` is a draft that shows every element and
  serves as the authoring reference.

The `/blog` listing and its category pages still show the placeholder cards
from `app/lib/blog-articles.ts`. It will read the collection once real posts exist.

## SEO

`@nuxtjs/seo` installs the Nuxt SEO modules: site config, sitemap, robots,
Schema.org, SEO utilities, OG images, and the link checker, which reports broken
internal links during development and builds.

- `app/lib/site.ts` owns the site name, canonical URL, slogan, description,
  email, and headquarters. `nuxt.config.ts`, the footer, the OG image template,
  structured data, and `llms.txt` read it, so these facts live in one place.
- The `site` config sets the URL, name, description, English locale, and no
  trailing slash. `NUXT_SITE_URL` overrides the URL, and `NUXT_SITE_ENV` other
  than `production` makes the deployment not indexable.
- The SEO utilities add the canonical link, `og:url`, `og:site_name`,
  `og:type`, and a `max-image-preview` robots tag to every page, and append
  ` | forrrow` to every title. Page titles are therefore written without the
  brand. `app.head` in `nuxt.config.ts` adds `og:locale` as `en_US` and
  `twitter:card` as `summary_large_image` to every page. That card type is the
  only `twitter:*` tag the site emits, because it has no Open Graph equivalent
  and without it X shows a small preview. X reads the title, description, and
  image from Open Graph, and unhead flags the duplicated tags as deprecated, so
  `seo.automaticTwitterTags: false` stops the SEO utilities from inferring them
  and `ogImage.includeTwitter: false` stops the OG image module from adding
  them.
- `app/lib/page-seo.ts` holds the title, description, and OG label of each
  indexable static page, so the pages and `llms.txt` share one copy.
- `usePageSeo` in `app/composables/usePageSeo.ts` sets the title, description,
  Open Graph title and description, and `og:type`, which is `website` unless
  the page passes `article`. Given an image, it shares that image with its
  absolute URL, size, and alternative text. Otherwise it renders the
  `BrandCard` OG image with the title and an optional label, and gives it the
  alternative text `forrrow: <title>`. Every indexable page calls it.
  `ProjectPage` passes the `article` type and `getProjectCoverImage`, the cover
  image or the poster of a video cover, and `BlogPostPage` passes the `article`
  type with the post date as `article:published_time`.
- `app/components/OgImage/BrandCard.takumi.vue` is the generated 1200 by 630
  card, rendered by Takumi in Switzer, which Nuxt Fonts registers globally for
  the renderer. Its colors come from `app/lib/og-image-theme.ts`, because CSS
  variables do not reach the renderer. `zeroRuntime` renders every card once
  at build time into a static `/_og/s/` PNG and ships no renderer with the
  server.
- The sitemap lists every indexable route, including each Work project page
  as soon as its page file exists. robots.txt allows every crawler and links
  the sitemap. Each entry carries a `lastmod` date. `config/page-lastmod.ts`
  reads it at build time from the last Git commit that touched the files that
  own the page's content, such as the page file, its feature components, and,
  for a Work project, its data file and media folder. Shared sections are left
  out so a footer or pricing change does not date every page. A build without
  Git history omits these dates. A blog post's `lastmod` is its `date`
  frontmatter. Add a new static page to the route list in
  `config/page-lastmod.ts`.
- The Courses placeholder sets `robots: false`
  and `ogImage: false` through route rules, so they send `noindex, nofollow`
  in a meta tag and an `X-Robots-Tag` header, stay out of the sitemap, and get
  no OG image. Remove a route's rule when its real page ships. The Privacy
  policy is indexable.
- Schema.org identity is an `Organization` with the logo, email, and address.
  Every page gets `WebSite` and `WebPage` nodes. FaqSection turns the home page
  into an `FAQPage` with one `Question` per visible FAQ item, and each
  service page into one with its own questions. AboutPage marks the About
  page as an `AboutPage`, and `AboutTeamSection` adds one `Person` per founder
  from its member list, with the role as `jobTitle`, the social links as
  `sameAs`, the portrait when there is one, and the organization as
  `worksFor`. Each `Person` has the id `/about#<name>`. ContactPage
  marks the Contact page as a `ContactPage` and passes `structuredData` as
  `false` to its FaqSection, so the shared questions are marked up only once
  across the site. `ProjectPage`
  adds a Home, Work, and project `BreadcrumbList` and a `CreativeWork` with the
  project's absolute URL, cover image, categories as its genre, and the organization
  as its creator. Raw nodes such as `CreativeWork` are not resolved by the
  module, so they use absolute URLs and ids.
- `server/routes/llms.txt.get.ts` builds `/llms.txt` from the site facts, the
  static page copy, and the project list, and is prerendered at build time.

### Known gaps

- The Contact rate limit is an in-memory map, so each server instance counts
  on its own and a cold start resets it. Move it to shared storage if abuse
  gets past it.

## Planned backend structure

Add the remaining directories only when a server feature requires them:

~~~text
server/
  api/              Nitro route handlers
  database/         Schema and generated migrations
  services/         Shared business workflows
  repositories/     Persistence access when abstraction is justified
  utils/            Server-only helpers
shared/
  schemas/          Contracts used by both client and server
  types/            Shared domain types
~~~

A typical request should flow like this:

~~~text
request
  -> route validation
  -> authentication and authorization
  -> service or focused domain function
  -> repository or external service
  -> typed response
~~~

Keep a simple route self-contained when it remains easy to test and understand. Add services or repositories when reuse, transaction boundaries, or complexity makes the separation valuable.

## Backend contract rules

- Validate all external input before domain logic.
- Return intentional public response shapes.
- Map known failures to consistent HTTP status codes.
- Keep database records and third-party payloads behind typed adapters.
- Keep secrets and privileged credentials server-only.
- Use idempotency where a retried mutation could duplicate a payment, message, booking, or content operation.
- Add caching only with a clear invalidation and freshness policy.
- Add background jobs only when work cannot safely finish within the request lifecycle.

## Feature placement workflow

When adding a feature:

1. Identify who owns the data.
2. Identify whether the behavior is local, shared, or server-side.
3. Check for an existing component, composable, utility, token, icon, or schema.
4. Define the smallest public contract.
5. Place the implementation in the lowest suitable layer.
6. Add responsive, accessible, loading, empty, error, and reduced-motion behavior as applicable.
7. Verify that dependency direction still flows downward.

## Architecture change rule

Update this document in the same change when adding a new top-level directory, data layer, state-management system, rendering strategy, external service boundary, or reusable component category.
