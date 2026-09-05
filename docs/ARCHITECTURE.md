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
    cards/
    landing/
    layout/
    shared/
    ui/
  composables/
    useGsap.ts
    useSiteHeaderMotion.ts
    useSmoothScroll.ts
  lib/
    icons.ts
    utils.ts
  plugins/
    lenis.ts
    ssr-width.ts
docs/
public/
nuxt.config.ts
components.json
package.json
~~~

## Layer responsibilities

### Application entry

app/app.vue owns the root application shell. The current app renders the landing experience directly. Add pages only when routing requirements exist, then keep app.vue focused on providers, global layout, and NuxtPage.

### Landing components

app/components/landing contains sections that are specific to the landing experience. A landing section may own static section content and compose cards, shared components, layouts, and UI primitives.

A landing section should not become a general component merely because it contains several elements. Extract only the parts that have a stable reusable contract.

### Layout components

app/components/layout contains site-wide structure such as SiteHeader and SiteFooter. Layout components may use shared components and UI primitives. They should not depend on a landing section.

### Card components

app/components/cards contains reusable content presentation such as case studies, courses, articles, journey steps, and statistics. Cards receive typed content and variants through props. They do not fetch their own page data.

### Shared components

app/components/shared contains small project-wide composition patterns such as SectionHeading and MediaPlaceholder. Shared components must remain independent of a single landing section.

### UI primitives

app/components/ui contains source-owned Shadcn Vue primitives. These components own generic behavior, accessibility, states, sizes, slots, and variants. They must not contain byroose page copy or feature-specific data.

Preserve Reka UI integration, attribute forwarding, data-slot values, keyboard behavior, focus behavior, and CVA contracts when modifying this layer.

### Composables

app/composables contains reusable reactive state, lifecycle behavior, and side-effect integrations.

Use a composable when logic:

- Uses Vue reactivity or lifecycle
- Coordinates a browser or framework integration
- Needs automatic cleanup
- Is reused by multiple components

The existing useGsap composable is the integration boundary for component-owned GSAP animation. Components own their animation intent. The composable owns plugin loading, scoped contexts, media matching, and cleanup.

useSiteHeaderMotion owns the site header's full and compact state transitions,
scroll-direction thresholds, and focus handoff. It composes useGsap and
useSmoothScroll so the layout component remains focused on header structure and
navigation content.

useSmoothScroll is the component-facing contract for the global Lenis instance. It exposes readiness, scrolling, start and stop controls, refresh behavior, and scope-cleaned scroll subscriptions without allowing components to create competing Lenis instances.

### Library modules

app/lib contains pure helpers, shared constants, and stable names.

- icons.ts is the canonical map for shared Lucide icon names.
- utils.ts contains pure class and value helpers.

Library modules must not access the DOM, Vue lifecycle, request state, or component instances.

### Assets and global CSS

app/assets/css/tailwind.css owns:

- Tailwind CSS v4 imports
- OKLCH theme variables
- Shadcn semantic token mappings
- Type and spacing tokens
- Reusable semantic component class groups
- Small reusable surface and pattern utilities
- Global base behavior

Vue templates own local structure and short one-off utility groups. Repeated recipes move to the global component layer or a component variant.

### Plugins

app/plugins contains Nuxt runtime integrations that must run as part of application setup. Keep plugins small. A plugin should configure an integration, not become a general utility collection.

lenis.ts owns the single application Lenis instance and its GSAP ScrollTrigger bridge. It initializes after the application mounts, drives Lenis from the GSAP ticker, updates ScrollTrigger from Lenis scroll events, refreshes measurements after navigation and font loading, and tears everything down with the Vue application.

The default scroller is the browser window. This keeps native scrolling, sticky positioning, anchors, and accessibility behavior. Do not add ScrollTrigger.scrollerProxy for this configuration. Reevaluate the integration only if the application adopts a custom scroll wrapper.

### Public assets

public contains source assets served from root-relative URLs, including images,
the logo, favicon, and robots file. Render images through NuxtImg or NuxtPicture
so Nuxt Image owns responsive sizing and optimization. The central IPX provider
configuration emits WebP for raster images, while components explicitly preserve
vector formats where needed.

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
