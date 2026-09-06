export const appIcons = {
	arrowDown: 'lucide:arrow-down',
	arrowLeft: 'lucide:arrow-left',
	arrowRight: 'lucide:arrow-right',
	arrowUpRight: 'lucide:arrow-up-right',
	close: 'lucide:x',
	plus: 'lucide:plus',
	menu: 'lucide:menu',
} as const

export type AppIcon = (typeof appIcons)[keyof typeof appIcons]
