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
  assets/
    css/
      lenis.css
      tailwind.css
  components/
    about/
    cards/
    landing/
    layout/
    shared/
    ui/
  composables/
    useAboutHeroMotion.ts
    useAboutHeroTrail.ts
    useAboutSectionMotion.ts
    useArrowSwapHover.ts
    useBlogMotion.ts
    useCookieBannerMotion.ts
    useDrawnLineMotion.ts
    useFaqMotion.ts
    useFitText.ts
    useFooterMotion.ts
    useHomeHeroScrollMotion.ts
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
    usePageTransitionMotion.ts
    useServicesMotion.ts
    useSiteHeaderMotion.ts
    useSiteMenuMotion.ts
    useSmoothScroll.ts
    useStudioMotion.ts
    useStudioRibbonMotion.ts
    useTrailingTooltip.ts
    useWorkLineMotion.ts
    useWorkMotion.ts
  lib/
    about-line-path.ts
    char-reveal.ts
    drawn-line-path.ts
    icons.ts
    image-parallax.ts
    ribbon-path.ts
    split-text.ts
    stack-reveal.ts
    surfaces.ts
    swap-timing.ts
    utils.ts
    word-reveal.ts
    work-line-path.ts
  layouts/
    default.vue
  pages/
    about.vue
    blog.vue
    contact.vue
    courses.vue
    index.vue
    journey.vue
    privacy.vue
    services.vue
    terms.vue
    works.vue
  plugins/
    lenis.ts
    page-transition.ts
    ssr-width.ts
  router.options.ts
docs/
public/
nuxt.config.ts
components.json
package.json
~~~

## Layer responsibilities

### Application entry

app/app.vue owns the root application shell and renders NuxtLayout around NuxtPage, which receives the page transition hooks from usePageTransitionMotion. app/layouts/default.vue owns the persistent site header, main landmark, footer, page transition shade, and cookie notice around every route. app/pages/index.vue owns the home route and composes the landing experience. app/pages/about.vue renders the About experience from app/components/about. The remaining page files own the Works, Services, Journey, Courses, Blog, Contact, Terms, and Privacy routes as focused route-level views. The Terms and Privacy routes are placeholders that the footer links to until the real policies exist. Keep app.vue focused on providers, NuxtLayout, and NuxtPage as routes are introduced.

### Landing components

app/components/landing contains sections that are specific to the landing experience. A landing section may own static section content and compose cards, shared components, layouts, and UI primitives.

A landing section should not become a general component merely because it contains several elements. Extract only the parts that have a stable reusable contract.

### About components

app/components/about contains the About route's sections. AboutPage composes
AboutHero, AboutTeamSection, AboutTrustSection, AboutBrandsSection, and
AboutCtaSection, and app/pages/about.vue renders it with the route metadata.
AboutPage wraps the trust, brands, and call to action sections in an isolated
`about-story` block that holds their shared DrawnLine and marks the brands and
call to action roots with `data-drawn-line-anchor`. AboutTeamSection holds its
own DrawnLine.
AboutTitle renders a title from explicit lines, each in its own mask, with an
optional underlined word that carries a WaveUnderline. AboutMediaFrame wraps
any image or placeholder in a frame and a parallax layer. AboutStatement is the
large split statement, placed in the right two thirds of its section, shared by
the trust and brands sections, and
AboutSectionHeading pairs a title with a cycling image. AboutTeamMember shows a
portrait, or a placeholder when it receives none, a name, a role, and a round
action. It owns a Dialog whose open state both the action and a click anywhere
on the card set, locks the smooth scroll while it is open, and emits `activate`
and `deactivate` on pointer enter and leave. AboutMemberDialog renders the
dialog content: the portrait, the name, the role, the social links, the bio,
and the close action. AboutTeamSection owns the member data, including each
bio and social link, and the shared TrailingTooltip the cards drive. The sections own their copy. They do not depend
on landing sections.

### Layout components

app/components/layout contains site-wide structure such as SiteHeader, SiteMenu,
SiteMenuLink, SiteNavLink, SiteCookieBanner, SiteScrollbar, and SiteFooter. Layout components
may use shared components and UI primitives. They should not depend on a landing
section.

SiteCookieBanner owns the cookie notice. Its consent value lives in the
byroose-cookie-consent cookie through Nuxt's useCookie, so the server and the
first client render agree on whether the notice is visible and an accepted or
declined notice never reappears. The layout withholds the banner until the home intro
reports a complete state, so it never paints over the preloader.

SiteScrollbar owns the overlay scroll thumb that replaces the hidden root
scrollbar. It measures native scroll and document geometry only after mount, so
it adds nothing to the server output. It routes thumb dragging through
useSmoothScroll rather than writing the scroll position itself.

### Card components

app/components/cards contains reusable content presentation such as case studies, courses, articles, journey steps, and statistics. Cards receive typed content and variants through props. They do not fetch their own page data.

### Shared components

app/components/shared contains small project-wide composition patterns such as SectionHeading, MediaPlaceholder, SplitText, and TrailingTooltip. SplitText renders its complete text during SSR, applies the GSAP SplitText plugin after mount, and emits typed runtime parts for component-owned animation. It reverts its split through the page transition's deferred cleanup, so a leaving page keeps its split text until the incoming page covers it. TrailingTooltip renders through Nuxt's shared teleport target, receives its active state, image, and optional label from its owner, and owns its fine-pointer tracking, reduced-motion state, thumbnail layer list, and GSAP cleanup. It keeps the outgoing thumbnail mounted until the incoming one has finished revealing, so the owner still passes a single image string and never manages the transition. Its owner loads it asynchronously only after mount when the primary input supports both hover and fine pointing, so touch-first devices do not request or mount the component. ImageCycle cuts through a list of decorative images on an interval, `750ms` by default, without a crossfade. It cycles only while it is on screen and never under reduced motion. DrawnLine renders the empty decorative SVG and path that useDrawnLineMotion fills and draws, with the shared stroke width, round caps, hidden resting state, reduced-motion visibility, and below-`lg` hiding. Its path strokes `currentColor`, so each owner sets the color, opacity, position, size, and overflow on the root. Shared components must remain independent of a single landing section.

### UI primitives

app/components/ui contains source-owned Shadcn Vue primitives. These components own generic behavior, accessibility, states, sizes, slots, and variants. They must not contain byroose page copy or feature-specific data. The dialog primitives wrap the Reka UI Dialog: DialogContent portals itself with its overlay, keeps the Shadcn close button behind a `showCloseButton` prop that defaults to `true`, and accepts an `overlayClass`.

Preserve Reka UI integration, attribute forwarding, data-slot values, keyboard behavior, focus behavior, and CVA contracts when modifying this layer.

### Composables

app/composables contains reusable reactive state, lifecycle behavior, and side-effect integrations.

Use a composable when logic:

- Uses Vue reactivity or lifecycle
- Coordinates a browser or framework integration
- Needs automatic cleanup
- Is reused by multiple components

The existing useGsap composable is the integration boundary for component-owned GSAP animation. Components own their animation intent. The composable owns plugin loading, scoped contexts, media matching, and cleanup.

useHomeIntroMotion owns the home route's entry sequence, geometry measurements, native and Lenis scroll lock, responsive timeline, shared layout-header reveal state, and cleanup. Its preloader stage builds on the shared stack-reveal recipe in app/lib/stack-reveal.ts. It receives the hero title and description splits from LandingPage and reveals them with the hero call to action. It shows every `data-home-intro-header` element, which covers the header and its separate logo layer, and rises their pieces from `getHeaderRevealParts` in visual order without fading the header. It runs the preloader and the center expansion only while Nuxt is hydrating a direct home request. A client-side entry arrives through a page transition: it shows the hero cards at rest in their grid immediately, lowers the header pieces into their masks, and builds its reveal timeline only when usePageTransition reports the reveal point, so the timeline starts at its own beginning instead of absorbing the incoming page's mount work. It holds the scroll through the shared Lenis lock rather than stopping Lenis directly, and marks the intro complete if the page is left before the intro finishes, so the header never stays hidden on the next route.

useHomeHeroScrollMotion owns the scroll-linked transition between the home hero
and Studio section. It waits for the intro to complete and lets the hero leave
through normal document scrolling while the featured retained card moves to the
viewport center and expands. The transition runs only from `lg` upward, where
LandingPage supplies a full-viewport empty scroll space before Studio. Below `lg`
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
length, and scrubs one DrawSVG timeline through the segments in draw order. It
rebuilds the geometry and the drawing inside the same GSAP media context when
the section resizes. Reduced motion keeps the measured ribbon fully drawn
through CSS.

useWorkMotion owns the work section: the centered title characters, each
case study's stacked media reveal, its scrubbed image parallax, and the
staggered rise of its masked text lines. WorkSection supplies the section scope
and the title split; the case study card supplies the `data-work-case`,
`data-work-case-layer`, `data-work-case-image`, and `data-work-case-reveal`
hooks the composable resolves inside that scope. One timeline per card carries
both the media reveal and the text lines, so their relative timing cannot drift. Reduced motion resolves the
title to visible characters and leaves every card in its resting state. It also
owns the handoff from the last card to the MoreWorksPanel. It slows and fades
the `data-work-case-list` element and brings in the `data-work-more-panel`
surface inside the `data-work-more` track, because that handoff choreographs
WorkSection's own cards against its closing panel.

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
scrubbed reveal that brings the words in from their sides character by character
while the image scales up from zero, and the on-screen state that drives image
cycling. The panel component owns the image list and the cycling interval, and
the composable only reports whether cycling should run. The panel emits its
hover state with its current image and label, and WorkSection feeds them to the
same TrailingTooltip the case cards use.

useServicesMotion owns the services section's motion: the pinned intro panel's
blurred word reveal and, for each `data-service-panel`, the slowed travel of
the children of its `data-service-content` block, the description line rise
anchored to the static service title, and the scrubbed bottom origin image entry
and top origin image exit with the scroll hold between them that keeps the image
near the viewport center. It returns `introRevealed`, which turns true once
the scrubbed intro reaches the end of its last word and false again above that
point, and ServicesSection feeds it to the `drawn` prop of the WaveUnderline
under "You?". It also owns the scrubbed rise of a dark panel's
`data-service-backdrop` from the viewport bottom center, and its curved
exit that reaches down toward the journey title as the panel leaves. Because the content block moves, those triggers are
scroll positions computed from untransformed layout rather than trigger
elements. On touch devices its media context drops the slowed travel, the
hold, and the backdrop rise, so the content stays in place, the dark backdrop
is shown at rest, and each image scales in once from a trigger on its frame. ServicesSection owns the copy, the image links, and
the tooltip handlers. The composable waits until the intro
lines and every description have reported their splits.
Reduced motion resolves every reveal to visible content without the pin.

useJourneyMotion owns the journey section's motion: the one-time character
spawn of the `data-journey-title` heading beneath the services section's
exiting dark curve, the stacking pin that scales, tilts, and fades each
`data-journey-slide` card except the last while the next one covers it, and
each card's number, title line, description line, call to action, and image
reveals. It waits for the title's character split and every card's title and
description splits, rebuilds a card title or description reveal when its lines
re-split before it plays, and shows everything at rest without the pin under
reduced motion.
JourneySection owns the step content and the slide wrappers, and
JourneyStepCard owns the card layout and emits its title and description
splits.

useBlogMotion owns the blog section's reveal: the heading's title words and
the `data-blog-cta` action rising from its `data-blog-cta-mask`, and for each
`data-blog-card` the title line rise and the `data-blog-card-meta` rise. The
cards themselves stay at rest. Cards that share a layout row are staggered from
their measured `offsetTop` when they enter. It waits for the title's word split
and every card title's line split, rebuilds a card's reveal when its title
re-splits before it plays, and shows everything at rest under reduced motion.
BlogSection owns the article content and collects the card title splits, and
BlogCard owns the card layout and emits its title split.

useFaqMotion owns the FAQ section's motion: the `data-faq-title` line reveal,
the staggered rise of each `data-faq-item`'s `data-faq-rise` question and icon
with its `data-faq-divider` draw, and the accordion toggle. It watches the
open item index and tweens the force-mounted `data-faq-content` region's
height and the `data-faq-icon-cross` bar's rotation, then reveals that item's
answer lines. It waits for the title's line split, rebuilds the title reveal
when the lines re-split before it plays, and resolves every reveal and toggle
instantly under reduced motion. FaqSection owns the copy, the controlled
accordion value, and the title and answer splits.

useAboutHeroMotion owns the About hero. It waits for the description split
and the page transition's reveal point, then rises the title lines and, just
before they land, the description lines, and scrubs the hero content down at half the
scroll speed and fades it out while the hero leaves, so the team section covers it. It returns
`revealed`, which lifts the hero's hidden CSS rest state.

useAboutHeroTrail owns the About hero's cursor image trail. After the page
transition's reveal point, inside a GSAP media context that matches only a fine
hover pointer with motion allowed, it returns `armed` as true and listens to
mouse pointer movement on the hero. It adds up the travelled distance and,
each time it passes a third of the viewport width, plays the next
`data-about-hero-trail-item` of the `data-about-hero-trail` layer at the
pointer. AboutHero owns the image list and renders that layer only while
`armed` is true, so the server output and touch devices never request it.

useAboutSectionMotion owns the scroll reveals of one About section. Inside its
scope it reveals the `data-about-title` lines, clip reveals and parallaxes
every `data-about-media` frame through its `data-about-media-layer`, rises the
`data-about-rise` items of every `data-about-rise-group` from their
`data-about-rise-mask`, and rises the lines of every `data-about-text` split,
matched by order to the `textSplits` it receives. It returns `titleRevealed`,
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
element, which the component's own font size must multiply. JourneySection
uses it for its title.

useTrailingTooltip owns the shared TrailingTooltip state: the active flag, the
image, label, and size, the 200ms close delay, and whether the fine-pointer tooltip
should load. WorkSection, ServicesSection, and AboutTeamSection compose it and
keep their own TrailingTooltip instance. `show` takes an optional image, so a
text-only tooltip opens without one.

useSiteHeaderMotion owns the site header's full and compact state transitions,
the top-of-page scroll thresholds, and responsive animation states. It also
owns the header reveal on routes other than home and the `navRevealed` flag
that lifts the hidden CSS rest state of the links, the logo, and the actions
once a reveal has finished, whether it ran there or in the home intro. It
exports `getHeaderRevealParts`, which collects the `data-home-intro-nav-item`
links and `data-header-rise` targets from the header and logo layer in visual
order along with their `data-header-rise-mask` wrappers, so both reveals rise
the same pieces. When a page transition reaches its `moving` phase, it switches the header to
its full state, because the real header is off screen and the incoming page
lands at the top. It composes
useGsap and useSmoothScroll so the layout component remains focused on header
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
such as the services backdrop, only counts once it actually reaches the probe.
Mark the painted surface rather than a transparent wrapper, because a wrapper's
box is hit even where nothing dark is painted.

useSiteMenuMotion owns the compact navigation panel's trigger-relative fixed
geometry, translated two-stage scale reveal, staggered content entrance,
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
scales away to its top center, its copy scales up from its bottom center, and an
underline draws outward from its center, all on the More works action's
`power4.inOut` timing. It tracks pointer and visible keyboard focus together and
resolves instantly under reduced motion. SiteNavLink owns the markup.

useHoverBounce owns the hover and press scale states of action surfaces. It
receives a target plus optional hover and press behavior, composes useGsap, and
keeps its listeners and tweens inside a motion media context. The button
primitive enables press feedback for every size and hover bounce for call to
action sizes, and SiteMenu enables press feedback only on the compact navigation
control. This leaves generic markup, variant contracts, and
accessibility behavior in their owning components.

useHoverRollover owns the layered hover rollover. It reads independent text and
layer groups from a target through their data attributes, coordinates their GSAP
timelines, and tracks pointer and focus state together. It only animates elements
the consuming components render. Those components own the markup, the semantic
layer and copied-text colors, the paired glyphs, and the clipped positioning
host. The text group is optional: an icon-only host animates its layers and
glyphs and takes its covered icon color from the final layer.

useArrowSwapHover owns the arrow swap hover: a slow-fast-slow scale and a swap
between the glyphs marked `data-arrow-swap-glyph` and
`data-arrow-swap-glyph-copy`. Both run on one shared `power4.inOut` timing. Its
options choose a `diagonal` swap, the default used by the More works circle, or
an `up` swap, and can turn the scale off, as the footer Back to Top button does. It
tracks pointer and focus state together, scales only for hover-capable
pointers with motion allowed, and resolves the swap instantly under reduced
motion. It stays separate from useHoverBounce and useHoverRollover so the
elastic CTA contract stays untouched.

useCookieBannerMotion owns the cookie notice's entrance and exit. It returns the
three Vue transition hooks that SiteCookieBanner binds, so the component keeps
its markup and consent intent while the composable owns the tweens, the
reduced-motion outcome, and tween cleanup. Because the hooks resolve Vue's done
callback, the notice stays mounted until its exit finishes.

useSmoothScroll is the component-facing contract for the global Lenis instance. It exposes readiness, scrolling, the scroll lock, the scroll reset, refresh behavior, the refresh hold, and scope-cleaned scroll subscriptions without allowing components to create competing Lenis instances. `lock` returns a release function, and Lenis only runs while no lock is held, so the page transition and the home intro can hold the scroll at the same time without either one restarting it early.

usePageTransition is the component-facing contract for the page transition plugin. It exposes `isActive`, `phase`, which is `preparing` from the navigation until the pages start moving, `moving` while they move, and `idle` otherwise, `deferCleanup`, which runs a cleanup immediately or, while a transition runs, after the leaving page has been covered and removed, and `waitForReveal`, which resolves at the transition's reveal point or immediately when no transition runs. useGsap routes its scope cleanup through `deferCleanup`, so a leaving page keeps every animation, pin, and inline style in place while it is visible.

usePageTransitionMotion owns the overlap page transition choreography and returns the Vue transition hooks that app.vue passes to NuxtPage. When the leaving page is handed over, before the incoming page mounts, it freezes the leaving scene: it pauses every ScrollTrigger without reverting it, anchors active pins to the page, copies the header and every visible `data-page-transition-overlay` element, such as the open site menu panel, offsets the leaving page and its followers by the current scroll position, and resets the scroll to the top. The incoming page therefore builds its scroll-linked motion against the scroll position it will land at, and the paused triggers that outlive the leaving page, such as the footer reveal, resume through `deferCleanup` before the final refresh. It sets the incoming page up as a fixed surface before insertion, moves the leaving page and every `data-page-transition-follow` element together, replaces every `data-page-transition-header` element with an inert static copy that leaves with them while the real header rises with the incoming page, fades the layout's `data-page-transition-shade` element, and restores normal flow in one task when the timeline ends.

### Library modules

app/lib contains pure helpers, shared constants, and stable names.

- char-reveal.ts owns the shared character rise recipe. It appends a set and a
  staggered rise to a timeline it is handed, so any character title can share
  the work title's timing from one definition. Like stack-reveal.ts, it never
  queries the DOM or creates its own timeline.
- icons.ts is the canonical map for shared Lucide icon names.
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
- stack-reveal.ts owns the shared stacked scale-up recipe. It appends the lead
  and follower tweens to a timeline it is handed, so the home preloader and the
  work section's media reveal keep identical timing from one definition. It
  never queries the DOM or creates its own timeline, which keeps trigger and
  lifecycle ownership with the calling composable.
- surfaces.ts is the canonical map for semantic surface and foreground tone names.
- swap-timing.ts owns the named swap timing: `swapDuration` and `swapEase` for
  hovers and toggles, and the programmatic scroll bounds `swapScrollDuration`
  and `swapScrollMaxDuration` with `getSwapScrollDuration`, a pure function
  that turns a scroll distance and viewport height into a duration.
  useArrowSwapHover, useNavLinkMotion, useFaqMotion, and the Lenis plugin
  import it instead of repeating the values.
- word-reveal.ts owns the shared masked word rise recipe, its `top 82%` start,
  and its two staggers. Callers may override the stagger, the duration, and
  the ease. The Studio section and the services panels both append it to their
  own timelines, so their word reveals share one recipe. It also exports
  `navRevealStagger`, which the home intro and the site header share for the
  navigation link rise, and the line reveal timing, `lineRevealDuration`,
  `lineRevealEase`, and `lineRevealStagger`, which the services descriptions
  and the journey step cards share. `titleLineRevealOffset` and
  `titleLineRevealStagger` hold the padded title line rise, `150` percent
  with a `0.1s` stagger, which the About titles use.
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

page-transition.ts owns the page transition lifecycle. A successful navigation to a different path begins a transition: it takes a Lenis lock and a refresh hold, so nothing scrolls or remeasures while two pages overlap, and it blocks further page navigations until the transition finishes. Finishing runs the deferred cleanups of the leaving page, resets the scroll to the top, releases the lock, and releases the hold, which refreshes Lenis and ScrollTrigger once against the final layout. If no transition hook claims a navigation by `page:finish`, or the app errors, it finishes immediately so the lock can never stick.

app/router.options.ts disables the Nuxt router scroll behavior, because the router would otherwise scroll the window while the leaving page is still visible. The page transition owns the scroll position after every page change, so the browser back button also lands at the top of the page.

The default scroller is the browser window. This keeps native scrolling, sticky positioning, anchors, and accessibility behavior. Do not add ScrollTrigger.scrollerProxy for this configuration. Reevaluate the integration only if the application adopts a custom scroll wrapper.

### Public assets

public contains source assets served from root-relative URLs, including images,
the logo, favicon, and robots file. Render images through NuxtImg or NuxtPicture
so Nuxt Image owns responsive sizing and optimization. Raster images go through
the Vercel provider, which emits WebP and only accepts widths listed in
`image.screens`, because that list becomes the Vercel image size allowlist.
Optimized images are cached for one day through `image.vercel.minimumCacheTTL`,
so a replaced image can stay stale for returning visitors until that expires.
Give an updated image a new file name when it must appear immediately. SVG
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

## Planned backend structure

No application backend exists yet. Add these directories only when the first server feature requires them:

~~~text
server/
  api/              Nitro route handlers
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
