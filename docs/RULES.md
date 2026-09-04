# Project rules

These are the mandatory engineering and content rules for byroose.com. They apply to human contributors, Codex, Claude Code, and other AI agents.

## Rule priority

Follow instructions in this order:

1. Current user and system instructions
2. Root AGENTS.md
3. This file
4. Architecture, design system, content, and workflow documents
5. Existing local patterns

When two rules conflict, stop and ask one concise question before making an irreversible or public-facing decision.

## Core project decisions

- The application uses Nuxt 4, Vue 3, and TypeScript.
- Vue components use the Composition API and script setup.
- Prop defaults use reactive destructuring from defineProps.
- withDefaults is not used.
- Styling uses Tailwind CSS v4 with CSS-first OKLCH tokens.
- Repeated utility groups use semantic classes or CVA variants.
- Base UI primitives follow Shadcn Vue and Reka UI patterns.
- Interface icons use Lucide through Nuxt Icon.
- Fonts load through Nuxt Fonts.
- Motion uses the shared GSAP composable and must respect reduced motion.

## General code rules

- Write the smallest complete solution that satisfies the requirement.
- Prefer readable code over clever code.
- Use descriptive names that explain purpose and domain meaning.
- Keep functions focused and keep side effects at clear boundaries.
- Use early returns to reduce nesting.
- Reuse an established pattern before creating another abstraction.
- Extract repeated logic only when the shared contract is clear.
- Do not build speculative features or generic systems without a current use.
- Do not add comments to code. Refactor code until intent is clear from names and structure.
- Do not leave dead code, commented-out code, temporary logs, or unused imports.
- Do not suppress errors with TypeScript directives or lint disable directives.
- Do not use any. Use precise types, unknown with narrowing, or generics.
- Handle failures explicitly. Do not leave empty catch blocks.
- Run independent asynchronous operations in parallel when order does not matter.
- Add a dependency only when existing platform and project tools cannot solve the need cleanly.

## TypeScript rules

- Type public props, emits, return values, API payloads, and shared domain models.
- Prefer string unions over unbounded strings for known variants.
- Prefer type inference for obvious local values.
- Keep types close to their domain. Move a type to a shared module only when multiple boundaries consume it.
- Narrow unknown external data before use.
- Use readonly data when mutation is not part of the contract.
- Avoid unsafe type assertions. Validate the value or redesign the boundary.

## Vue component rules

Use this prop style:

~~~vue
<script setup lang="ts">
const {
	href,
	variant = 'ghost',
	size = 'sm',
	icon,
	disabled = false,
} = defineProps<{
	href?: string
	variant?: 'solid' | 'ghost'
	size?: 'sm' | 'lg' | 'xl'
	icon?: string
	disabled?: boolean
}>()
</script>
~~~

- Do not use withDefaults.
- Keep props explicit and narrow. Do not pass a broad configuration object when named props are clearer.
- Use defineEmits for events and defineModel only for a genuine two-way value contract.
- Keep props read-only and emit changes to the owner.
- Derive values with computed instead of synchronizing duplicate state with watch.
- Use watch only for side effects.
- Use template refs instead of DOM queries. Prefer useTemplateRef when the installed Vue version supports it.
- Use stable keys based on domain identity, never array indexes for reorderable lists.
- Keep templates declarative. Move complex expressions into computed values or functions.
- Preserve attribute forwarding, keyboard behavior, focus states, and data attributes in UI primitives.
- Use slots when consumers need controlled composition. Do not create a prop for every possible block of markup.

## Reuse boundaries

Choose the narrowest correct home:

- **UI component:** a reusable visual primitive with behavior and variants.
- **Shared component:** a project-wide composition pattern.
- **Card component:** a reusable content presentation contract.
- **Layout component:** site-wide structure such as the header or footer.
- **Feature or landing component:** section-specific composition and content.
- **Composable:** reusable reactive state, lifecycle behavior, browser integration, or side effects.
- **Utility:** a pure, framework-independent function.
- **Constant module:** stable names, configuration, or content shared by multiple consumers.

Do not create a composable for a pure formatting function. Do not place DOM side effects in a utility. Do not make a global component for markup used once unless it has an independent responsibility.

## Nuxt rules

- Follow the app directory structure documented in ARCHITECTURE.md.
- Use Nuxt auto-imports where they improve consistency. Use explicit imports when they make ownership clearer or avoid naming ambiguity.
- Use Nuxt useRoute inside application code.
- Use NuxtLink for internal navigation.
- Use useFetch or useAsyncData for SSR-aware data loading.
- Do not wrap initial page data in onMounted.
- Use useState for SSR-safe shared state when Pinia is not justified.
- Keep secrets in server runtime configuration. Expose only intentional public values through runtimeConfig.public.
- Keep browser globals, measurements, and DOM access inside onMounted, client plugins, or import.meta.client guards.
- Never use Date.now, Math.random, or unstable browser-derived values during the first server render.
- Use ClientOnly only when the feature truly cannot render on the server.
- Lazy load heavy client-only features when they are not needed above the fold.
- Keep page metadata truthful, unique, and aligned with visible content.

## Frontend rules

- Build mobile-first, then enhance at sm, md, lg, and xl breakpoints.
- Preserve a clear heading hierarchy and one primary H1 per page.
- Use semantic HTML before adding ARIA.
- Every interactive control must work with a keyboard and show a visible focus state.
- Icon-only controls require an accessible name.
- Images require accurate alternative text or an empty alt value when decorative.
- Use buttons for actions and links for navigation.
- Keep touch targets comfortable on phones and tablets.
- Avoid horizontal overflow at supported viewport widths.
- Respect prefers-reduced-motion and never make animation required to understand or operate content.
- Treat loading, empty, error, disabled, and success states as part of the component contract.

## Tailwind and Shadcn rules

- Use semantic tokens such as bg-background, text-foreground, bg-primary, and border-border.
- Do not place raw hexadecimal, RGB, HSL, or OKLCH color values in Vue templates.
- Do not use arbitrary values when a documented token or standard scale value is suitable.
- Keep one-off layout utilities in the template when the class list remains short and clear.
- Move repeated visual recipes into a semantic class group under the appropriate Tailwind layer.
- Use CVA for a component with meaningful variants, sizes, or states.
- Keep source-owned Shadcn components generic. Put byroose-specific composition in cards, shared components, layouts, or feature components.
- Extend existing primitives instead of copying almost identical components.
- Preserve dark-mode token pairs even when a feature launches in the light theme first.
- Add or change tokens through the process in DESIGN_SYSTEM.md.

## Icon rules

- Use Nuxt Icon with Lucide names from app/lib/icons.ts.
- Add a shared semantic icon name to the icon map before repeating it in templates.
- Do not use emoji, Unicode arrows, inline SVG copies, or a second icon library for interface controls.
- Keep decorative icons hidden from assistive technology.
- Keep icon size, stroke, wrapper radius, and spacing inside the owning component variant.

## Motion rules

- Use app/composables/useGsap.ts for GSAP access and cleanup.
- Scope selectors to a component root.
- Animate transform and opacity properties where possible.
- Register and load plugins only when needed.
- Revert contexts and media queries when the Vue scope is disposed.
- Provide a reduced-motion outcome that preserves all information.
- Do not add motion only to decorate an otherwise complete feature. Motion must support hierarchy, feedback, continuity, or brand character.

## Backend rules

The project has no application backend yet. When server features are added:

- Use Nuxt Nitro routes in server/api for HTTP endpoints.
- Keep route handlers thin. Parse input, authenticate, authorize, call domain logic, and map the response.
- Validate route parameters, query values, headers, and bodies at the boundary with Zod or an equivalent typed schema.
- Use clear resource-oriented routes and correct HTTP methods and status codes.
- Keep business logic in focused services when it is shared or too complex for a handler.
- Add repositories only when persistence logic needs a stable abstraction.
- Return consistent error shapes without stack traces or internal implementation details.
- Keep private credentials and privileged API calls on the server.
- Enforce authorization on every protected resource, not only in the interface.
- Select only required database fields and prevent repeated per-item queries.
- Use transactions for related writes that must succeed or fail together.
- Use structured logs and request correlation where useful. Never log secrets, access tokens, payment data, or sensitive personal data.
- Design mutation endpoints to handle retries safely when duplicate execution would be harmful.
- Add rate limits and abuse protection to public forms, authentication, uploads, and expensive operations.
- Do not introduce service, repository, queue, or cache layers until the actual requirement justifies them.

## Content and SEO rules

- Follow CONTENT_GUIDE.md for all public copy and metadata.
- Never use an em dash.
- Write for people first and search discovery second.
- Give every page one clear purpose and one primary search intent.
- Keep claims specific, honest, and supportable.
- Use descriptive headings and links. Do not write vague link text such as click here.
- Do not stuff keywords, hide text, or add schema that is not represented on the page.

## Verification rules

- Match verification effort to the risk of the change.
- Run npm run typecheck after TypeScript, Vue, Nuxt configuration, or dependency changes.
- Run npm run build when changing rendering, modules, server behavior, build configuration, or release-critical code.
- Test interactive states and keyboard behavior after component changes.
- Check 390px, 768px, and 1440px widths after layout changes.
- Check reduced motion after animation changes.
- Check server rendering and hydration after client behavior changes.
- Verify public content for spelling, factual accuracy, heading structure, metadata, and the no em dash rule.
- Do not claim a check passed unless it was run.

## Do not

- Do not use withDefaults.
- Do not add code comments.
- Do not use em dashes.
- Do not copy a component to make a minor variant.
- Do not bypass design tokens with hardcoded colors.
- Do not mix icon libraries.
- Do not fetch initial page data only on the client.
- Do not mutate props.
- Do not leak server secrets into public runtime configuration.
- Do not commit generated build output, temporary files, local secrets, or unrelated changes.
- Do not force push or rewrite shared Git history.
- Do not add Co-Authored-by or AI attribution to commits.
