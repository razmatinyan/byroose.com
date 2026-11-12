<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import {
	computed,
	nextTick,
	onMounted,
	onScopeDispose,
	ref,
	useTemplateRef,
	watch,
} from "vue";
import BrandLogomark from "@/components/shared/BrandLogomark.vue";
import { whenImageLoaded } from "@/composables/useImagesLoaded";
import type { TrailingTooltipSize } from "@/composables/useTrailingTooltip";
import { registerSlideEase, slideDuration } from "@/lib/slide-ease";
import { stackRevealEase } from "@/lib/stack-reveal";

interface TooltipLayer {
	id: number;
	ready: boolean;
	src: string;
}

interface LabelLayer {
	id: number;
	text: string;
}

const {
	active = false,
	image = "",
	label = "See Full Project",
	mark = false,
	preload = [],
	size = "default",
} = defineProps<{
	active?: boolean;
	image?: string;
	label?: string;
	mark?: boolean;
	preload?: readonly string[];
	size?: TrailingTooltipSize;
}>();

const swapDuration = 0.6;
const thumbnail = {
	alt: "",
	draggable: "false",
	height: 96,
	loading: "eager",
	sizes: "sm:448px",
	width: 96,
} as const;

const tooltip = useTemplateRef<HTMLElement>("tooltip");
const media = useTemplateRef<HTMLElement>("media");
const labelMask = useTemplateRef<HTMLElement>("labelMask");
const layers = ref<TooltipLayer[]>([]);
const labelLayers = ref<LabelLayer[]>([{ id: 0, text: label }]);
const currentLabelId = computed(() => labelLayers.value.at(-1)?.id);
const resizesSmoothly = ref(false);
const showsMark = computed(() => mark && !image);
const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
const { createMatchMedia, gsap, loadPlugin } = useGsap();
let nextLayerId = 0;
let nextLabelId = 1;
let labelEase: string | gsap.EaseFunction = "power3.out";

function keepLayersFrom(id: number) {
	layers.value = layers.value.filter((layer) => layer.id >= id);
}

function hasLayer(id: number) {
	return layers.value.some((layer) => layer.id === id);
}

function markLayerReady(id: number) {
	layers.value = layers.value.map((layer) =>
		layer.id === id ? { ...layer, ready: true } : layer,
	);
}

async function showLayer(id: number, reveal: boolean) {
	await nextTick();
	const element = media.value?.querySelector(`[data-tooltip-layer="${id}"]`);
	if (!(element instanceof HTMLImageElement)) {
		if (hasLayer(id)) keepLayersFrom(id);
		return;
	}

	await whenImageLoaded(element);
	if (!hasLayer(id)) return;

	markLayerReady(id);
	if (!reveal) {
		keepLayersFrom(id);
		return;
	}

	gsap.fromTo(
		element,
		{ scale: 0 },
		{
			duration: swapDuration,
			ease: stackRevealEase,
			onComplete: () => keepLayersFrom(id),
			scale: 1,
		},
	);
}

watch(
	() => [active, image] as const,
	([isActive, nextImage], previous) => {
		if (!nextImage) {
			layers.value = [];
			return;
		}

		if (nextImage === layers.value.at(-1)?.src) return;

		const id = nextLayerId++;
		const revealsOverPrevious =
			Boolean(previous?.[0]) && isActive && layers.value.length > 0;

		const layer = { id, ready: false, src: nextImage };

		if (!revealsOverPrevious || prefersReducedMotion.value) {
			layers.value = [layer];
			return showLayer(id, false);
		}

		layers.value = [...layers.value, layer];
		return showLayer(id, true);
	},
	{ flush: "post", immediate: true },
);

function resetLabelMotion() {
	const mask = labelMask.value;
	if (!mask) return;

	gsap.killTweensOf([mask, ...mask.children]);
	gsap.set(mask, { clearProps: "width" });
}

async function slideLabel(id: number, fromWidth: number) {
	await nextTick();
	const mask = labelMask.value;
	const incoming = mask?.querySelector(`[data-label-layer="${id}"]`);
	if (!mask || !(incoming instanceof HTMLElement)) return;

	const outgoing = mask.querySelectorAll('[data-leaving="true"]');
	const tween = {
		duration: slideDuration,
		ease: labelEase,
		force3D: false,
		overwrite: "auto" as const,
	};

	gsap.killTweensOf(mask);
	gsap.set(mask, { clearProps: "width" });
	const toWidth = mask.getBoundingClientRect().width;

	gsap.fromTo(
		mask,
		{ width: fromWidth },
		{ ...tween, clearProps: "width", width: toWidth },
	);
	gsap.to(outgoing, { ...tween, yPercent: -100 });
	gsap.fromTo(
		incoming,
		{ yPercent: 100 },
		{
			...tween,
			onComplete: () => {
				labelLayers.value = labelLayers.value.filter(
					(layer) => layer.id >= id,
				);
			},
			yPercent: 0,
		},
	);
}

watch(
	() => [active, label] as const,
	([isActive, nextLabel], previous) => {
		if (nextLabel === labelLayers.value.at(-1)?.text) return;

		const layer = { id: nextLabelId++, text: nextLabel };
		const mask = labelMask.value;
		const slides =
			Boolean(previous?.[0]) &&
			isActive &&
			Boolean(mask) &&
			!prefersReducedMotion.value;

		if (!slides || !mask) {
			resetLabelMotion();
			labelLayers.value = [layer];
			return;
		}

		const fromWidth = mask.getBoundingClientRect().width;
		labelLayers.value = [...labelLayers.value, layer];
		return slideLabel(layer.id, fromWidth);
	},
);

watch(
	() => [active, size] as const,
	([isActive], previous) => {
		resizesSmoothly.value = Boolean(previous?.[0]) && isActive;
	},
);

onMounted(async () => {
	createMatchMedia(
		{
			finePointer: "(hover: hover) and (pointer: fine)",
			motion: "(prefers-reduced-motion: no-preference)",
		},
		(context) => {
			const element = tooltip.value;
			if (!element || !context.conditions?.finePointer) return;

			const gap = 16;
			const moveX = context.conditions.motion
				? gsap.quickTo(element, "x", {
						duration: 0.65,
						ease: "power3.out",
						force3D: false,
					})
				: (value: number) => {
						gsap.set(element, { force3D: false, x: value });
					};
			const moveY = context.conditions.motion
				? gsap.quickTo(element, "y", {
						duration: 0.65,
						ease: "power3.out",
						force3D: false,
					})
				: (value: number) => {
						gsap.set(element, { force3D: false, y: value });
					};

			const handlePointerMove = (event: PointerEvent) => {
				moveX(event.clientX + gap);
				moveY(event.clientY + gap);
			};

			window.addEventListener("pointermove", handlePointerMove, {
				passive: true,
			});

			return () => {
				window.removeEventListener("pointermove", handlePointerMove);
				gsap.killTweensOf(element);
				gsap.set(element, { clearProps: "transform" });
			};
		},
		tooltip,
	);

	const CustomEase = await loadPlugin("CustomEase");
	if (CustomEase) labelEase = registerSlideEase(CustomEase);
});

onScopeDispose(() => {
	const element = media.value;
	if (element) gsap.killTweensOf(element.children);
	resetLabelMotion();
});
</script>

<template>
	<Teleport to="#teleports">
		<div
			ref="tooltip"
			class="trailing-tooltip"
			:data-active="active"
			:data-size="size"
			:data-resize="resizesSmoothly ? 'smooth' : undefined"
			:data-media="layers.length > 0"
			:data-mark="showsMark"
			aria-hidden="true"
		>
			<span
				v-if="showsMark"
				class="trailing-tooltip-mark inset-arrow-surface"
			>
				<BrandLogomark class="trailing-tooltip-logomark" />
			</span>
			<span v-if="layers.length" ref="media" class="trailing-tooltip-media">
				<NuxtImg
					v-for="layer in layers"
					:key="layer.id"
					v-bind="thumbnail"
					:data-tooltip-layer="layer.id"
					:data-ready="layer.ready"
					class="trailing-tooltip-image"
					:src="layer.src"
				/>
			</span>
			<span ref="labelMask" class="trailing-tooltip-label">
				<span
					v-for="layer in labelLayers"
					:key="layer.id"
					class="trailing-tooltip-label-text"
					:data-label-layer="layer.id"
					:data-leaving="layer.id !== currentLabelId"
				>
					{{ layer.text }}
				</span>
			</span>
			<span v-if="preload.length" class="trailing-tooltip-preload">
				<NuxtImg
					v-for="src in preload"
					:key="src"
					v-bind="thumbnail"
					class="trailing-tooltip-preload-image"
					:src="src"
				/>
			</span>
		</div>
	</Teleport>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.trailing-tooltip {
	--tooltip-resize: 0.5s cubic-bezier(0.19, 1, 0.22, 1);
	@apply pointer-events-none fixed top-0 left-0 z-50 flex items-center gap-5 overflow-hidden border border-border bg-card p-2 pr-8 text-card-foreground shadow-xl;
	border-radius: 0.5rem;
	clip-path: inset(50% 100% 50% 0 round 0.5rem);
	transition: clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1);
}

.trailing-tooltip[data-active="true"] {
	clip-path: inset(0 0 0 0 round 0.5rem);
}

.trailing-tooltip-media {
	@apply relative block size-26 shrink-0 overflow-hidden;
	border-radius: calc(0.75rem - 0.5rem);
}

.trailing-tooltip-image {
	@apply absolute inset-0 size-full object-cover;
	border-radius: inherit;
}

.trailing-tooltip-image[data-ready="false"] {
	@apply invisible;
}

.trailing-tooltip-preload {
	@apply hidden;
}

.trailing-tooltip-preload-image {
	@apply object-cover;
}

.trailing-tooltip-label {
	@apply relative -my-[0.15em] block overflow-y-clip whitespace-nowrap text-3xl tracking-tighter leading-none font-semibold;
}

.trailing-tooltip-label-text {
	@apply block py-[0.15em];
}

.trailing-tooltip-label-text[data-leaving="true"] {
	@apply absolute top-0 left-0;
}

.trailing-tooltip-mark {
	@apply block size-9 shrink-0 overflow-hidden rounded-[15%] p-1.5 text-primary;
}

.trailing-tooltip-logomark {
	@apply block size-full;
}

.trailing-tooltip[data-media="false"] {
	@apply px-5 py-3;
}

.trailing-tooltip[data-size="compact"] {
	@apply gap-3 p-1.5 pr-5;
}

.trailing-tooltip[data-size="compact"][data-media="false"] {
	@apply px-3.5 py-2;
}

.trailing-tooltip[data-size="compact"] .trailing-tooltip-media {
	@apply size-16;
	border-radius: calc(0.75rem - 0.375rem);
}

.trailing-tooltip[data-size="compact"] .trailing-tooltip-label {
	@apply text-xl;
}

.trailing-tooltip[data-mark="true"] {
	@apply gap-3;
}

.trailing-tooltip[data-size="compact"][data-mark="true"] {
	@apply gap-2.5;
}

.trailing-tooltip[data-size="compact"] .trailing-tooltip-mark {
	@apply size-6 p-1;
}

@media (prefers-reduced-motion: no-preference) {
	.trailing-tooltip[data-resize="smooth"] {
		transition:
			clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1),
			padding var(--tooltip-resize),
			gap var(--tooltip-resize);
	}

	.trailing-tooltip[data-resize="smooth"] .trailing-tooltip-media,
	.trailing-tooltip[data-resize="smooth"] .trailing-tooltip-mark {
		transition:
			width var(--tooltip-resize),
			height var(--tooltip-resize),
			padding var(--tooltip-resize),
			border-radius var(--tooltip-resize);
	}

	.trailing-tooltip[data-resize="smooth"] .trailing-tooltip-label {
		transition: font-size var(--tooltip-resize);
	}
}

@media (prefers-reduced-motion: reduce) {
	.trailing-tooltip {
		transition: none;
	}
}
</style>
