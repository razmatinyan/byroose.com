export type SplitTextAria = 'auto' | 'hidden' | 'none'
export type SplitTextMask = 'chars' | 'lines' | 'words'
export type SplitTextMode =
	| 'chars'
	| 'chars,words'
	| 'lines'
	| 'lines,chars'
	| 'lines,words'
	| 'lines,words,chars'
	| 'words'
	| 'words,chars'

export interface SplitTextParts {
	chars: HTMLElement[]
	lines: HTMLElement[]
	masks: HTMLElement[]
	words: HTMLElement[]
}

export type SplitTextResult = SplitTextParts | null
