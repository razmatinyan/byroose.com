<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from "vue";
import SplitText from "@/components/shared/SplitText.vue";
import type { SplitTextResult } from "@/lib/split-text";

const copyParagraphs = [
	{
		id: "team",
		text: "Nine people in one room: editors, designers, engineers and an AI pipeline that does the boring half. No account layer, no handoff tax. You talk to the people doing the work.",
	},
	{
		id: "method",
		text: "Every engagement starts with a hypothesis and ends with a number. If a format does not work, we kill it and say so out loud, in the readout, with the maths attached.",
	},
] as const;

type CopyParagraphId = (typeof copyParagraphs)[number]["id"];

const studioRoot = useTemplateRef<HTMLElement>("studioRoot");
const studioPortrait = useTemplateRef("studioPortrait");
const studioCopy = useTemplateRef<HTMLElement>("studioCopy");
const statementSplit = shallowRef<SplitTextResult>();
const copySplits = shallowRef<Partial<Record<CopyParagraphId, SplitTextResult>>>(
	{},
);
const studioStatement =
	"We make work that gets chosen, not just seen. Sharp thinking, fast execution, numbers you can defend.";

const copyWords = computed(() => {
	const results = copyParagraphs.map(({ id }) => copySplits.value[id]);
	if (results.includes(undefined)) return undefined;

	return results.flatMap((parts) => parts?.words ?? []);
});

useStudioMotion(studioRoot, {
	copy: studioCopy,
	copyWords,
	portrait: () => studioPortrait.value?.imgEl,
	statementSplit,
});

function setStatementSplit(parts: SplitTextResult) {
	statementSplit.value = parts;
}

function setCopySplit(id: CopyParagraphId, parts: SplitTextResult) {
	copySplits.value = { ...copySplits.value, [id]: parts };
}
</script>

<template>
	<section id="studio" ref="studioRoot" class="studio section-gutter">
		<SplitText
			class="studio-statement"
			as="p"
			mask="words"
			:text="studioStatement"
			type="words"
			@split="setStatementSplit"
		/>

		<div class="studio-grid">
			<div class="studio-column">
				<NuxtImg
					ref="studioPortrait"
					class="studio-portrait object-cover"
					src="/images/founder.jpg"
					alt="Founder of byroose against a blue sky"
					width="720"
					height="1280"
					sizes="sm:100vw md:448px"
					loading="lazy"
				/>
			</div>

			<div ref="studioCopy" class="studio-column studio-copy">
				<SplitText
					v-for="paragraph in copyParagraphs"
					:key="paragraph.id"
					class="studio-copy-paragraph"
					as="p"
					mask="words"
					:text="paragraph.text"
					type="words"
					@split="setCopySplit(paragraph.id, $event)"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.studio {
	@apply w-full py-section;
}

.studio-statement {
	@apply m-0 max-w-[22ch] text-justify text-statement font-semibold tracking-[-0.035em];
}

.studio-statement :deep(.split-text-word),
.studio-statement :deep(.split-text-word-mask),
.studio-copy-paragraph :deep(.split-text-word),
.studio-copy-paragraph :deep(.split-text-word-mask) {
	display: inline-block;
}

.studio-statement :deep(.split-text-word),
.studio-copy-paragraph :deep(.split-text-word) {
	visibility: hidden;
}

.studio-grid {
	@apply mt-12 flex flex-wrap items-center gap-8 md:mt-16 md:gap-12 xl:mt-20 xl:gap-18;
}

.studio-column {
	@apply min-w-0 flex-1 basis-80;
}

.studio-portrait {
	@apply aspect-4/5 w-full max-w-md overflow-hidden rounded-2xl;
}

.studio-copy {
	@apply space-y-6;
}

.studio-copy-paragraph {
	@apply m-0 max-w-[46ch] text-justify text-xl leading-snug tracking-tight font-bold first:mb-8 text-foreground md:text-2xl xl:text-4xl;
}
</style>
