# byroose design system

The design system keeps the original landing-page character while following
Shadcn Vue and Tailwind CSS v4 conventions. Components own behavior and variants;
their scoped style blocks own component-specific recipes. The global stylesheet
owns semantic tokens, base behavior, and cross-component Tailwind utilities.

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
surfaces use dark ink foregrounds. Copied labels over dark rollover surfaces use
`primary-foreground`. Keep each brand color paired with its foreground token so
color behavior remains consistent in both themes.

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

Geist is the primary font and loads through Nuxt Fonts. Do not add font link tags
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

Component-specific visual recipes live in the owning Vue single-file component's
`<style scoped>` block. These blocks use `@reference` to access the theme and
utilities from `app/assets/css/tailwind.css` without emitting the global sheet a
second time. Cross-component recipes live under the global `@layer components`.
Examples include `section-title`, `section-gutter`, and the shared tilt behavior.
Small reusable surface and media recipes use Tailwind v4 `@utility`, such as
`surface-blue` and `pattern-orange`.

Use direct Tailwind utilities in templates for one-off layout adjustments of a
few classes. When the same recipe appears twice, give it a semantic class group
or move it into a component variant.

Use this decision order:

1. Existing semantic class group
2. Existing component or CVA variant
3. A short one-off utility list
4. A scoped class group owned by one component
5. A global class group for a repeated cross-component recipe
6. A new token when multiple recipes share the same design value

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

Only the `outline` and `secondary` variants may carry a border. Filled variants
stay borderless so a stray one-pixel ring never survives on top of a rollover
layer or an animated surface.

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

The brand showcase uses a static bordered grid with one logomark and name per
item. Keep every brand visible without motion or duplicated content.

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
Raster output inherits the central WebP default. Do not repeat the `format` prop
unless a source needs an intentional override. Keep vector brand assets as SVG.

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
`CustomEase`, `SplitText`, `Flip`, `Observer`, `ScrollToPlugin`, or `TextPlugin`.
ScrollTrigger is registered by the Lenis bridge and remains available through
the existing loader when a component needs its API. Contexts and media queries
are reverted automatically when their Vue scope is disposed.

### Header motion

The site header has full and compact sticky states. It stays full at the top of
the page, compacts after intentional downward travel, and returns after a short
upward movement. The compact state keeps the Start a project action visible and
pairs it with a navigation control that uses the same dark action surface, outer
radius, and control height without using the shared CTA icon tile. Render the
menu glyph directly with Nuxt Icon. On desktop, activating that control restores
the full navigation and moves focus into it. On smaller screens, it also opens
the mobile navigation.

Drive header state from the shared Lenis scroll subscription and animate it with
the component-scoped GSAP toolkit. Keep transitions quick, interruptible, and
limited to transforms and opacity. Reduced motion must switch between complete
states without animated travel.

The Start a project action and the navigation control share one slot on desktop,
because the full state slides the action across the space the control occupies in
the compact state. Offset the two rather than running them in step, so one is
still travelling while the other scales. Entering the compact state starts the
action moving back and begins scaling the control up from zero shortly after.
Entering the full state starts the control scaling down to zero and sends the
action into the slot shortly after. Keep the ease strength in mind when tuning
these offsets, because a strong out ease finishes most of its visible travel in
the first third of its duration and turns an intended overlap back into a
sequence. The full state deliberately uses a gentle ease on the control so it is
still visibly shrinking while the action travels. The residual overlap is safe
because the control paints above the action and both use the same dark action
surface. Scale the control rather than drifting it, and animate it with a plain
tween from its current value so a reversal mid transition stays continuous. Keep the header surface transparent in both
states. The landing wrapper uses horizontal clipping so it does not create a
competing scroll container that breaks sticky positioning.

### Hover bounce

Actions bounce on hover. `useHoverBounce` attaches GSAP pointer tweens to a target
element, scales it up with an elastic ease, and settles it back with a short
overshoot when the pointer leaves. The `cta-sm` and `cta-lg` button sizes opt in
through the button primitive, and the header navigation control opts in through
`useSiteHeaderMotion`, so both action surfaces share one motion character.

The behavior is created inside a
`(hover: hover) and (prefers-reduced-motion: no-preference)` media context, so
pointers without hover and readers who prefer reduced motion keep a static
control. Listeners, tweens, and the inline transform are removed when the query
stops matching or the component scope is disposed.

GSAP owns the transform of every element it bounces, so CSS must not animate the
same property. The CTA sizes narrow the shared button transition to
`transition-colors`, and the navigation control keeps its press scale inside a
`(hover: none)` block where the bounce never runs. Apply the same split whenever
a component hands one property to GSAP and keeps the rest in CSS.

### Hover rollover

The `cta-sm` and `cta-lg` button sizes also run a masked three-stage rollover.
The size variant makes the button a clipped positioning host. The primitive
renders an independent layer group with three surfaces below the button and an
independent text grid containing the original and copied labels. On hover the
original label travels up and out while the layers sweep up in sequence. Each
layer starts at `94%` scale around its bottom-center origin and grows to full
size during its existing rise. The copied label follows the final layer into the
center. Leaving reverses the layer order and returns the layers to their smaller
hidden state while the original label returns with the same elastic character.

The text grid follows an axis-angle motion contract. At rest the copied label is
`2em` below the original, rotated `-30deg` around a `1 1 0.5` axis, and hidden.
On rollover the original moves to `-2em`, rotates to `-60deg` around a
`1 1 0.45` axis, and fades out. The copy starts after `0.1s`, then translates to
zero, rotates to zero, and fades in. Translation uses the approved elastic
`CustomEase` over `0.75s`, rotation uses the smooth curve over `0.5s`, and
opacity and color settle over `0.2s`. The elastic curve overshoots in both
directions, so the outgoing and returning original label both have a visible pop.

The icon tile stays put. CTA buttons pass their `ButtonIcon` through the named
`icon` slot, which renders after the layers and is positioned so it paints above
them. Only the glyph animates. `ButtonIcon` renders its glyph twice into the same
grid cell and parks the second copy below and to the left, and the tile clips its
own overflow, so the pair is invisible until the rollover swaps them diagonally:
the original leaves toward the upper right while the copy arrives at rest. Both
glyphs are ordinary spans rather than the raw SVG, which keeps percentage
transforms predictable. The independent text grid keeps both labels aligned, so
the copied label does not need an icon-width reserve.

Render the swap in the template rather than cloning a node at runtime. The tile
lives inside a Vue-managed subtree, so an injected copy is not guaranteed to
survive a re-render of the icon.

`useHoverRollover` owns the motion. The layers and glyphs retain their shared
`power3.out` timing while each text property uses its approved custom curve and
duration. Each new timeline tweens from the current values, so a fast pointer
never jumps. Reduced motion switches between the two complete states with
`gsap.set` instead of travelling. Pointer and keyboard state are tracked together,
so a `:focus-visible` control shows the same covered state as a hovered one. A
`speed` option scales the whole timeline through `timeScale`, so a smaller control
can feel quicker without redefining its timings.

The rollover is not limited to buttons. `SiteNavLink` uses the same composable
with a pink, primary, dark sequence and a slightly higher speed, because a small
navigation target reads better with a quicker sweep. Any element can join by
becoming a clipped positioning host with the data attributes below.

Layer colors belong to the variant, not to the motion. `variantRolloverTones` in
the button module maps each participating variant to a tuple of three semantic
surface names:

| Variant | Layer sequence |
| --- | --- |
| `default` | blue, green, dark |
| `dark` | green, pink, primary |
| `outline` | primary, green, dark |
| `cream` | primary, green, dark |

`destructive`, `secondary`, `ghost`, `link`, and `inverse` are absent from that
map on purpose. They keep their plain color hover at every size and render no
rollover markup. A CTA-size button still bounces regardless of its variant.

Tone names resolve through `app/lib/surfaces.ts` to the `surface-*` utilities,
which pair a background with its readable foreground. `surface-dark` was added
for the dark final layer. Because the copied text is independent from the layer,
the same module maps every surface tone to its semantic Tailwind foreground class.
Add a variant to the map to give it a rollover, pass the `rolloverTones` prop to
override one button, and add a surface utility before introducing a new tone.

A variant that owns a rollover drops its hover colors, because the rollover is the
hover state and a second color change underneath it only competes. The primitive
filters `hover:` classes out of the variant list for those buttons rather than
duplicating every variant's resting colors.

These invariants keep this working:

- A rollover host needs `position: relative` and `overflow: hidden`, and its
  layer group, text grid, and optional icon must be direct children carrying
  `data-rollover-layers`, `data-rollover-texts`, and `data-rollover-icon`.
- Layers are direct children of the layer group with `data-rollover-layer`.
  Original and copied labels are direct children of the text grid with
  `data-rollover-label` and `data-rollover-label-copy`.
- Anything that must stay visible above the layers needs its own `position`,
  because the absolutely positioned layers paint above every static sibling
  regardless of document order.
- GSAP parses an element's computed `transform` into its own pixel translation
  before it tweens. The layers start below through a CSS `transform`, so the first
  GSAP call must set `y: 0` alongside `yPercent`. Without it the parsed pixel
  offset survives and the layers stay below the button for the whole animation.

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
