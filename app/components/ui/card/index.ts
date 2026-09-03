import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Card } from "./Card.vue"
export { default as CardAction } from "./CardAction.vue"
export { default as CardContent } from "./CardContent.vue"
export { default as CardDescription } from "./CardDescription.vue"
export { default as CardFooter } from "./CardFooter.vue"
export { default as CardHeader } from "./CardHeader.vue"
export { default as CardTitle } from "./CardTitle.vue"

export const cardVariants = cva('', {
	variants: {
		variant: {
			default: 'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm',
			plain: '',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export type CardVariants = VariantProps<typeof cardVariants>
