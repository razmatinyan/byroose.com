<script setup lang="ts">
import { useEventListener, useMounted, useResizeObserver } from '@vueuse/core'
import { computed, onMounted, shallowRef } from 'vue'

interface DragStart {
	pointer: number
	scroll: number
}

const minThumbSize = 48

const viewportSize = shallowRef(0)
const contentSize = shallowRef(0)
const scrollPosition = shallowRef(0)
const mounted = useMounted()
const { scrollTo } = useSmoothScroll()
let dragStart: DragStart | null = null

const scrollRange = computed(() => contentSize.value - viewportSize.value)
const scrollable = computed(() => scrollRange.value > 1)
const thumbSize = computed(() =>
	Math.max(
		minThumbSize,
		(viewportSize.value * viewportSize.value) / Math.max(contentSize.value, 1),
	),
)
const thumbTravel = computed(() => viewportSize.value - thumbSize.value)
const thumbOffset = computed(() =>
	scrollable.value
		? (scrollPosition.value / scrollRange.value) * thumbTravel.value
		: 0,
)
const thumbStyle = computed(() => ({
	height: `${thumbSize.value}px`,
	transform: `translateY(${thumbOffset.value}px)`,
}))

function measureScroll() {
	scrollPosition.value = window.scrollY
}

function measure() {
	viewportSize.value = window.innerHeight
	contentSize.value = document.documentElement.scrollHeight
	measureScroll()
}

function startDrag(event: PointerEvent) {
	if (event.button !== 0 || !(event.currentTarget instanceof HTMLElement)) {
		return
	}

	event.preventDefault()
	event.currentTarget.setPointerCapture(event.pointerId)
	dragStart = { pointer: event.clientY, scroll: scrollPosition.value }
}

function drag(event: PointerEvent) {
	if (!dragStart || thumbTravel.value <= 0) return

	const scrollPerPixel = scrollRange.value / thumbTravel.value
	const distance = event.clientY - dragStart.pointer

	scrollTo(dragStart.scroll + distance * scrollPerPixel, { immediate: true })
}

function endDrag() {
	dragStart = null
}

useEventListener('scroll', measureScroll, { passive: true })
useEventListener('resize', measure, { passive: true })
useResizeObserver(() => (mounted.value ? document.body : null), measure)

onMounted(measure)
</script>

<template>
	<div v-if="mounted && scrollable" class="site-scrollbar" aria-hidden="true">
		<div
			class="site-scrollbar-thumb"
			:style="thumbStyle"
			@pointerdown="startDrag"
			@pointermove="drag"
			@pointerup="endDrag"
			@pointercancel="endDrag"
		/>
	</div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-scrollbar {
	@apply pointer-events-none fixed inset-y-0 right-0 z-80 w-3.5 mix-blend-difference;
}

.site-scrollbar-thumb {
	@apply pointer-events-auto absolute top-0 right-0 w-full cursor-grab touch-none active:cursor-grabbing;
}

.site-scrollbar-thumb::before {
	content: '';
	@apply absolute inset-y-0.5 right-1 w-1.5 rounded-full bg-background opacity-50;
}
</style>
