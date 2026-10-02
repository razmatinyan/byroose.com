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
| `background` and `brand-cream` | Warm cream, `#F5EBDD` | Main page canvas and cream brand surfaces |
| `foreground` | Near-black ink | Primary text and dark surfaces |
| `card` | White | Elevated and contained content |
| `primary` | Orange-red | Primary actions, emphasis, and high-energy sections |
| `secondary` | Cobalt blue | Alternate brand surfaces and supporting emphasis |
| `brand-green` | Saturated green, `#0B9E5A` | Positive editorial surfaces and varied content cards |
| `brand-yellow` | Butter yellow, `#F8E5AA` | Warm editorial surfaces and selective highlights |
| `brand-violet` | Vivid violet, `#7C3AED` | Expressive editorial surfaces and selective highlights |
| `accent` and `brand-pink` | Soft pink | Playful highlights and alternate surfaces |
| `muted` | Pale warm neutral, `#EEE3D5` | Quiet backgrounds and placeholders |
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

The cream is a family, not a single token. `muted` sits a step darker and
slightly toward yellow at `oklch(0.9208 0.0221 73.14)`, so quiet surfaces stay
visible on the canvas. The dark theme uses the same cream,
`oklch(0.9441 0.0215 76.53)`, for its foreground, card, popover, accent, and
cream foreground tokens. Change the canvas, `brand-cream`, `muted`, and those
dark foregrounds together, then recheck `muted-foreground`, `brand-soft`, and
`brand-subtle` against both the canvas and `muted`. Against the current cream,
`brand-soft` on `muted` is the tightest pair at about 4.75:1.

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
- `text-service` sets the service panel titles at
  `clamp(3.25rem, 8.5vw, 10rem)`, about 122px at 1440 wide, where the longest
  name still holds one line. Its leading of `1.08` leaves room for the
  descender of "Development" inside its word mask, so the rise never clips the
  glyph.
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

## Canvas grain

The page canvas carries a fine grain texture so large flat areas read as printed
paper rather than flat screen color. The texture is `public/images/noise.webp`,
a 256px neutral noise tile stored losslessly. A fixed `body::before` layer in the
global base layer tiles it across the viewport at its natural size, sits at
`-z-10` behind every page element, and is `pointer-events-none`. Because the
layer is fixed and never repaints, the grain stays still while the page scrolls.

The tile must stay lossless. A lossy codec cannot encode random noise, so it
substitutes a field with the right per-pixel statistics but roughly double the
variance at the four to eight pixel scale, which reads as mottling across a large
flat canvas. Quality level does not change that, so there is nothing to buy by
paying for it. Tile dimensions only set the repeat period. One image pixel is
always one CSS pixel, so resizing the asset never changes how coarse the grain
looks.

The texture, its opacity, and its light blend live in the `canvas-grain` utility,
which both the body layer and the More works circle apply, so one value still
tunes every grain surface. The dark override cannot nest inside that utility,
because Tailwind cannot attach a `.dark` ancestor to an applied pseudo-element.
Each consumer therefore repeats the two dark declarations next to its own
selector. One opacity value tunes the whole effect. The light theme multiplies the light
tile into the cream canvas, which keeps the warm hue and costs roughly three
percent lightness. The dark theme inverts the same asset and screens it, so a
near-black canvas gains a matching three percent instead of losing it. Keep both
blend modes paired when the opacity changes.

The layer sits behind page content, so any element painted with `bg-background`
hides the grain beneath it. Surfaces that only repeat the canvas color must stay
transparent and let the body background show through. The landing wrapper and the
brand grid cells follow that rule.

The tile is referenced directly from CSS with a root-relative URL because it is a
repeating decorative texture rather than a content image, so it does not pass
through Nuxt Image.

## Tailwind class groups

Component-specific visual recipes live in the owning Vue single-file component's
`<style scoped>` block. These blocks use `@reference` to access the theme and
utilities from `app/assets/css/tailwind.css` without emitting the global sheet a
second time. Cross-component recipes live under the global `@layer components`.
Examples include `section-title`, `section-gutter`, `split-title`, and the
shared tilt behavior.
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

## Cookie notice

`SiteCookieBanner` is a small fixed notice in the bottom right corner of every
route. It uses the card surface, a border, and `shadow-xl`, because a floating
overlay is the elevation exception to the borders before shadows rule. On phones
it spans the viewport inset. From `sm` it settles into a compact panel in the
corner.

A title sits above a single row that keeps the explanation and the accept action
inline, so the notice reads as one short block rather than a stack. The action
carries `shrink-0`, so the copy wraps beside it instead of crushing it.

It is an `aside` named by its own title through `aria-labelledby` rather than a
dialog, because it never traps focus and never blocks the page. Its single
action is a `cta-sm` button in the `dark` variant, so the accept control
inherits the shared hover bounce and the masked three-stage rollover without
redefining either.

That size reserves trailing space for an icon tile. A label-only call to action
therefore closes the variant gap and restores symmetric horizontal padding in
the banner's own scoped style, rather than changing the shared size contract.
Prefer this local correction whenever a CTA size is reused without its icon.

The notice enters and leaves through a `Transition` with `:css="false"`, driven
by `useCookieBannerMotion`. It rises `24px` with a slight scale over `0.5s` on
`power3.out`, and it settles back down over `0.3s` on `power2.in` when accepted.
The transition carries `appear`, so the notice animates on its first paint as
well as when the home intro finally releases it. Reduced motion resolves both
directions with `gsap.set`, so the notice still appears and still dismisses
without travelling.

Accepting writes `accepted` to the `byroose-cookie-consent` cookie for one year.
Because the value is read through `useCookie`, the server already knows whether
to render the notice, so an accepted banner never flashes during hydration.

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
unless a source needs an intentional override. Keep vector brand assets as SVG
and render them with `provider="none"`.

Every width an image requests, including its 2x density, must be a value in
`image.screens`, or the Vercel provider rounds it up and warns. Give every
`sizes` entry a screen key, such as `sm:100vw md:448px`. A bare entry like
`100vw` is resolved against a 1px screen and produces a useless 1px candidate.
When a fixed slot needs a width that is not a breakpoint, add it to `screens`
under a descriptive key, as the founder portrait does with `portrait` and
`portrait-2x`. Repeating CSS background textures are the exception and are
described in Canvas grain.

The browser picks a candidate once, from the `sizes` value multiplied by the
device pixel ratio. It never looks at crops or transforms. An image whose
`sizes` value is smaller than what it shows on screen is fetched too small and
looks soft, so work out `sizes` for every new image with this checklist:

1. Start from the widest layout box the image gets at each breakpoint. Size
   every breakpoint for the widest viewport it covers, because the last entry
   applies to all larger viewports.
2. Add the crop. An `object-cover` slot that is narrower than its source ratio
   crops the sides, so the source must be wider than the box. A 16:9 source
   needs about 1.33 times the width of a 4/3 box and 1.78 times the width of a
   square box.
3. Add every transform. When GSAP or CSS scales the element or a parent, size
   for the largest state, not the resting layout. The hero cards are about
   300px in the grid, but they are scaled up to a 520px preloader stack and the
   featured card grows to almost the full viewport on scroll, so the hero asks
   for up to 1536px.
4. Pick the nearest `screens` value at or above each need. When the 2x width of
   a value would leave `screens`, which is true for anything above 768px, list
   the needed widths per breakpoint and set `densities="x1"`, as HeroSection
   and CaseStudyCard do. The browser still multiplies the slot by the device
   pixel ratio and picks the best of those candidates.
5. Do not worry about asking for more than the source. A request above the
   source width, such as 1536 for a 1456 image, returns the original converted
   to WebP.

Small fixed slots follow the same rules. The TrailingTooltip thumbnail is a
104px square cropped from a 16:9 source, so it needs about 185px at 1x and uses
`sm:448px` for 448 and 896 candidates.

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

### Scrollbar

The page shows a thumb with no track. A classic scrollbar always reserves its own
gutter, and that gutter paints the root canvas color, so it would show as a cream
strip beside dark sections. The base layer therefore hides the root scrollbar
with `scrollbar-width: none` and `html::-webkit-scrollbar { display: none }`.
Nested scroll regions keep the global `::-webkit-scrollbar` styling.

`SiteScrollbar` in the layout replaces it with a fixed overlay thumb on the right
edge. It reads the native scroll position, viewport height, and document height
after mount. It updates on scroll and resize, and through a resize observer on
the body, so pin spacers and late content keep the thumb in proportion. The
thumb is at least `48px` tall. A `w-1.5` pill sits inside a `w-3.5` drag target
painted in `background` at half opacity with `mix-blend-mode: difference`, so it
reads dark on the canvas and light on dark surfaces without a separate color
per section. Dragging the thumb scrolls through `useSmoothScroll` with
`immediate`, so Lenis stays the single owner of the scroll position. The overlay
is hidden from assistive technology. Wheel, keyboard, and touch scrolling stay
native, and the overlay renders nothing until mount or when the page does not
scroll.

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

A template ref placed on a component holds that component's instance, not its
element. `NuxtLink`, `Button`, and `SiteMenu` refs therefore reach GSAP as
plain objects, which tween silently and move nothing on screen. Resolve every
motion target through VueUse's `unrefElement` and confirm the result is an
`HTMLElement` before animating it, so a plain element can become a component
later without breaking the animation.

### Home intro motion

The home route owns a two-stage hero entrance through `useHomeIntroMotion`. The
preloader is the first stage and nothing else. A direct request to the home page
starts with ten fully opaque images scaling into a centered stack. The first
image leads for one second with `power3.out`; the remaining images start
one-third of a second later with a `0.12s` stagger. The preloader ends as soon
as that stack is revealed. Client-side entries to the home page skip the
preloader and begin from the same centered stack.

The second stage begins at the shared `expand` timeline label. Hide the six back
layers without an exit tween, then expand the four retained 4:3 images straight
from the centered stack into their responsive grid positions over one second
with `power3.inOut` and a `0.06s` stagger from the center of the group. They
land with alternating rotation and slight scale so adjacent cards overlap, and
they keep a `40px` downward offset in their final state so the row sits
partially outside the viewport. Do not trail the stack to a separate bottom
dock first. The image expansion, site header reveal, and hero title reveal must
all be anchored to that same label so the stage reads as one movement.

Reset the native and Lenis scroll positions to the document top before the home
intro begins. Keep both scrolling systems stopped until the expansion finishes.
The expansion reveals the site header `0.4s` after the label and starts the hero
title line sequence `0.5s` after it. Reduced motion must resolve directly to this
complete state with scrolling available.

The preloader has no curtain. Because both scrolling systems are pinned to the
document top, the only thing behind the centered stack is the hero section with
its title still masked, so an opaque cover would hide nothing worth hiding. The
media grid still lifts to `zIndex: 70` for the duration of the intro, which is
what keeps the cards above the page now that the page is visible behind them.

Render animated titles through the shared `SplitText` component. Its server
output must remain the complete text node for indexing and assistive technology.
After mount, the component may split into words, lines, or characters and pass
those elements to the consuming animation. The home title animates its generated
visual lines in order. Each fully opaque line rises from 115% below its own
clipping mask over `0.8s` with `power3.out` easing and a `0.1s` stagger.

### Home hero scroll transition

After the home intro completes, the third of the four retained hero cards becomes
the featured transition image. The hero leaves through normal document scrolling
while LandingPage's empty one-viewport transition space keeps Studio below the
viewport. The featured card offsets that document movement as it leaves its
rotated grid position, reaches the viewport center, and expands to fit within 92
percent of the viewport width and 82 percent of its height. The movement and
scale are scrubbed directly to scroll progress, and the existing Lenis instance
supplies the wheel smoothing. When the transition space ends, the card does not
switch straight from holding at center to moving with the page. Over the next
thirty percent of a viewport, it eases from holding into full scroll speed with
`power1.out`, which offsets it upward by half that distance. The handoff is
velocity matched, so the card never looks like it stops and restarts. Its scale
never freezes either: a separate scrubbed tween keeps it growing very slowly
for 1.3 viewport heights after the transition space ends, by ten percent in
total with `power1.out`, so it is still growing as it leaves the top of the
viewport. The window stays short so the card never covers the
Studio statement entering below it. All hero cards remain 4:3 in the grid. The featured
card alone transitions to the source image's native 16:9 ratio while it expands.

`useHomeHeroScrollMotion` owns this behavior. It starts only after
`useHomeIntroMotion` reports a complete state, uses the browser window as the
scroller, animates the featured card's transform and aspect ratio, and lets its
scoped GSAP media context remove the inline styles during route cleanup. Reduced
motion collapses the empty transition space and keeps the standard hero and
Studio flow without scaling or changing the card ratio.

Keep the featured card on two-dimensional transforms with `force3D: false` and
do not apply a persistent `will-change` hint. Promoting the card while it is
still grid-sized can cache a small raster layer that becomes visibly soft when
the scroll transition enlarges it.

### Studio section reveal

Render the Studio statement and both copy paragraphs through the shared
`SplitText` component with word masks. When the Studio section reaches 82
percent of the viewport, each statement word rises from 115 percent below its
mask over `0.8s` with `power3.out` easing and a `0.03s` stagger. The recipe
lives in `app/lib/word-reveal.ts`, which the services panels share.

The statement is start-aligned, so its large display lines keep natural word
spacing. The copy paragraphs are justified so every full line ends on the
same edge, while a short final line stays start-aligned. Justification still
applies after splitting because each masked word is an inline block and the
split keeps the spaces between words, which the browser stretches.

Negative tracking ends a word's box slightly before the right edge of its last
glyph, so a word mask would clip that edge, as it did to the b in "Web". Every
`.split-text-word-mask` therefore carries `0.1em` of inline padding cancelled
by an equal negative inline margin. The clip box covers the full glyphs while
the layout, the word spacing, and the justification stay exactly as before.
The rule lives in the global `@layer components`, so every word mask on the
site gets it.

The founder portrait follows with a top to bottom clip reveal. When its top edge
reaches 82 percent of the viewport, its `clip-path` inset opens from the bottom
edge over `1.2s` with `power3.inOut`, and the inline clip is cleared once the
image is fully visible. The copy words then use the statement's rise when the
copy column reaches the same line, with a tighter `0.01s` stagger because the
paragraphs hold many more words.

Every reveal runs once. Reduced motion displays the portrait and every word in
their resting positions without a ScrollTrigger animation.

### Work section

The work section centers its heading, currently "What we've done", and gives
each case study its own full-width row. The heading keeps `section-title` for
its weight but overrides the font size and tracking in the component's own
scoped block. This heading is deliberately oversized: its clamp runs past
`text-hero` and sits just below `text-journey`, so the section opens at display
scale. The phrase always sets on one line through `white-space: nowrap`. The
line is about `7.4em` wide, so the clamp's floor is `2rem`, which lets `12vw`
set the size on phones and keeps the line inside the column instead of
overflowing it. Promote that clamp to a token
if a second section ever wants the same step. From `md` the row is a `3fr 2fr` grid, so the media takes
sixty percent of the width and the copy takes forty, and both columns align to
the top of the row rather than to each other's center. On phones the row stacks
to one column. Case study cards carry no surface color of their own, so the
canvas grain stays visible behind them and the image is the only filled shape in
the row.

The copy column reads title, description, result value, result label. The value
is an inline highlight that takes a `surface-*` utility through the card's
`tone` prop, so a case study picks a brand color from `app/lib/surfaces.ts`
rather than defining one. The label below it stays at foreground weight, because
the color belongs to the number and not to the sentence that explains it.

Case images are currently reused from the hero set. They are content images with
their own alternative text, and they will be replaced by real project media when
case studies gain their own routes.

The section heading is a `SplitText` character reveal. It splits into words and
characters with a mask on every character. The word wrappers stay inline
blocks, so each word holds together as a unit.

Splitting drops the font's kerning pairs, because every character becomes its
own inline block, so the split title would set wider than the same text unsplit.
The heading therefore takes the global `split-title` class group, which tracks
at `-0.07em` through `--split-title-tracking`. `letter-spacing` would also
shrink each character's mask box and clip the edges of wide bold glyphs, so in
the split state each character resets its own `letter-spacing` to zero and its
mask takes the tracking as a negative `margin-inline-end`. The masks keep each
full glyph and still sit tighter than the old unsplit setting. The group also
hides every character until its reveal sets it visible. When the section
reaches 90 percent of the viewport, each character rises from 115 percent below
its mask over `0.9s` with `power3.out` easing and a `0.035s` stagger, so the
title types itself in from left to right. That recipe lives in
`app/lib/char-reveal.ts`.

Each case study reveals from its own trigger at the same line. The media frame
fills with the preloader's stack reveal: five elements stacked on the frame all
scale up from zero around their own center, four of them empty brand-color
layers, with the image arriving as the fifth and last. Both the preloader and
this section run that recipe through `addStackReveal` in
`app/lib/stack-reveal.ts`, so the lead element scales over one second with
`power3.out`, the rest start a third of a second later, and the group carries a
`0.12s` stagger. Change the timing there and both reveals move together.

Each case study gets its own four-color sequence through the card's
`revealTones` prop, resolved through the same `surface-*` map as the result
highlight. The sequences are all different, and each one ends on the card's own
`tone`, so the color that lands immediately before the image is the color the
result number wears.

Layers bleed one pixel past the frame and inherit its radius, and the frame
shapes itself with `clip-path: inset(0 round var(--radius-2xl))` alongside its
radius and `overflow: hidden`, so the resting surface never survives as a
hairline rim around the final layer. DOM order is the paint order, so the image
wrapper must stay last. The colored layers rest at `scale(0)` in CSS because
they are decorative, which keeps a solid color block off the card before the
motion initializes and without JavaScript. The image wrapper carries no CSS rest
state, so the image itself is always present in the server output.

The four text lines share the card's timeline rather than running their own
trigger. They start at the halfway point of the media reveal, so the copy is
already arriving while the last colored layers are still landing, and they rise
from their masks over `0.8s` with a `0.08s` stagger. The position is read from
the timeline's own duration after the stack tweens are added, so retiming the
stack moves the text with it. The image inside the frame is held at `1.3` scale and scrubbed
from `-14` to `14` percent as the card crosses the viewport, so it travels in
the same direction as the scroll and lags behind its frame. The reveal and the parallax are on
different elements: the image's layer wrapper owns the entry scale and the image
inside it owns the parallax, so neither fights the other. Keep the scale ahead
of the shift: the image only has `(scale - 1) / 2` of overflow on each edge, so
raising the travel without raising the scale exposes the frame.

Card content is not hidden before the motion initializes, because it is part of
the server output. Reduced motion therefore needs no exit state for the cards:
it resolves the title words and leaves every card at rest with no parallax.

The complete case study card is the hover surface for one shared trailing
tooltip. WorkSection owns the active image and keeps one TrailingTooltip mounted
through Nuxt's shared teleport target, so the follower is not clipped by the
landing wrapper or card media. The card stays an article until a real case study
destination exists. Its pointer cursor communicates the intended future link
surface without introducing a no-op control or fake URL.

The tooltip uses the hovered card image in a large 104-pixel thumbnail, the
label "See Full Project" at `text-3xl`, and a fixed card surface. Its `size`
prop also accepts `compact`, a 64-pixel thumbnail with a `text-xl` label and
tighter padding, which the more works panel and the services images use. It opens from
`inset(50% 100% 50% 0 round 1.2rem)` to
`inset(0 0 0 0 round 1.2rem)` over `0.75s` with the
`cubic-bezier(0.19, 1, 0.22, 1)` curve. GSAP `quickTo` owns only its `x` and `y`
position with `power3.out` easing, keeping repeated pointer updates inside one
reused tween per axis. The follower keeps its pointer offset and may travel
beyond a viewport edge. It never flips or clamps its position. The card image
is non-selectable and non-draggable, so pointer travel cannot highlight or drag
it.

Leaving a card starts a 200ms close delay. Entering another card within that
window cancels the close, keeps the tooltip open, and swaps only its image.

That swap is layered rather than instant. The incoming image mounts on top of
the outgoing one inside a fixed thumbnail frame and scales up from zero with the
shared `stackRevealEase`, so it borrows the card media reveal's curve. The
outgoing image stays mounted underneath until the incoming one finishes, then
every layer below it is dropped. A fast pass across several cards stacks several
layers, and each completion clears only the layers beneath itself, so a newer
image is never removed by an older tween. The reveal runs only when the tooltip
was already open before the image changed. Opening from a closed state, and
reduced motion, both replace the thumbnail in one step instead, so a stale
project image never shows while the panel is wiping open. The
movement stays on two-dimensional transforms with `force3D: false`, and the
tooltip has no persistent `will-change` promotion, so its settled text remains
sharp. Reduced motion removes the movement delay and clip transition.

The open, close-delay, and loading state lives in `useTrailingTooltip`, which
the services section shares. Each consumer loads the component asynchronously
only after mount and only while `(hover: hover) and (pointer: fine)` matches. Phones, tablets, and other
touch-first devices never request or mount the tooltip chunk.

### More works panel

The work section ends with four case studies and a full-width dark panel,
`MoreWorksPanel`, that leads to the `/works` route. The panel uses the
`foreground` surface with `background` text, fills at least one small viewport
height, and stacks a centered title stage above one large circular action.

The action is a `NuxtLink` named "Explore Projects" through `aria-label`. It is a
circle of `clamp(9rem, 15vw, 15rem)` in the canvas `background` color, carrying
the same grain as the page through the `canvas-grain` utility, so it reads as a
piece of the canvas pushed up into the dark panel. A negative bottom margin of
half its size sits its center on the panel's bottom edge. The panel clips its
own overflow, so only the top half shows. The arrow up right glyph sits in that
visible half, a quarter of the way down the circle.

On hover the circle runs its own `useArrowSwapHover` rather than the CTA bounce
and rollover. The scale and the arrow swap share one `0.7s` `power4.inOut`
tween, which starts slowly, moves quickly through the middle, and settles slowly,
in the style of a motion graphic rather than an elastic button. The circle
scales to `1.08` without overshoot. The arrow leaves toward the upper right
while its copy arrives from the lower left. The arrow box does not clip its
glyphs. The circle's own rounded clip hides the departing arrow, and the copy
is parked `200` percent left and `150` percent down, far enough to sit outside
the circle and below the panel edge until it travels in. The surface never
changes color. Visible keyboard focus runs the same swap and shows the
standard focus ring. Reduced motion swaps the arrow instantly without scaling,
and touch-first pointers swap the arrow without scaling. A click anywhere else on
the panel also routes to `/works`, so the whole surface carries a pointer
cursor. Keyboard users reach the destination through the action link.

The panel is also a hover surface for the work section's shared trailing
tooltip. While the pointer is on the panel, the tooltip reads "Explore Projects"
instead of the cards' default label. Its thumbnail follows the panel's
currently cycling image, so each cut swaps the thumbnail through the tooltip's
layered reveal. The tooltip steps aside while the pointer is on the circular
action itself, so it never covers the control it describes, and
returns when the pointer moves back onto the panel. Moving between a card and
the panel keeps the same 200ms close window as moving between cards. Over the
panel, the tooltip uses its `compact` size: a 64-pixel thumbnail, a `text-xl`
label, and tighter padding, so it stays secondary to the large title and the
circular action.

The panel is followed by `spacing-section` of canvas before the next section.

The stage overlays the heading and a 3:4 image frame in one grid cell. The
heading reads "View work", rendered as two uppercase words split into
characters. Both words have four characters so they balance around the image.
The heading is a `1fr gap 1fr` grid, with the gap set to `0.4` times the image
width, so each word overlaps three tenths of the frame. The first word aligns to the end of its column and the second to the
start of its column, so the gap stays centered on the image and both words
overlap the frame by the same amount, whatever their glyph widths. The heading
paints above the image with `mix-blend-mode: exclusion`, so the letters that
cross the frame invert against the photograph. A visually hidden copy
carries the accessible name while both visual words stay hidden from assistive
technology. The frame cycles through the seven images in `public/images/work`,
cutting to the next one every `750ms` without a crossfade. They are decorative,
so they carry an empty alt.

The handoff from the cards to the panel starts only once the reader has fully
arrived at the last card, when its center meets the viewport center. That start
is measured from `offsetTop` rather than the bounding box, because the case list
it measures is the element the handoff transforms. From there until the panel
pins, `useWorkMotion` scrubs one timeline:

- The track gains a `50svh` runway above it through the `--more-works-runway`
  variable. That extra scroll distance lets both the cards and the panel move
  slower than the reader's scroll.
- The case list drifts down seventy percent of the handoff distance, so the
  cards move at about three tenths of the scroll speed.
- The case list fades to zero over the last seventy percent of the range.
- The panel starts lifted by the handoff distance minus one viewport height, so
  it enters at the viewport bottom exactly as the handoff starts. It then
  settles into place, arriving at roughly seven tenths of the scroll speed.

Both offsets are read from the timeline's own trigger range on every refresh, so
the speeds hold at any viewport size. Before the handoff starts, every element
moves at the native scroll speed. The header does not change color over the
panel. `useMoreWorksMotion` owns the panel's own motion:

- Reveal: one timeline is scrubbed from when the track reaches 60 percent of
  the viewport until the end of the pin. Across it, both words travel in from
  `22` percent of the viewport width to their resting columns. The image frame
  scales up from zero. Each character fades in from zero opacity, working
  outward from the center, so "View" reveals right to left and "work" left to
  right, and every character is visible before the words settle. Every
  character is set to zero opacity before the timeline is built, and the
  timeline only tweens toward one. Do not use a staggered `fromTo` here: inside
  a scrubbed timeline it applies its starting opacity only to the characters
  the playhead has reached. Later characters keep their natural full opacity
  until their turn, which reveals the outer letters first. The circular
  action scales up from zero around its center on the panel edge during the
  pinned part of the timeline, with `power2.out` easing, so it rises out of the
  bottom edge after the title has arrived.
- Drift: the reveal never stops dead. From the end of the pin until the panel
  has scrolled one panel height further, a second scrubbed timeline keeps the
  words moving toward each other past their resting columns and keeps the image
  growing past full size. The image drift starts at the reveal's own speed and
  slows with `power1.out`, so it grows by about thirty percent and never
  visibly halts. The words must never collapse into each other, so each one
  moves inward by at most thirty percent of the gap between them, measured from
  layout on every refresh, with `power2.out` easing. At least forty percent of
  the gap always stays open.
- Pin: the track pins for one viewport of scroll once its top reaches the
  viewport top.
- Cycling: images only cycle while the panel is on screen.

The track carries `pointer-events: none` and only the panel accepts input.
Reduced motion drops the runway, the pin, the fade, the slowdown, the reveal,
the drift, and the cycling. It keeps a static dark panel with the words in place, the
first image, and the full circular action, whose glyph swap resolves instantly.

### Services section

The services section opens with a pinned intro panel, followed by one panel
per service that scrolls normally. `useServicesMotion` pins the intro at the
top of the viewport for one and a half viewport heights and scrubs its title
against that pin. Its triggers use a `refreshPriority` of `-1`, so they
measure after the work section's pin above them.

The intro panel centers its heading, currently "What can we do for You", on two
lines at `clamp(3rem, 10vw, 12rem)`, with each line held to one line through
`white-space: nowrap`. Each line is its own `SplitText` word split, and
screen readers get the phrase from an `sr-only` copy. Every word starts invisible,
blurred, and small, at `0` opacity, `blur(16px)`, and `0.6` scale, and
grows to full opacity, no blur, and its resting size. The words resolve one
after another in reading order, and the pin holds the finished title for a
short beat before releasing it.

Each service panel centers its title at `text-service`, a description below
it, and an image below that. The service names, "AI Content Creation" and
"Website Development", are set in title case. The intro title is not
selectable, so a drag across the pinned panel never highlights its words. The
description sets at `text-2xl`, `text-4xl` from `md`, and `text-5xl` from
`xl`, in the default `foreground` color at weight 600 with `1.15` leading.
It is a full-width box capped at a `30ch` measure, centered in the panel like
the title, while its text is left-aligned inside that box. It uses
`text-pretty` rather than `text-balance`, because balanced lines inside a fixed
box would leave a ragged gap on the right and read as off center. The image
spans the full content width at the source's natural `1456 / 816` ratio, so it is never cropped to fit the viewport.

Each service panel scrolls slower than the page, so the title, the
description, and a future video stay on screen together while the video
grows. While motion is enabled, the panel adds one viewport height of runway
below its content through `--service-runway`, and the whole content block
slides down through that runway as the panel crosses the viewport. At 1440 by
900 the content moves about 0.7 times as fast as the scroll, and the text
reveal and the image scale stretch across the longer distance. Reduced motion
drops the runway.

Because the content moves, its own elements cannot serve as ScrollTrigger
triggers. Every text and image trigger is therefore a scroll position computed
from untransformed layout: `scrollWhen` takes an element's offset inside the
panel and a viewport line, and returns the scroll position at which that
element reaches that line once the slowed travel is accounted for. The panel
itself is never transformed, so it stays a reliable reference.

The title and the description reveal together from one trigger. When the
title reaches 60 percent of the viewport, it rises word by word from
`SplitText` word masks with a `0.08s` stagger set through `titleStagger`,
and the description starts at the same moment in the same timeline, rising
line by line from `SplitText` line masks with a `0.1s` stagger set through
`descriptionStagger`, both in `useServicesMotion`. Each description line
takes `1.1s` to rise, set through `descriptionDuration`, so the description
settles a little after the title. Each mask rise uses the
recipe from `app/lib/word-reveal.ts`: 115 percent below the mask to rest over
`0.8s` with `power3.out` easing. The title keeps its `-0.045em` tracking,
because a word split preserves kerning inside each word. Sharing one trigger keeps the two
in sync, even though the description sits below the title. The lines and their
masks are block elements, because the split emits them as inline spans and a
transform has no effect on an inline element. The lines are split once, after
the fonts load, and are not re-split on resize, so a large width change can
wrap a split line inside its own mask.

The image is scrubbed with the scroll in one continuous motion with no rest at
full size. It scales up from zero around its bottom center from the moment it
enters the viewport until it is centered in the viewport, easing out with
`sine.out` to a peak of `0.8`, while the picture inside eases from `1.3`
scale to rest. The title and description stay visible for most of that growth.
From the same point it eases back down to zero around its top center with
`sine.in`, finishing as the image leaves the top. Both eases are slow at the
peak, so the turn from growing to shrinking is smooth. The image never reaches
its full layout size. Entry and exit live on two nested elements, the link for
the bottom origin entry and its wrapper for the top origin exit, so the
transform origins never fight.

Each image is a `NuxtLink` to the `/services` route, named for its service
through `aria-label`. Hovering it opens the services section's TrailingTooltip
at its `compact` size with the service image and the label "More Details". The images are decorative
placeholders from `public/images/hero` and will be replaced with real service
media.

Reduced motion drops the intro pin, every reveal, and the image scale. It
displays the title words, the service titles, the descriptions, and the images
at rest.

### Header motion

The site header has full and compact sticky states. It stays full at the top of
the page, compacts after intentional downward travel, and returns after a short
upward movement. The compact state keeps the Start a project action visible and
pairs it with a single responsive SiteMenu control. The control uses the same
dark action surface, outer radius, and control height without using the shared
CTA icon tile. Its glyph is two horizontal one-pixel lines that morph into an X
when expanded. Activating the control opens its own menu and never restores the
header logo or primary navigation. There is no separate mobile dropdown.

The header logo always renders a real link to the home route so it stays
crawlable and opens in a new tab on a modified click. On the home route a plain
click scrolls smoothly to the top through the shared Lenis contract instead of
repeating the current navigation. Every other route follows the link.

Drive header state from the shared Lenis scroll subscription and animate it with
the component-scoped GSAP toolkit. Keep transitions quick, interruptible, and
limited to transforms and opacity. Reduced motion must switch between complete
states without animated travel.

The expanded menu is a dark rounded panel teleported to Nuxt's shared overlay
target, outside the header action group. Position its fixed surface from the
control's live viewport bounds, resting eight pixels above and to the right
while keeping a safe viewport inset. It grows from the control's exact width and
height through `scaleX` and `scaleY`. Derive the transform origin from the final
panel position and collapsed scales so the closed panel bounds match the control
exactly, then sweep up and right through a subtle translate, skew, and scale
overshoot before settling at full dimensions. Its heading, navigation items,
and footer enter with opacity and a tight stagger after the overshoot, keeping
the content itself steady while the panel settles.
Closing reverses the same sequence so the content and panel move immediately on
the same short timeline, matching the opening speed as the panel swooshes down
and left into the control. Keep the panel behind the compact header actions so
the Start a project action and close control remain visible. The Start a project
action switches from the dark to the default variant on the same reactive open
state, with its color transition timed to the panel expansion.

Expanded navigation labels retain a single semantic link name while their
two visual text copies stay hidden from assistive technology. SplitText divides
both copies into characters after mount. On hover or visible keyboard focus,
the resting characters travel up and the copied characters arrive from below
over `0.2s` with a `0.02s` left-to-right stagger and `power1.inOut` easing as
the label color softens. Leaving sends the resting characters back down and the
copied characters below with the same left-to-right stagger, rather than
reversing the entry order. Each change tweens from the current character
positions, so a quick exit or re-entry stays continuous. Keep the rollover
clipped to the label line, revert both
SplitText instances during cleanup, and skip character splitting for touch-only
pointers or reduced-motion preferences.

Escape closes the panel and restores focus to the control. Outside clicks and
navigation selection also close it. Keep the panel inert and absent from the
accessibility tree while closed, and let short viewports scroll its content
without handing those gestures to the page's Lenis instance.

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

Actions bounce on hover. `useHoverBounce` attaches GSAP scale tweens to a target,
scales it to `1.08` with an elastic ease, and settles it back with a short
overshoot when the pointer leaves. The `cta-sm` and `cta-lg` button sizes, each
`SiteNavLink`, and the header navigation control share this motion character.

`SiteNavLink` and every size of the shared button primitive also enable press
feedback. Pointer down and keyboard activation scale the control to `0.96`, then
release returns it to `1.08` while still hovered or `1` at rest. Disabled controls
ignore the press state. Hover enlargement only runs for hover-capable pointers,
while press feedback also works with touch. Readers who prefer reduced motion
keep a static control. Listeners, tweens, and inline transform hints are removed
when the media context stops matching or the component scope is disposed.

GSAP owns the transform of every element it bounces, so CSS must not animate the
same property. The complete button primitive uses `transition-colors`, and the
header navigation control keeps its CSS press scale inside a `(hover: none)`
block where its hover-only GSAP behavior does not run. Apply the same split
whenever a component hands one property to GSAP and keeps the rest in CSS.

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
for the dark final layer, and `surface-yellow` completes the brand hues so
butter yellow can be selected by tone name like every other brand color.
Because the copied text is independent from the layer,
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
- Every rounded edge in the stack must be rasterized once. Coincident
  antialiased edges blend instead of covering each other, so the surface below
  survives as a hairline rim, and the hover scale magnifies it because
  `useHoverBounce` promotes the host with `will-change: transform`. Two rules
  keep the stack to a single edge.
- Layers bleed one pixel past the host on every side, so the top layer covers
  the antialiased outline of the layer and the host background beneath it. Keep
  the inherited radius on the bleeding layer; a box grown by one pixel still
  covers the host shape at every radius the system uses.
- The host shapes itself with `clip-path: inset(0 round <radius>)` alongside its
  radius and `overflow: hidden`. `overflow: hidden` never clips the host's own
  background, so the radius and the clip draw the rounded outline twice and the
  resting surface bleeds around the final layer. `clip-path` clips the
  background and the layers in one pass. It also clips the focus ring, so the
  host drops the clip while `:focus-visible`.
- Nothing but the final layer paints at the edge while the rollover covers the
  host. Antialiased clipping is applied per painted surface, so every surface
  that still reaches the resting box adds its own edge and survives as a rim
  under the final layer. This is the rule that does not depend on how a browser
  applies the clip, and it takes two steps. The rollover hides the layers that
  the final one covers, then restores them as the reverse starts. It also
  switches the host to `background-clip: content-box`, which pulls the host's
  own background off the edge and back inside its padding, and restores it the
  same way. A rollover host therefore needs padding. `background-clip` is not a
  transitioned property, so both switches are instant and the host keeps the
  color transition that the header's variant swap depends on.
- Layers tween with `force3D: false`. GSAP's default writes a 3D transform,
  which promotes each layer to its own compositor layer, and the compositor
  applies the rounded mask to promoted layers one at a time. Every layer then
  keeps its own antialiased edge and the surface below shows through it no
  matter how the CSS is arranged. Without promotion the button rasterizes once
  and the pixel of overhang covers what sits under it.
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
