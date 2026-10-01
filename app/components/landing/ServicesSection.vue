<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import { appIcons } from "@/lib/icons";
import type { SplitTextResult } from "@/lib/split-text";

interface Service {
	image: string;
	title: string;
}

const servicesTitle = "We can help You with";

const servicesData: Service[] = [
	{
		image: "/images/work/1.png",
		title: "AI content creation",
	},
	{
		image: "/images/work/2.png",
		title: "Web development",
	},
];

const servicesRoot = useTemplateRef<HTMLElement>("servicesRoot");
const activeService = shallowRef(0);
const titleSplit = shallowRef<SplitTextResult>();
const optionSplits = shallowRef<(SplitTextResult | undefined)[]>(
	servicesData.map(() => undefined),
);

useServicesMotion(servicesRoot, {
	active: activeService,
	optionSplits,
	titleSplit,
});

function setTitleSplit(parts: SplitTextResult) {
	titleSplit.value = parts;
}

function setOptionSplit(index: number, parts: SplitTextResult) {
	optionSplits.value = optionSplits.value.map((entry, entryIndex) =>
		entryIndex === index ? parts : entry,
	);
}

function selectService(index: number) {
	activeService.value = index;
}
</script>

<template>
	<section id="services" ref="servicesRoot" class="services section-gutter">
		<h2 class="section-title split-title services-title">
			<span class="sr-only">{{ servicesTitle }}</span>
			<span aria-hidden="true">
				<SplitText
					aria="none"
					mask="chars"
					:text="servicesTitle"
					type="words,chars"
					@split="setTitleSplit"
				/>
				<span class="services-title-arrow">
					<span class="services-title-glyph" data-services-title-arrow>
						<Icon :name="appIcons.arrowDown" />
					</span>
				</span>
			</span>
		</h2>

		<div class="services-layout" data-services-layout>
			<div class="services-options">
				<button
					v-for="(service, index) in servicesData"
					:key="service.title"
					class="services-option"
					type="button"
					:aria-pressed="index === activeService"
					@click="selectService(index)"
					@focus="selectService(index)"
					@pointerenter="selectService(index)"
				>
					<SplitText
						aria="none"
						mask="words"
						:text="service.title"
						@split="setOptionSplit(index, $event)"
					/>
				</button>
			</div>

			<div class="services-visual" data-services-visual>
				<NuxtImg
					v-for="service in servicesData"
					:key="service.image"
					class="services-image"
					data-services-image
					:src="service.image"
					alt=""
					width="1080"
					height="1919"
					sizes="sm:448px"
					loading="lazy"
					draggable="false"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.services {
	@apply w-full pb-section;
}

.services-title {
	@apply text-center text-balance;
}

.services-title-arrow {
	@apply ms-[0.12em] inline-block overflow-clip align-[-0.06em];
}

.services-title-glyph {
	@apply invisible block size-[0.8em];
}

.services-title-glyph :deep(svg),
.services-title-glyph :deep(.iconify) {
	@apply block size-full;
}

.services-layout {
	@apply mt-16 grid grid-cols-1 items-center gap-12 md:mt-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 xl:mt-24 xl:gap-24;
}

.services-options {
	@apply flex flex-col items-start gap-3 md:gap-5;
}

.services-option {
	@apply m-0 cursor-default border-0 bg-transparent p-0 text-left text-service font-bold tracking-[-0.045em] text-balance text-foreground/60 transition-colors duration-300 hover:text-foreground aria-pressed:text-foreground;
}

.services-option :deep(.split-text-word),
.services-option :deep(.split-text-word-mask) {
	display: inline-block;
}

.services-option :deep(.split-text-word) {
	visibility: hidden;
}

.services-visual {
	@apply relative aspect-9/16 w-full max-w-xs justify-self-center overflow-hidden rounded-2xl bg-muted sm:max-w-sm lg:w-[clamp(16rem,26vw,28rem)] lg:max-w-none lg:justify-self-end;
}

.services-image {
	@apply pointer-events-none absolute inset-0 size-full object-cover select-none;
}

.services-image + .services-image {
	clip-path: inset(100% 0% 0% 0%);
}
</style>
