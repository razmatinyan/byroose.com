export const appIcons = {
	arrowDown: 'ph:arrow-down-bold',
	arrowLeft: 'ph:arrow-left-bold',
	arrowRight: 'ph:arrow-right-bold',
	arrowUp: 'ph:arrow-up-bold',
	arrowUpRight: 'ph:arrow-up-right-bold',
	check: 'ph:check-bold',
	close: 'ph:x-bold',
	github: 'ph:github-logo-bold',
	instagram: 'ph:instagram-logo-bold',
	linkedin: 'ph:linkedin-logo-bold',
	minus: 'ph:minus-bold',
	plus: 'ph:plus-bold',
	share: 'ph:share-network-bold',
	spinner: 'lucide:loader-circle',
} as const

export type AppIcon = (typeof appIcons)[keyof typeof appIcons]
