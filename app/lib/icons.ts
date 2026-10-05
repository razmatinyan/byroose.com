export const appIcons = {
	arrowDown: 'lucide:arrow-down',
	arrowLeft: 'lucide:arrow-left',
	arrowRight: 'lucide:arrow-right',
	arrowUp: 'lucide:arrow-up',
	arrowUpRight: 'lucide:arrow-up-right',
	minus: 'lucide:minus',
	plus: 'lucide:plus',
} as const

export type AppIcon = (typeof appIcons)[keyof typeof appIcons]
