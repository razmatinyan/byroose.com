import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'
export { default as ButtonIcon } from './ButtonIcon.vue'

export const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
	{
		variants: {
			variant: {
				default:
					'border border-primary bg-primary text-primary-foreground hover:border-foreground hover:bg-foreground hover:text-background',
				dark: 'border hover:border-primary hover:bg-primary hover:text-primary-foreground border-foreground bg-foreground text-background',
				destructive:
					'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
				outline:
					'border border-foreground/35 bg-background text-foreground hover:bg-card hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 hover:underline',
				cream: 'bg-brand-cream text-brand-cream-foreground hover:bg-card hover:text-foreground',
				inverse:
					'border border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground',
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
				icon: 'size-9',
				'icon-xs':
					"size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
				'icon-sm': 'size-8',
				'icon-lg': 'size-10',
				'cta-sm':
					'h-auto min-h-11 gap-2.5 !rounded-action py-action-inset pr-action-inset pl-4 text-sm sm:text-base',
				'cta-lg':
					'h-auto min-h-13 gap-3 !rounded-action py-action-inset pr-action-inset pl-5 text-lg sm:text-xl',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
