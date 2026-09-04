# byroose design system

The design system keeps the original landing-page character while following
Shadcn Vue and Tailwind CSS v4 conventions. Components own behavior and variants;
the global stylesheet owns semantic tokens and reusable Tailwind class groups.

## Principles

- Preserve the bold editorial character of the original landing concept.
- Use a small number of strong colors with generous neutral space.
- Keep typography direct, oversized, and easy to scan.
- Make touch, focus, and responsive behavior part of every component contract.
- Prefer semantic tokens and named variants over isolated visual values.
- Keep templates readable by grouping repeated Tailwind recipes.
- Add a token, component, or abstraction only when it has a clear role.

## Theme

Theme values live in `app/assets/css/tailwind.css` as OKLCH variables. Shadcn's
standard surface pairs (`background`/`foreground`, `card`/`card-foreground`,
`primary`/`primary-foreground`, and so on) are the default API. Brand extensions
cover blue, green, butter yellow, violet, pink, cream, soft copy, and subtle copy.

Use semantic utilities such as `bg-primary`, `text-muted-foreground`, and
`border-border`. Do not add raw hexadecimal colors to Vue templates. New theme
tokens belong in `:root` and `.dark`, then must be exposed through `@theme inline`.

The light theme is the current product baseline. Dark theme values already exist
and must remain valid when tokens change, but dark-mode launch requires a complete
visual and accessibility review.

### Current palette

| Token | Visual role | Intended use |
| --- | --- | --- |
| `background` | Warm cream | Main page canvas |
| `foreground` | Near-black ink | Primary text and dark surfaces |
| `card` | White | Elevated and contained content |
| `primary` | Orange-red | Primary actions, emphasis, and high-energy sections |
| `secondary` | Cobalt blue | Alternate brand surfaces and supporting emphasis |
| `brand-green` | Saturated green, `#0B9E5A` | Positive editorial surfaces and varied content cards |
| `brand-yellow` | Butter yellow, `#F8E5AA` | Warm editorial surfaces and selective highlights |
| `brand-violet` | Vivid violet, `#7C3AED` | Expressive editorial surfaces and selective highlights |
| `accent` and `brand-pink` | Soft pink | Playful highlights and alternate surfaces |
| `muted` | Pale warm neutral | Quiet backgrounds and placeholders |
| `brand-soft` | Mid neutral | Secondary labels and low-emphasis copy |
| `brand-subtle` | Dark neutral | Editorial body copy below primary emphasis |
| `destructive` | Alert red | Destructive and error actions only |
| `border`, `input`, and `ring` | Semantic controls | Boundaries, fields, and focus indicators |

`brand-blue`, `brand-pink`, and `brand-cream` are explicit brand aliases. Generic
components should prefer `secondary`, `accent`, and `background`. Brand aliases
are appropriate when the color itself is part of a byroose composition.

Orange, blue, green, and violet surfaces use white foregrounds. Yellow and pink
surfaces use dark ink foregrounds. Keep each brand color paired with its
foreground token so color behavior remains consistent in both themes.

### Adding colors

A new color must fill a role the existing palette cannot express. Before adding it:

1. Name the semantic purpose, not only the hue.
2. Define the base token and a readable foreground pair in `:root`.
3. Define the equivalent dark-theme values.
4. Expose both tokens through `@theme inline`.
5. Verify text, icon, border, focus, hover, and disabled contrast.
6. Add a reusable surface utility only when more than one component needs it.
7. Update this palette table in the same change.

Do not create numbered brand shade scales without a concrete use. Prefer a small
semantic palette over many near-duplicate colors.

## Typography

Inter is the primary font and loads through Nuxt Fonts. Do not add font link tags
or component-level font imports.

- `text-hero` is reserved for the primary landing statement.
- `text-section` is the default major section heading.
- `text-statement` supports large editorial body statements.
- `text-service` supports interactive service titles.
- `text-journey` and `text-step` support the oversized process composition.
- Standard Tailwind sizes cover body copy, labels, metadata, and controls.

Use sentence case for small interface text and card metadata. Do not use expanded
uppercase styling for these elements. Eyebrows are not part of the interface
hierarchy. Promote a meaningful section label to a semantic heading, or remove a
decorative label when it does not add useful structure.

Use tight tracking only for large display text. Body copy should use comfortable
line height and a readable measure. Do not choose heading elements by visual size;
preserve semantic heading order and apply visual tokens separately.

## Spacing and layout

`spacing-page` controls responsive horizontal page padding. `spacing-section`
controls the main vertical rhythm. Reuse these tokens before adding section-specific
clamp values.

Use standard Tailwind spacing for local gaps, padding, and alignment. An arbitrary
value is acceptable only when it preserves an intentional source proportion that
cannot be represented by the existing scale. If it repeats, promote it to a token
or semantic class group.

Primary content should remain fluid. Use max-width constraints to protect reading
measure, not to force a fixed desktop canvas.

## Radius and surface hierarchy

The base radius is `1rem`. Cards may use larger radius tokens to create editorial
softness. Controls use `radius-action`.

Action icon wrappers use `radius-action-icon`, calculated from the outer action
radius minus the shared inset. This keeps the outer and inner curves concentric.
Do not tune the icon wrapper radius independently inside a button size.

Use borders before shadows for most containment. Add a shadow only when elevation
communicates layering, such as an open mobile menu or floating overlay.

## Tailwind class groups

Repeated visual recipes live under `@layer components`. Examples include
`section-title`, `hero-card`, `course-card`, and `site-nav-link`. Small reusable
surface and media recipes use Tailwind v4 `@utility`, such as `surface-blue` and
`pattern-orange`.

Use direct Tailwind utilities in templates for one-off layout adjustments of a
few classes. When the same recipe appears twice, give it a semantic class group
or move it into a component variant.

Use this decision order:

1. Existing semantic class group
2. Existing component or CVA variant
3. A short one-off utility list
4. A new semantic class group for a repeated recipe
5. A new token when multiple recipes share the same design value

Do not hide all utilities behind a class name. A semantic group should represent
a recognizable design concept, not a random collection created only to shorten a
template.

## Component layers

- `components/ui`: source-owned Shadcn primitives. Keep `data-slot`, CVA variants,
  focus states, disabled states, and attribute forwarding intact.
- `components/shared`: small project-wide composition helpers such as section
  headings and media placeholders.
- `components/cards`: reusable content cards with typed props and semantic
  variants.
- `components/layout`: site-level header and footer.
- `components/landing`: page sections that own content data and compose the
  layers above.

Props use Vue's reactive destructuring syntax. Static primitive defaults can be
declared directly in the destructure. Array and object defaults can also use
native destructuring defaults. Do not use `withDefaults`.

### Variant rules

- Use CVA when a primitive has named visual variants, sizes, or state combinations.
- Keep variant names semantic, such as `solid`, `ghost`, `cta-sm`, or `cta-lg`.
- Keep page-specific color combinations out of a generic primitive unless they
  are established design-system variants.
- Prefer slots for flexible content and typed props for controlled visual behavior.
- Keep default behavior useful without requiring every prop.
- Preserve focus, disabled, loading, and pressed states across every variant.

## Icons and action buttons

UI icons use the Lucide Iconify collection through Nuxt Icon. Canonical names
live in `app/lib/icons.ts`; add shared semantic icons there instead of placing
Unicode glyphs or package-specific icon components in templates. The collection
is installed locally and the known icons are client-bundled, so rendering never
depends on the public Iconify API.

`ButtonIcon` owns the icon tile, tone, and icon-size contract. The `cta-sm` and
`cta-lg` button variants keep a compact 4px top, right, and bottom inset so the
tile sits against the action edge. The icon tile radius is derived from the
button radius minus that shared inset, keeping both curves visually concentric
at every supported button size.

Icon names that express a repeated meaning belong in `app/lib/icons.ts`. A
one-time decorative icon may use a direct Lucide collection name when a semantic
alias would not improve clarity.

## Responsive rules

Build mobile-first with Tailwind's standard `sm`, `md`, `lg`, and `xl`
breakpoints. Cards stack on phones, become two-column layouts on tablets where
space allows, and expand to their full editorial grids on desktop. Keep a zero
horizontal-overflow check at 390px, 768px, and 1440px in visual QA.

Do not shrink desktop layouts until they fit. Recompose them for smaller screens:

- Stack content before reducing it below a useful reading width.
- Preserve the primary action and key message above decorative content.
- Keep interactive targets comfortable for touch.
- Keep large type fluid and prevent orphaned single-word lines when practical.
- Test open navigation, accordion content, long titles, and translated-length text.

## Images

Render images with NuxtImg or NuxtPicture from the Nuxt Image module. Local image
sources belong under `public/` and use root-relative paths. Provide intrinsic
width and height, an accurate alt value or an empty alt for decorative images,
and responsive `sizes` when the rendered width changes across breakpoints.

Use `object-cover` only when the composition intentionally crops the source.
Lazy-load below-the-fold images. Reserve eager loading and preload behavior for
images that are verified as critical to the initial viewport.

## Accessibility

- Meet WCAG AA contrast for text and essential controls.
- Keep muted text and opacity-based metadata at WCAG AA contrast on every surface.
- Preserve a visible focus ring against every surface.
- Use semantic landmarks and heading order.
- Give icon-only controls an accessible name.
- Hide decorative icons from assistive technology.
- Keep animation optional through reduced-motion behavior.
- Do not communicate state or meaning by color alone.

## Smooth scrolling

Lenis owns global scroll smoothing through `app/plugins/lenis.ts`. The plugin
creates one application instance after mount, uses GSAP's ticker as the only
animation frame source, sends Lenis scroll updates to ScrollTrigger, and refreshes
measurements after route completion and font loading.

Use `useSmoothScroll()` in components:

```vue
<script setup lang="ts">
const { scrollTo, stop, start } = useSmoothScroll()

async function openContact() {
	await scrollTo('#contact', { offset: -24 })
}
</script>
```

The composable also exposes `instance`, `isReady`, `onScroll`, `ready`, `refresh`,
and `resize`. Subscriptions created with `onScroll` are removed automatically
when the current Vue scope is disposed.

The browser window remains the scroller. Do not add `ScrollTrigger.scrollerProxy()`
for the current configuration because Lenis retains native document scrolling.
If a custom wrapper is introduced later, treat that as an architecture change and
review the proxy, pin type, dimensions, routing, and accessibility behavior.

Wheel input is smoothed. Touch input remains native. Lenis respects the user's
reduced-motion preference. Use `data-lenis-prevent`,
`data-lenis-prevent-wheel`, or `data-lenis-prevent-touch` on nested regions that
must manage their own scroll input.

Do not construct Lenis inside a page or component. Do not add a second animation
frame loop. The app plugin is the only owner of initialization and teardown.

The implementation follows the official [Lenis GSAP integration](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger)
and [GSAP ScrollTrigger guidance](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

## GSAP

`useGsap()` exposes the core instance, scoped contexts, responsive match-media
contexts, optional plugin loading, and automatic teardown. The Lenis bridge loads
GSAP and ScrollTrigger after application mount. Components still use `useGsap()`
to own and clean up their individual animation contexts.

```vue
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

const root = useTemplateRef<HTMLElement>('root')
const { createMatchMedia, gsap } = useGsap()

onMounted(() => {
	createMatchMedia(
		{
			desktop: '(min-width: 64rem)',
			reduceMotion: '(prefers-reduced-motion: reduce)',
		},
		(context) => {
			const { desktop, reduceMotion } = context.conditions ?? {}
			if (reduceMotion) return

			gsap.from('[data-animate]', {
				autoAlpha: 0,
				duration: desktop ? 0.7 : 0.45,
				stagger: 0.08,
				y: desktop ? 24 : 12,
			})
		},
		root,
	)
})
</script>
```

Prefer `x`, `y`, `scale`, `rotation`, and `autoAlpha`; scope selector strings to
a component root. Use `loadPlugin()` for optional capabilities such as
`SplitText`, `Flip`, `Observer`, `ScrollToPlugin`, or `TextPlugin`. ScrollTrigger
is registered by the Lenis bridge and remains available through the existing
loader when a component needs its API. Contexts and media queries are reverted
automatically when their Vue scope is disposed.

## Design-system change workflow

When changing the system:

1. Confirm the need exists in a current component or feature.
2. Check whether an existing token, class group, primitive, or variant already fits.
3. Change the lowest shared layer that owns the behavior.
4. Verify all known consumers.
5. Check light and dark token pairs.
6. Check 390px, 768px, and 1440px layouts.
7. Check keyboard, focus, disabled, and reduced-motion states.
8. Update this document when the public design contract changes.
