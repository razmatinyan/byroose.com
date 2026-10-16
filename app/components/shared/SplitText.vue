<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import type { SplitText as SplitTextInstance } from 'gsap/SplitText'
import type {
	SplitTextAria,
	SplitTextMask,
	SplitTextMode,
	SplitTextParts,
	SplitTextResult,
} from '@/lib/split-text'

type SplitTextElement = 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span'

const labelledElements = new Set<SplitTextElement>(['h1', 'h2', 'h3'])

const {
	aria = 'auto',
	as = 'span',
	autoSplit = false,
	mask,
	text,
	type = 'words',
} = defineProps<{
	aria?: SplitTextAria
	as?: SplitTextElement
	autoSplit?: boolean
	mask?: SplitTextMask
	text: string
	type?: SplitTextMode
}>()

const emit = defineEmits<{
	split: [parts: SplitTextResult]
}>()

const root = useTemplateRef<HTMLElement>('root')
const { loadPlugin } = useGsap()
const { deferCleanup } = usePageTransition()
let splitInstance: SplitTextInstance | null = null

const usesTextCopy = aria === 'auto' && !labelledElements.has(as)

function addTextCopy(element: HTMLElement, parts: SplitTextParts) {
	const pieces = [...parts.masks, ...parts.lines, ...parts.words, ...parts.chars]
	pieces.forEach(piece => piece.setAttribute('aria-hidden', 'true'))

	const copy = document.createElement('span')
	copy.className = 'sr-only'
	copy.textContent = text
	element.prepend(copy)
}

function handleSplit(element: HTMLElement, instance: SplitTextInstance) {
	const parts = getParts(instance)
	if (usesTextCopy) addTextCopy(element, parts)
	emit('split', parts)
}

function getHtmlElements(elements: Element[]) {
	return elements.filter(
		(element): element is HTMLElement => element instanceof HTMLElement,
	)
}

function getParts(instance: SplitTextInstance): SplitTextParts {
	return {
		chars: getHtmlElements(instance.chars),
		lines: getHtmlElements(instance.lines),
		masks: getHtmlElements(instance.masks),
		words: getHtmlElements(instance.words),
	}
}

onMounted(async () => {
	await document.fonts.ready
	const element = root.value
	if (!element) {
		emit('split', null)
		return
	}

	try {
		const SplitTextPlugin = await loadPlugin('SplitText')
		if (!SplitTextPlugin) {
			emit('split', null)
			return
		}

		splitInstance = SplitTextPlugin.create(element, {
			aria: usesTextCopy ? 'none' : aria,
			autoSplit,
			charsClass: 'split-text-char',
			linesClass: 'split-text-line',
			mask,
			onSplit: instance => handleSplit(element, instance),
			tag: 'span',
			type,
			wordsClass: 'split-text-word',
		})
	} catch {
		emit('split', null)
	}
})

onBeforeUnmount(() => {
	const instance = splitInstance
	splitInstance = null
	deferCleanup(() => instance?.revert())
})
</script>

<template>
	<component :is="as" ref="root">{{ text }}</component>
</template>
