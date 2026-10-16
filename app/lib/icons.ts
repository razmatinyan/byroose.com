export const appIcons = {
	arrowDown: 'lucide:arrow-down',
	arrowLeft: 'lucide:arrow-left',
	arrowRight: 'lucide:arrow-right',
	arrowUp: 'lucide:arrow-up',
	arrowUpRight: 'lucide:arrow-up-right',
	check: 'lucide:check',
	close: 'lucide:x',
	github: 'lucide:github',
	instagram: 'lucide:instagram',
	linkedin: 'lucide:linkedin',
	minus: 'lucide:minus',
	plus: 'lucide:plus',
	share: 'lucide:share-2',
	spinner: 'lucide:loader-circle',
} as const

export type AppIcon = (typeof appIcons)[keyof typeof appIcons]
