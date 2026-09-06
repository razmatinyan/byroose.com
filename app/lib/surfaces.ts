export const surfaceTones = {
	blue: 'surface-blue',
	card: 'surface-card',
	dark: 'surface-dark',
	green: 'surface-green',
	pink: 'surface-pink',
	primary: 'surface-orange',
} as const

export type SurfaceTone = keyof typeof surfaceTones
