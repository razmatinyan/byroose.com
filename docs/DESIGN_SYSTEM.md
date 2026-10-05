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

Switzer is the primary font. Nuxt Fonts loads it from the Fontshare provider in
weights 400 to 800, then downloads and self-hosts the files, so the site never
requests fonts from a third party at runtime. Do not add font link tags or
component-level font imports.

Switzer's descenders reach `0.24em` below the baseline and its ascenders `0.74em`
above it. Text set tighter than about `1.2` leading therefore overflows its line
box, and a word or line mask needs roughly `(1.21 - leading) / 2` em of bottom
padding, cancelled by an equal negative margin, to keep descenders visible. Keep
that padding below the reveal's starting offset so a waiting word does not peek
through the extra space. Recheck every mask and every measured wrap when the font
changes.

- `text-hero` is reserved for the primary landing statement. It sets
  `clamp(2.875rem, 8.8vw, 9.5rem)`, about 127px at 1440 wide. See Home hero
  layout for how the hero title uses it.
- `text-section` is the default major section heading.
- `text-statement` supports large editorial body statements.
- `text-service` sets the service panel titles at
  `clamp(3.25rem, 8.5vw, 10rem)`, about 122px at 1440 wide, where the longest
  name still holds one line. Its leading of `1.08` leaves room for the
  descender of "Development". The titles are plain headings without a reveal
  or a mask.
- `text-step` sets the journey step card titles at
  `clamp(4rem, 9vw, 9rem)` with a leading of `0.85`, capped by the card
  column's width. The journey section
  title has no size token, because it fits its container. See Journey section.
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
softness. Controls use `radius-action`, which maps to `radius-sm` so every CTA
shares the compact control radius.

Filled action icon tiles use `radius-action-icon`, calculated from the action
radius minus the shared inset. This keeps the outer and inner curves concentric.
Do not tune the icon tile radius independently.

Use borders before shadows for most containment. Add a shadow only when elevation
communicates layering, such as an open mobile menu or floating overlay.

## Canvas grain

The whole page carries a fine, moving grain so flat areas read as printed film
rather than flat screen color. The texture is `public/images/noise.webp`, a
256px neutral noise tile stored losslessly. A fixed `body::before` layer in the
global base layer tiles it at its natural size and sits at `z-999`, above every
page element, including the header, overlays, the cookie notice, the trailing
tooltip, and the scrollbar. It is `pointer-events-none` and `select-none`, so it
never intercepts a click, a hover, or a text selection.

The grain is built to keep moving. The layer is twice the viewport in each direction
through `-inset-1/2`, and the `canvas-grain-shift` keyframes jump it between ten
offsets each second with `steps(10)`, so the grain flickers like film rather than
sliding. Every offset stays within twenty percent of the layer, which is forty
percent of the viewport and inside the half viewport of overhang on each side,
so the viewport is always covered. The
motion is transform only and the layer carries `will-change: transform`, so the
compositor moves it without repainting the page. Reduced motion stops the
animation and leaves a still grain.

The animation is temporarily paused through `animation-play-state: paused` on
`body::before`, so the grain currently holds still at its first offset for
everyone. The keyframes and the rest of the setup stay in place. Remove that one
declaration to turn the movement back on.

The tile must stay lossless. A lossy codec cannot encode random noise, so it
substitutes a field with the right per-pixel statistics but roughly double the
variance at the four to eight pixel scale, which reads as mottling across a large
flat canvas. Quality level does not change that, so there is nothing to buy by
paying for it. Tile dimensions only set the repeat period. One image pixel is
always one CSS pixel, so resizing the asset never changes how coarse the grain
looks.

The texture, its opacity, and its light blend live in the `canvas-grain` utility.
The body layer is its only consumer, and one opacity value tunes the whole
effect, currently `opacity-30`. The dark override sits next to the `body::before` selector, because
Tailwind cannot attach a `.dark` ancestor to an applied pseudo-element. The
light theme multiplies the light tile into everything beneath it, which keeps
warm hues. At the earlier 35 percent it cost roughly three percent lightness,
so at 90 percent expect roughly eight. The dark theme inverts the same asset
and screens it, so a near-black surface gains a matching amount instead of
losing it. Keep both blend modes paired when the opacity
changes.

Because the layer sits above the page and blends into it, every surface,
image, and control is grained by the same layer, and no component needs its own
grain. A surface painted with `bg-background` no longer hides the texture.

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

`ButtonIcon` owns the icon tone and icon-size contract. The default `plain` tone
renders the bare glyph directly after the label, with no background and no tile
padding. Its box is exactly the glyph size, `size-5` by default and `size-4` at
`sm`, and it does not clip its overflow, so the rollover glyph swap is clipped
by the button edge rather than by the icon box. The glyph uses the action's own
text color. CTA buttons use `plain`, so the `cta-sm` and
`cta-lg` sizes use symmetric horizontal padding, `px-4` and `px-5`, with the
shared 4px vertical inset and their minimum heights.

The `light`, `dark`, and `soft` tones render a filled tile, `size-11` or
`size-9` at `sm`, that clips its own overflow, for icons outside a button, such
as the course card link.

Icon names that express a repeated meaning belong in `app/lib/icons.ts`. A
one-time decorative icon may use a direct Lucide collection name when a semantic
alias would not improve clarity.

## Cookie notice

`SiteCookieBanner` is a small fixed notice in the bottom left corner of every
route. It uses the card surface, a border, and `shadow-xl`, because a floating
overlay is the elevation exception to the borders before shadows rule. On phones
it spans the viewport inset. From `sm` it settles into a compact panel in the
corner.

The notice sits at `z-70`, above the featured hero card's `50` scroll
transition layer, the `z-50` menu panel and trailing tooltip, and the `z-60`
header, and below the `z-80` overlay scrollbar. The home intro's `70` media
grid never meets it, because the layout withholds the notice until the intro
completes.

The notice has two bands. The explanation sits on top in foreground text with
`leading-snug`, and a `border-border` divider separates it from an action row
aligned to the end. It has no visible title. The panel and both actions use
`rounded-xs`, Tailwind's default `0.125rem`, so the notice reads as a crisp
utility surface rather than a rounded brand card.

It is an `aside` named "Cookie notice" through `aria-label` rather than a
dialog, because it never traps focus and never blocks the page. Its two actions
are `sm` buttons: "Decline all" in the `outline` variant and "Accept all" in the
`dark` variant. The `sm` size keeps them compact and outside the CTA rollover
and hover bounce, so they use the plain color hover and the shared press
feedback only.

The notice enters and leaves through a `Transition` with `:css="false"`, driven
by `useCookieBannerMotion`. It rises `24px` with a slight scale over `0.5s` on
`power3.out`, and it settles back down over `0.3s` on `power2.in` when answered.
The transition carries `appear`, so the notice animates on its first paint as
well as when the home intro finally releases it. Reduced motion resolves both
directions with `gsap.set`, so the notice still appears and still dismisses
without travelling.

Accepting writes `accepted` and declining writes `declined` to the
`byroose-cookie-consent` cookie for one year. Any future tracking must check for
`accepted` before it runs. Because the value is read through `useCookie`, the
server already knows whether to render the notice, so an answered banner never
flashes during hydration.

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
under a descriptive key, as the 448px slots of the trailing tooltip and the more
works frame do with `portrait` and `portrait-2x`. Repeating CSS background textures are the exception and are
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

### Home hero layout

The hero leads with the problem, the solution, and the action. From `lg` the
intro is a two-column grid. The description and the dark `cta-lg` action sit in
the flexible left column, and the title sits in an auto-width right column. The
column gap is `3rem`. Below `lg` the title stacks above the copy, which is
capped at `max-w-md`.

The title is bold with `-0.05em` tracking and `0.82` leading. Its longest line
measures about `6.8em`. The title is capped at `7.4em` below `lg` and `7.25em`
from `lg`, so it always wraps into the same four near-equal lines while leaving
the copy column as much width as possible. From `lg` its size is `text-hero`. Below `lg` it scales to the content width divided by
`7.6`, so a phone still shows four lines. Each line mask carries `0.22em` of
block padding, so ascenders and descenders are not clipped at the tight
leading. A negative bottom margin of twice that amount cancels the padding.
Only the bottom margin is negative, because adjacent negative block margins
collapse, and the title shifts up by the same `0.22em`. Do not make the title a
flex or grid container. SplitText measures lines with the words as direct
children, and those would each become an item on their own row.

The description is semibold with `-0.04em` tracking and tight leading, at
`text-xl` below `lg`. From `lg` it scales with the viewport at
`clamp(1.0625rem, 1.7vw, 1.75rem)`, about 24px at 1440 wide. It is capped at
`12.7em`, where ordinary wrapping gives six lines of nearly equal width. The
same wrap holds from about `12.25em` to `13.1em`, so the cap sits in the middle of
that range. The font and the title both scale with the viewport, and the
tracking is in `em`, so the wrap is identical at every desktop width and the
copy column stays wider than the cap down to 1024 wide. Chrome's balanced
wrapping does not even out these lines, so recheck the cap whenever the
description copy changes.

The hero is at least one viewport tall, minus the header, plus half a card
height, minus the `40px` dock offset. The media row therefore rests about half
visible at the bottom of the first screen, and the copy sits at the top.

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
The expansion reveals the site header `0.1s` after the label, and the header's
navigation links rise one by one from their masks at the same moment. The hero title
lines, the description lines, and the call to action start rising at that same
moment. Reduced motion must resolve directly to this complete state with
scrolling available.

The preloader has no curtain. Because both scrolling systems are pinned to the
document top, the only thing behind the centered stack is the hero section with
its title still masked, so an opaque cover would hide nothing worth hiding. The
media grid still lifts to `zIndex: 70` for the duration of the intro, which is
what keeps the cards above the page now that the page is visible behind them.

Render animated titles through the shared `SplitText` component. Its server
output must remain the complete text node for indexing and assistive technology.
After mount, the component may split into words, lines, or characters and pass
those elements to the consuming animation. The home title animates its generated
visual lines in order. Each fully opaque line rises from 150% below its own
clipping mask over `0.8s` with `power3.out` easing and a `0.1s` stagger. The
start is deeper than the usual 115% because the padded title masks would
otherwise show the tops of the waiting glyphs. The description lines and then the
call to action follow the same rise from 115% with a `0.06s` stagger. The action
rises inside a wrapper that clips it only during the intro, so the hover bounce
and focus ring are not cut off afterwards.

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

The copy paragraphs use `1.05` leading. That is
tighter than the glyphs, so each Studio copy word mask carries `0.16em` of
block padding cancelled by an equal negative block margin, which keeps
descenders inside the clip without moving the lines. The statement's word masks
carry `0.12em` the same way for its `1.06` leading.

Negative tracking ends a word's box slightly before the right edge of its last
glyph, so a word mask would clip that edge, as it did to the b in "Web". Every
`.split-text-word-mask` therefore carries `0.1em` of inline padding cancelled
by an equal negative inline margin. The clip box covers the full glyphs while
the layout, the word spacing, and the justification stay exactly as before.
The rule lives in the global `@layer components`, so every word mask on the
site gets it.

The founder photo is a landscape 4:3 image. It fills the full width of its
column in a 4:3 frame with `rounded-2xl` corners, so the frame matches the
source and nothing is cropped at rest. The frame is a wrapper around the
image, which lets the frame and the image carry different motion.

The frame follows with a top to bottom clip reveal. When its top edge reaches
82 percent of the viewport, its `clip-path` inset opens from the bottom edge
over `1.2s` with `power3.inOut`, and the inline clip is cleared once the image
is fully visible. The image inside it runs the same parallax as the case study
images: it is held at `1.3` scale and scrubbed from `-14` to `14` percent as
the frame crosses the viewport, so it lags behind its frame. Both use the
values in `app/lib/image-parallax.ts`. The copy words then use the statement's rise when the
copy column reaches the same line, with a tighter `0.01s` stagger because the
paragraphs hold many more words.

Every reveal runs once. Reduced motion displays the photo and every word in
their resting positions without a ScrollTrigger animation or parallax.

### Work section

The work section centers its heading, currently "What we've done", and gives
each case study its own full-width row. The heading keeps `section-title` for
its weight but overrides the font size and tracking in the component's own
scoped block. This heading is deliberately oversized: its clamp runs past
`text-hero`, so the section opens at display
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
from `-14` to `14` percent as the card crosses the viewport, with the values
shared through `app/lib/image-parallax.ts`, so it travels in
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
tighter padding, which the more works panel and the services images use. When
the size changes while the tooltip is already open, such as moving from the
last case card onto the more works panel, the padding, gap, thumbnail size and
radius, and label size transition over `0.5s` on the tooltip's
`cubic-bezier(0.19, 1, 0.22, 1)` curve, so the panel resizes smoothly instead of
jumping. The component only sets `data-resize="smooth"` when the tooltip was
already active before the change, so opening from a closed state still takes
the new size in one step, and reduced motion keeps every change instant. It opens from
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
circle of `clamp(9rem, 15vw, 15rem)` in the canvas `background` color. The
page's grain overlay textures it like the canvas, so it reads as a piece of the
canvas pushed up into the dark panel. A negative bottom margin of
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

Each service panel stacks its title at `text-service`, a description below
it, and an image below that. The panels use a narrower gutter than the
site-wide `section-gutter`, `clamp(1rem, 2vw, 1.5rem)` instead of
`spacing-page`, so the title, the description, and the image reach closer to
the viewport edges. The service names, "AI Content Creation" and
"Website Development", are set in title case. The intro title is not
selectable, so a drag across the pinned panel never highlights its words.

The title is left-aligned and starts at the left content edge. The description
sets at `text-2xl`, `text-4xl` from `md`, and `text-6xl` from `xl`, in the
default `foreground` color at weight 600 with `0.9` leading and `-0.04em`
tracking. It sits further below the title than the panel's default gap, with a
top margin of `1rem`, `2rem` from `md`, and `3rem` from `xl`. That leading is
tighter than the glyphs, so each line mask carries `0.12em` of top and `0.18em`
of bottom padding, each cancelled by an equal negative margin, which keeps
descenders inside the clip without moving the lines. Adjacent block masks
collapse their negative margins into the larger one, so the line pitch stays at
`1.02em`. On phones it
spans the full column. From `md` it takes the right two thirds of the content
width and ends exactly on the right content edge, so it reads as an editorial
column from just left of center to the right side. Its text is left-aligned,
and it uses `text-pretty` so the last line never holds a single word. The
image spans the full content width at the source's natural `1456 / 816`
ratio, so it is never cropped to fit the viewport.

Each service panel scrolls slower than the page, so the title, the
description, and a future video stay on screen together while the video
grows. While motion is enabled, the panel adds runway below its content
through `--service-runway`: one viewport height for the slowed travel plus the
image hold described below. The title, the description, and the image frame
slide down together through that runway as the panel crosses the viewport. The shared offset is applied to each child of
`data-service-content` rather than to the block itself, because a transform on
the block would make it an isolated group and stop its text from blending with
the dark backdrop. At 1440 by
900 the content moves about 0.7 times as fast as the scroll, and the text
reveal and the image scale stretch across the longer distance. Reduced motion
drops the runway.

Because the content moves, its own elements cannot serve as ScrollTrigger
triggers. Every text and image trigger is therefore a scroll position computed
from untransformed layout: `scrollWhen` takes an element's offset inside the
panel and a viewport line, and returns the scroll position at which that
element reaches that line once the slowed travel and the image hold are
accounted for. The panel itself is never transformed, so it stays a reliable
reference.

The service titles do not animate. Each is a plain `h3` that is visible in
the server output and at rest from the start, so the panel always names its
service. The title still anchors the description reveal: when the title
reaches 60 percent of the viewport, the description rises line by line from
`SplitText` line masks with a `0.1s` stagger set through
`lineRevealStagger` in `app/lib/word-reveal.ts`. Each description line takes
`1.5s` to rise with `power3` easing, which GSAP reads as `power3.out`, set
through `lineRevealDuration` and `lineRevealEase`. The journey step cards share
the same three values. Each mask rise uses the
recipe from `app/lib/word-reveal.ts`: 115 percent below the mask to rest.
Anchoring to the title keeps the reveal and the dark backdrop rise on the same
trigger, even though the description sits below the title. The lines and their
masks are block elements, because the split emits them as inline spans and a
transform has no effect on an inline element. The description uses
`SplitText`'s `autoSplit`, so its lines are split again whenever the fonts
load or its width changes, and a split line never wraps inside its own mask.
It splits into lines and words, with every word an inline block, so the
browser can only break between whole words. A plain line split lets the
browser break inside a hyphenated word such as "one-off" while SplitText
assigns the whole word to the first line, which makes that line too long for
the box. Each split line is also `white-space: nowrap`, so sub-pixel rounding
can never push its last word onto a second line.
`useServicesMotion` watches those re-splits. If the panel's text has already
started revealing, the new lines are shown at rest. Otherwise the panel's text
timeline is killed and rebuilt with the new lines inside the same GSAP media
context, so it is still reverted with the rest of the section.

The image is scrubbed with the scroll in three phases, so a future video gets
time on screen. It scales up from zero around its bottom center from the moment
it enters the viewport until it is centered in the viewport, easing out with
`sine.out` to `0.75`, set through `mediaHoldScale`. It then holds for two
viewport heights of scroll, set through `mediaHoldLength`. During the hold the
content travels with the scroll, so the image stays near the viewport center
and only drifts up by `0.1` of the scrolled distance, set through
`mediaHoldDrift`. Across the first half of the hold the image keeps growing
slowly and linearly to its peak of `0.8`, while the picture inside finishes
easing from `1.3` scale to rest. Across the second half it shrinks just as
slowly back to `0.75` around its top center. When the hold ends the content
returns to its slowed travel, and the image drops quickly to zero with
`sine.in`, finishing as it leaves the top over the same scroll distance as
before the hold existed. The two halves of the hold use custom eases built from
the trigger's measured span, because the hold length depends on the viewport.
The image never reaches its full layout size. Entry and exit live on two nested
elements, the link for the bottom origin entry and its wrapper for the top
origin exit, so the transform origins never fight.

Each image is a `NuxtLink` to the `/services` route, named for its service
through `aria-label`. Hovering it opens the services section's TrailingTooltip
at its `compact` size with the service image and the label "More Details". The images are decorative
placeholders from `public/images/hero` and will be replaced with real service
media.

Each service declares a `surface`. The Website Development panel uses `dark`,
so it renders a `foreground` backdrop behind its content. Its title and
description are set in `background` with `mix-blend-mode: difference`, so they
read dark over the canvas and cream over the backdrop, including the moment the
rising edge crosses a line. The backdrop covers the panel's full width and
height, including its runway, and ends at the panel's bottom edge, so the
section's closing `spacing-section` stays on the canvas before the journey
section. The backdrop sits at `-z-10`, so the previous panel's content still
paints above the dark surface while the two overlap.

The blend only works while nothing between the text and the canvas forms an
isolated group. Keep the section, the panel, and `data-service-content` free of
`isolation`, `z-index` stacking, opacity below one, filters, and transforms.
Motion that moves the text must transform the text elements themselves.

The backdrop rises from the bottom center of the viewport just ahead of the
panel's text. `backdropRevealDelay` in `useServicesMotion` places its start
between the moment the panel top enters the viewport bottom, at `0`, and the
title and description reveal, at `1`, which begins when the title reaches 60
percent of the viewport through the shared `textRevealStart` position. It
currently sits at `0.7`, closer to the text reveal. A scrubbed
`clip-path` inset with a `32px` corner radius then grows from zero to the full
viewport over `0.8` of a viewport height of scroll, set through
`backdropRiseLength`, so the dark top edge climbs at 1.25 times the scroll
speed. Raise that length to slow the growth and lower it to quicken it. It is anchored to the viewport bottom throughout, so it
reads as one card scaling up from the bottom center, and its radius resolves to
zero as it fills the screen. The backdrop extends one viewport above the panel
through `--service-backdrop-lead`, and the final inset keeps the dark surface
starting exactly where the viewport top was when the rise completed. The tween
uses a linear ease because the bottom anchor depends on the clip moving in step
with the scroll.

The backdrop is a wrapper around two layers. `data-service-backdrop-surface`
carries the dark fill and the rise clip. `data-service-backdrop-curve` hangs
from the wrapper's bottom edge: a half ellipse 150 percent of the panel width,
centered so its sides run past the viewport, `clamp(4rem, 10vw, 10rem)` tall,
and resting at `scaleY(0)` from its top edge. The rest state is a plain CSS
`transform` rather than Tailwind's `scale-y-0`, because that utility writes the
separate `scale` property, which would stack with the transform GSAP writes.

As the reader leaves the panel, one scrubbed timeline grows the curve
to full height and moves the whole wrapper so the curve's tip travels down
through the section's closing `spacing-section`. The wrapper's offset is the
closing space times `backdropExitReach` minus the curve's height, so the tip
reaches that share of the closing space by the end. At `1` the tip ends at the
services section's bottom edge, just the journey section's top padding above
the journey title, which keeps the dark panel close to the title it spawns.
Lower the reach to leave more canvas between them. The tip never passes the
section's bottom edge, so it never covers the journey section. The landing wrapper's horizontal clip hides the
curve where it runs past the viewport. The timeline starts at the end of the
image hold, the shared `holdPoint` position where the image begins its quick
exit, so the curve and the quick exit begin together. It ends when the panel's
bottom edge reaches the viewport top.

Reduced motion drops the intro pin, every reveal, the image scale, and the
backdrop rise and curve. It displays the intro title words, the
descriptions, and the images at rest, and the dark panel keeps a
flat backdrop without the lead.

### Journey section

The journey section opens with its title, currently "Working process", set in
uppercase on one line that always spans the full width of the section gutter.
The gutter is an inline-size container, and the title sets
`calc(var(--journey-title-size) * var(--fit-text-scale, 1))`. The
`--journey-title-size` of `11.2cqi` is measured from Switzer bold at `-0.05em`
tracking, so the server render and the first paint already sit within about a
percent of the edge. `useFitText` then compares the title's rendered width with
its parent's content width and writes the correcting `--fit-text-scale` on the
title whenever its box resizes, which covers font loading, the character split,
and viewport changes. The title is `w-max` with `0.05em` of end padding, so its
box includes the last letter's ink instead of ending at the trailing negative
tracking. If the title copy changes, measure the new phrase and update
`--journey-title-size` so the first paint stays close to the fitted size.

The title is spawned by the services section's dark curve. As the dark panel
above bows into its arc and reaches toward it, the title's characters appear
beneath it one after another in reading order. Each character drops from `-110`
percent of its height above its resting place, grows from `0` scale from its
top edge, and turns from `-24` degrees to upright over `1.1` seconds with a
`power3.out` ease and a `0.045` stagger. The reveal is not scrubbed. It plays
once when the title's top reaches 85 percent of the viewport, which falls
inside the curve's exit, and then runs on its own timing so the characters
settle smoothly whatever the scroll speed. The arc's tip stops at the services
section's bottom edge, so the characters always settle on the canvas. The
trigger uses a `refreshPriority` of `-2`, so it measures after the services
section's pin and triggers above it.

The steps follow the title as a stack of full-height cards. Each step is a
`data-journey-slide` exactly one `100svh` tall, holding a
`data-journey-slide-frame` with `clamp(1rem, 2vw, 1.5rem)` of padding, the
panel inset the services section uses, and `perspective-distant`, which is
`1200px`. The JourneyStepCard fills the frame with a `rounded-2xl` corner and
its theme surface. From `md` it is a two-column grid
with two rows, packed to the top. The first row pairs the title on the left
with an uppercase "STEP" label and the step number on the right, aligned to the
column's right edge and to the bottom of the row. The label shares the title's
weight and tracking at `0.75` of its size, through the card's
`--journey-step-display` and `--journey-step-label` variables. It is a dimmed
copy of the card's own text color, `text-current/25` on the white card and
`text-current/40` on the blue and orange cards, so it reads as a quieter
companion to the title rather than a second black heading. The second row pairs
the description on the left with the image on the right. The rows sit
`--journey-step-row-gap` apart: `2rem` below `md`, `3rem` from `md`, and `4rem`
from `xl`, which keeps the description clearly apart from the title. The image
pulls up by that gap plus `0.3` of the label size, so it overlaps the bottom of
the step label, and it is `relative`, so it paints over the label. Below `md`
the card stacks the title, the description, the step label, and the image,
which fills the remaining height, with the same overlap.

Each card ends its text column with a `cta-lg` call to action under the
description, `gap-8` below it, `gap-10` from `md`, and `gap-14` from `xl`, that
routes to `/services`. Every step has its own label, set through the step's `action`
field: "Explore the diagnosis", "See what we build", and "See how we scale".
The white card uses the `dark` variant, and the blue and orange cards use
`light`, a white `bg-card` button with `card-foreground` text, so the action
reads as a clean white pill on the saturated surface rather than the beige
`cream`. The orange card's light action overrides its rollover tones to
`blue`, `green`, and `dark`, because the variant's default `primary` entry
tone would match the orange card.

The description is set at `text-xl`, `text-2xl` from `sm`, and `text-3xl` from
`xl`, with a `1.05` leading, `-0.045em` tracking, `font-medium`, and a `32ch`
measure. It inherits the surface's text color, so it matches the title. The
image takes the right column at a `16/11` ratio from `md`. The images are
`object-cover` NuxtImg crops of the 1456 by 816 hero placeholders in
`public/images/hero`, `1.png`, `5.png`, and `2.png` in step order, lazy
loaded with the services panel's `sm:1024px md:1280px lg:1536px` sizes, which cover a roughly square crop on
phones and the `16/11` crop of a half-width column up to a 2560px viewport.
Replace them with real process imagery when it exists.

The title and the step label must never clip at their column's right edge. The
card is an inline-size container, and `--journey-step-display` is
`min(var(--text-step), 20cqi)` below `md` and `min(var(--text-step), 9.5cqi)`
from `md`, where a column is just under half the card. The title uses it
directly and the label uses `0.75` of it. They hold `text-step` until the
column gets too narrow and then shrink with it, which keeps a word of about
nine letters on one line. Longer titles wrap between words, and a single word that is still too
wide breaks through `overflow-wrap: break-word` instead of overflowing. The
title's line masks span its full column rather than the text, and every mask,
including the step label's, extends `0.15em` past its end with a matching
negative margin, so the last letter's ink, which overhangs the line box under
negative tracking, is never cut.

Every card but the last pins its frame for one viewport of scroll once the
slide's top reaches the viewport top, with `pinSpacing` off, so the next slide,
which is `relative` and later in the document, scrolls up over the pinned card.
While it is covered, one scrubbed timeline scales the card to `0.7`, tilts it
back `40` degrees around its horizontal axis, and turns it a random amount up
to `5` degrees either way with `power1.in`, then fades it out with
`power1.inOut` over the last quarter of the pin. The last card does not pin, so
the section ends on it.

Each card's text reveals as it arrives, all at once. When the card title
reaches 82 percent of the viewport, the title, the step label, the description,
and the call to action start rising together from their own masks: the title
and the description line by line from their `SplitText` line masks, and the
step label as one line from its clipping paragraph. All of them share that one
trigger and use the shared line reveal timing: `1.5s`, `power3`, and a `0.1s`
stagger between lines. The call to action belongs to the description's reveal
and rises the way the hero action does, without any fade. Its `data-journey-step-cta-mask`
wrapper is clipped to `inset(0)` and the inner `data-journey-step-cta` block
starts `115` percent below it, the shared `wordRevealOffset`, then rises to rest
with the same duration and ease, starting with the first description line
rather than after the last one. The transform and the clip are cleared at the end, so the button's focus
ring and hover rollover are never cut by the mask. The title and the description re-split their lines on resize. A
re-split before its reveal rebuilds that reveal with the new lines, and a later
one shows them at rest. The line masks carry `0.12em` above and `0.2em` below with matching
negative margins, so the tight leading never clips a descender. The image
wrapper reveals at the same 82 percent point with the Studio portrait's clip:
an inset that opens from the bottom over `1.2s` with `power3.inOut`, cleared at
the end.

Reduced motion shows the title and every card at rest, without the reveals and
without the pin, so the cards simply follow one another.

### Blog section

The blog section is a white panel on the canvas. The section takes the
journey slide inset, `clamp(1rem, 2vw, 1.5rem)`, on both sides and
`spacing-section` below it before the FAQ. Inside, a `bg-card` panel with
`rounded-2xl` corners holds the `section-gutter` and `py-16`, `py-20` from
`md`, and `py-24` from `xl`. The heading row pairs the "More Than a Blog" title,
set in title case at the user's request, with a `dark` `cta-lg` "All articles"
action that routes to `/blog`, aligned to the row's bottom edge. The row wraps,
so on phones the action sits below the title. The title keeps `section-title`
for its weight and tracking but sets its own size,
`clamp(2.75rem, 9vw, 9rem)`, about 130px at 1440 wide, larger than
`text-section`, at `0.92` leading.

Three `BlogCard`s follow in one column below `md` and three columns from `md`.
Each card is a `NuxtLink` painted with a `surface-*` utility through its
`tone` prop, which accepts `pink`, `yellow`, and `green`, used in that order.
The card is `rounded-2xl` with `p-3`, so its `rounded-xl` image sits inset in
the tint. The image is a decorative 4:3 `object-cover` crop of a 16:9 hero
placeholder with an empty alt, because the title names the link. Below it come
the title and a meta row that pairs the category pill on the left with the
publishing date on the right. The title is semibold at `text-2xl`, `text-xl`
from `md`, `text-3xl` from `lg`, and `text-4xl` from `xl`, with `0.95` leading
and `-0.045em` tracking. The meta row tracks at `-0.02em`. The pill uses
`bg-current/10`, so it tints itself from the card's foreground on every
surface. The date is a `time` element whose label comes from
`formatPublishDate`. The meta row sits at the bottom of the card through
`mt-auto`, so the rows align across cards with titles of different lengths. It
is `text-xs` from `md` until `xl`, which keeps the date beside the pill from
1024 wide. On narrower three-column cards the date wraps below the pill.

`useBlogMotion` reveals the section. When the heading row reaches 82 percent of
the viewport, the title words rise from their `SplitText` word masks with the
shared word reveal, `0.8s` on `power3.out`, but with a wider `0.12s` stagger
than the shared `0.03s`, because a four word title would otherwise read as one
movement. The word
masks carry `0.15em` of block padding cancelled by an equal negative margin for
the tight leading. The action follows one stagger step after the last word,
rising the same way as the journey call to action: its `data-blog-cta-mask`
wrapper is clipped to `inset(0)` while the inner `data-blog-cta` block rises
from `115` percent, and both the clip and the transform are cleared at the end
so the focus ring and the rollover are never cut.

The cards themselves do not animate, so the tinted surfaces and the images are
always at rest. Only their text reveals, from each card's own trigger at the
same 82 percent line. The title rises line by line from its `SplitText` line
masks with the journey card timing, `1.5s`, `power3`, and a `0.1s` stagger, and
the meta row rises as one line from its clipping wrapper one stagger step after
the last title line. Cards that share a layout row, measured by their
`offsetTop` when they enter, start their text `0.15s` apart, so the desktop row
reads as a stagger while stacked phone cards each reveal as they arrive
without waiting. The title splits into lines and
words with every word an inline block, so the browser never breaks inside a
hyphenated word such as "AI-generated". Each line is `white-space: nowrap`,
and its mask extends `0.12em` above, `0.2em` below, and `0.15em` past its end
with matching negative margins. The title uses `autoSplit`. A re-split before
the card reveals rebuilds that card's reveal with the new lines, and a later
one shows them at rest. Reduced motion shows the title, the action, and every
card at rest without any reveal.

Hovering a card blurs only its image, to `12px`, and brings a "Read Article"
action into the center of the image. The title, the meta row, and the tinted
surface stay sharp. The image also scales to `1.1` while it blurs, so the
blur never softens the edges of its rounded frame, which clips it. The action
is the shared `dark` `cta-lg` button rendered as a `span` with an arrow right
glyph, inside an overlay on the image frame that is hidden from assistive
technology, because the whole card is already the link and a link cannot
contain another control. Its wrapper carries a soft `shadow-xl` in
`foreground` at 25 percent with the action's `radius-action` corners, because
the button's own rounded clip would cut a shadow placed on it. The shadow lifts
the action off the blurred image, which is the floating layer exception to the
borders before shadows rule. It rests at zero opacity, `0.9` scale, and `1rem`
below center, and the blur, the image scale, and the action all settle over
`0.5s` on the tooltip's `cubic-bezier(0.19, 1, 0.22, 1)` curve. The action only
accepts the pointer while it is visible, so its rollover runs once the reader
moves onto it. The hover state applies only to `(hover: hover)` pointers, so a
tap on a touch screen opens the article without blurring first. Visible
keyboard focus shows the same state, and reduced motion switches between the
two states without the transition.

The articles, dates, and images are placeholders until real posts exist, and
every card links to `/blog`.

### FAQ section

The FAQ section pairs the "Frequently Asked Questions" title, set in title case
at the user's request, with a single collapsible accordion. From `lg` it is a
`5fr 7fr` grid, so the accordion takes the wider right column. Below `lg` the
title stacks above the accordion. The title keeps `section-title` for its
weight and tracking but sets `clamp(2.75rem, 7vw, 6.5rem)` at `0.92` leading,
larger than `text-section`, which sets it on three lines from `lg`.

Each item is a question row and a collapsible answer. The question is
`font-medium` at `text-xl`, `text-2xl` from `md`, and `text-3xl` from `xl`,
with `-0.03em` tracking, and the row's block padding grows from `py-7` to
`py-9` at `md` and `py-11` at `xl`. The answer is muted copy at `text-lg`,
`text-xl` from `md`, and `text-2xl` from `xl`, with `1.2` leading and a `44ch`
measure. A one-pixel `border` divider sits between items, never after the
last one. The icon is a bare glyph with no tile: two Lucide `minus` bars in
one grid cell, one of them rotated `90` degrees to form a plus. Opening an item
turns that bar back to the left, so the plus becomes a minus.

The title rises line by line from `SplitText` line masks with the services
description timing, `1.5s`, `power3`, and a `0.1s` stagger, when it reaches 82
percent of the viewport. When the accordion reaches the same line, each item's
question and icon rise together from their own masks, and its divider draws
from the left, with items `0.08s` apart. The title uses `autoSplit`. A re-split
before the reveal rebuilds it, and a later one shows the lines at rest.

Opening and closing are driven by `useFaqMotion` rather than the accordion's
CSS keyframes. The answer region is force-mounted, so it is always laid out
and its lines are split before it opens, and it rests at zero height with
hidden visibility while closed. A toggle tweens the region's height and the
icon bar's rotation over `0.7s` on `power4.inOut`, the More works action's
timing. As an item opens, its answer lines rise from their masks with the same
line reveal timing as the title, starting with the expansion. Opening another
item closes the previous one on the same timing. Reduced motion shows every
reveal at rest and switches items instantly.

The questions and answers are placeholder copy until the real policies are
confirmed.

### Header motion

The site header has full and compact sticky states. The full state, with the
primary navigation, exists only at the top of the page. The header compacts once
the reader has scrolled `96px` down and stays compact while they scroll back up,
returning to full only within `24px` of the top. The logo stays visible in both
states. The compact state keeps the Start a project action visible and pairs it
with a single responsive SiteMenu control labelled "Menu" in uppercase. The
control uses the same dark action surface, `radius-action` corners, and `44px`
height as the CTA, with a fixed `w-26` width. Its glyph is two horizontal
one-pixel lines with no tile behind them that morph into an X when expanded.
The control has no hover motion, only the shared press feedback. Activating it
opens its own menu and never restores the primary navigation. There is no
separate mobile dropdown.

Both header actions share the dark action surface, so over a dark block they
gain a one-pixel `background/20` border that keeps their outline readable. The
dark blocks are the More works panel, the services backdrop surface and curve,
and the site footer, each marked with `data-header-surface="dark"`.
`useHeaderSurface` sets the state from what is actually behind the header
actions. The menu control receives it through its `bordered` prop and fades its
own border color, the same color it uses while expanded. The Start a project
action receives `data-bordered` and fades in an `::after` ring with inherited
radius above its rollover layers rather than a real border, because a filled
rollover host must stay borderless. Both fades take `0.3s` and are instant under
reduced motion. Mark any new dark block on the element that paints it.

The primary navigation is plain text: no surface, padding, or shadow on the
`nav` or its links. It lists Home, About, Works, Services, Blog, and Contact.
Each `SiteNavLink` sets its label in uppercase at `text-lg` and stacks a hidden
copy in the same grid cell. The header's Start a project action is uppercase
too. On hover or visible keyboard focus, `useNavLinkMotion` scales the
label to zero toward its top center while the copy scales up from zero at its
bottom center, and a one-pixel underline below the label draws outward from its
center. All three share the More works action's `0.7s` `power4.inOut` timing,
and leaving reverses them. The copy and the underline rest at zero scale in CSS
so they never flash before hydration. Reduced motion switches states instantly.

The navigation links rise into place one by one when a page loads. Each link sits
in its own `site-nav-item` mask, which carries `0.25em` of padding cancelled by
an equal negative margin so the hover underline and the focus ring stay inside
the clip. Every link rises from 115 percent below its mask with the shared
`addWordReveal` recipe, `0.8s` on `power3.out`, with the `navRevealStagger` of
`0.08s` from `app/lib/word-reveal.ts`. On the home route the intro timeline runs
this reveal at the same `expand+=0.1` position as the header reveal. On every
other route `useSiteHeaderMotion` runs it after mount. Until the reveal finishes
the `nav` has no `data-nav-revealed` attribute and its links stay hidden in CSS,
so a server-rendered link never flashes before it rises. Reduced motion shows
the links at rest without the rise.

The header logo always renders a real link to the home route so it stays
crawlable and opens in a new tab on a modified click. On the home route a plain
click scrolls smoothly to the top through the shared Lenis contract instead of
repeating the current navigation. Every other route follows the link.

Drive header state from the shared Lenis scroll subscription and animate it with
the component-scoped GSAP toolkit. Keep transitions quick, interruptible, and
limited to transforms and opacity. Reduced motion must switch between complete
states without animated travel.

The expanded menu is a dark panel with the control's `radius-action` corners, teleported to Nuxt's shared overlay
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
the compact state. The action's server-rendered `translate-x-28` offset therefore
equals the control's fixed width plus the `0.5rem` gap. Offset the two rather than running them in step, so one is
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
overshoot when the pointer leaves. The `cta-sm` and `cta-lg` button sizes share
this motion character.

Every size of the shared button primitive and the header navigation control
also enable press feedback. Pointer down and keyboard activation scale the control to `0.96`, then
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

The rollover tweens the icon slot's text color together with the original
label, from the resting color to the copied label's color, so a `plain` glyph
follows the final layer's foreground.

The icon box stays put. CTA buttons pass their `ButtonIcon` through the named
`icon` slot, which renders after the layers and is positioned so it paints above
them. Only the glyph animates. `ButtonIcon` renders its glyph twice into the same
grid cell and parks the second copy below and to the left of the button. The
rollover host clips both glyphs, so the swap travels across the whole button
instead of being cut out around the icon: the original leaves along the arrow's
45 degree diagonal through the upper right edge while the copy arrives at rest
from the lower left. The travel on each axis equals the host's `clientHeight`,
read when each swap starts, so the parked copy always sits fully outside the
host whatever its size. Before the composable mounts, CSS parks the copy at
`translate(-300%, 300%)`, which is already outside every CTA size. Both glyphs
are ordinary spans rather than the raw SVG, which keeps their transforms
predictable. The independent text grid keeps both labels aligned, so
the copied label does not need an icon-width reserve.

An arrow right glyph swaps horizontally instead. `ButtonIcon` marks its box
with `data-rollover-glyph-axis="x"` and the `button-icon-slide` class, which
clips the box to the glyph. The original slides out through the right edge of
that box while the copy, parked one box width to the left, slides in to rest.
The travel is the box's `clientWidth`, read when each swap starts. Because the
icon box itself clips, the copy never crosses the label on its way in. Every
other glyph keeps the diagonal swap.

Render the swap in the template rather than cloning a node at runtime. The icon
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

The rollover is not limited to buttons. Any element can join by becoming a
clipped positioning host with the data attributes below.

Layer colors belong to the variant, not to the motion. `variantRolloverTones` in
the button module maps each participating variant to a tuple of three semantic
surface names:

| Variant | Layer sequence |
| --- | --- |
| `default` | blue, green, dark |
| `dark` | green, pink, primary |
| `outline` | primary, green, dark |
| `cream` | primary, green, dark |
| `light` | primary, green, dark |

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
