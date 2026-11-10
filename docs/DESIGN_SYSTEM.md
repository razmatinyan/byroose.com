# forrrow design system

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

| Token                                                             | Visual role                                                     | Intended use                                                                                                                                    |
| ----------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `background`                                                      | Neutral off-white, `#FCFCFC`                                    | Main page canvas                                                                                                                                |
| `brand-cream`                                                     | Warm cream, `#F5EBDD`                                           | Cream brand surfaces                                                                                                                            |
| `foreground`                                                      | Near-black ink                                                  | Primary text and dark surfaces                                                                                                                  |
| `card`                                                            | White                                                           | Elevated and contained content                                                                                                                  |
| `panel`                                                           | Soft sand, `#F5E8D4`                                            | Large panels that sit on the canvas, such as the blog section                                                                                   |
| `paper`                                                           | Light cream, `#F5EEDE`                                          | The site footer and the first working-process card                                                                                              |
| `canvas-shade`                                                    | Neutral grey, `oklch(0.955 0 0)`                                | A grey band one step below the canvas, such as the About team section                                                                           |
| `primary` and `ring`                                              | Orange-red, `#FF3C00`                                           | Primary actions, emphasis, and high-energy sections                                                                                             |
| `secondary`                                                       | Cobalt blue                                                     | Alternate brand surfaces and supporting emphasis                                                                                                |
| `brand-green`                                                     | Saturated green, `#0B9E5A`                                      | Positive editorial surfaces and varied content cards                                                                                            |
| `brand-yellow`                                                    | Butter yellow, `#F8E5AA`                                        | Warm editorial surfaces and selective highlights                                                                                                |
| `brand-violet`                                                    | Vivid violet, `#7C3AED`                                         | Expressive editorial surfaces and selective highlights                                                                                          |
| `accent` and `brand-pink`                                         | Soft pink                                                       | Playful highlights and alternate surfaces                                                                                                       |
| `brand-pink-tint`, `brand-blue-tint`, and `brand-green-tint`      | Very light pink, blue, and green, near `oklch(0.955)`           | Quiet tinted blocks that use the default `foreground` ink, such as the Services offer blocks                                                    |
| `brand-orange-deep`, `brand-violet-deep`, and `brand-yellow-deep` | Deep, low-chroma orange, violet, and yellow, near `oklch(0.27)` | Quiet tinted blocks on a `foreground` dark surface with `background` ink. They turn light in the dark theme, where that surface turns light too |
| `muted`                                                           | Pale warm neutral, `#EEE3D5`                                    | Quiet backgrounds and placeholders                                                                                                              |
| `brand-soft`                                                      | Mid neutral                                                     | Secondary labels and low-emphasis copy                                                                                                          |
| `brand-subtle`                                                    | Dark neutral                                                    | Editorial body copy below primary emphasis                                                                                                      |
| `ribbon`                                                          | Fresh green, `oklch(0.82 0.16 135)`                             | The decorative Studio ribbon stroke                                                                                                             |
| `ribbon-shade`                                                    | Deeper green, `oklch(0.66 0.15 142)`                            | The ribbon's shading where it passes under itself                                                                                               |
| `ribbon-foreground`                                               | Near-black ink                                                  | Text on a `ribbon` surface                                                                                                                        |
| `destructive`                                                     | Alert red                                                       | Destructive and error actions only                                                                                                              |
| `border`, `input`, and `ring`                                     | Semantic controls                                               | Boundaries, fields, and focus indicators                                                                                                        |

`brand-blue` and `brand-pink` are explicit brand aliases. Generic components
should prefer `secondary` and `accent`. Brand aliases are appropriate when the
color itself is part of a forrrow composition. `brand-cream` no longer matches
the canvas, so use it only when a surface must read as cream.

Orange, blue, green, and violet surfaces use white foregrounds. Yellow and pink
surfaces use dark ink foregrounds. Copied labels over dark rollover surfaces use
`primary-foreground`. Keep each brand color paired with its foreground token so
color behavior remains consistent in both themes. Text selection uses the same
pair, white `primary-foreground` on the orange `primary`, through the global
`::selection` rule.

The light canvas is a neutral off-white, about `#FCFCFC` or
`oklch(0.99 0 0)`, and the creams sit on it as distinct surfaces. Do not set
the canvas to pure white. Every warm surface steps clearly below the
canvas, so none of them reads as the page itself. `paper`, at
`oklch(0.95 0.022 84)`, is a light cream for the footer and the first
working-process card. Keep `background` and `paper` visibly different whenever
either changes. `brand-cream` sits at nearly the same value,
`oklch(0.9441 0.0215 76.53)`, so do not place a `brand-cream` surface on
`paper`. `muted` sits a step darker and slightly toward yellow at
`oklch(0.9208 0.0221 73.14)`, so quiet surfaces stay visible on the canvas.
`panel` is a soft sand between `brand-cream` and `muted` at
`oklch(0.935 0.03 79)`, so the blog panel reads as a deliberate block of
color. It pairs with the ink `panel-foreground`, and in the dark theme both
match the dark `card` pair. The dark theme uses the cream, `oklch(0.9441 0.0215 76.53)`, for
its foreground, card, popover, accent, and cream foreground tokens. Change
`brand-cream`, `muted`, and those dark foregrounds together, then recheck
`muted-foreground`, `brand-soft`, and `brand-subtle` against the canvas and
`muted`, and recheck them against `panel` and `paper` when those change.
`brand-soft` on `muted` is the tightest pair at about 4.75:1.

`canvas-shade` is neutral rather than warm, so it reads as a grey version of
the canvas instead of another cream. It pairs with the ink
`canvas-shade-foreground`, and in the dark theme it sits one step above the dark
canvas with the cream foreground. Its `ribbon-foreground` is the ink in the light theme and the
cream in the dark theme, where the ribbon itself turns a deeper green.

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
  `clamp(2.5rem, 7.65vw, 8.25rem)`, about 110px at 1440 wide. See Home hero
  layout for how the hero title uses it.
- `text-display` is the largest title size. It sets
  `min(clamp(3.5rem, 11vw, 12rem), 12vw)` at `0.88` leading, about 158px at
  1440 wide. The site call to action title and the project title block use it.
- `text-section` is the default major section heading.
- `text-statement` supports large editorial body statements.
- `text-service` sets the service panel titles at
  `clamp(3.25rem, 8.5vw, 10rem)`, about 122px at 1440 wide, where the longest
  name still holds one line. Its leading of `1.08` leaves room for the
  descender of "Development". The titles are plain headings without a reveal
  or a mask.
- The Why Choose Us title has no size token, because it fits its
  container. See Why Choose Us section.
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
softness. Controls use `radius-action`, which maps to `radius-sm`. Every
Button size uses it, from `xs` and the icon sizes to the CTA sizes, so every
action shares the header call to action's compact corner. Only the round
`cta-icon` size is fully rounded. A container that groups buttons with a
`p-1` inset adds that inset to the radius so the curves stay concentric.

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
page element, including the header, overlays, the trailing
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

The tile must stay lossless. A lossy codec cannot encode random noise, so it
substitutes a field with the right per-pixel statistics but roughly double the
variance at the four to eight pixel scale, which reads as mottling across a large
flat canvas. Quality level does not change that, so there is nothing to buy by
paying for it. Tile dimensions only set the repeat period. One image pixel is
always one CSS pixel, so resizing the asset never changes how coarse the grain
looks.

The texture, its opacity, and its light blend live in the `canvas-grain` utility.
The body layer is its only consumer, and one opacity value tunes the whole
effect, currently `opacity-85`. The dark override sits next to the `body::before` selector, because
Tailwind cannot attach a `.dark` ancestor to an applied pseudo-element. The
light theme multiplies the light tile into everything beneath it, which keeps
warm hues. The dark theme inverts the same asset
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
  focus states, disabled states, and attribute forwarding intact. The tabs
  primitive keeps the Shadcn defaults; the pricing switcher restyles it.
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

### Wave underline

`WaveUnderline` is the shared decorative SVG for a thick repeating wave that
draws from left to right. The component renders one stroked path and owns no
surrounding surface, so it can sit on any section background. Its `color` prop
defaults to `currentColor`; consumers can inherit a semantic text color or pass
a CSS color value such as `var(--color-ribbon)`. `strokeWidth`, `duration`, and
`delay` tune its appearance and entrance without changing the artwork.

The `drawn` prop defaults to `true`. Changing it to `false` erases the path back
to its starting point, and changing it to `true` draws it again. The motion uses
the shared GSAP DrawSVG integration and resolves immediately to the requested
state when reduced motion is enabled. The SVG is decorative and stays outside
the accessibility tree. The services intro title is its first consumer and
toggles `drawn` from its scrubbed word reveal.

The `animated` prop defaults to `true`. Setting it to `false` makes the line a
permanent mark: the path is visible in the server output and stays at its
`drawn` state without any entrance, so it never waits for hydration or plays a
draw. The footer slogan uses this mode.

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

UI icons use the Phosphor Iconify collection, `ph`, through Nuxt Icon, always
in its bold weight, so every name ends in `-bold`. The only exception is the
Lucide `loader-circle` spinner, the one icon kept from Lucide. Canonical names
live in `app/lib/icons.ts`; add shared semantic icons there instead of placing
Unicode glyphs or package-specific icon components in templates. Both
collections are installed locally and the known icons are client-bundled, so
rendering never depends on the public Iconify API. Phosphor glyphs are filled
paths, so adjust their weight by choosing the variant, never with
`stroke-width`.

`ButtonIcon` owns the icon tone and icon-size contract. The default `plain` tone
renders the bare glyph directly after the label, with no background and no tile
padding. Its box is exactly the glyph size, `size-5` by default and `size-4` at
`sm`, and it does not clip its overflow, so the rollover glyph swap is clipped
by the button edge rather than by the icon box. The glyph uses the action's own
text color. CTA buttons use `plain`, so the `cta-sm` and
`cta-lg` sizes use symmetric horizontal padding, `px-4` and `px-5`, with the
shared 4px vertical inset and their minimum heights.

The `cta-icon` size is a round `size-13` icon-only action that keeps the CTA
rollover. It renders no text grid, so it needs an `aria-label`, and its host
clip uses a fully round radius instead of `radius-action`. A consumer may
resize it, as the home blog section does to match its title. The `ribbon` variant
fills it with the `ribbon` green and the `yellow` variant with butter yellow.

The `light`, `dark`, and `soft` tones render a filled tile, `size-11` or
`size-9` at `sm`, that clips its own overflow, for icons outside a button, such
as the course card link.

Icon names that express a repeated meaning belong in `app/lib/icons.ts`. A
one-time decorative icon may use a direct Phosphor bold name when a semantic
alias would not improve clarity.

## Site call to action

`SiteCtaSection` closes every route, between the page and the footer. It is a
light `background` section with `foreground` text that fills at least the
viewport. From `lg` it splits into two equal columns: the copy on the left,
left-aligned and aligned to the top behind only the `page` gutter, so it
lines up with the top of the projects marquee on the right.
Below `lg` the copy comes first and the marquee follows as a row. Its copy comes from `app/lib/site-cta.ts` by route. The
default title is "Turn your social media views into leads?" on two
bold lines, "Turn your social media" and "views into leads?", at 85
percent of `clamp(1.75rem, 8.6vw, 9.5rem)` with `0.9` leading and `-0.05em` tracking.
That is smaller than `text-display`, because the lines are longer than the old
title's, and the floor keeps "Turn your social media" on one line down to 320
wide. The Services route asks "Not sure which marketing service you need?"
with its own description. The AI content creation route says "Get AI content
that turns views into leads" on the lines "Get AI content that" and "turns
views into leads" with no description, so the action follows the title
directly. The web development route says "Get a website that turns your views
into leads" on the lines "Get a website that turns" and "your views into
leads", also with no description. Every Blog page, the category pages, and every post ask "Want this done for
your brand?" on the lines "Want this done" and "for your brand?" with the
description "We make the AI content and build the website, so nothing leaks
in between." The Work route asks "Want work like this for your brand?" on the lines
"Want work like this" and "for your brand?", with no description. The About
route says "Work with an AI
content and web development agency" on the lines "Work with an AI content" and
"and web development agency", with no description. Every route title
renders at the shared 85 percent default `titleScale`, which a route can
override. The title is `w-max` and `useFitText` scales it down,
never up, when its longest line is wider than the copy column, so a longer route
title still holds two lines at every width. Below it sits a description in `font-medium`
`foreground/60` at `text-xl` and `text-2xl` from `md`, held to `38ch` with
balanced wrapping, then a large `default` Start a project
action to `/contact` with an arrow right glyph and the hover bounce. When the title reaches 82 percent of the viewport, its
lines rise one after the other from their line masks, with the shared word
reveal, `0.8s` on `power3.out`, and the title line reveal's `0.1s` stagger.
The description lines then rise with the hero description's line reveal, and
the action rises after the last line. The line masks carry
`0.12em` above, `0.18em` below, and `0.12em` on each side, cancelled by equal
negative margins, so the tight tracking never cuts the last letter of a line. The action's rise mask clips only
vertically, so the hover bounce can grow the action past its sides without
cutting its corners. Reduced motion shows the text and the action at rest.

The marquee shows every project's cover as a rounded 16:9 card on a `muted`
ground, with no name or caption, each linking to its project page. On a
project page it leaves that project out. From `lg` the cards fill the right
column, up to the page gutter, in one column with a `1.5rem` gap, cut by the
section's top and bottom edges, and the column scrolls up. Below `lg` the
cards are `78vw` wide, `48vw` from `sm`, with a `1rem` gap, run from edge to
edge, and the row scrolls left. Either way the loop crosses one card about
every `5s`, eases to a stop under the pointer or keyboard focus, and pauses
off screen. A card's cover does not scale on hover. Instead, on fine-pointer
devices, the shared `TrailingTooltip` follows the pointer over a card in its
compact size with an arrow right glyph and "View" followed by the project
name and "Case", such as "View Cartoon Case". Covers load
lazily, and a video cover plays muted and looped only while its card is near
the screen, fading in over its poster once it plays. Reduced motion stops the
loop and the videos, keeps the posters, and lets the mobile row scroll by
hand.

The section follows the outgoing page during a page transition, and a fresh
copy replaces it once the new page has landed, so it reveals again on every
route. On short routes such as Courses it already sits in the first screen and
reveals at once. Its action links to `/contact` everywhere, so on the Contact
route it scrolls that page back to the top.

## Site footer

`SiteFooter` spans the full width with `paper-foreground` text. Like the
service panels, it uses the narrower `clamp(1rem, 2vw, 1.5rem)` gutter instead
of `section-gutter`, so its content runs nearly edge to edge. Its surface is a vertical `bg-linear-to-b` gradient: solid
light cream `paper` through the top 30 percent of its height, then a smooth fade to the page
`background` at its bottom edge, so the cropped wordmark settles onto the
canvas color. The gradient lives on the footer root rather than the moving
content wrapper, so it stays fixed while the content travels during the
reveal. The footer is not a dark
surface, so it carries no
`data-header-surface` marker. On every route it follows the site call to
action.

From `lg` the top row is a two-column grid. The left column stacks the slogan
title and its description above the email block. The right column holds Navigation, Social Media, and
Located in as a three-column grid, then aligns the three credit lines with the
email block at the bottom of the row. Below `lg` the right side stacks under the
left column. Its link grid drops to two columns below `sm`.

The title uses `section-title` on two block lines, "From seen" and "to chosen".
"seen" and "chosen" each carry a static `WaveUnderline` just below the word, as
wide as the word, with `animated` off so the lines are always present. The
"seen" line is the `ribbon` green, and the "chosen" line is brand orange
`primary`. The left column is an inline-size container, and the title sets
`min(18cqi, 6.5rem)`, about 104px at 1440 wide. The footer has no call to
action of its own, because the site call to action sits directly above it.

Under the title, `2.5rem` below and `3rem` from `md`, a semibold
`muted-foreground` description at `text-lg`, `text-xl` from `md`, with
`-0.03em` tracking and snug leading, held to `24em`, reads "forrrow is an AI
content and web development agency. We create AI videos and UGC ads that stop
the scroll, and build websites that turn views into leads."

Below the title, a semibold `muted-foreground` "Or write directly to" label at
`text-base`, `text-lg` from `md`, with `-0.03em` tracking sits tightly above the
`contact@hello.forrrow.com` mail link.
The lead column uses the larger `gap-16`, `gap-20` from `md`, rhythm.

Column titles are bold `h2` labels in the ink `paper-foreground` at `text-xl`,
`text-2xl` from `md`, with no uppercase and no border. Every footer link, including the email, the
column links, and the credit, is a `SiteNavLink`, so it shares the header
navigation's hover: the label scales away while its orange copy scales up and
the underline draws from the center. The email, the column links, and the
location share `site-footer-item-text`: semibold at `text-xl`, `text-2xl` from
`md`, with `leading-tight` and `-0.03em` tracking. The links use the `inherit`
size so they take it, and list items sit only `0.125rem` apart. Navigation lists
Home, About, Works, Services, Blog, and Contact. Social Media lists X, LinkedIn, and
Instagram, which point to `#` until the real profile URLs exist. Located in
shows "Yerevan, Armenia", a live local time with "GMT +4", then Privacy Policy
after a larger gap.

The right column ends with "Website by Razo Codes", "© 2026 All Rights
Reserved", and "forrrow inc." as three separate lines that share the email
address typography. "Razo Codes" is a `SiteNavLink` at its `inherit` size and
opens the author's LinkedIn profile in a new tab. A "Back to Top" button sits on
the right of the credits, aligned with their last line, in the same item
typography with a Phosphor bold up arrow at `0.9em`. Below the credits' width it wraps
under them. It smooth scrolls to the top through `useSmoothScroll`. On hover or
visible keyboard focus, `useArrowSwapHover` in its `up` direction without the
scale moves the arrow up out of its clipped box while a copy rises in from
below, on the swap timing, and leaving reverses it. The copy rests one box
below in CSS so it never flashes before hydration. The large wordmark below keeps
the logo's own black and has no legal row beneath it. Its wrapper uses the
wordmark's `680` unit width with a `128` unit visible height and clips the rest
at the footer edge, so the oversized letterforms finish partially below the
page like a cropped print mark.

`useFooterMotion` reveals the whole footer as one surface instead of animating
its text. The footer comes up from under the last section of every route.
The footer element clips its content, and the `site-footer-content` wrapper
inside it carries the gutter and padding. A scrubbed trigger starts when the
footer top meets the viewport bottom and runs for the smaller of the footer
height and the viewport height, so it ends when the footer bottom reaches the
viewport bottom or, on a footer taller than the screen, when its top reaches
the viewport top. Over that distance the content travels from half the
distance above its rest position to rest, so it trails the scroll and
the middle of the footer shows first. A plain `paper-foreground` tint at
`40` percent, `site-footer-shade`, covers the footer and fades from full
to zero opacity over the same distance. The tint has no texture, ignores the
pointer, and is hidden from assistive technology. Its resting CSS opacity is
zero, so server-rendered and reduced-motion footers show no tint. All text,
links, and the action are always visible and focusable. Reduced motion shows
the footer at rest without the travel or the tint. The same progress fades the
header actions, as described under the site header.

## Project page

Every Work project page shares one layout, so projects differ only in content.

The hero repeats the Work hero's frame, title recipe, and description recipe.
The project name is the H1, centered on one line at the Work title's `0.76`
leading. Its size is at most the Work title's `23.71cqi`, so a name as long
as "Our Work" or shorter keeps that size, and a longer name shrinks until it
fits the full width. Below `lg` the description comes before the services and
the live link. From `lg` they sit in the left column beside it. As on the
Work hero, the `h1` is an `sr-only` copy of the name, and the visual title is
split into characters and hidden from assistive technology.

The hero reveals like the Work hero. At the page transition's reveal point the
title characters rise one by one inside the shared mask, and `0.35s` later the
description lines rise from `115` percent with a `0.06s` stagger. At the same
moment the "Services" heading, each service, and the live link rise from `115`
percent with their own `0.06s` stagger, each in a line mask that clips only
while the reveal runs, so the live link's focus ring is never cut off. Until
then all of it stays hidden in CSS, and reduced motion shows it at rest. The
project hero does not drift or fade on scroll, because the cover follows it
in the page flow instead of sliding over it.

The services block has a semibold `text-xl`, `text-2xl` from `md`, "Services"
heading in sentence case with `-0.04em` tracking, and the project categories
as a `text-2xl`, `text-3xl` from `md`, medium list with `-0.05em` tracking and
a `0.125rem` gap. From `sm` the live link sits centered in the space between
the services block and the description, bottom aligned with them.

The shared `ArrowLink` is the underlined arrow link, and `LiveLink` renders it
as the external "Visit Live Website" link. Its `md` size, the default, is a
medium label in `text-xl`, `text-2xl` from `md`, at most `w-80` wide. The `sm`
size is a `text-lg`, `text-xl` from `md`, label as wide as its text, and the
`lg` size is a full-width semibold `text-5xl`, `text-6xl` from `md`,
`text-7xl` from `lg`, `text-8xl` from `xl`, and `text-9xl` from `2xl`, label with `-0.05em` tracking and `1.25` leading, so
descenders stay inside the rollover mask. The mask carries `0.08em` of end
padding, because the last letter's ink can pass its tracked box and was cut
off on the right. Every size has an arrow up right glyph at its end and a one
pixel line below in the current text color, so it follows a dark or light
surface. Without a `to` it renders a span instead of a link, for use inside a
larger link marked `data-arrow-link-trigger`, which then drives its motion. On
hover or keyboard focus its label rolls over character by character through `useMenuLinkMotion`, like the
site menu links, its glyph swaps diagonally through `useArrowSwapHover`
without the scale, like the CTA buttons, and `useUnderlineSweep` sweeps the
line out through its right end and draws it back in from the left. Leaving
runs the same sweep, and a sweep that is still running finishes instead of
restarting. Every part rests in place for touch devices and reduced motion.

The cover follows the hero at its own aspect ratio in the page gutter, and the
content blocks follow the cover with no extra space. Every image and video,
from the cover to the grid items, uses `rounded-lg`. Each block follows a gap:
`1rem` between two image, video, or grid blocks, counting the cover as one,
which matches the gap between grid items, and `100px` on both sides of every
text, title, or results block. A title block opens a new section, so the gap
above it is `200px` unless it is the first block.

The Next Project block follows the last block after a `200px` gap. It is a
full-width section with the page gutter and `py-section` padding, filled with
the next project's own `surface` color, and it ends the page with no bottom
space, so the site call to action follows it directly. The surface's `ink`
sets the text: `dark` uses `foreground`, and `light` uses `background` and marks
the section `data-header-surface="dark"` for the header. A project's surface
color is sampled from its own cover and lives in its data file as an OKLCH
value, applied through the `--project-next-surface` variable. It is project
content, not a site token, and is the one place a raw color reaches a
component.

The whole block is one link to the next project. Hovering it shows the shared
TrailingTooltip in its text-only form, "Next Project" with an arrow up right
glyph. A video cover shows its poster at rest and plays muted inside the
frame through the shared `HoverVideo` while the block is hovered, loading
none of the video before then. From `md` it is a `9fr` and `11fr` grid with a `2.5rem` column gap, so
the next project's cover takes about 45 percent of the width as a `4/3`
`object-cover` crop in a `rounded-lg` frame. A 16:9 cover needs about 1.33
times the frame width, so it requests
`sm:1024px md:1024px lg:640px xl:768px 2xl:1280px` with `densities="x1"`. The
right column puts a semibold `text-3xl`, `text-4xl` from `md` and `text-5xl`
from `xl`, "Next Project" H2 at the top and an `lg` `ArrowLink` with the next
project's name across its full width at the bottom, its arrow on the page's
right edge. The name is not a link of its own: the block's link is its
trigger, so hovering or focusing anywhere in the block rolls the name over,
swaps its arrow, and sweeps its line. An `sm` "All Works" `ArrowLink` to
`/work` sits outside the block's link, absolutely placed in the top right
corner and centered on the heading's line, because links cannot nest. Below
`md` the heading comes first, then the cover, then the name.

A text block is at most `max-w-3xl` wide and sits on the left, center, or right
of the page while its text stays left aligned. From `lg` a right placed block
starts in the second column of the hero's two-column grid, so it lines up with
the hero description. The subtitle is a semibold `text-3xl`, `text-4xl` from
`md`, H2 in `foreground`. The paragraphs are medium `text-xl`, `text-2xl`
from `md`, in the same `foreground` with a tight `1.1` leading, one line apart and `1.5rem`
below the subtitle. A title block is a centered, balanced H2 at the call to
action title size: bold `text-display` type with `-0.05em` tracking, in
`foreground`. It gets the same `100px` gaps as a text block. Use it to open
a section that has no body copy. An image or video block fills the width at
its own ratio.
A grid is one column on phones, two from `sm`, and three from `lg` when set to
three, with a `1rem` gap and each image at its own ratio. Grid images request
`sm:640px md:640px lg:640px xl:768px 2xl:1024px` in two columns and
`sm:640px md:640px lg:448px xl:640px 2xl:768px` in three, with
`densities="x1"`. Each value is the nearest `screens` width at or above the
widest column its breakpoint range produces: a two-column image is about 463px
wide at a 1023px viewport, so `md` asks for 640px, not 384px, which is not a
screen and only triggered a rounding warning.

A results block has no heading of its own. Put a title block, such as
"Results", before it. The results are a description list with a `1rem` column
gap and a `3.5rem` row gap: one column on phones, two from `md`, and three from `lg` when there are more
than two results. Each result has no surface of its own and centers its
content. It scales up the home case study recipe: the value is an extrabold
`rounded-lg` pill in the block's surface tone at
`clamp(3.5rem, 6.5vw, 7.5rem)` with `-0.05em` tracking, and the label sits
`1.5rem` below it in balanced semibold `text-4xl`, `text-5xl` from `md`, at
most `16ch` wide. Labels start with a capital letter.

Every project image and video, from the cover to the grid items, opens in the
viewer on click or keyboard activation. The item sits in a full-width button
with a pointer cursor, a `rounded-lg` focus ring, and the label "View full
size", or "Watch with sound" for a video, followed by its alt text. Hovering a
video opens the page's TrailingTooltip in its text-only form, "Watch with
sound" with a speaker high glyph.

The viewer is a full-screen Dialog over a `foreground/90` overlay. The image
shows at its intrinsic size and only shrinks to fit the viewport, never grows,
inside a `rounded-lg` `foreground` frame with a large shadow. The frame keeps
only `24px` free on every side from `md` and `16px` below it, so a large
image fills as much of the screen as it can: a 2560 by 1440 image shows at about
1835 by 1032 on a 1920 by 1080 screen. The controls float over the frame's
edges. The round `light` `cta-icon` previous and next actions sit centered on
the viewport's left and right edges from `md` and in the bottom corners below
it, the close action sits in the top right corner, and a semibold
`background` "3 / 13" counter sits centered at the bottom on a
`foreground/70` pill, so it stays readable over light images. The arrow keys and a horizontal touch
swipe also step through the images, and stepping wraps from the last image to
the first. Clicking outside the frame or pressing Escape closes it. Closing
returns focus to the image that opened the viewer with `preventScroll`, so the
page stays exactly where the reader left it instead of scrolling that image
into view.

Changing images never jumps. The frame tweens its width and height to the next
image's fitted size over `0.7s` on `power3.inOut`, and a new step during a
resize retargets from the current size instead of restarting. Each image is an
`object-cover` layer, so it fills the frame while the ratio changes and fits
exactly once the frame settles. The next image waits until it has loaded, then
fades in over the previous one in `0.45s` on `power2.out`, and the older layers
are removed. The two neighbors of the current image load in the background.
Window resizes refit the frame at once. Reduced motion swaps the size and the
image without tweens and keeps the Dialog still. The images request
`sm:1024px md:1536px xl:2560px` with `densities="x1"`, so a large screen gets
the full source.

A video slide fits the same way as an image from `md`, so a 1920 by 1080
video fills about 1835 by 1032 of a 1920 by 1080 screen, and the counter hides
while it shows so it never covers the controls. Below `md` it keeps `168px`
of height free, so its controls clear the bottom navigation. It appears once
its first frame has loaded and plays with sound.

The slide is `ProjectVideoPlayer`, a custom player on the `foreground`
frame. A bar along the bottom edge fades from `foreground/80` to transparent
and holds, in `primary-foreground` ink, a play and pause action, a semibold
tabular "0:12 / 0:20" time, a shadcn `Slider` that seeks, a volume control,
and a full screen action where the browser supports it. The actions are
`inverse` `icon` buttons with Phosphor bold play, pause, speaker high,
speaker low, speaker x, corners out, and corners in glyphs, each with an
accessible name, and the seek thumb is named "Seek".

The volume control is a mute action whose glyph follows the level: speaker x
when muted or at zero, speaker low below half, and speaker high from half.
Hovering it, or focusing anything inside it, opens a popover centered
`0.5rem` above the button without moving the bar: a `foreground/80`
`rounded-action` panel holding a vertical `6rem` shadcn `Slider`, its thumb
named "Volume". The popover fades in over `0.2s` while it rises `0.5rem` over
`0.3s` on `cubic-bezier(0.19, 1, 0.22, 1)`, and a transparent bridge spans
the gap, so the pointer can travel from the button to the slider. Dragging to
zero mutes, and unmuting at zero restores half volume. The popover shows only
for fine hover pointers, because touch browsers, iOS among them, leave volume
to the device buttons.

While the video is paused, a round
`light` `cta-icon` play action sits in the center, and while it buffers a
spinner takes its place. Clicking the video plays or pauses it. The bar and
the pointer hide after `2.5s` without pointer movement while the video plays
and return on any movement, press, or focus, and they always show while it is
paused. With focus inside the player, Space or K plays and pauses, M mutes, F
toggles full screen, the up and down arrows change the volume by ten percent,
and the left and right arrows seek five seconds instead of stepping slides, and a touch swipe that starts on the bar does not step either. Full
screen shows the whole video with `object-contain`. Stepping away or closing
the viewer stops it. Neighbor preloading skips videos. Reduced motion removes
the bar's fade, the volume popover's fade and rise, and the spinner's spin.

## Blog article

An article page sits on the site `background`. The hero fills the first screen
minus a peek of `clamp(4rem, 14svh, 9rem)`, so the top of the cover shows
below it. It centers a semibold `text-5xl`, `text-7xl` from `md` and
`text-8xl` from `xl`, title with `-0.045em` tracking, at most `16em` wide and
balanced. On page entry, after the page transition's reveal point, each title
word rises from its mask on the shared word reveal timing with a `0.06s`
stagger. The split words and their masks are `inline-block`, because transforms
do not apply to inline elements and SplitText leaves words inline. From `0.35s` the cover, in a `rounded-lg` frame, opens upward from a
bottom clip over `1.4s` on `power4.out` while the image settles from `1.15`
scale. Both stay hidden until the reveal starts, and reduced motion shows them
at once.

From `lg` the article is a twelve column grid. The text column spans columns
four to nine, so it is centered on the page. The aside spans the first three
columns and stays `7rem` below the viewport top while the article scrolls. It
stacks the author, with a `size-10` round photo or a `foreground` initial, the
semibold `text-lg` title and the date, and a round `outline` share action
whose status appears beside it. Below `lg` only the author and share action
show, in a row above the text. The body is medium `text-xl` relaxed
`foreground` text, the same color as the headings, with `1.5rem` between
paragraphs. Section headings are semibold `text-4xl`, `text-5xl` from `md`,
with `-0.03em` tracking. A one pixel `foreground/15` grey line across the full text
column separates each section from the one above, except right after a
divider. Links in text are underlined `foreground` and turn `primary` on
hover. Lists, `brand-green` bordered `text-2xl` quotes, inline images with
`rounded-lg`, and `text-lg` tables with a `canvas-shade` header row and
`foreground/10` row lines follow the same column.

The `::divider` block is the same grey line across the full
text column, with generous space around it. The `::callout` block is a
`rounded-lg` `canvas-shade` panel with a `brand-green` dot and medium
`foreground` text. The `::cta` block is a `dark` `cta-lg` button with the arrow
glyph and the CTA rollover.

The next article block follows the article in the page gutter: two equal
`rounded-lg` halves from `md`, the cover on the left and a `canvas-shade` panel
on the right that centers a "Next article" label, the title in semibold
`text-3xl`, `text-4xl` from `md`, and a `dark` `cta-sm` "Read the article"
button. Below `md` the cover stacks above the panel at 4:3.

## Legal page

The Privacy policy route opens with the shared listing hero, "Privacy policy"
fitted to one line with a short description, and the hero drifts behind a
rounded `canvas-shade` section like the Work projects section. From `lg` the
section is a twelve column grid. The section navigation spans the first three
columns and stays `7rem` below the viewport top while the document scrolls.
The body spans columns five to twelve, five to eleven from `xl`. Below `lg`
the navigation stacks above the body as a plain list.

The navigation has a semibold `text-lg` "On this page" label above an ordered
list on a one pixel `foreground/15` track. Each link is medium `text-base`
`muted-foreground` text that turns `foreground` on hover and focus. The current
section's link is `foreground`, and a `0.5` wide `primary` bar grows over the
track beside it over `300ms`. Reduced motion switches both without the
transition.

The body is medium `text-lg`, `text-xl` from `md`, relaxed `brand-subtle` text,
with a muted "Last updated" date above it. Section headings are semibold
`text-3xl`, `text-4xl` from `md`, with `-0.03em` tracking and a one pixel
`foreground/15` line above every heading but the first. They carry a `7rem`
scroll margin, so a navigation jump leaves them clear of the header.
Subheadings are semibold `text-2xl`. Bold lead-ins, links, and headings use
`foreground`, links are underlined and turn `primary` on hover, and list
markers use `foreground/40`.

## Error page

`SiteErrorView` renders the not-found and error page inside the default layout,
so the header, call to action, and footer stay in place. The catch-all page
`app/pages/[...slug].vue` and an unknown blog post render it as a normal page
with a 404 status, so page transitions run into and out of it.
`app/error.vue` renders it only for other errors. A section fills the first screen
below the header and centers the status code as bold display type at
`clamp(8rem, 30vw, 26rem)` with `-0.06em` tracking, a semibold `text-4xl`,
`text-6xl` from `md`, heading, a medium `text-xl` `muted-foreground` line of
copy, and the actions. A 404 reads "This page scrolled away." over "The link might be old, or we
moved something. Try our AI content creation services, our web development
work, or the homepage." The three named destinations are underlined
`foreground` links to `/services/ai-content-creation`,
`/services/web-development`, and `/`, which turn `primary` on hover. It offers a
`dark` Back to home and an `outline` See our work `cta-lg` button. Any other
error reads "Something went wrong on our side" and offers only Back to home.
On `app/error.vue` both actions clear the error with `clearError` before
navigating. The page is
`noindex, nofollow`.

## Social sharing card

`BrandCard` is the generated 1200 by 630 OG image for every page without its
own sharing image. It is a dark `foreground` surface with `72px` of padding and
three rows spread across the height. The top row holds the bold `forrrow`
wordmark text with `-0.05em` tracking on the left and the site host in muted ink
on the right. The middle row holds an optional semibold page label in the
`primary` orange above the bold title, set large with `-0.05em` tracking and
`0.95` leading and clamped to three lines. The bottom row holds the slogan in
muted ink on the left and a rounded `primary` bar on the right. Everything uses
Switzer. The ink is the off-white `canvas-shade` value, never pure white.

The renderer cannot read CSS variables, so the card's colors live as hex values
in `app/lib/og-image-theme.ts`, converted from the `foreground`, `canvas-shade`,
and `primary` tokens. It is the one documented exception to the no raw colors
rule. Update it whenever those tokens change.

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
works frame do with `portrait` and `portrait-2x`, and the project image viewer does
with `viewer` at 2560px. Repeating CSS background textures are the exception and are
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

The Services offer media, the hero image that flies into the first of them,
and the hero frame's own cycle below `lg` share `servicesOfferImageSizes` from
`app/lib/services-hero.ts`, so the flying layer, the hero frame, and the
landing slot request the same file. The slot is a 4/3 box that
fills the block below `md` and half of it above, and it shows 16:9 sources, so
it lists `sm:1024px md:640px lg:768px xl:1024px 2xl:1536px` with
`densities="x1"`. Fluid entries such as `md:50vw` resolve against the screen
value, here 384px, which is not in `screens`. `ImageCycle` forwards an optional
`densities` value to each of its images.

Small fixed slots follow the same rules. The TrailingTooltip thumbnail is a
104px square cropped from a 16:9 source, so it needs about 185px at 1x and uses
`sm:448px` for 448 and 896 candidates.

Use `object-cover` only when the composition intentionally crops the source.
Lazy-load below-the-fold images. Reserve eager loading and preload behavior for
images that are verified as critical to the initial viewport, and give a
preloaded image `fetchpriority="high"` on both the image and its preload, as
the home hero does. Hidden preload copies, such as the TrailingTooltip
thumbnails, keep `object-cover` so their square box matches the displayed crop.

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
measurements after mount, font loading, and every page transition.

Use `useSmoothScroll()` in components:

```vue
<script setup lang="ts">
const { scrollTo } = useSmoothScroll();

async function openContact() {
   await scrollTo("#contact", { offset: -24 });
}
</script>
```

`scrollTo` and Lenis anchor links use the swap scroll timing, the
`power4.inOut` curve, unless the caller passes its own options. A fixed
duration makes a long scroll look like it stops dead: across the full home
page the last viewport would get under half a second right after content
flies past. So `scrollTo` measures the distance to its target and sets the
duration to the fourth root of that distance in viewports, in seconds, kept
between `1.5s` and `2.5s`. Short scrolls take `1.5s`, the whole home page takes
about `2.25s`, and the last viewport of a long scroll always gets about `0.6s`
to settle. Lenis anchor links keep the `1.5s` floor. The scrollbar drag passes
`immediate`. Under reduced motion Lenis makes every programmatic scroll
immediate.

The composable also exposes `instance`, `isReady`, `onScroll`, `ready`, `refresh`,
`resize`, `lock`, `reset`, and `holdRefresh`. Subscriptions created with `onScroll` are removed automatically
when the current Vue scope is disposed. Hold the scroll with `lock`, which
returns its own release function. Lenis only runs while no lock is held, so
several owners can hold the scroll at once and none of them restarts it early.
Call `refresh` rather than `ScrollTrigger.refresh`, because a page transition
holds every refresh until the incoming page has its final layout.

The browser window remains the scroller. Do not add `ScrollTrigger.scrollerProxy()`
for the current configuration because Lenis retains native document scrolling.
If a custom wrapper is introduced later, treat that as an architecture change and
review the proxy, pin type, dimensions, routing, and accessibility behavior.

Wheel input is smoothed. Touch input runs through Lenis with `syncTouch`, so a
drag follows the finger directly and Lenis adds the release inertia. Native
touch scrolling runs on the compositor ahead of the GSAP ticker, so every
scrubbed transform that moves against the scroll, such as the hero card, the
case list handoff, and the footer reveal, trailed it by a frame and visibly
lagged. With `syncTouch` the scroll position and the scrubbed transforms update
in the same frame. Lenis respects the user's reduced-motion preference. Use `data-lenis-prevent`,
`data-lenis-prevent-wheel`, or `data-lenis-prevent-touch` on nested regions that
must manage their own scroll input.

Do not construct Lenis inside a page or component. Do not add a second animation
frame loop. The app plugin is the only owner of initialization and teardown.

### Scrollbar

The page shows a thumb with no track. A classic scrollbar always reserves its own
gutter, and that gutter paints the root canvas color, so it would show as a light
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
is hidden from assistive technology. It never intercepts wheel, keyboard, or
touch scrolling, and the overlay renders nothing until mount or when the page does not
scroll.

The implementation follows the official [Lenis GSAP integration](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger)
and [GSAP ScrollTrigger guidance](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
It deliberately keeps GSAP's default ticker lag smoothing instead of the
`gsap.ticker.lagSmoothing(0)` call in the Lenis example. Browsers stop animation
frames in a hidden tab, and without lag smoothing GSAP adds the whole hidden
time on return, so time-based animations such as the home preloader would jump
to their end. With the default, a gap over `500ms` counts as one `33ms` frame,
so every animation resumes where it paused.

## GSAP

`useGsap()` exposes the core instance, scoped contexts, responsive match-media
contexts, optional plugin loading, and automatic teardown. The Lenis bridge loads
GSAP and ScrollTrigger after application mount. Components still use `useGsap()`
to own and clean up their individual animation contexts.

```vue
<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";

const root = useTemplateRef<HTMLElement>("root");
const { createMatchMedia, gsap } = useGsap();

onMounted(() => {
   createMatchMedia(
      {
         desktop: "(min-width: 64rem)",
         reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
         const { desktop, reduceMotion } = context.conditions ?? {};
         if (reduceMotion) return;

         gsap.from("[data-animate]", {
            autoAlpha: 0,
            duration: desktop ? 0.7 : 0.45,
            stagger: 0.08,
            y: desktop ? 24 : 12,
         });
      },
      root,
   );
});
</script>
```

Prefer `x`, `y`, `scale`, `rotation`, and `autoAlpha`; scope selector strings to
a component root. Use `loadPlugin()` for optional capabilities such as
`CustomEase`, `DrawSVGPlugin`, `SplitText`, `Flip`, `Observer`, `ScrollToPlugin`,
or `TextPlugin`.
ScrollTrigger is registered by the Lenis bridge and remains available through
the existing loader when a component needs its API. Contexts and media queries
are reverted automatically when their Vue scope is disposed.

A template ref placed on a component holds that component's instance, not its
element. `NuxtLink`, `Button`, and `SiteMenu` refs therefore reach GSAP as
plain objects, which tween silently and move nothing on screen. Resolve every
motion target through VueUse's `unrefElement` and confirm the result is an
`HTMLElement` before animating it, so a plain element can become a component
later without breaking the animation.

### Named timings

Requests and reviews may use these short names instead of pointing at a
component.

| Name               | Timing                                                                  | Source and current users                                                                                                                                                                                          |
| ------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Swap timing        | `0.7s` on `power4.inOut`, a slow-fast-slow curve                        | The More works action's arrow swap. Also the footer Back to Top arrow, the navigation link hover, and the FAQ toggle. The Services hero link and image frames and the home service links use its ease over `1.1s` |
| Swap scroll timing | The same `power4.inOut` curve over `1.5s` to `2.5s`, scaled by distance | Every programmatic scroll and section anchor, such as Back to Top                                                                                                                                                 |

Both live in `app/lib/swap-timing.ts`. Import them rather than repeating the values.

### Page transitions

Every page change runs an overlap transition from `usePageTransitionMotion`,
passed to NuxtPage in `app/app.vue`. A link to the current page runs no
transition. It scrolls the page back to the top on the swap scroll timing, or
to the section its hash names. The first page
load never runs it, so a direct home request still opens with the preloader.

The leaving page stays on screen exactly where the reader left it and moves
up a quarter of the viewport height while it scales to `0.97`. Before the
incoming page mounts, every scroll-linked animation pauses in its current
state, the document scroll returns to the top, and the leaving page and footer
are offset by the old scroll position, so nothing visibly moves. The incoming
page therefore builds its scrubbed motion, such as the About hero drift,
against the scroll position it lands at, and never arrives part way through a
scroll effect that snaps back when the transition ends. The overlay scrollbar
shows the incoming page's position from the start of the transition. The site
footer carries `data-page-transition-follow`, so it moves with the page as one rigid
surface, and both scale around the viewport center. A `foreground` shade in the
layout, `data-page-transition-shade`, fades over them to `0.8` opacity. The
incoming page is fixed to the viewport with the canvas color, at least one
`100svh` tall, and padded down to the main landmark's offset, so its content
already sits where it will rest. It rises from the viewport bottom. All three
movements share `1.1s` on the `page-transition` CustomEase,
`0.73, 0.05, 0.112, 1`, which leaves slowly, moves fast through the middle, and
lands softly. The shade sits at `z-10` and the incoming page at `20`.

The header transitions with the layout. The layout marks the header and the
logo layer with `data-page-transition-header`. Before the scroll returns to the
top, each is replaced in place by a static copy marked `data-page-transition-clone`. The copy
is inert, hidden from assistive technology, and fixed at `z-5` under the shade,
and it leaves with the outgoing page and footer, so the old header lifts, shrinks,
and darkens with the page it belonged to. In the same frame the real header jumps
to the viewport bottom and rises with the incoming page, so it lands at the top
of the new page. The header stays at `z-60` above the incoming page throughout.
While it is off screen it switches to its full state, because the incoming page
always lands at the top. A compact header therefore never lands compact and then
expands.

Overlays that belong to the leaving page carry `data-page-transition-overlay`.
The expanded site menu panel is the current one. If an overlay is visible at
the handover, it gets the same inert static copy under the header copy and
leaves with the outgoing page, while the real overlay closes instantly. An open
menu therefore never sits above both pages.

When the movement ends, one task removes the leaving page, returns the incoming
page to normal flow, clears every transition style, reverts the leaving page's
deferred GSAP work, resets the scroll to the top, and refreshes Lenis and
ScrollTrigger against the final layout. The incoming page's scroll reveals are
built during the transition but are measured again at that point, so above-fold
reveals play as soon as the page lands and later ones wait for their scroll
position.

When the destination carries a hash, such as `/services#website-development`,
the page still lands at the top. Once that final refresh has measured it, the
page scrolls to the element with that id on the swap scroll timing, so the
reader sees where the section sits on the page. A direct request with a hash
does the same after the first refresh. A hash with no matching element is
ignored.

`0.4s` into the movement the transition reports its reveal point. Time-based
entrances on the incoming page, such as the home intro, start there rather than
on mount.

A leaving page keeps its state on screen until it is covered. Its GSAP contexts,
media queries, and SplitText splits revert only after it has been removed. A
section that is pinned when the reader leaves is `position: fixed`, and the
leave transform would make it relative to the page. The transition therefore
offsets each active pin by the page's own position before it moves, so a pinned
panel such as More works leaves exactly where it was.

Further page navigations are ignored until a transition finishes, and the scroll
stays locked throughout. Reduced motion swaps the pages instantly with the same
cleanup, scroll reset, and refresh.

### Home hero layout

The hero leads with the problem, the solution, and the action. From `lg` the
intro is a two-column grid. The description and the dark `cta-lg` action sit in
the flexible left column, and the title sits in an auto-width right column. The
column gap is `3rem`. Below `lg` the title stacks above the copy, which is
capped at `max-w-md`.

The title is bold with `-0.05em` tracking and `0.82` leading. Its longest line
measures about `7.7em`. The title is capped at `7.85em`, so it always wraps into
the same four lines while leaving the copy column as much width as possible.
From `lg` its size is `text-hero`. Below `lg` it scales to the content width
divided by `7.9`, so a phone still shows four lines. Recheck the cap and the
divisor whenever the title copy changes. Each line mask carries `0.22em` of
block padding, so ascenders and descenders are not clipped at the tight
leading. A negative bottom margin of twice that amount cancels the padding.
Only the bottom margin is negative, because adjacent negative block margins
collapse, and the title shifts up by the same `0.22em`. Do not make the title a
flex or grid container. SplitText measures lines with the words as direct
children, and those would each become an item on their own row.

The description is semibold with `-0.04em` tracking and tight leading, at
`text-xl` below `lg`. From `lg` it scales with the viewport at
`clamp(1.0625rem, 1.7vw, 1.75rem)`, about 24px at 1440 wide. It is capped at
`15em`, where ordinary wrapping gives five lines of nearly equal width. The
same wrap holds from about `14.7em` to `15.2em`, so the cap sits in the middle of
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
as that stack is revealed. Client-side entries to the home page skip both stages
of the media motion. They arrive through the page transition with the four
retained cards already at rest in their grid, so the cards travel in with the
incoming page instead of expanding from the center.

Below `lg` there is no intro. The header, the hero title, the description, the
call to action, and the four retained cards with their `40px` dock offset are
visible from the first paint, the six preloader cards are never displayed, and
the scroll stays free. The six preloader cards load lazily, so phones never
download them, and the desktop intro switches them to eager loading before it
waits for them.

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
The header does not fade or slide in. `0.1s` after the label, the logo, the
navigation links, and the header actions rise one by one from their masks. The hero title
lines, the description lines, and the call to action start rising at that same
moment. Reduced motion must resolve directly to this complete state with
scrolling available.

A client-side entry plays only the text half of the second stage. While the
page transition starts, the header pieces drop back into their masks over
`0.22s` on `power2.in` with a `0.015s` stagger, which always finishes before the
reveal point. The intro then waits for the page transition's reveal point and
starts the header, title, description, and action rise at time zero of a fresh
timeline, with the same durations, eases, and staggers as a direct request.
Two rules keep that reveal from starting partway through. A timeline without
the preloader must never hold a tween before its own time zero, because GSAP
moves every child later and moves the timeline's start back by the same
amount. And a time-based reveal must not be created during the incoming page's
mount work, because GSAP counts that blocked time, up to its `500ms` lag
threshold, as time the reveal has already played.

The preloader has no curtain. Because both scrolling systems are pinned to the
document top, the only thing behind the centered stack is the hero section with
its title still masked, so an opaque cover would hide nothing worth hiding. The
media grid still lifts to `zIndex: 70` for the duration of the intro, which is
what keeps the cards above the page now that the page is visible behind them.

Render animated titles through the shared `SplitText` component. Its server
output must remain the complete text node for indexing and assistive technology.
After mount, the component may split into words, lines, or characters and pass
those elements to the consuming animation. Splits run one per browser task in
mount order through `queueMainThreadTask`, so a page with many split texts
never blocks the main thread with one long task, and the hero splits first. The home title animates its generated
visual lines in order. Each fully opaque line rises from 150% below its own
clipping mask over `0.8s` with `power3.out` easing and a `0.1s` stagger. The
start is deeper than the usual 115% because the padded title masks would
otherwise show the tops of the waiting glyphs. The description lines and then the
call to action follow the same rise from 115% with a `0.06s` stagger. The action
rises inside a wrapper that clips it only during the intro, so the hover bounce
and focus ring are not cut off afterwards.

### Home hero scroll transition

From the `lg` breakpoint upward, after the home intro completes, the third of
the four retained hero cards becomes the featured transition image. Its
transition starts with the first scroll and runs as one continuous scrubbed
timeline, so nothing about it ever stops or changes speed abruptly. The hero
leaves through normal document scrolling while LandingPage's empty transition
space, one and a half small viewports tall, keeps the next section below the viewport. Below `lg`
the transition is disabled: the space collapses to zero, the featured card
stays in its grid position, and the hero scrolls straight into the next section. The featured card offsets that
document movement as it leaves its rotated grid position, reaches the viewport
center, and expands to fit within 92 percent of the viewport width and 82 percent
of its height by the end of the transition space. Every property follows a
velocity matched curve from `app/lib/scroll-curve.ts` rather than a linear
segment. The card starts at full scroll speed and slows down gradually until it
holds at the viewport center. That slowdown is centered on the moment the
card's center would naturally pass the viewport center, so it always settles
exactly there. The horizontal move and the rotation ease in and out over the
same stretch. The existing Lenis instance supplies the wheel smoothing. When the
transition space ends, the card speeds back up from holding to full scroll
speed over thirty percent of a viewport, so it never looks like it stops and
restarts. Its scale is one curve from its resting grid scale to ten percent
beyond its fitted size, 1.3 viewport heights after the transition space ends.
It starts at rest, reaches the fitted size at the end of the transition space,
keeps a slow matching growth across that point, and settles as the card leaves the top of
the viewport. The growth window stays short so the card never covers the
next section entering below it. All hero cards remain 4:3 in the grid. The featured
card alone transitions to the source image's native 16:9 ratio while it expands.

`useHomeHeroScrollMotion` owns this behavior. It starts only after
`useHomeIntroMotion` reports a complete state, uses the browser window as the
scroller, animates the featured card's transform and aspect ratio, and lets its
scoped GSAP media context remove the inline styles during route cleanup. Reduced
motion and screens below `lg` collapse the empty transition space and keep the
standard hero and the next section's flow without scaling or changing the card ratio.

Keep the featured card on two-dimensional transforms with `force3D: false` and
do not apply a persistent `will-change` hint. Promoting the card while it is
still grid-sized can cache a small raster layer that becomes visibly soft when
the scroll transition enlarges it.

### Studio section reveal

The home page does not currently render the Studio section. LandingPage keeps
it disabled, so the hero leads straight into the work section. The Studio
section and its ribbon below stay documented for when it returns.

Render the Studio statement and both copy paragraphs through the shared
`SplitText` component with word masks. When the Studio section reaches 82
percent of the viewport, each statement word rises from 115 percent below its
mask over `0.8s` with `power3.out` easing and a `0.03s` stagger. The recipe
lives in `app/lib/word-reveal.ts`, which the services panels share.

The statement is start-aligned, so its large display lines keep natural word
spacing. It is capped at `20.85em`, where ordinary wrapping gives six lines of
nearly equal width. The same wrap holds only from about `20.75em` to `21em`, so
recheck the cap whenever the statement copy changes. From `lg` it is inset from
the left edge by the space left beside the cap, up to `8%` of the section width,
so it sits closer to the center on wide screens while staying start-aligned. The copy paragraphs are justified so every full line ends on the
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

The same overhang would cut the last letter of a title line while it rises,
because a line mask ends where the tracked text ends. Every reveal mask that a
composable clips therefore uses `revealMaskClip` from `app/lib/word-reveal.ts`,
`inset(0 -0.5em)`, which clips only above and below and leaves half an em of
room on both sides. A mask that clips through `overflow` sets only
`overflow-y: clip`, as the About hero title does. Never clip a reveal mask on
its sides.

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

### Studio ribbon

A thick green ribbon draws itself behind the Studio section as the reader
scrolls. It comes out from under the featured hero card as the hero transition
ends and sweeps down and right beside the statement to a crossing near the
right edge. It then curves down behind the copy column and rounds one large
loop out to the left, behind the photo, and back up to that crossing, where it
passes under its own first sweep. From there it bows out past the right edge
and returns in one long curve that dips under the "What we've done" title,
just above the first case study, before it leaves at the left edge.

`StudioRibbon` is a decorative SVG, hidden from assistive technology, that
fills the Studio section with `overflow: visible`, so the ribbon can reach
above the section into the hero transition space and below it into the work
title. It sits at `-z-10` inside the `relative` but non-isolated Studio
section, so it paints in the page's root stacking context above the body
canvas and below every in-flow block. The featured hero card, the statement,
the photo, the copy, and the work title therefore all paint above it, and the
landing wrapper's horizontal clip hides it past the viewport edges. Do not
give the Studio section a `z-index`, `isolation`, or a background, because any
of them would hide the ribbon or lift it above the content. The header logo
blends with `difference`, so it reads violet while it passes over the green.

The stroke uses the `ribbon` token at `clamp(4.5rem, 13vw, 15rem)` with round
caps and joins. The shape comes from a hand-drawn SVG path. `ribbonArtwork` in
`app/lib/ribbon-path.ts` stores its `d` string unchanged, together with the
Studio anchor lines measured at the width it was drawn on: the statement top
and bottom, the grid top and bottom, and the section height, all at 1440 wide.
The path is parsed into cubic Bézier pieces, so the curves keep the exact
handles from the drawing. At runtime every point is scaled by the live section
width horizontally, and mapped vertically between the matching live anchor
lines, so the ribbon follows the content at every breakpoint and matches the
drawing exactly at 1440 wide. Points above the section top or below its bottom
move by the width ratio. A short straight lead-in, `0.05` of the section width,
is added before the first point along its starting direction, so the round cap
starts hidden under the hero card.

To replace the ribbon, draw a single stroked path in Figma or a similar tool
on a frame that matches the Studio section at 1440 wide, with its top edge on
the section top. Draw it in the direction it should animate, because the
ribbon draws from the start of the path to its end, and draw any off-screen
turns outside the frame. Do not outline the stroke, because a filled shape
cannot be drawn. An outlined export runs forward along one edge of the stroke,
around a small cap, and back along the other edge. If one arrives, keep only
the forward edge up to the first cap, drop any zero-length curves, and use
that as the centerline. Paste the exported `d` string into
`ribbonArtwork.path`. The parser accepts `M`, `L`, `H`, `V`, `C`, `S`, and `Z` in absolute and relative
form, and it throws on any other command. If the frame was drawn at another
width or the Studio layout has changed, remeasure the anchor lines at the
frame width and update `ribbonArtwork.anchors`.

Then set `ribbonSegments`. Its indices count the curve and line pieces in the
order they appear in `d`, starting at `0`, and a closing `Z` that ends on its
own start point adds no piece. Each segment covers the pieces from `from` up to
but not including `to`, segments draw one after another, and the last `to`
equals the piece count. A segment marked `under` paints before the `over`
segments, so it passes beneath them wherever they cross. Its crossing is found
automatically: the point on the segment closest to any `over` segment, ignoring
points within the shade reach of the segment's own two ends, where it simply
joins its neighbors.

The current artwork has six pieces in three segments. The lead covers pieces
`0` to `2`, from the card to the crossing, down behind the copy, and around the
large loop. The climb covers pieces `3` and `4`, back up through the crossing
under the lead and out past the right edge. The sweep is piece `5`, the closing
curve under the work title. The climb is `under`, and its stroke is a gradient that darkens to
`ribbon-shade` around the crossing, `1.5` stroke widths either side. As it
draws, the ribbon reads as if it is weaving under itself.

`useStudioRibbonMotion` scrubs one DrawSVG timeline with the scroll. Each
segment draws from `0% 0%` to `0% 100%` over a duration equal to its length,
and it stays hidden until its turn so a waiting round cap never shows as a dot.
The scroll starts when the tuck point reaches 80 percent of the viewport. Every
visible pixel of ribbon costs `0.3` pixels of scroll, so the ribbon draws at
most about three times faster than the page moves. The tip may run up to 80
percent of the viewport ahead of that line, which lets the loop draw just
below the viewport so the climb is still on screen while it rises. Any part of
the ribbon outside the viewport, past a side edge or above the top, costs only
`0.03` pixels, so the reader never scrolls through a stretch where nothing
visible draws. The scrub uses one second of smoothing, so a wheel step glides
the tip forward instead of revealing a whole stretch at once. Scrolling back
above the start lets that smoothing finish, so the ribbon retracts all the way
to its start point instead of vanishing. Do not force the scrub tween to
complete on leave back. The work line and the About lines follow the same
rule. The geometry and
the timeline are rebuilt whenever the section resizes. The ribbon is hidden below
the `lg` breakpoint. Reduced motion shows the complete ribbon without drawing it
on larger screens.

`createRibbonDrawTiming` accepts an optional `lead` in its view, a share of the
viewport height that replaces the default `0.8` head lead. The Studio ribbon
leaves it unset.

### Work line

A faint grey line draws itself behind the work case list as the reader
scrolls. It enters from past the right edge level with the top of the first
case study, weaves left, right, and left again behind the cards, and ends at
the bottom of the last case study.

`WorkLine` renders the shared `DrawnLine`, a decorative SVG hidden from
assistive technology, inside the `relative` case list at `-z-10`, so every card
paints above it. It bleeds
across the page gutters with a negative `--spacing-page` offset and an explicit
width, because an absolutely positioned SVG ignores opposing insets and keeps
its default 300 pixel width. The stroke uses `foreground` at the ribbon's
`clamp(4.5rem, 13vw, 15rem)` width with round caps and joins, and the SVG's
`opacity-3` class turns it into a soft grey. Adjust that class to make the line
fainter or stronger. `DrawnLine` strokes `currentColor`, so `WorkLine` sets the
color with `text-foreground`.

`workLineArtwork` in `app/lib/work-line-path.ts` stores the hand-drawn `d`
string, drawn on a 1440 wide frame whose top edge is the first case study's
top. At runtime the path is scaled by the live frame width horizontally and
stretched vertically so its last point lands on the case list's bottom edge.
To replace it, draw a single stroked path in the direction it should animate
and paste its `d` string into `workLineArtwork.path`.

`useWorkLineMotion` scrubs the line with the same draw timing as the Studio
ribbon, with a head lead of `0`, so the drawing tip stays at 80 percent of the
viewport instead of running ahead below it. Because the line sits inside the
case list, it moves and fades with the list during the handoff to the more
works panel. The line is hidden below the `lg` breakpoint, and reduced motion
shows it complete without drawing it.

### Work section

The work section centers its heading, currently "Case studies", and gives
each case study its own full-width row. It follows the hero directly, so it
opens with two and a half times `spacing-section` of top padding, about 360px
at 1440 wide, which gives the hero's featured image room to settle before the
heading arrives. The heading keeps `section-title` for
its weight but overrides the font size and tracking in the component's own
scoped block. This heading is deliberately oversized: its clamp runs past
`text-hero`, so the section opens at display
scale. The phrase always sets on one line through `white-space: nowrap`. The
title adds `0.15em` of word spacing, because the tight title tracking otherwise
pulls the words together. With it the line is about `5.44em` wide, so `11.6vw`
keeps it well inside the column at every width, and the `2rem` floor only
applies on the narrowest phones. Promote that clamp to a token
if a second section ever wants the same step. From `md` the row is a `3fr 2fr` grid, so the media takes
sixty percent of the width and the copy takes forty, and both columns align to
the top of the row rather than to each other's center. On phones the row stacks
to one column. Case study cards carry no surface color of their own, so the
canvas grain stays visible behind them and the image is the only filled shape in
the row.

The copy column reads title, description, the optional live link or service
link, the services, then a results row. Each card describes the problem the
project solved rather than what the project is: the title is a short headline,
and the description explains why it was built. The title is the `title` prop, falling back to the client name, and
is bold in the same `foreground` ink as the section heading at `text-4xl`,
`text-5xl` from `md`, and `text-6xl` from `xl`, with `0.95` leading,
`-0.045em` tracking, and balanced wrapping, because a headline runs to several
lines in the forty percent column.
Its `0.12em` of bottom padding keeps descenders inside its reveal mask. The
description is `font-medium` `brand-subtle` copy at `text-xl`, `text-2xl` from
`md`, with `leading-tight`, `-0.03em` tracking, and a `36ch` measure.

The optional `serviceLink` takes a label and an internal path, such as the
matching service page, and renders the shared `ArrowLink` in
the same slot and layer as the live link. Inside the card both links size to
their label, capped at the column width, instead of the link's default `20rem`
cap, so a longer label is never clipped.

The services sit `1.75rem` below the link, or below the description when there
is no link, as a wrapping list of pills with a `0.625rem` gap, `0.75rem` from
`md`. Each pill is fully rounded on a `foreground/8` fill, with `px-6 py-3.5`
and semibold `text-xl` type, `text-2xl` from `md`, at `leading-none` and
`-0.03em` tracking. They are deliberately large enough to read at a glance. The
card takes them through its optional `categories` prop, and WorkSection passes
each project's `categories` from its data file, so the pills always match the
project page. The list reveals with the rest of the copy as one line.

The card's optional `results` prop takes a list of value and label pairs,
currently two per case study that has them. A card without results, such as
Sygen, renders no results row. They sit side by side in a wrapping row with
`gap-x-10`, `gap-x-8` from `xl` until `2xl`. From
`md` the copy column stretches to the height of the media and the row takes
`mt-auto`, so the results sit on the bottom edge of the image while the title
and description stay at the top. Below `md` the row follows the description
with `mt-10`. Each value is an extrabold inline highlight at `text-5xl`,
`text-6xl` from `md`, back to `text-5xl` from `xl`, and `text-6xl` again from
`2xl`, with `leading-none` and `-0.05em` tracking, that takes a
`surface-*` utility through the card's `tone` prop, so a case study picks a
brand color from `app/lib/surfaces.ts` rather than defining one. The highlight
keeps a surface behind the number because yellow and pink would not be
readable as text on the canvas. The label below it is `font-semibold`
`foreground` text at `text-lg`, `text-xl` from `md`, `text-lg` from `xl`, and
`text-xl` from `2xl`, with `1.05` leading, held to `18ch` so it wraps into at
most two lines under its number. The smaller `xl` step exists because the copy
column is only about `440px` wide at 1280, so the two results of the widest
pair stay on one row from 1280 to 1536 wide. Its `0.1em` of
bottom padding keeps the last line's descenders inside its reveal mask. The
color belongs to the number and not to the sentence that explains it.

Each case image is its project's cover image, or the poster of a video cover,
with the project's own alternative text. The section shows only real projects,
currently UGC Creator, Sygen, and Cartoon, in that order.

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
fills with the preloader's stack reveal: three elements stacked on the frame all
scale up from zero around their own center, two of them empty brand-color
layers, with the image arriving as the third and last. Both the preloader and
this section run that recipe through `addStackReveal` in
`app/lib/stack-reveal.ts`, so the lead element scales over one second with
`power3.out`, the rest start a third of a second later, and the group carries a
`0.12s` stagger. Change the timing there and both reveals move together.

Each case study gets its own two-color sequence through the card's
`revealTones` prop, resolved through the same `surface-*` map as the result
highlights. The sequences are all different, and each one ends on the card's own
`tone`, so the color that lands immediately before the image is the color the
result numbers wear.

The card, its covering link, and the frame use `rounded-xl` corners. Layers
bleed one pixel past the frame and inherit its radius, and the frame shapes
itself with `clip-path: inset(0 round var(--radius-xl))` alongside its radius
and `overflow: hidden`, so the resting surface never survives as a hairline
rim around the final layer. Keep the clip's radius token equal to the frame's
radius class. Once the reveal ends, `useWorkMotion` hides every layer but the
last with `autoAlpha: 0`, because the image covers them and their color would
otherwise tint the antialiased pixels along the frame's edges and corners. DOM order is the paint order, so the image
wrapper must stay last. The colored layers rest at `scale(0)` in CSS because
they are decorative, which keeps a solid color block off the card before the
motion initializes and without JavaScript. The image wrapper carries no CSS rest
state, so the image itself is always present in the server output.

The text lines share the card's timeline rather than running their own
trigger. In document order they are the title, the description, and each
result's value then label. They start a tenth of the way into the media reveal,
so the copy is already arriving while the colored layers are still landing, and they rise
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
A card can lower its scale through the optional `imageScale` prop when the
default crops its image too tightly, as Sygen's wide monitor shot does at
`1.1` and UGC Creator and Cartoon do at `1.05` to keep the head in the frame.
The travel then shrinks in proportion through `imageParallaxShiftFor`, to
about `4.7` percent at `1.1` and `2.3` percent at `1.05`, so the overflow
still covers it.

Card content is not hidden before the motion initializes, because it is part of
the server output. Reduced motion therefore needs no exit state for the cards:
it resolves the title words and leaves every card at rest with no parallax.

A case study card's image rests at `1.06` scale inside its frame and settles
to its actual size on hover over `0.8s` on the tooltip's
`cubic-bezier(0.19, 1, 0.22, 1)` curve, while the frame keeps its size. A
linked card does the same while its link has keyboard focus. The scale sits on
a `case-image-zoom` wrapper around the image, because GSAP owns the image's
parallax transform and writes an inline `scale: none` on it. It applies only to `(hover: hover)` pointers and switches without
the transition under reduced motion. A card with a `video` stacks the shared
`HoverVideo` over its image inside the parallax layer, so the video moves
with the image and plays while the card is hovered. The page loads none of it
until the first hover.

The complete case study card is the hover surface for one shared trailing
tooltip. WorkSection owns the active image and keeps one TrailingTooltip mounted
through Nuxt's shared teleport target, so the follower is not clipped by the
landing wrapper or card media. The card is always an article. A card with an
`href`, such as Sygen, adds a NuxtLink that covers the whole card,
named by the client in `sr-only` text, and the card shows the focus ring while
that link has keyboard focus. A card with a `liveUrl` adds the shared
`LiveLink` `2rem` below the description, revealed with the other lines in a
mask with `0.25rem` of padding so its focus ring is not clipped. It sits above
the covering link, so both links stay separate and never nest. Hovering it
switches the tooltip to its compact text-only form, "Visit Live" with an arrow
up right glyph and no image, and leaving it for the rest of the card brings
back the card image and "See Full Project". A card with neither stays a plain
article. Its pointer cursor
communicates the intended future link surface without introducing a no-op
control or fake URL.

The tooltip uses the hovered card image in a large 104-pixel thumbnail, the
label "See Full Project" at `text-3xl`, and a fixed card surface outlined by a
one-pixel light grey `border-border` hairline, which keeps its edge visible on
the light canvas. Its `size`
prop also accepts `compact`, a 64-pixel thumbnail with a `text-xl` label and
tighter padding, which the more works panel and the services images use.
Without an image the compact tooltip is text only, with `0.875rem` inline and
`0.5rem` block padding. When
the size changes while the tooltip is already open, such as moving from the
last case card onto the more works panel, the padding, gap, thumbnail size and
radius, and label size transition over `0.5s` on the tooltip's
`cubic-bezier(0.19, 1, 0.22, 1)` curve, so the panel resizes smoothly instead of
jumping. The component only sets `data-resize="smooth"` when the tooltip was
already active before the change, so opening from a closed state still takes
the new size in one step, and reduced motion keeps every change instant. It opens from
`inset(50% 100% 50% 0 round 0.5rem)` to
`inset(0 0 0 0 round 0.5rem)` over `0.75s` with the
`cubic-bezier(0.19, 1, 0.22, 1)` curve. GSAP `quickTo` owns only its `x` and `y`
position with `power3.out` easing, keeping repeated pointer updates inside one
reused tween per axis. The follower trails `16px` below and right of the
pointer, keeps that offset, and may travel
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
project image never shows while the panel is wiping open.

Every case card names its project in the tooltip, "View" followed by the
project's short name and "Case", such as "View Sygen Case", on the home case
studies, the Work route grid, and the call to action marquee. When the label
changes while the tooltip stays open, it swaps like a header navigation link:
the outgoing label slides up out of a clipping mask while the incoming one
slides up from just below it, over `0.65s` on the shared `nav-link-slide`
curve, and the label's width eases to the new text over the same time. The
outgoing label leaves the layout during the swap, so the tooltip never holds
the width of both. The mask adds `0.15em` of block padding so descenders clear
it. Opening from a closed state, and reduced motion, set the new label in one
step.

A new layer never shows before its image has loaded. It stays invisible while
it loads, and only then reveals over the previous layer or, when opening from a
closed state, replaces it, so the thumbnail frame never shows an empty box
during a swap. Owners can pass the images they will show through the `preload`
prop, which fetches each thumbnail with the same size settings while the
tooltip is idle. The work section preloads its case images and the services
section its service images. The
movement stays on two-dimensional transforms with `force3D: false`, and the
tooltip has no persistent `will-change` promotion, so its settled text remains
sharp. Reduced motion removes the movement delay and clip transition.

The tooltip also has a text-only form. Without an image it renders no
thumbnail frame and switches to `px-5 py-3` padding. An `icon` passed instead
of an image takes the thumbnail's place on the left of the label as a square
mark styled like the home service link: the `inset-arrow-surface` grey, a
brand orange `primary` glyph in `inset-arrow-icon`, `7.5%` corners, and a
`17.5%` inset. That inset lives on an inner content box that fills the mark,
as in the service link, because percentage padding resolves against the
containing block's width and would otherwise grow with the whole tooltip and
collapse the glyph. The mark is `size-12` with `p-2 pr-6` tooltip padding and a
`gap-3`, or `size-9` with `p-1.5 pr-4` and `gap-2.5` in the compact size. An
image always wins over an icon. The About team cards use it for "More Info",
the Services hero link for "About", and the Work project cards for "View
Project", all with an arrow up right glyph. Passing an
empty image drops every thumbnail layer, so a tooltip that switches from an
image target to a text-only one, such as a home case study card and its
Visit Live link, never keeps the previous thumbnail.

The open, close-delay, and loading state lives in `useTrailingTooltip`, which
the services section, the About team section, the Services hero, and the Work
projects section share. Each consumer loads the component asynchronously
only after mount and only while `(hover: hover) and (pointer: fine)` matches. Phones, tablets, and other
touch-first devices never request or mount the tooltip chunk.

### More works panel

The work section ends with four case studies and a full-width dark panel,
`MoreWorksPanel`, that leads to the `/work` route. The panel uses the
`foreground` surface with `background` text, fills at least one dynamic viewport
height, `min-h-dvh`, and stacks a centered title stage above one large circular
action. The dynamic unit follows the mobile browser bars, so the pinned panel
still fills the screen when the address bar collapses or returns.

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
the panel also routes to `/work`, so the whole surface carries a pointer
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
cutting to the next one every `750ms` without a crossfade, once all seven
images have loaded. They are decorative,
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
  scales up from zero. Each character fades in from zero opacity and scales up
  from zero around its own center, working outward from the center of the
  title, so "View" reveals right to left and "work" left to right, and every
  character is visible at full size before the words settle. The characters
  are inline blocks so the scale applies. Every character is set to zero
  opacity and zero scale before the timeline is built, and the timeline only
  tweens toward one. Do not use a staggered `fromTo` here: inside
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
- Cycling: images only cycle while the panel is on screen and after every
  panel image has loaded.

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

The intro panel centers its heading, currently "AI Content and Website
Services", on two lines, "AI Content and" and "Website Services", at
`clamp(2.25rem, 10vw, 12rem)`, with each line held to one line through
`white-space: nowrap`. The `2.25rem` floor keeps "Website Services" inside the
column down to 320 wide. Each line is its own `SplitText` word
split, and the title carries no underline. Screen readers get the phrase from an
`sr-only` copy. Every word starts invisible,
blurred, and small, at `0` opacity, `blur(16px)`, and `0.6` scale, and
grows to full opacity, no blur, and its resting size. The words resolve one
after another in reading order. The pin holds the finished title for
a short beat before releasing it. Reduced motion shows the title at rest.

Each service panel stacks its title at `text-service`, a description below
it, and an image below that. The panels use a narrower gutter than the
site-wide `section-gutter`, `clamp(1rem, 2vw, 1.5rem)` instead of
`spacing-page`, so the title, the description, and the image reach closer to
the viewport edges. The service names, "AI Content Creation" and
"Website Development", are set in title case. The intro title is not
selectable, so a drag across the pinned panel never highlights its words.

The title is left-aligned and starts at the left content edge. The description
sets at `text-2xl`, `text-4xl` from `md`, `text-5xl` from `xl`, and `text-6xl`
from `2xl`, in the
default `foreground` color at weight 600 with `0.9` leading and `-0.04em`
tracking. It sits further below the title than the panel's default gap, with a
top margin of `1rem`, `2rem` from `md`, and `3rem` from `xl`. That leading is
tighter than the glyphs, so each line mask carries `0.12em` of top and `0.18em`
of bottom padding, each cancelled by an equal negative margin, which keeps
descenders inside the clip without moving the lines. Adjacent block masks
collapse their negative margins into the larger one, so the line pitch stays at
`1.02em`. On phones it
spans the full column. From `md` the content is a three-column grid without a
column gap, and the description takes the right two thirds of the content
width and ends exactly on the right content edge, so it reads as an editorial
column from just left of center to the right side. Its text is left-aligned,
and it uses `text-pretty` so the last line never holds a single word. The
image spans the full content width at the source's natural `1456 / 816`
ratio, so it is never cropped to fit the viewport.

The left third holds a square service link, the Services hero's link frame
repeated at a larger scale. It is a `NuxtLink` to the service's own page,
`/services/ai-content-creation` or `/services/web-development`, named "See AI content creation services" or "See web
development services" through `aria-label`, and it shares the hero link's
`inset-arrow-link` focus ring, `inset-arrow-surface` grey, and
`inset-arrow-icon` glyph. From `md` it is exactly as tall as the description:
it stretches to the height of the grid row it shares with the description,
`aspect-square` makes it as wide as it is tall, and `justify-self-start` keeps
the column from stretching its width instead. It sits `0.5em` of the
description's font size in from the left content edge, so it shifts right with
the type. Its corners are `7.5%` of its size and its glyph sits inside
`17.5%` of padding, the hero frame's proportions. Its top is level with the
description's first line. Below `md` it is hidden, so phones show the title
and the description without it. Hovering it opens the services section's TrailingTooltip in its
text-only form, "More about" followed by the service name and "service", such
as "More about Website Development service", with an arrow up right glyph and
no thumbnail.

The link keeps its full size from the start, so the layout never moves. Its
grey `service-link-surface` is clipped from the right by
`--service-link-open`, which rests at `0` in CSS, so the button stays hidden
until it reveals. It opens from its left edge with the description reveal,
over `1.1s` on the swap timing's `power4.inOut` ease, while its content settles
from `1.3` scale, as the hero link frame does. The clip sits on the inner
surface rather than the link, so it never cuts the link's focus ring. Visible
keyboard focus opens it instantly, so a keyboard user never lands on a closed
link.

Each service panel scrolls slower than the page, so the title, the
description, and a future video stay on screen together while the video
grows. While motion is enabled, the panel adds runway below its content
through `--service-runway`: one viewport height for the slowed travel. The title, the description, and the image frame
slide down together through that runway as the panel crosses the viewport. The shared offset is applied to each child of
`data-service-content` rather than to the block itself, because a transform on
the block would make it an isolated group and stop its text from blending with
the dark backdrop. The title is the exception: it travels through its `top`
offset rather than a transform, because its blended text fragments are its
children, and a transform on the title would isolate them from the backdrop as
it does for the About hero title. Both offsets take the same value on the same
scrubbed timeline, so the title and the rest of the content never drift apart.
At 1440 by
900 the content moves about 0.7 times as fast as the scroll, and the text
reveal and the image scale stretch across the longer distance. That speed is
constant across the whole panel. The content never slows down further while
the image scales, because a slowdown under a scaling image reads as the page
dragging. Reduced motion drops the runway.

Because the content moves, its own elements cannot serve as ScrollTrigger
triggers. Every text and image trigger is therefore a scroll position computed
from untransformed layout: `scrollWhen` takes an element's offset inside the
panel and a viewport line, and returns the scroll position at which that
element reaches that line once the slowed travel is accounted for. The panel itself is never transformed, so it stays a reliable
reference.

The service title text does not animate. Each is a plain `h3` that is visible
in the server output and at rest from the start, so the panel always names its
service. Inside it, a 16:9 image frame follows one word, "Content" in AI
Content Creation and "Website" in Website Development. It repeats the Services
hero's image frame: `0.8em` tall, `0.06em` below the baseline, with `0.06em`
corners, and its width and `0.12em` end margin multiplied by
`--service-title-inset-open`, which rests at `0` in CSS, so the closed title
reads as plain text. Its content keeps the full frame width and stays
centered, so it is uncovered from the center outward while the next word moves
aside. The frame holds an `ImageCycle` that cuts every `750ms`: the four Services
hero images for AI Content Creation, and the work images `3.png`, `6.png`, and
`7.png` for Website Development, requested at `sm:448px`. The frame opens with
the description reveal, over `1.1s` on the swap timing's `power4.inOut` ease,
while its images settle from `1.3` scale, the Services hero frame's timing.
The frame is hidden from assistive technology and the leading text keeps its
word space, so the heading still reads "AI Content Creation". Every title
stays on one line with the frame open from `md` up, and phones keep the same
two lines whether it is open or closed. The title still anchors the description reveal: when the title
reaches 60 percent of the viewport, the description rises line by line from
`SplitText` line masks with a `0.075s` stagger set through
`lineRevealStagger` in `app/lib/word-reveal.ts`. Each description line takes
`1.1s` to rise with `power3` easing, which GSAP reads as `power3.out`, set
through `lineRevealDuration` and `lineRevealEase`. The blog card titles share
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

The image is scrubbed with the scroll in two phases that meet at the viewport
center, with no hold between them. It scales up from zero around its bottom
center from the moment its frame enters the viewport until the frame's center
reaches the viewport center, easing out with `sine.out` to its peak of `0.8`,
set through `mediaPeakScale`, while the picture inside settles from `1.3`
scale to rest. From that same point it scales back down to zero around its top
center with `sine.in`, finishing as the frame's bottom leaves the top of the
viewport. Both eases have zero speed at the peak, so the turn from growing to
shrinking is rounded rather than a sharp corner.
The image never reaches its full layout size. Entry and exit live on two nested
elements, the link for the bottom origin entry and its wrapper for the top
origin exit, so the transform origins never fight.

Each image is a `NuxtLink` to its service's own page,
`/services/ai-content-creation` or `/services/web-development`, named for
its service through `aria-label`. Hovering it opens the services section's TrailingTooltip
at its `compact` size in its text-only form with the label "More about"
followed by the service name and "service". The images are decorative
placeholders from `public/images/hero` and will be replaced with real service
media.

Each service declares a `surface`. The Website Development panel uses `dark`,
so it renders a `foreground` backdrop behind its content. Its title and
description are set in `background`, and the description and the title's text
fragments, but not its image frame, use `mix-blend-mode: difference`, so they
read dark over the canvas and off-white over the backdrop, including the moment the
rising edge crosses a line. The backdrop covers the panel's full width and
height, including its runway, and ends at the panel's bottom edge, so the
section's closing `spacing-section` stays on the canvas before the Why Choose
Us section. The backdrop sits at `-z-10`, so the previous panel's content still
paints above the dark surface while the two overlap.

The blend only works while nothing between the text and the canvas forms an
isolated group. Keep the section, the panel, and `data-service-content` free of
`isolation`, `z-index` stacking, opacity below one, filters, and transforms.
Motion that moves the text must transform the text elements themselves, and
the title, whose blended fragments sit inside it, must move without a
transform.

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
services section's bottom edge, one `spacing-section` above the Why Choose Us
title it spawns.
Lower the reach to leave more canvas between them. The tip never passes the
section's bottom edge, so it never covers the Why Choose Us section. The landing wrapper's horizontal clip hides the
curve where it runs past the viewport. The timeline starts at the image's
peak, the shared `mediaCenteredAt` position where the image begins to scale
down, so the curve and the image exit begin together. It ends when the panel's
bottom edge reaches the viewport top.

Touch devices, matched by `(hover: none) and (pointer: coarse)`, keep the
intro pin, the description reveal, and the backdrop curve, but drop the slowed
travel, the runway, the scrubbed image scale, and the backdrop rise. The content scrolls
at page speed like normal content. Each image scales up once from zero around
its bottom center, with the picture inside settling from `1.3` to rest, over
`1.2s` on `power3.out` when its frame top reaches 85 percent of the viewport. It
then stays at full size in place. The dark backdrop is revealed from the start
without the lead, so it begins at the panel top as a flat surface. The text
reveal starts when the title reaches 60 percent of the viewport, measured from
the title itself because nothing moves it, and the curve starts when the panel
bottom reaches the viewport bottom.

Reduced motion drops the intro pin, every reveal, the image scale, and the
backdrop rise and curve. It displays the intro title words, the
descriptions, the open service links, and the images at rest, and the dark
panel keeps a flat backdrop without the lead.

### Pricing section

The home pricing section sits between the services section and the work
process. It opens with two and a half times `spacing-section` of top padding,
so its title stands clear of the services panel's dark curve, and it has no
bottom padding, because the work process brings its own top padding.

The heading is centered. The title, "Plans and pricing", is a bold H2 at the
`text-section` size with `0.92` leading, `-0.05em` tracking, and balanced
wrapping. The description sits `1.5rem` below it, `2rem` from `md`, in
`font-medium` `text-current/70` at `text-base`, `text-lg` from `md`, held to
`44ch`.

Below the heading, a switcher picks the service: AI content creation, web
development, or content and web. It is the Reka UI tabs primitive, so it
carries the tab roles, arrow key navigation, and the shared focus ring. The
track is a fully round `canvas-shade` bar with a `0.25rem` inset. Its tabs
share one equal column width, the widest label's, through an auto-column
grid, so every pill has the same size. Below `md` the track spans the column
and long labels wrap onto two balanced lines.

Two pills sit behind the labels. The active pill is `foreground` with
`background` text. The hover pill is `foreground/8`. Each is one tab wide and
moves only by `translate`, by its index times its own width, over `0.55s` on
`cubic-bezier(0.22, 1, 0.36, 1)`, so a new selection glides across the track
instead of jumping. The hover pill rests under the active pill and fades in
as a mouse enters a tab, so it glides out of the active pill toward the
hovered tab, follows the mouse from tab to tab, and fades away when the mouse
leaves the track. Touch and pen input never show it. Reduced motion drops the
glide and keeps both pills in place.

Each category shows three plan cards, one column below `lg` and three from
`lg`, with a `1rem` gap. A card is a `rounded-3xl` `canvas-shade` block with
`1.5rem` of padding, `2rem` from `md`. The featured card is `foreground` with
`background` text and a fully round "Most popular" badge in `ribbon` green.
The card stacks the plan name, the price at `text-5xl`, `text-6xl` from `md`,
with its billing note in `text-current/55`, the description, a `current/15`
hairline, the feature list with check glyphs, and a full-width `cta-lg`
"Book a call" link to the Contact route. Plain cards use the `dark` button
and the featured card uses the orange `default` button. Each feature list
opens with "Includes:" on the first plan and "Everything in" the previous
plan on the others. A centered note below the cards gives the currency and
the 90 day minimum for monthly plans.

The prices are starting points designed for launch and must be confirmed
before they are treated as final.

When the heading reaches 82 percent of the viewport, the title words rise
with the line reveal timing and a `0.08s` stagger, the description lines
follow at `0.3s`, and the switcher and the note rise `48px` and fade in at
`0.45s`. When the panels reach the same line, the active cards rise `96px` and
fade in with a `0.1s` stagger. Each switch replays a shorter rise on the new
cards: `32px` over `0.8s` on `power3.out` with a `0.07s` stagger. Reduced
motion shows everything at rest and switches without the rise.

### Journey section

The journey section is the shared `ProcessSection`, which takes its title,
description, and steps as props. The home page uses it for "Work Process",
and the AI content creation and web development pages repeat it after their
story blocks for "AI Content Creation Process" and "Our web development
process", each with its own one or two sentence description, with the same
layout and motion. The `uppercase` prop sets the title in capitals and defaults
to `true`; every page currently sets it to `false`. The `titleReveal` prop
chooses a `chars` or `words` title reveal and defaults to `chars`; both service
pages use `words`. It opens with two and a half times `spacing-section` of top
padding, about 360px at 1440 wide, so the title stands well clear of the
section above it.

The heading is aligned to the left of the page gutter. The title is a bold H2
at the `text-section` size, `0.92` leading, and `-0.05em` tracking, with
balanced wrapping, so it stays on one line on wide screens and wraps on small
ones. The description sits `1.5rem` below it, `2rem` from `md`, in
`font-medium` `text-current/70` at `text-base`, `text-lg` from `md`, held to
`44ch`.

The timeline sits `3.5rem` below the heading, `5rem` from `md` and `6rem` from
`xl`, inside the page gutter on the page background, with no panel and no
images. It is a decorative chart, hidden from assistive technology, of twelve
equal columns divided by `current/15` dashed hairlines, each numbered `01` to
`12` at its foot in medium sans `current/35`, `0.625rem` and `text-xs` from
`md`. Over the columns one bar per step steps down in an equal staircase: every
bar has the same width, `60%` of the chart and `37.5%` from `md`, and each
starts an equal stride further right so the first bar starts at the left edge,
the last ends at the right edge, and neighbouring bars overlap. A bar is a
`foreground` block with the step title in semibold `background` text, `2.25rem`
tall, `2.75rem` from `md`, and truncates a title that does not fit. The stride
comes from the step count, so any number of steps fills the chart.

Below the chart, `3rem` down and `4rem` from `md`, an ordered list carries the
steps in one column, two from `md`, and four from `xl`. Each step is a bold H3
at `text-3xl`, `text-4xl` from `md`, with balanced wrapping and `-0.045em`
tracking, over its description `1rem` below, `1.25rem` from `md`, in
`font-medium` `text-current/70` at `text-base`, `text-lg` from `md`, held to
`36ch`. A step takes only a title and a description.

The heading reveals once as it reaches 85 percent of the viewport. The title
reveals either character by character with the shared `addCharReveal` recipe
that the "Case studies" title uses, or word by word with the shared word reveal
and a `0.08s` stagger, and each character or word mask carries `0.25em` of
block padding so descenders are not clipped. The description lines rise `0.3s`
in, overlapping the title, with the line reveal timing.

When the chart reaches 82 percent of the viewport, one timeline plays its parts
as overlapping waves. The dashed column lines draw down from the top in
`1.2s` on `power3.inOut` with a `0.04s` stagger. At `0.35s` the column numbers
fade and rise from `60%` below with the line reveal timing and a `0.03s`
stagger. At `0.5s` the bars wipe in from the left through a clip path with the
line reveal timing and a `0.15s` stagger. From `md`, the step text joins the
same timeline at `0.9s`, each step `0.12s` after the last: its title reveals
character by character at a `0.02s` stagger, each character mask padded
`0.12em`, and its description lines rise `0.2s` later with the line reveal
timing and a `0.075s` stagger. Below `md`, where the steps stack well below the
chart, each step plays the same reveal on its own as it reaches 82 percent of
the viewport. Reduced motion shows everything at rest.

### Why Choose Us section

The home page does not currently render the Why Choose Us section. LandingPage
keeps it disabled and shows the Journey section in its place, under the
"Work Process" title. The section stays documented for when it returns.

The Why Choose Us section opens with its title, "Why Choose Us", written in
title case at the user's request, without uppercase, on one line that always
spans the full width of the section gutter. The gutter is an inline-size
container, and the title sets
`calc(var(--why-title-size) * var(--fit-text-scale, 1))`. The
`--why-title-size` of `15cqi` is estimated from Switzer bold at `-0.05em`
tracking, and `useFitText` compares the
title's rendered width with its parent's content width and writes the
correcting `--fit-text-scale` whenever the title's box resizes, which covers
font loading, the character split, and viewport changes. The title is `w-max`
with `0.05em` of end padding, so its box includes the last letter's ink. If the
title copy changes, measure the new phrase and update `--why-title-size` so the
first paint stays close to the fitted size. The title has no underline.

The section takes `spacing-section` above the title. The services section's
dark curve grows into that section's own closing space and its tip ends at the
section's bottom edge, so this top padding is what keeps a full section gap
between the curve and the title.

The title is spawned by the services section's dark curve. As the dark panel
above bows into its arc, the title's characters appear one after another in
reading order. Each character drops from `-110` percent of its height above
its resting place, grows from `0` scale from its top edge, and turns from `-24`
degrees to upright over `1.1` seconds with a `power3.out` ease and a `0.045`
stagger. The reveal is not scrubbed. It plays once when the title's top reaches
85 percent of the viewport and then runs on its own timing, so the characters
settle smoothly whatever the scroll speed. The triggers use a `refreshPriority` of `-2`, so
they measure after the services section's pin.

Six reasons follow in a grid, each a ReasonCard inside a `data-reason`
wrapper that holds its place in the grid. Below `md` they stack in one column
with `gap-4`. From `md` the grid is a two-column staggered masonry. Odd cards
fill the left column and even cards the right, every card spans two grid rows,
and each card starts one row after the previous one, so the right column begins
at the first left card's midpoint. Cards in the same column sit only the
`gap-5` apart, with no other spacing between them. `md:auto-rows-fr` makes
every row the same height, half of the tallest card, so all cards share one
size and the offset is always one row plus the gap. Each wrapper receives its
starting row through `--reason-row`, its index plus one, and its column
through `--reason-column`. The grid keeps the `section-gutter`, so the cards
align with the title, and sits `mt-12` below it, `mt-20` from `md`, and
`mt-24` from `xl`. The section closes with `spacing-section` before the blog
section.

The stagger leaves one empty row cell beside the first card and one beside the
last, and two short notes fill them so the grid never reads as unfinished. The
intro, "Two services, one team, and a process you can watch every week...",
sits in the right column's first row, aligned to the top of the first card. The
outro, "Still comparing agencies?...", sits in the left column's last row,
`--why-outro-row`, aligned to the bottom of the last card. Both are semibold
at `text-2xl` and `text-4xl` from `xl`, with `1.05` leading, `-0.04em`
tracking, and a `30ch` measure. Below `md` the intro sits above the cards and
the outro below them, each with `1.5rem` of extra space.

ReasonCard is a plain `rounded-2xl` Card painted with a `surface-*` utility
through its `tone` prop, which accepts every `surfaceTones` key. The reasons use
`primary`, `dark`, `yellow`, `blue`, `pink`, and `green` in order, so the colors
alternate between the columns. The card is at least `18rem` tall, `24rem`
from `md`, and `28rem` from `xl`, with `p-6`, `p-10` from `md`, and `p-12`
from `xl`. A large two-digit number in `text-current/30` sits at the top and is
hidden from assistive technology, and the title and description sit at the
bottom. The title is bold at `text-3xl`, `text-4xl` from `md`, and `text-5xl`
from `xl`, with `0.95` leading and `-0.045em` tracking. The description is
`font-medium` at `text-lg`, `text-xl` from `md`, and `text-2xl` from `xl`,
with `1.2` leading and a `34ch` measure. The copy restates what the services
panels already promise: one team for content and code, a human editor on every
asset, measurement, weekly demos, a maintainable handover, and a quarterly
content slate. Keep new reasons and notes to claims the site can support.

Each card reveals once when its wrapper's top reaches 82 percent of the
viewport. The card rises `160px` to rest over `1.2s` on `power3.out`, without
a fade or a clip, and its transform is cleared at the end. The wrapper is the
trigger, so the card's own movement never shifts its start. `0.2s` into the
rise, the text follows with the shared line reveal timing, `1.1s`, `power3`,
and a `0.075s` stagger: the number rises as one line from its clipping
paragraph, the title rises word by word from its `SplitText` word masks, and
the description rises line by line from its line masks, starting one stagger
step per title word later. The two notes rise line by line the same way from
their own triggers. The description and the notes re-split their lines on
resize. A re-split before its reveal rebuilds that reveal with the new lines,
and a later one shows them at rest. Every card has its own trigger, so the
staggered layout also staggers the reveals.

Reduced motion shows the title characters, the notes, and every card and its
text at rest.

### Blog section

The blog section is a warm sand panel on the canvas. The section takes the
services panel inset, `clamp(1rem, 2vw, 1.5rem)`, on both sides and
`spacing-section` below it before the FAQ. Inside, a `bg-panel` panel with
`text-panel-foreground` and
`rounded-2xl` corners holds the `section-gutter` and `py-16`, `py-20` from
`md`, and `py-24` from `xl`. The heading row pairs the "Our Blog" title,
set in title case at the user's request, with a round `dark` `cta-icon` action
that routes to `/blog`, aligned to the row's bottom edge. The action holds only
the arrow up right glyph and keeps the CTA rollover, and its `aria-label`,
"All articles", names the link. It is as tall as the title: the heading sets
`--blog-title-size` and `--blog-title-leading`, the title uses both, and the
action takes the title size as its font size and a diameter of
`calc(var(--blog-title-leading) * 1em)`, the title's line height, with the
glyph at `0.4em`. The font size sits on the button itself because the base
button classes set `text-sm`. The row wraps, so on narrow screens the action
can drop below the title. The title keeps `section-title` for its weight and
tracking but sets its own size, `clamp(2.75rem, 9vw, 9rem)`, about 130px at
1440 wide, larger than `text-section`, at `0.92` leading.

Three `BlogCard`s follow in one column below `md` and three columns from `md`.
Each card is a `NuxtLink`. Its default `tinted` surface is painted with a
`surface-*` utility through its `tone` prop, which accepts `pink`, `yellow`,
and `green`, used in that order.
The card is `rounded-2xl` with `p-3`, so its `rounded-xl` image sits inset in
the tint. It carries a soft `shadow-xl` in `foreground` at 10 percent, at the
user's request, so the tinted cards lift off the sand panel. This is a
deliberate exception to the borders before shadows rule. The image is a decorative 4:3 `object-cover` crop of a 16:9 hero
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
the viewport, the title rises character by character from its `SplitText` word
masks with the shared character rise from `app/lib/char-reveal.ts`: each
character rises from 115 percent below its mask over `0.9s` with
`power3.out` and a `0.035s` stagger, so the title types itself in from left
to right. The word masks carry `0.15em` of block padding cancelled by an equal
negative margin for the tight leading. The action follows one stagger step
after the last character,
rising the way the hero action does: its `data-blog-cta-mask`
wrapper is clipped to `inset(0)` while the inner `data-blog-cta` block rises
from `115` percent, and both the clip and the transform are cleared at the end
so the focus ring and the rollover are never cut.

The cards themselves do not animate, so the tinted surfaces and the images are
always at rest. Only their text reveals, from each card's own trigger at the
same 82 percent line. The title rises line by line from its `SplitText` line
masks with the services description timing, `1.1s`, `power3`, and a `0.075s` stagger, and
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

The Blog route reuses the Work route's fitted listing hero and rounded grey
listing section. Its hero title "Our Blog" paints at `27.15cqi` and its
description reads "What we're learning about AI content that stops the scroll,
websites that keep people, and the numbers in between." The category pages
`/blog/ai-content` and `/blog/web-development` share the layout with their own
titles, "AI Content" at `22.3cqi` and "Web Development" at `12.44cqi`, each
measured so the first paint matches the fitted size, and their own
descriptions. Beside the article count, from `md`, sit All, AI Content, and Web
Development links in the Work filter button style: `cta-lg` pills with a `2px`
foreground border at `text-2xl`, `dark` for the current page and transparent
`outline` otherwise. Below `md` they wrap under the count. They navigate to
their pages instead of filtering in place, and they rise one after another
after the count with the navigation stagger. A category with no articles shows
"No articles in this category yet." Its article heading shows the live article count and, because
it shares `useBlogMotion` with the home section, it must split into characters
and rises character by character like the home title. Its
cards use the same responsive BlogCard grid and interaction as the home section:
one column below `md` and three columns from `md`. It passes the `neutral`
surface, which uses the card background and foreground tokens instead of a
brand tone. The home section keeps the default tinted surface.

The articles, dates, and images are placeholders until real posts exist, and
every card links to `/blog`.

### FAQ section

The FAQ section pairs the "Frequently Asked Questions" title, set in title case
at the user's request, with a single collapsible accordion. From `lg` it is a
`5fr 7fr` grid, so the accordion takes the wider right column. Below `lg` the
title stacks above the accordion. The title keeps `section-title` for its
weight and tracking but sets `clamp(2.75rem, 7vw, 6.5rem)` at `0.86` leading,
larger than `text-section`, which sets it on three lines from `lg`. Each line
mask carries `0.16em` of top and `0.2em` of bottom padding so ascenders and
descenders stay inside the clip. Adjacent negative block margins collapse into
the larger one, which would add `0.16em` to every line pitch, so only the
bottom margin is negative and cancels both paddings, and the title shifts up by
`0.16em`. The line pitch therefore matches the declared leading.

The accordion holds eight questions that follow the home keyword map, from what
an AI content agency does to cost, reporting, and the 90-day minimum. The
section title is the H2 and each question is an H3 through the accordion
header, so the outline stays nested. The answers state no prices or fixed start
dates until real figures are confirmed. The same questions feed the FAQPage
structured data.

Each item is a question row and a collapsible answer. The question is
`font-medium` at `text-xl`, `text-2xl` from `md`, and `text-3xl` from `xl`,
with `-0.03em` tracking, and the row's block padding grows from `py-7` to
`py-9` at `md` and `py-11` at `xl`. The answer is muted copy at `text-lg`,
`text-xl` from `md`, and `text-2xl` from `xl`, with `1.2` leading and a `44ch`
measure. A one-pixel `border` divider sits between items, never after the
last one. The visual question is hidden from assistive technology and an
`sr-only` copy names the trigger, because the visual question stays hidden
until the items reveal and would otherwise leave the button without a name.
The icon is a bare glyph with no tile: two Phosphor bold `minus` bars in
one grid cell, one of them rotated `90` degrees to form a plus. Opening an item
turns that bar back to the left, so the plus becomes a minus.

The title rises line by line from `SplitText` line masks with the services
description timing, `1.1s`, `power3`, and a `0.075s` stagger, when it reaches 82
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
confirmed. FaqSection is a shared component, and the Contact route renders the
same section below its hero. A route can pass its own `title` and `items`, as
the AI content creation page does with "AI content creation questions" after its
process section and the web development page with "Web development FAQ". An
item may carry an optional `link`, which renders as an `ArrowLink` `1.5rem`
below the answer, `2rem` from `md`, and opens and closes with it.

### Contact page

The Contact route stacks a two-column hero, the shared FAQ section, and the
site call to action. The hero is a grid with a `4rem` column gap from `lg`,
`pt-10`, `pt-14` from `md`, and `spacing-section` below. The left column holds
the title, "Tell us what you want to build", bold at
`clamp(3rem, 7.5vw, 8rem)` with `0.86` leading, `-0.05em` tracking, and a
`7.5em` measure. Like the Services hero, it is an `sr-only` `h1` beside a
visual copy hidden from assistive technology, set in three explicit lines,
"Tell us what", "you want to", and "build" on its own with the image inset,
each in a mask with `0.16em` of top and
`0.2em` of bottom padding and a `-0.36em` bottom margin. A line may still wrap
inside its mask on a narrow phone. "build" and the inset that follows it never
separate. The inset is a `0.8em` tall, 16:9 frame with a `0.06em` radius,
`0.12em` after the word and dropped `0.06em` like the Services hero insets.
It holds an eager ImageCycle of four hero placeholders, `5.png`, `6.png`,
`3.png`, and `4.png`, that cycles every `750ms`, and its width follows
`--contact-hero-inset-open`, which rests at `0` before the reveal and `1`
after it and under reduced motion. Below it sit a
semibold description at `text-xl`, `text-2xl` from `md`, and a muted
"Prefer email?" line whose underlined link opens the site email. Below `lg`
the form stacks under the intro.

The form follows the reference contact form: labels above the controls,
`text-lg` and `text-xl` from `md`, `font-medium`. Every field is
required, including the idea field, so no label carries an optional note. The form is one column at every width, so Name,
Email address, the idea textarea, and the footer each take their own row,
`2rem` apart and `2.5rem` from `md`. The controls are the
source-owned Shadcn `Input` and `Textarea` with the `border` color, `md`
corners, no shadow, `1.25rem` of inline padding, and `text-xl` copy,
`text-lg` from `md`. Inputs
are `h-14`, `h-16` from `md`. The textarea is at least `10rem` tall, `12rem`
from `md`, and resizes vertically. Errors sit under their control in
`destructive` text, and the control takes the primitive's `aria-invalid`
ring. The submit action is a `dark` `cta-lg` Button with the arrow up right
glyph pushed to the far edge, full width below `sm` and half the form from
`sm`. While a submit runs it reads "Sending", stays disabled at full opacity,
and swaps its arrow for the Lucide `loader-circle` spinner, which turns with
`animate-spin` and holds still under reduced motion. The arrow stays mounted
and only hides, so the rollover keeps its glyphs after a submit. A polite
status line under the action offers the site email after a failure.

A successful submit clears the form and opens the sent dialog instead of an
inline message. The dialog is the shared Dialog primitive without its close
glyph: a `max-w-xl` panel with `clamp(1.5rem, 3vw, 2.5rem)` corners, no
border, and a large shadow. A round `yellow` `cta-icon` close action named
"Close" sits in its top right corner, as in the About member dialog. Below
it, centered, are a round `ribbon` green mark with a Phosphor bold `check`, the
"Message sent" title, bold at `text-4xl` and `text-5xl` from `md`, and a
muted description. Escape, the overlay, and the close action close it, and
focus returns to the submit action. It locks the smooth scroll while open and skips its zoom and
fade under reduced motion.

At the page transition's reveal point, or once the fonts and the description
split are ready on a direct request, the title lines rise from `150` percent
with a `0.1s` stagger inside masks clipped only while they rise, the
description lines rise from `115` percent `0.3s` in with a `0.06s` stagger,
and from `0.45s` the email line and each form group fade in while rising
`48px`, `0.08s` apart, all over `0.8s` on `power3.out`. At `0.4s` the inset
after "build" opens with the Services hero timing: its frame grows from zero
width over `1.1s` on the swap ease while the picture inside settles from
`1.3` scale. Reduced motion shows the hero at rest with the inset open. The FAQ section below already sits in the first screen on
larger viewports, so it waits for the hero reveal to finish before its own
scroll reveal can play.

### About page

The About route stacks six sections: a centered hero, a combined section, a
grey team section, an approach section, a trust section, and a brands section,
followed by the site call to action and the site footer.

`AboutApproachSection` shows how forrrow works with clients. Its H2, "How we
work with clients", is centered at `clamp(2.5rem, 7vw, 7rem)`, bold with
`-0.05em` tracking and `0.88` leading, and rises word by word from `SplitText`
word masks with the shared word reveal and a `0.08s` stagger when it reaches 82
percent of the viewport. Three left-aligned text items follow `6rem` below,
`9rem` from `md` and `12rem` from `xl`, each a bold title over a `font-medium`
description and held to `30rem`. From `md` the list is centered and held to
`64rem`, `68rem` from `xl`, so "Small team, senior hands" on the left and "AI
for speed, humans for taste" on the right of one row sit near the center, and
"Numbers over opinions" is centered below them. Phones stack them. Each item's title
and description rise from their masks with the shared word reveal, `0.12s`
apart, when the item reaches 82 percent of the viewport. Reduced motion shows
everything at rest. The section opens with `2.5` times `spacing-section` and
ends with `spacing-section`.

`AboutCombinedSection` explains why forrrow joins AI content creation and web
development. Its H2, "Why we combined AI content creation and web
development", is centered at `clamp(2.25rem, 5.5vw, 5.5rem)`, smaller
than the other About section titles, bold with `-0.05em` tracking and `0.88`
leading, balanced and held to `14em`, so it breaks into two lines on desktop and
three on phones. Its lines are a `SplitText` line split in masks with the
section titles' `0.2em` padding and `-0.4em` bottom margin, and they rise with
the same title reveal. Two `AboutStatement` paragraphs follow at `text-xl`,
`text-2xl` from `md` and `text-3xl` from `xl`, held to `26em` and centered as
a block under the title, with their lines aligned left. The first sits `3.5rem` below the title,
`5rem` from `md` and `6rem` from `xl`, the second `1.5rem` below it, `2rem` from
`md`, and each rises line by line like the trust and brands statements. It sits on the canvas between the
hero and the team section, with `spacing-section` above and below.

The hero fills the first screen below the header except for
`--about-hero-peek`, `clamp(3rem, 9svh, 6rem)`, so the rounded top of the team
section shows at the bottom of the first screen. It centers the "Welcome to"
title above a three line description, held to `36ch` and widened to `80ch`
from `lg` so the founding story stays on three balanced lines, with the
forrrow logo in place of the second line's text. The logo is a `currentColor` span masked by `/logo.svg`,
`0.74em` tall, the measured height of the bold lowercase "forrrow" it replaces,
and sits on the text baseline, so it takes the title's color and blend. Screen
readers still hear "Welcome to forrrow" from the heading label. The team,
trust, and brands section titles, "Who are the forrrow founders", "Why people
trust forrrow", and "Why brands choose forrrow", render the brand name as the
same logo at the same `0.74em`, next to their underlined word. Body copy keeps
the name as text. The description sits `5rem` below the title and
`7rem` from `md`, which keeps the descender of the y clear. The title and the call
to action title use `AboutTitle` at its `display` size,
`clamp(3.5rem, 11vw, 12rem)`. The section titles use its `section` size,
`clamp(2.75rem, 8vw, 8.5rem)`. Every title is bold with `-0.05em` tracking and
`0.88` leading, and each explicit line sits in a mask with `0.2em` of block
padding, cancelled by a `-0.4em` bottom margin and a `-0.2em` title top margin,
as the home hero title does. The masks clip only while their lines rise, so the
underline wave below a word is never cut afterwards. The hero rises like the
home hero on a client-side entry: at the page transition's reveal point the
title lines rise from `150` percent over `0.8s` on `power3.out` with a `0.1s`
stagger. The description lines follow at `0.35s`, while the last title line
is still visibly settling, because the `power3.out` lines look finished long
before their tweens end. They rise from `115` percent with a `0.06s` stagger. On a direct request it starts once the description is split, beside
the header reveal. Until then both stay hidden in CSS. As the reader scrolls,
the hero content drifts down at half the scroll speed and fades out
linearly. The drift moves the content through `top` and fades the text and
the image frame one by one, because a transform or opacity on the content
itself would isolate the blended text from the trail behind it. It reaches zero opacity as the hero leaves the top of the viewport, so
the team section appears to arrive faster and covers it.

The "forrrow" line opens a 16:9 image frame before the word, the same frame the
Services hero sets before "Websites": `0.8em` tall, `0.06em` below the
baseline, with `0.06em` corners, and its width and `0.12em` end margin
multiplied by `--about-title-inset-open`. It holds an `ImageCycle` of the four
eager images `1.png` to `4.png` in `public/images/hero`. `0.3s` into the title
rise the frame opens from the center over `1.1s` on the swap ease while its
images settle from `1.3` scale, so the centered line spreads around it.
`AboutTitle` renders the frame for any line that passes `images`. Until the
reveal the frame is closed in CSS, and reduced motion shows it open with its
first image.

Moving a mouse across the hero leaves a trail of work images. Every time the
pointer has travelled a third of the viewport width, counting horizontal and
vertical movement together, the next image appears centered on the pointer,
with a random horizontal offset of up to `40` percent of its width and a
random tilt of up to `10` degrees. It lands from `1.3` scale over `0.6s` on
`elastic.out(2, 0.6)`, and over `1.5s` on `power4.out` it is thrown four times
the pointer's last movement while it turns to a new random tilt. `0.1s` after
the throw it shrinks to zero over `0.3s` on `back.in(1.5)`. The images are the
seven files in `public/images/work`, cycled in order, in `rounded-xl` 3:4
frames `clamp(6rem, 10vw, 11rem)` wide. They paint behind the hero text and
below the team section. The title text and the description are set in
`background` with `mix-blend-difference`, as the Services dark section intro
is, so they read black over the canvas and invert over a passing image, and
stay readable. The title's image frame does not blend. Because a clip path
or a transform would isolate the blended text from the canvas, the hero title
rises through `overflow: clip` on its masks and a relative `top` offset on its
lines, the same `150` percent of the line height, instead of the clip path and
`yPercent` the other About titles use. The images never take the pointer, and stay hidden from
assistive technology. The layer holds two recycled frames per image, so a fast
pointer reuses a frame only after thirteen newer ones. The trail starts at the
page transition's reveal point, runs only for a fine hover pointer, and is
absent on touch devices and under reduced motion.

The team section paints the `canvas-shade` grey with
`clamp(1.5rem, 3vw, 3rem)` top corners at `z-10`, so it slides over the hero.
"Who are the forrrow founders" sits on the left with a primary orange wave
under "founders". Two 5:6 portraits with a name and a role follow: Ruzan
Darbinyan, Co-Founder and Creative Director, on the right, and Razmik Matinyan,
Co-Founder and Senior Software Engineer, on the left, pulled up by `0.45` of the portrait width
from `md`. From `md`, both cards also step in from the page edge by
`clamp(2rem, 8vw, 9rem)`, Ruzan's from the right and Razmik's from the left. The name and the role share the section's ink. Ruzan's portrait, with the alt text "Ruzan Darbinyan, co-founder and creative
director of forrrow", reuses
`public/images/founder.jpg`. A member without a `portrait` shows the striped
`MediaPlaceholder` until a photo exists.

A round `yellow` `cta-icon` action with an arrow up right glyph sits to the
right of each name and role, centered on both, and rises with them. Hovering
it runs the CTA rollover. Hovering anywhere on a card opens the text-only
TrailingTooltip, "More Info" with an arrow up right glyph, set in title case at
the user's request. Clicking the card or the action opens that member's dialog.
The tooltip closes as the dialog opens.

The member dialog is a centered Shadcn dialog at `z-90`, above the header and
the overlay scrollbar, over a `foreground` overlay at half
opacity. Its panel is `brand-cream` with `clamp(1.5rem, 3vw, 3rem)` corners, up
to `72rem` wide and never closer than `1rem` to the viewport edges, and at most
the viewport height less `2rem`. The body scrolls inside the panel with
`data-lenis-prevent` while the page's smooth scroll is locked. From `md` it is a
`5fr 6fr` grid: the 5:6 portrait on the left, and on the right the name with one
word per line, then a row with the role on the left and round `background`
social links on the right, then the bio paragraphs and an optional
`ArrowLink` `2rem` below them, `2.5rem` from `md`, sized to its label at
`text-lg`, `text-2xl` from `md`. Ruzan's links to "See AI content creation
services" and Razmik's to "See web development services". Below `md` everything
stacks. Each social link opens in a new tab and is named "{name} on {network}".
The close action is a round `yellow` `cta-icon` in the top right corner whose
close glyph scales in place on hover. Opening focuses the dialog itself rather
than the close action, so a pointer open never shows the close action in its
covered or focus state, and Tab reaches it first. Escape, the overlay, and the
close action all close the dialog, and focus returns to the card action.

The trust and brands sections share `AboutSectionHeading`: the title on the
left and a 5:6 `ImageCycle` frame on the right, centered on the title from
`md`, that cuts through four images from `public/images/work` every `750ms`, as
the More works panel does. "trust" carries a `ribbon` green wave and "choose" a
primary orange one. Each wave draws once its title has risen. Below each
heading a statement takes the right two thirds of the row from `md`. The
statements use `AboutStatement`, which owns that placement, semibold at `text-2xl`,
`text-4xl` from `md`, and `text-5xl` from `2xl`, with `0.95` leading and
`-0.04em` tracking, and they rise line by line with the services description
timing, `1.1s`, `power3`, and a `0.075s` stagger.

Two lines draw themselves with the scroll on larger screens, as the home Studio
ribbon and work line do. Both were drawn as two layers of one 1440 wide frame
whose top edge is the team section's top. The source file is not kept in the
repository. `app/lib/about-line-path.ts` stores each layer's `d` string
unchanged with the section lines it was drawn against,
measured at 1440 by 900: the team section from `0` to `1768`, and the trust
and brands sections at `1768`, `2866`, and `3820`, where the green call to
action the story line was drawn under used to begin. At
runtime x scales by the live width and y maps between the matching live
section lines, so each line keeps its place against the content at every
breakpoint. The team artwork's top line sits at `-120` instead of `0`, which
lowers the line by about `120` pixels at 1440 wide so its top curve clears the
section's top edge instead of being cut by it. Its bottom line sits at `1960` instead of
`1768`, below the path's lowest point plus half the stroke, so the line's end
stays whole inside the section instead of being cut by its bottom edge. The
team section adds `2.25` times `spacing-section` of bottom padding to match, so
the line keeps its drawn proportions. The approach section that follows opens
with `2.5` times `spacing-section` of top padding, a deliberately large pause
after the grey team section.

The team line, Layer 1, is a `DrawnLine` with `text-ribbon` at full strength
inside the team section, so it paints above the grey surface and below the
title and portraits. It enters past the right edge beside the title, loops
around the portraits, and leaves at the right edge near the section bottom.
It uses the Studio ribbon's default head lead, and its SVG clips at the
section edges.

The story line, Layer 2, uses the work line's `text-foreground` and
`opacity-3`. It sits at `-z-10` in the isolated `about-story` block that wraps
the trust and brands sections. It enters past the right edge beside the trust
title, sweeps left behind the trust statement, and curves back right behind
the brands heading. The rest of the artwork continues below the block, where
the SVG clips it, so the line ends at the brands section's bottom edge, right
where the site call to action begins. It uses the work
line's head lead of `0`. To replace either line, draw it on the same frame in
the direction it should animate, paste its `d` string into the matching
artwork, and remeasure the section lines if the layout has changed.

Every frame on the page reveals with the Studio portrait's bottom-up clip and
carries the shared image parallax on its `data-about-media-layer`. Every scroll
reveal starts at `82` percent of the viewport and runs once. Reduced motion
shows every title, line, image, and underline at rest, without the hero drift,
the cursor trail, or image cycling, and shows both drawn lines complete. Below
the `lg` breakpoint the drawn lines are hidden.

### Services page

The Services route is a hub. It stacks a centered hero, a grey statement
section, a light AI Content Creation summary, and a dark Website Development
summary, followed by the site call to action and the site footer. Each summary
links to that service's own page, so each service can rank on its own.

The hero repeats the About hero's frame: it fills the first screen below the
header except for `--services-hero-peek`, `clamp(3rem, 9svh, 6rem)`, so the
rounded top of the statement section shows at the bottom of the first screen.
It has no description. The title sets "We create", "AI Content and", and
"Websites" on three centered lines, with a link frame after "We" and an image
frame before "Websites". It is bold with `-0.05em` tracking and `0.88` leading,
in the same padded line masks as `AboutTitle`. The hero is an inline-size
container, and the title sets `min(10.5cqi, 18svh)`. The longest line, "AI
Content and", measures about `6.2em` with its frames open, so `10.5cqi` sets it
across about 65 percent of the content width at every width, and the `18svh`
cap keeps the three lines inside the first screen on short, wide viewports.
Every line stays on one line. If the phrase changes, measure its longest line
again and update the size. The `h1` is an `sr-only`
copy of the phrase. The visual title is a `div` whose text fragments are hidden
from assistive technology one by one, rather than as a whole, so the link
inside it stays reachable.

Both frames are inline blocks as tall as the letters, `0.8em`, set `0.06em`
below the baseline so they span from just under the baseline to the ascender
line, with `0.06em` corners. A frame's width and its `0.12em` end margin, which
matches a word space, are multiplied by `--services-hero-inset-open`, so at `0`
the frame takes no room and the line reads as plain text. The content inside
keeps its full width and stays centered, so as the frame widens it is
uncovered from its center outward while the centered line spreads around it.

The link frame is a square `NuxtLink` to `/about` on the `canvas-shade` grey of
the statement section below, named "About" through `aria-label`. It holds a
brand orange `primary` arrow up right glyph that fills the frame inside
`0.14em` of padding. The Phosphor bold arrow spans only about three fifths of
its box, so the glyph scales to `1.5`, which brings the arrow itself most of
the way to the padding. The focus ring lives in the global
`inset-arrow-link` class group, the grey in `inset-arrow-surface`, and the
glyph's scale in `inset-arrow-icon`, which the home service links
share. Hovering it opens the hero's text-only TrailingTooltip, "About"
with an arrow up right glyph, and keyboard focus shows the standard ring.

The image frame is 16:9 and shows an `ImageCycle` that cuts through four images
from `public/images/hero` every `750ms`, the way the About section headings do,
at every width. The images are decorative and load eagerly. Under reduced
motion the cycle holds its first image.

The title rises with the About hero timing at the page transition's reveal
point, or after the fonts load on a direct request. `0.5s` later, while the
title lines are still rising, the link frame opens over `1.1s` on the swap
timing's `power4.inOut` ease, `swapEase` from
`app/lib/swap-timing.ts`, while its content settles from `1.3` scale on the
same ease. The image frame starts `0.3s` later on the same timing, so the two
openings overlap. Until the reveal the title is hidden and both frames are
closed in CSS. As the reader scrolls, the hero content drifts
down at half the scroll speed and fades out like the About hero, while the
statement section covers it.

The statement section paints the `canvas-shade` grey with
`clamp(1.5rem, 3vw, 3rem)` top corners at `z-10`, as the About team section
does. Its statement spans the full content width, semibold at `text-3xl`,
`text-5xl` from `md`, and `text-6xl` from `xl`, with `0.95` leading and
`-0.04em` tracking, and its line masks carry `0.12em` above and `0.18em` below
like `AboutStatement`. When the text reaches 82 percent of the viewport its
lines rise once with the services description timing, `1.1s`, `power3`, and a
`0.075s` stagger. Every word also starts at `0.2` opacity and is scrubbed to full
opacity in reading order, from when the text top reaches 65 percent of the
viewport until its bottom reaches the viewport middle, with about three words
fading in at a time, so the read part of the statement stays dark while the
rest waits in grey. The statement reads "Buy AI content, web development, or
both", followed by the promise that one team works to one brief. Reduced
motion shows the title, both open frames with a still first image in the image
frame, and the statement at full opacity,
without the rise, the drift, or the scrub.

The AI Content Creation section sits on the white `background` canvas, like
the hero. It carries the `ai-content-creation` id and the Website Development
section the `website-development` id, so a link can open either section.
Each section is a summary, not a list of offers. Its intro repeats the home
services panel: the title in bold `text-service` with `-0.045em` tracking on
the left, and the description below it in the home service description style,
in the right two of three grid columns from `md`. The left column holds the
home services panel's square arrow link to the service's own page, with the
same sizing, `inset-arrow` surface and glyph, `0.5em` inset, focus ring, and
hidden state below `md`: from `md` it is exactly as tall as the description
and its top is level with the first line. Hovering it opens a text-only
TrailingTooltip, "More about" followed by the section title and "service".
Under the description, `2.5rem` below and `3.5rem` from `md`, sits the shared
`ArrowLink` to the same page, "See AI content creation services" or "See web
development services", sized to its label, so phones keep a visible link. The
title and description rise line by line with the services description timing,
`1.1s`, `power3`, and a `0.075s` stagger, and the link rises from its mask
`0.3s` later with the word reveal timing. The square link's grey surface is
clipped from the right by `--services-offer-inset-open`, which rests at `0`,
and opens from its left edge as it reaches 82 percent of the viewport, level
with the description, over `1.1s` on the swap ease while its glyph settles
from `1.3` scale, as on the home page. Keyboard focus and reduced motion show
it open. The light AI
Content Creation section ends with twice `spacing-section` of bottom padding,
so there is a large gap before the dark Website Development section. The dark
section ends with `spacing-section`.

The Website Development section repeats the layout on a dark `foreground`
surface with `background` ink. Its description names the range of work, from
landing pages to full websites and custom web platforms. The dark surface is
revealed like the home services dark panel: as the section's top enters the
viewport it grows from a rounded `32px` point at the bottom center of the
viewport to the full width, over `0.8` of a viewport of scroll. The surface
marks the header as dark. As in the home dark panel, the intro title,
description, and link are set in `background`, and the title and description
use `mix-blend-difference`, so they read black over the light canvas and turn
light where the dark surface has grown behind them.

The light site call to action follows with a straight edge below the dark
surface. The dark surface extends one pixel below the section, under the call
to action, so the fractional smooth scroll offset never opens a gap at the
seam.

### Service pages

Each service has its own route under `/services`, so it can rank on its own.
`/services/ai-content-creation` is built; `/services/web-development` is still
a placeholder heading. Both stay out of search through `unlistedRoute` until
their content ships.

A service page opens with `ServiceHero`, which repeats the home hero layout.
From `lg` it is a two-column grid with a `3rem` column gap: the description and
the dark `cta-lg` Start a project action sit in the flexible left column, and
the H1 sits in an auto-width right column. Below `lg` the title stacks above
the copy, which is capped at `max-w-md`. The H1 is bold with `-0.05em` tracking
and `0.88` leading at `clamp(2.5rem, 7.4vw, 8rem)`, capped at `9.2em`. The
description is semibold `foreground` with `-0.04em` tracking, at `text-xl`
below `lg` and `clamp(1.0625rem, 1.5vw, 1.5rem)` from `lg`, held to `17em`. At
the page transition's reveal point, or after the fonts load on a direct
request, the title lines rise from their masks with the line reveal timing and
the About title's `0.1s` stagger, the description lines follow `0.3s` later,
and the action rises after the last line. The title, description, and action
stay hidden until the reveal starts, and the motion places every line at its
start offset before showing them, so the text never flashes in its final place
first. The title line masks carry `0.12em` above and `0.18em` below, and
`0.12em` on each side cancelled by a matching negative margin, so letters that
overhang their box, such as the tail of a "j", are not clipped. The
description masks `0.1em` and `0.2em`, cancelled by a negative bottom margin
only, because negative top and bottom margins of adjacent masks would collapse
and grow the hero when the text splits. The title shifts up `0.24em` to match.
Reduced motion shows the hero at rest. The hero has no parallax.

`ServiceCardsSection` follows on a dark `foreground` surface with
`clamp(1.5rem, 3vw, 3rem)` corners on all four sides at `z-10`, set `3rem`
below the hero, `5rem` from `md` and `6rem` from `xl`, so the light
canvas shows around it before the next section, and marks the header as dark.
Its centered H2 keeps `section-title` and reveals word by word with the shared
word reveal and a `0.08s` stagger when it reaches 82 percent of the viewport.
Below it the cards sit in a row of four from `lg`, two from `md`, and a stack
below `md`. Each card is a `rounded-2xl` `surface-*` tone with `p-6`, `p-8`
from `xl`, a `4:5` ratio from `md`, and a minimum height of `18rem` on phones.
It carries a two-digit number at the top in bold `text-6xl`, `text-7xl` from
`xl`, with `-0.05em` tracking, and its H3 title and description
at the bottom. The cards tilt by `-3deg`, `2.5deg`, `-2deg`, and `3deg` in
turn, at 40 percent of that on phones so they stay inside the gutter, and from
`lg` every second card sits `4rem` lower. A decorative white `6px` line in an
SVG hidden from assistive technology curves behind the row from `lg`.
Each list item holds an inner surface that carries the tone and the tilt, so
the pop-in scale on the item never fights the hover. With hover and a fine
pointer, the hovered card straightens to `0deg`, scales to `1.05`, and rises
above its neighbors, over `0.5s` on the `cubic-bezier(0.19, 1, 0.22, 1)` ease
the blog cards use. Reduced motion switches the hover without a transition. Do not
give the path `vector-effect: non-scaling-stroke`, because DrawSVG then
measures the dash in the wrong units and the line draws with gaps.

When the row reaches 75 percent of the viewport, the line draws from left to
right over `1s` at a constant speed, and each card pops in from `0` scale
`0.1s` before the line reaches its center, on `elastic.out(1, 0.6)` over
`1.1s`, so it overshoots past full size and settles back. The cards are hidden
until their pop starts. Reduced motion shows the title, the line, and the cards
at rest. The AI content cards use green, pink, blue, and the brand orange.

`ServiceStorySection` follows on the light canvas after twice
`spacing-section` of space. It stacks story blocks inside the page gutter,
`7rem` apart, `10rem` from `md` and `12rem` from `xl`. Each block holds a
`text-section` H2 at `0.95` leading with balanced wrapping, a `font-medium`
`foreground` description in the same ink as the title, at `text-xl`,
`text-2xl` from `md`, held to `40ch`,
and an optional `ArrowLink`. Every block is start-aligned. From `lg` a block
with the `start` offset begins 12 percent from the left edge, and a `middle`
block begins 55 percent from the left edge and is held to 40 percent of the
width. Below `lg` both sit at the left edge. When a block reaches 82 percent of
the viewport, its title lines rise from their masks with the line reveal timing
and a `0.1s` stagger,
its description lines rise `0.3s` later with the line reveal timing, and the
link rises after the last line. Reduced motion shows the blocks at rest.

The AI content creation page closes with the shared `ProcessSection` for its
four step process, described under Journey section.

### Work page

The Work route stacks a hero, a grey projects section, and the dark call to
action that also closes the Services route, followed by the site footer.

From `lg` the hero repeats the Services hero's frame: it fills the first screen
below the header except for `--listing-hero-peek`, `clamp(3rem, 9svh, 6rem)`,
so the rounded top of the projects section shows at the bottom of the first
screen. Its content fills that space. The Work title sets "Case studies" on one line
across the full content width at the top, and the description sits at the
bottom of the space below it, in the right half of a two-column grid with a
`4rem` column gap and a `3.5rem` row gap. Below `lg` the hero has no minimum
height and takes only its content's height, and the description follows the
title across the full width `1.5rem` below it, `2rem` from `sm`. The projects
section still slides over the drifting hero on every width. The title is bold with `-0.05em`
tracking and a tight `0.76` leading, in the same padded line mask as the
Services hero, with each word and each of its characters an inline block
inside it. Separate characters drop the font's kerning pairs, which the
measured size accounts for. The content is an inline-size container, and the title sets
`calc(var(--work-hero-title-size) * var(--fit-text-scale, 1))`. The
`--work-hero-title-size` is measured from the phrase, `23.71cqi` by default
for a phrase as wide as "Our Work" and `18.13cqi` for "Case studies", so the
first paint already sits at the edge, and `useFitText` corrects the scale
whenever the title's box resizes, as it does for the Why Choose Us title. The title
is `w-max` with `0.05em` of end padding, so its box includes the last letter's
ink. If the phrase changes, measure it again and update the size. The title
mask carries `0.2em` above and `0.3em` below, because at `0.76` leading a
Switzer Bold descender such as the "g" in "Our Blog" hangs about `0.22em` below
the line box, and `0.2em` cut it off while the reveal clip was on. The project
hero title mask uses the same padding. A `0.2em`
bottom margin cancels the mask's negative margin, so the description never
crowds the letters on phones. The `h1` is an `sr-only` copy of the phrase and
the visual line is hidden from assistive technology. The Work description, "Our studio projects and tools,
each one a test of the pipeline behind our client work: AI content that stops
the scroll and websites built from scratch.", is semibold at `text-2xl`, `text-4xl` from `md`, and
`text-5xl` from `2xl`, with `0.95` leading, `-0.04em` tracking, and a `20em`
measure, in line masks that carry `0.12em` above and `0.18em` below. Each mask
cancels that padding with negative margins, and the description becomes a flex
column once it holds the masks, so the margins of adjacent masks never
collapse into each other. The split lines then keep the height of the unsplit
paragraph, and nothing below the hero moves when the description splits. It
stays a block while SplitText measures, because a flex container would put
every word on its own line.

The hero reveals like the home hero. At the page transition's reveal point, or
once the description is split on a direct request, the title characters rise
one by one from `150` percent inside the shared mask over the shared
character reveal's `0.9s` on `power3.out`, with a wider `0.07s` stagger than
the shared `0.035s`, so each letter reads on its own, and `0.35s`
later the description lines rise from `115` percent with a `0.06s` stagger.
Until then both stay hidden in CSS. As the reader scrolls, the hero content
drifts down at half the scroll speed and fades out while the projects section
covers it, as the Services hero does.

The projects section paints the `canvas-shade` grey with
`clamp(1.5rem, 3vw, 3rem)` top corners at `z-10`, like the Services statement
section, so it slides over the drifting hero. An `sr-only` "Projects" `h2`
names it. It opens with the filters: a bold project count, such as
"Projects - 8", at display size, `clamp(2.75rem, 7.5vw, 8rem)`, about 108px at
1440 wide, with `-0.05em` tracking, and a wrapping row of `cta-lg` toggle buttons, All,
AI Content, and Website Development, `0.5rem` apart. The buttons override the
size's type, height, and inline padding at every breakpoint: `text-2xl`
labels, a fixed `60px` height that includes the padding and border, and `2rem`
of inline padding. The number follows the
shown filter and uses tabular figures. "Projects -" is split into characters
in the template and the number is one more character element, and the line
sits in a mask that clips only vertically. It
is hidden from assistive technology, because the polite live status already
reads the count. From `md` the count and
the buttons share one row, the count on the left and the buttons aligned to
the right edge, both resting on the row's bottom. Below `md` the buttons wrap
under the count. The buttons are pills: a `9999px` radius, set on the
button itself as `--radius-sm`, the variable the size's important
`radius-action` resolves to. Never declare a Tailwind layer in a component
style block: a component sheet that loads before the global stylesheet would
put `utilities` first in the layer order, and the base reset would then beat
every utility, such as the button colors. They
pass `rollover` as `false`, so they skip the CTA rollover, and they carry no
icon, so each is exactly as wide as its label and padding. The pressed button
uses the `dark` variant and the others use `outline` with a transparent
background, so the grey section shows through them. Every button carries a
`2px` `foreground` border, the same black as the outline buttons' text, in
place of the outline variant's faint `1px` border, so the pressed button's
border blends into its fill and the buttons keep one size whichever is
pressed. On `(hover: hover)` pointers every button turns the `foreground`
black with white `primary-foreground` text, replacing the variants' orange and
white hovers, so the pressed button stays dark. Each carries `aria-pressed` inside a
group named "Filter projects". When the filters reach 82 percent of the
viewport, the count characters rise with the shared character reveal, and `0.3s` in the buttons rise from `115` percent of their masks over
`0.8s` on `power3.out` with the `0.08s` navigation stagger. The masks clip only
during the rise, so the focus ring is never cut.

The project cards follow in one column below `md` and two columns from `md`,
`1rem` apart, `1.25rem` from `md`, with `3rem` between rows, `4rem` from `md`,
and `5rem` from `xl`. Each card is an article with a 4:3 image frame with
subtle `rounded-md` corners, about `13px`, then a row with the project name on the left and its comma-separated
categories on the right, semibold and medium `brand-subtle` at `text-xl`,
`text-2xl` from `md`, and `text-3xl` from `xl`, with `-0.03em` tracking. The
row is inset from the frame's edges by `0.75rem`, `1rem` from `md`, and
`1.25rem` from `xl`, so the name and the categories sit inside the image's
edges rather than flush with them. The categories and their services come
from `app/lib/projects.ts`. The images are `object-cover` crops of 16:9 or
portrait sources, requested at `sm:1024px md:1024px lg:768px xl:1024px 2xl:1536px`
with `densities="x1"`, which covers the 4:3 crop and the hover scale. The
listing shows only real projects, UGC Creator, Sygen, and Cartoon, in
that order. Each card takes an `href`, so the whole card renders as a NuxtLink
to its project page, and a card without one stays an article. The pointer
cursor marks the link surface, as on the home case study cards. A linked card shows the focus ring and
the hover image scale on keyboard focus.

Hovering a card scales its image to `1.06` inside the frame over `0.8s` on
the tooltip's `cubic-bezier(0.19, 1, 0.22, 1)` curve and opens the section's
TrailingTooltip in its text-only form, "View" followed by the project name
and "Case", such as "View UGC Creator Case", with an arrow up right
glyph. The scale applies only to `(hover: hover)` pointers and switches without
the transition under reduced motion. A card with a `video` keeps its image at
rest and stacks the shared `HoverVideo` over it, a muted, looping,
decorative video whose source is set on the first hover, so the page loads
none of it before then. Hovering plays the video,
which fades in over `0.4s` once it is playing and scales with the image, and
leaving pauses it, rewinds it to the start, and fades it out. It plays only
for `(hover: hover)` pointers and never under reduced motion. The cards have no scroll reveal. They
are always at rest and only move when a filter changes.

Choosing a filter presses its button at once. The shown cards then fade out
and drop `24px` over `0.35s` on `power2.in` with a `0.03s` stagger, the grid
swaps to the matching projects, and those rise from `48px` while they fade in
over `0.8s` on `power3.out` with a `0.08s` stagger. The count's number
changes in place as the grid swaps, without any animation, and "Projects -"
never moves. A project appears under a
service when any of its categories belongs to that service, so a project with
both kinds of work appears under both. A polite live status announces how many
projects are shown. A newer choice interrupts a running swap. Reduced motion
shows the count, the buttons, and every card at rest and swaps the cards
instantly.

The site call to action follows the grey projects section with a straight top
edge.

### Header motion

The site header has full and compact sticky states. The full state, with the
primary navigation, exists only at the top of the page. The header compacts once
the reader has scrolled `96px` down and stays compact while they scroll back up,
returning to full only within `24px` of the top. The logo stays visible in both
states. The compact state keeps the Start a project action visible and pairs it
with a single responsive SiteMenu control labelled "Menu" in normal case. The
control uses the same dark action surface, `radius-action` corners, and `44px`
height as the CTA, with a fixed `w-26` width. Its glyph is two horizontal
one-pixel lines with no tile behind them that morph into an X when expanded.
The control has no hover motion, only the shared press feedback. Activating it
opens its own menu and never restores the primary navigation. There is no
separate mobile dropdown.

A mouse pointer entering the control also opens the menu. A menu opened this
way closes once the pointer has stayed outside both the control and the panel
for `200ms`, or leaves the window. The bounds are measured rather than read
from the hovered element, because the header actions sit above the panel.
Clicking the control while a hover opened menu is showing pins it open instead
of closing it. A menu opened by a click, a tap, or the keyboard never closes on
pointer leave and stays open until the control, a link, an outside click, or
Escape closes it. Touch and pen pointers never open the menu on hover.

A menu link keeps the menu open until the page transition takes it over, so
the open menu leaves with the old page as described in Page transitions. A
link to the current page starts no transition, so the menu closes with its
normal animation while the page scrolls to the top. A link followed
while a transition is already running closes the menu with its normal animation.
Any menu close during a page transition is instant.

Both header actions share the dark action surface, so over a dark block they
gain a one-pixel `background/20` border that keeps their outline readable. The
dark blocks are the More works panel and the services backdrop surface and
curve, each marked with `data-header-surface="dark"`.
`useHeaderSurface` sets the state from what is actually behind the header
actions. The menu control receives it through its `bordered` prop and fades its
own border color, the same color it uses while expanded. The Start a project
action receives `data-bordered` and fades in an `::after` ring with inherited
radius above its rollover layers rather than a real border, because a filled
rollover host must stay borderless. Both fades take `0.3s` and are instant under
reduced motion. Mark any new dark block on the element that paints it.

While the site footer is revealed by scrolling, the header actions and the
logo fade out with it. The opacity of the actions container and the logo layer
follows the footer reveal progress from one to zero, and both become hidden
once the footer is fully at rest, so the invisible controls cannot be clicked
or focused. The primary navigation does not fade. The actions and the logo stay
fully visible while the menu is open,
and on a route so short that the footer already starts inside the first screen,
because then the reveal is not driven by scrolling. Reduced motion has no
footer reveal, so the actions and the logo never fade.

The primary navigation is plain text: no surface, padding, or shadow on the
`nav` or its links. It lists Home, Work, Services, About, Blog, and Contact.
Each `SiteNavLink` sets its label in semibold at `text-lg`, in the title case
of the nav labels rather than uppercase, and stacks a hidden copy in the same
grid cell. Its `size` prop defaults to `lg`. The `inherit` size drops the
size and weight so the link takes them from its surrounding text, as the
footer credit does. The copy and the underline are brand orange, `primary`, so hovering
swaps the ink label for an orange one. The header's Start a project action
and the menu control drop uppercase too. On hover or visible keyboard focus,
`useNavLinkMotion` slides the label up out of a clipping mask while the copy
slides up from just below it, with no scaling, and a one-pixel underline below
the label draws outward from its center. All three run over `0.65s` on
`cubic-bezier(0.16, 1, 0.35, 1)`, so the motion starts at once, and leaving
reverses them. The mask sets the labels at `1.25` leading so the two words pass
close together while descenders still clear it, and the link adds `0.15em` of
vertical padding so its height and the underline position stay the same. The copy
rests one line below in CSS and the underline at zero scale, so neither flashes
before hydration. Reduced motion switches states instantly.

The header rises into place piece by piece when a page loads, with no opacity
change. The logo, every navigation link, the Start a project action, and the
compact menu control rise from 115 percent below their masks with the shared
`addWordReveal` recipe, `0.8s` on `power3.out`, with the `navRevealStagger` of
`0.08s` from `app/lib/word-reveal.ts`. They play in visual order from left to
right, read from their measured positions by `getHeaderRevealParts`, which
both the intro and `useSiteHeaderMotion` use. Each link sits in its own
`site-nav-item` mask, which carries `0.25em` of padding cancelled by an equal
negative margin so the hover underline and the focus ring stay inside the clip.
The logo and the two actions instead rise inside a `data-header-rise-mask`
wrapper that is clipped to `inset(0)` only during the reveal, as the hero
action's is, so the hover bounce and the focus ring are never cut afterwards.
The action's `data-header-rise` target is a span around the button rather than
the button itself, because `useHoverBounce` owns the button's transform. On a
direct home request the intro timeline runs this reveal at `expand+=0.1`. A page
transition into home lowers the pieces and runs the reveal again at the
transition's reveal point, as described in Home intro motion. On every other
route `useSiteHeaderMotion` runs it after mount, and later page transitions carry
the revealed header in with the incoming page, as described in Page transitions. Until the reveal finishes the
`nav` has no `data-nav-revealed` attribute, and the header and the logo layer
have no `data-header-revealed` attribute, so their pieces stay hidden in CSS
and a server-rendered piece never flashes before it rises. Reduced motion shows
everything at rest without the rise.

The header logo always renders a real link to the home route so it stays
crawlable and opens in a new tab on a modified click. A plain click always
follows the link, so on the home route it scrolls the home page back to the
top like any other link to the current page.

The header logo reads on every surface through `mix-blend-mode: difference`.
It is painted in the `background` token, so it shows as black on the canvas and
as off-white over dark blocks, the way the dark services panel text does. Saturated
surfaces invert it to their complement, so it reads cyan over orange. A sticky header always forms its own stacking context, and a blended
element only mixes with what is painted inside that context, so the logo cannot
live inside the `header`. `SiteHeader` therefore renders it as a second root,
a fixed `site-logo-layer` that sits in the page's root stacking context at the
header's `z-60` and repeats the header's `py-4` padding around a `44px` row, so
it stays level with the actions. The layer must stay free of any ancestor that
isolates it. The logo is a `span` masked with `public/logo.svg` and filled with
`bg-background`, because an image cannot take a theme color. The span's aspect
ratio repeats the SVG's `680 / 192` viewBox, so update both together when the
logo artwork changes, or the masked mark is letterboxed inside its box. The link's
`aria-label` names it. `SiteHeader` disables attribute inheritance and binds
`$attrs` to both roots, so `data-home-intro-header` reaches the header and the
logo layer, and the home intro hides both until it reveals them.

Drive header state from the shared Lenis scroll subscription and animate it with
the component-scoped GSAP toolkit. Keep transitions quick, interruptible, and
limited to transforms and opacity. Reduced motion must switch between complete
states without animated travel.

The expanded menu is a dark panel with the control's `radius-action` corners, teleported to Nuxt's shared overlay
target, outside the header action group. Position its fixed surface from the
control's layout bounds, measured with the transforms on the control and its
ancestors briefly neutralized. A menu opened while the header is still scaling
the control in, or while the control is pressed, therefore opens from the
control's final revealed position. Rest the panel eight pixels above and to the right
while keeping a safe viewport inset. It grows from the control's exact width and
height through `scaleX` and `scaleY`. Derive the transform origin from the final
panel position and collapsed scales so the closed panel bounds match the control
exactly, then sweep up and right through a subtle translate, skew, and scale
overshoot before settling at full dimensions. The panel holds only its
navigation items, with no heading or footer. They enter with opacity and a
tight stagger after the overshoot, keeping
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
clipped to the label line, and keep the label line height at `1.2` so the clip
holds full descenders and the copied characters stay hidden below it. Revert both
SplitText instances during cleanup, and skip character splitting for touch-only
pointers or reduced-motion preferences.

Escape closes the panel and restores focus to the control. Outside clicks and
navigation selection also close it. Keep the panel inert while closed. `inert`
already removes it from the accessibility tree, so do not add `aria-hidden`:
choosing a link closes the panel while that link still has focus, and the
browser blocks and warns about `aria-hidden` on an ancestor of the focused
element. Let short viewports scroll its content
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

Actions can bounce on hover. `useHoverBounce` attaches GSAP scale tweens to a target,
scales it to `1.08` with an elastic ease, and settles it back with a short
overshoot when the pointer leaves.

The shared button primitive only bounces when it receives `bounceOnHover`, which
defaults to `false`. With it, every size gets press feedback and the
`cta-sm`, `cta-lg`, and `cta-icon` sizes also get the hover bounce. Without it,
a button has neither. The About team card action and the member dialog close
action currently opt in. The header navigation control always enables press
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

The rollover tweens the icon slot's text color together with the original
label, from the resting color to the copied label's color, so a `plain` glyph
follows the final layer's foreground. Both colors are read from the host and
the copied label each time a rollover starts, and the inline color is cleared
once the label returns, so a button whose variant changes while it is hovered,
such as a Work filter that becomes pressed, rests in its new variant's ink.

The icon box stays put. CTA buttons pass their `ButtonIcon` through the named
`icon` slot, which renders after the layers and is positioned so it paints above
them. The icon box renders only when that slot is filled, so a CTA without an
icon, such as a Work filter, reserves no gap for one. Only the glyph animates. `ButtonIcon` renders its glyph twice into the same
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
icon box itself clips, the copy never crosses the label on its way in.

A close glyph scales in place instead. `ButtonIcon` marks its box with
`data-rollover-glyph-axis="scale"` and the `button-icon-scale` class, which
parks the copy at `scale(0)`. On rollover the original shrinks to zero while the
copy grows to full size in the same spot, and leaving reverses both. Every
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

| Variant   | Layer sequence        |
| --------- | --------------------- |
| `default` | blue, green, dark     |
| `dark`    | green, pink, primary  |
| `outline` | primary, green, dark  |
| `cream`   | primary, green, dark  |
| `light`   | blue, pink, primary   |
| `ribbon`  | yellow, primary, dark |
| `yellow`  | green, primary, dark  |

`destructive`, `secondary`, `ghost`, `link`, and `inverse` are absent from that
map on purpose. They keep their plain color hover at every size and render no
rollover markup. Any other button can opt out the same way through its
`rollover` prop, which defaults to `true`, as the Work filters do. A CTA-size button that opts into `bounceOnHover` bounces
regardless of its variant.

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
  `data-rollover-label` and `data-rollover-label-copy`. The text grid is
  optional. Without it the icon takes its covered color from the final layer's
  foreground.
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
