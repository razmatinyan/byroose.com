# byroose design system

The design system keeps the original landing-page character while following
Shadcn Vue and Tailwind CSS v4 conventions. Components own behavior and variants;
the global stylesheet owns semantic tokens and reusable Tailwind class groups.

## Theme

Theme values live in `app/assets/css/tailwind.css` as OKLCH variables. Shadcn's
standard surface pairs (`background`/`foreground`, `card`/`card-foreground`,
`primary`/`primary-foreground`, and so on) are the default API. Brand extensions
cover blue, green, pink, cream, soft copy, and subtle copy.

Use semantic utilities such as `bg-primary`, `text-muted-foreground`, and
`border-border`. Do not add raw hexadecimal colors to Vue templates. New theme
tokens belong in `:root` and `.dark`, then must be exposed through `@theme inline`.

## Tailwind class groups

Repeated visual recipes live under `@layer components`. Examples include
`section-title`, `hero-card`, `course-card`, and `site-nav-link`. Small reusable
surface and media recipes use Tailwind v4 `@utility`, such as `surface-blue` and
`pattern-orange`.

Use direct Tailwind utilities in templates for one-off layout adjustments of a
few classes. When the same recipe appears twice, give it a semantic class group
or move it into a component variant.

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
declared directly in the destructure. Defaults that reference local arrays or
objects should be resolved with `computed`, because `defineProps` is hoisted.

## Responsive rules

Build mobile-first with Tailwind's standard `sm`, `md`, `lg`, and `xl`
breakpoints. Cards stack on phones, become two-column layouts on tablets where
space allows, and expand to their full editorial grids on desktop. Keep a zero
horizontal-overflow check at 390px, 768px, and 1440px in visual QA.

## GSAP

`useGsap()` exposes the core instance, scoped contexts, responsive match-media
contexts, lazy plugin loading, and automatic teardown. GSAP is not eagerly loaded
into the landing page until a component uses the composable.

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
a component root. Use `loadPlugin()` for `ScrollTrigger`, `SplitText`, `Flip`,
`Observer`, `ScrollToPlugin`, or `TextPlugin`. Contexts and media queries are
reverted automatically when their Vue scope is disposed.
