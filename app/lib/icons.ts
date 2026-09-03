export const appIcons = {
	arrowDown: 'lucide:arrow-down',
	arrowLeft: 'lucide:arrow-left',
	arrowRight: 'lucide:arrow-right',
	close: 'lucide:x',
	plus: 'lucide:plus',
	menu: 'lucide:menu',
} as const

export type AppIcon = (typeof appIcons)[keyof typeof appIcons]
