<script setup lang="ts">
import { computed, nextTick, shallowRef, useId, useTemplateRef, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import SiteNavLink from '@/components/layout/SiteNavLink.vue'
import BrandLogomark from '@/components/shared/BrandLogomark.vue'
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from '@/components/ui/popover'
import { servicePagePaths } from '@/lib/services-anchors'

defineOptions({ inheritAttrs: false })

type OpenMode = 'focus' | 'hover'

const hoverCloseDelay = 200

const { href, label } = defineProps<{
	href: string
	label: string
}>()

const services = [
	{
		href: servicePagePaths.aiContent,
		label: 'AI content creation',
		description: 'AI videos, UGC ads, and visuals',
		markClass: 'text-primary',
	},
	{
		href: servicePagePaths.web,
		label: 'Web development',
		description: 'Websites and landing pages that convert',
		markClass: 'text-brand-blue',
	},
] as const

const listId = useId()
const navLink = useTemplateRef<ComponentPublicInstance>('navLink')
const serviceList = useTemplateRef<HTMLUListElement>('serviceList')
const open = shallowRef(false)
const openMode = shallowRef<OpenMode | null>(null)
const hoveredIndex = shallowRef<number | null>(null)
const lastHoveredIndex = shallowRef(0)
const listStyle = computed(() => ({
	'--service-count': services.length,
	'--service-hover': lastHoveredIndex.value,
}))
const route = useRoute()

const hoverClose = useTimeoutFn(
	() => {
		if (openMode.value === 'hover') setOpen(false)
	},
	hoverCloseDelay,
	{ immediate: false },
)

function getLinkElement() {
	const element: unknown = navLink.value?.$el
	return element instanceof HTMLElement ? element : null
}

function setOpen(nextOpen: boolean, mode: OpenMode | null = null) {
	hoverClose.stop()
	open.value = nextOpen
	openMode.value = nextOpen ? mode : null
	if (!nextOpen) hoveredIndex.value = null
}

function handleOpenChange(nextOpen: boolean) {
	if (!nextOpen) setOpen(false)
}

function isMouse(event: PointerEvent) {
	return event.pointerType === 'mouse'
}

function openOnHover(event: PointerEvent) {
	if (!isMouse(event)) return

	hoverClose.stop()
	if (!open.value) setOpen(true, 'hover')
}

function closeOnHoverLeave(event: PointerEvent) {
	if (isMouse(event) && openMode.value === 'hover') hoverClose.start()
}

function cancelHoverClose() {
	hoverClose.stop()
}

function openOnKeyboardFocus(event: FocusEvent) {
	const target = event.currentTarget
	if (!(target instanceof HTMLElement) || !target.matches(':focus-visible')) {
		return
	}

	if (!open.value) setOpen(true, 'focus')
}

function isInsideServices(target: EventTarget | null) {
	if (!(target instanceof Node)) return false

	return Boolean(
		serviceList.value?.contains(target) || getLinkElement()?.contains(target),
	)
}

function closeOnFocusLeave(event: FocusEvent) {
	if (openMode.value === 'focus' && !isInsideServices(event.relatedTarget)) {
		setOpen(false)
	}
}

async function focusFirstService(event: KeyboardEvent) {
	if (event.key !== 'ArrowDown') return

	event.preventDefault()
	if (!open.value) setOpen(true, 'focus')
	await nextTick()
	serviceList.value?.querySelector<HTMLElement>('a')?.focus()
}

function returnFocusOnEscape() {
	if (serviceList.value?.contains(document.activeElement)) {
		getLinkElement()?.focus()
	}
}

function startItemHover(index: number, event: PointerEvent) {
	if (!isMouse(event)) return

	hoveredIndex.value = index
	lastHoveredIndex.value = index
}

function endItemHover() {
	hoveredIndex.value = null
}

function preventAutoFocus(event: Event) {
	event.preventDefault()
}

watch(
	() => route.path,
	() => setOpen(false),
)
</script>

<template>
	<Popover :open="open" @update:open="handleOpenChange">
		<PopoverAnchor as-child>
			<SiteNavLink
				ref="navLink"
				:href="href"
				:label="label"
				v-bind="$attrs"
				:aria-expanded="open"
				:aria-controls="open ? listId : undefined"
				@pointerenter="openOnHover"
				@pointerleave="closeOnHoverLeave"
				@focus="openOnKeyboardFocus"
				@blur="closeOnFocusLeave"
				@keydown="focusFirstService"
			/>
		</PopoverAnchor>

		<PopoverContent
			class="w-auto rounded-2xl bg-canvas-shade p-1.5 text-canvas-shade-foreground shadow-none duration-200 data-[state=closed]:data-[side=bottom]:slide-out-to-top-2"
			align="center"
			:side-offset="6"
			@open-auto-focus="preventAutoFocus"
			@close-auto-focus="preventAutoFocus"
			@escape-key-down="returnFocusOnEscape"
			@pointerenter="cancelHoverClose"
			@pointerleave="closeOnHoverLeave"
			@focusout="closeOnFocusLeave"
		>
			<ul
				:id="listId"
				ref="serviceList"
				class="site-nav-services-list"
				:style="listStyle"
				@pointerleave="endItemHover"
			>
				<li
					class="site-nav-services-pill"
					:data-visible="hoveredIndex !== null || undefined"
					aria-hidden="true"
				/>
				<li
					v-for="(service, index) in services"
					:key="service.href"
					class="site-nav-services-item"
					@pointerenter="startItemHover(index, $event)"
				>
					<NuxtLink
						class="site-nav-service"
						:to="service.href"
						@click="setOpen(false)"
					>
						<span class="site-nav-service-mark-box">
							<BrandLogomark
								class="site-nav-service-mark"
								:class="service.markClass"
							/>
						</span>
						<span class="site-nav-service-text">
							<span class="site-nav-service-label">
								{{ service.label }}
							</span>
							<span class="site-nav-service-description">
								{{ service.description }}
							</span>
						</span>
					</NuxtLink>
				</li>
			</ul>
		</PopoverContent>
	</Popover>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-nav-services-list {
	--service-gap: 0.25rem;
	@apply relative m-0 grid list-none gap-(--service-gap) p-0;
}

.site-nav-services-pill {
	@apply pointer-events-none absolute inset-x-0 top-0 rounded-xl bg-foreground/8 opacity-0;
	height: calc(
		(100% - var(--service-gap) * (var(--service-count) - 1)) /
			var(--service-count)
	);
	translate: 0 calc(var(--service-hover) * (100% + var(--service-gap)));
	transition:
		translate 0.55s cubic-bezier(0.22, 1, 0.36, 1),
		opacity 0.3s ease;
}

.site-nav-services-pill[data-visible] {
	@apply opacity-100;
}

.site-nav-services-item {
	@apply relative;
}

.site-nav-service {
	@apply flex items-stretch gap-3 rounded-xl px-3 py-2.5 pr-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/50;
}

.site-nav-service-mark-box {
	@apply flex size-12 shrink-0 items-start justify-end self-center p-2;
}

.site-nav-service-mark {
	@apply size-5;
}

@media (prefers-reduced-motion: reduce) {
	.site-nav-services-pill {
		transition: none;
	}
}

.site-nav-service-text {
	@apply grid gap-0.5;
}

.site-nav-service-label {
	@apply text-xl leading-tight font-semibold tracking-[-0.02em] whitespace-nowrap;
}

.site-nav-service-description {
	@apply text-base leading-snug whitespace-nowrap text-muted-foreground;
}
</style>
