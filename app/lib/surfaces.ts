export const surfaceTones = {
	blue: 'surface-blue',
	card: 'surface-card',
	dark: 'surface-dark',
	green: 'surface-green',
	pink: 'surface-pink',
	primary: 'surface-orange',
} as const

export type SurfaceTone = keyof typeof surfaceTones

export const surfaceForegroundTones = {
	blue: 'text-brand-blue-foreground',
	card: 'text-card-foreground',
	dark: 'text-primary-foreground',
	green: 'text-brand-green-foreground',
	pink: 'text-brand-pink-foreground',
	primary: 'text-primary-foreground',
} satisfies Record<SurfaceTone, string>
