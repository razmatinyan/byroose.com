<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";
import { shallowRef, useTemplateRef, watch } from "vue";
import type { ComponentPublicInstance } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import { appIcons } from "@/lib/icons";
import type { SplitTextResult } from "@/lib/split-text";

interface MoreWorksImage {
	height: number;
	src: string;
}

const emit = defineEmits<{
	activate: [image: string, label: string];
	deactivate: [];
}>();

const worksRoute = "/works";
const titleStart = "View";
const titleEnd = "work";
const actionLabel = "Explore Projects";
const imageInterval = 750;

const moreWorksImages: readonly MoreWorksImage[] = [
	{ height: 1919, src: "/images/work/1.png" },
	{ height: 1919, src: "/images/work/2.png" },
	{ height: 1620, src: "/images/work/3.png" },
	{ height: 1919, src: "/images/work/4.png" },
	{ height: 1919, src: "/images/work/5.png" },
	{ height: 1919, src: "/images/work/6.png" },
	{ height: 1919, src: "/images/work/7.png" },
];

const track = useTemplateRef<HTMLElement>("track");
const panel = useTemplateRef<HTMLElement>("panel");
const media = useTemplateRef<HTMLElement>("media");
const startWord = useTemplateRef<HTMLElement>("startWord");
const endWord = useTemplateRef<HTMLElement>("endWord");
const action = useTemplateRef<HTMLElement>("action");
const actionLink = useTemplateRef<ComponentPublicInstance>("actionLink");
const startSplit = shallowRef<SplitTextResult>();
const endSplit = shallowRef<SplitTextResult>();
const activeImage = shallowRef(0);
const previewing = shallowRef(false);

useArrowSwapHover(actionLink);

const { cycling } = useMoreWorksMotion(track, {
	action,
	endSplit,
	endWord,
	media,
	panel,
	startSplit,
	startWord,
});

const { pause, resume } = useIntervalFn(showNextImage, imageInterval, {
	immediate: false,
});

watch(cycling, (active) => {
	if (active) resume();
	else pause();
});

watch(activeImage, () => {
	if (previewing.value) showPreview();
});

function showNextImage() {
	activeImage.value = (activeImage.value + 1) % moreWorksImages.length;
}

function showPreview() {
	const image = moreWorksImages[activeImage.value];
	if (!image) return;

	previewing.value = true;
	emit("activate", image.src, actionLabel);
}

function hidePreview() {
	previewing.value = false;
	emit("deactivate");
}

function setStartSplit(parts: SplitTextResult) {
	startSplit.value = parts;
}

function setEndSplit(parts: SplitTextResult) {
	endSplit.value = parts;
}

function openWorks(event: MouseEvent) {
	if (event.target instanceof Element && event.target.closest("a")) return;

	return navigateTo(worksRoute);
}
</script>

<template>
	<div ref="track" class="more-works-track" data-work-more>
		<div
			ref="panel"
			class="more-works"
			data-work-more-panel
			data-header-surface="dark"
			@click="openWorks"
			@pointerenter="showPreview"
			@pointerleave="hidePreview"
		>
			<div class="more-works-stage">
				<div ref="media" class="more-works-media" aria-hidden="true">
					<NuxtImg
						v-for="(image, index) in moreWorksImages"
						:key="image.src"
						class="more-works-image"
						:data-active="index === activeImage"
						:src="image.src"
						alt=""
						width="1080"
						:height="image.height"
						sizes="sm:448px"
						loading="lazy"
						draggable="false"
					/>
				</div>

				<h3 class="more-works-title">
					<span class="sr-only">{{ titleStart }} {{ titleEnd }}</span>
					<span
						ref="startWord"
						class="more-works-word more-works-word-start"
						aria-hidden="true"
					>
						<SplitText
							aria="none"
							:text="titleStart"
							type="chars"
							@split="setStartSplit"
						/>
					</span>
					<span
						ref="endWord"
						class="more-works-word more-works-word-end"
						aria-hidden="true"
					>
						<SplitText
							aria="none"
							:text="titleEnd"
							type="chars"
							@split="setEndSplit"
						/>
					</span>
				</h3>
			</div>

			<div class="more-works-action">
				<div ref="action" class="more-works-action-reveal">
					<NuxtLink
						ref="actionLink"
						class="more-works-action-link"
						:to="worksRoute"
						:aria-label="actionLabel"
						@pointerenter="hidePreview"
						@pointerleave="showPreview"
					>
						<span
							class="more-works-action-icon"
							aria-hidden="true"
						>
							<span class="more-works-action-glyph" data-arrow-swap-glyph>
								<Icon :name="appIcons.arrowUpRight" />
							</span>
							<span
								class="more-works-action-glyph"
								data-arrow-swap-glyph-copy
							>
								<Icon :name="appIcons.arrowUpRight" />
							</span>
						</span>
					</NuxtLink>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.more-works-track {
	@apply pointer-events-none relative z-10;
	margin-top: calc(var(--more-works-runway, 0) * 50svh);
}

.more-works {
	@apply pointer-events-auto flex min-h-dvh cursor-pointer flex-col overflow-clip bg-foreground px-page text-background;
	--more-works-image: clamp(5rem, 17vw, 18rem);
	--more-works-action: clamp(9rem, 15vw, 15rem);
}

.more-works-stage {
	@apply grid flex-1 place-items-center;
}

.more-works-media,
.more-works-title {
	@apply col-start-1 row-start-1;
}

.more-works-media {
	@apply relative aspect-3/4 overflow-hidden rounded-xl bg-brand-subtle;
	width: var(--more-works-image);
}

.more-works-image {
	@apply absolute inset-0 size-full select-none object-cover opacity-0;
}

.more-works-image[data-active="true"] {
	@apply opacity-100;
}

.more-works-title {
	@apply relative z-10 m-0 grid w-full items-center leading-none font-bold tracking-[-0.045em] whitespace-nowrap uppercase mix-blend-exclusion;
	grid-template-columns: 1fr calc(var(--more-works-image) * 0.4) 1fr;
	font-size: clamp(2.75rem, 11vw, 13rem);
}

.more-works-word {
	@apply inline-block;
}

.more-works-word-start {
	@apply col-start-1 justify-self-end;
}

.more-works-word-end {
	@apply col-start-3 justify-self-start;
}

.more-works-action {
	@apply flex justify-center;
	margin-bottom: calc(var(--more-works-action) / -2);
}

.more-works-action-reveal {
	@apply size-(--more-works-action);
}

.more-works-action-link {
	@apply relative block size-full overflow-hidden rounded-full bg-background text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50;
}

.more-works-action-icon {
	@apply absolute top-1/4 left-1/2 grid size-[28%] -translate-1/2;
}

.more-works-action-glyph {
	@apply col-start-1 row-start-1 grid place-items-center;
}

.more-works-action-glyph :deep(svg) {
	@apply size-full;
}

.more-works-action-glyph[data-arrow-swap-glyph-copy] {
	transform: translate(-200%, 150%);
}
</style>
