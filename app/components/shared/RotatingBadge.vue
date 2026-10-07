<script setup lang="ts">
import { computed, useId, useTemplateRef } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const {
	class: className,
	mark = "/icons/sparkle.svg",
	phrases,
} = defineProps<{
	class?: HTMLAttributes["class"];
	mark?: string;
	phrases: readonly string[];
}>();

const ringPathId = `rotating-badge-ring-${useId()}`;
const badge = useTemplateRef<HTMLDivElement>("badge");
const ringText = computed(() =>
	phrases.map((phrase) => `${phrase} • `).join(""),
);
const markStyle = computed(() => ({
	"--rotating-badge-mark": `url("${mark}")`,
}));

useRotatingBadgeMotion(badge);
</script>

<template>
	<div
		ref="badge"
		:class="cn('rotating-badge', className)"
		aria-hidden="true"
	>
		<svg class="rotating-badge-ring" viewBox="0 0 200 200">
			<defs>
				<path
					:id="ringPathId"
					d="M 100 100 m -72 0 a 72 72 0 1 1 144 0 a 72 72 0 1 1 -144 0"
				/>
			</defs>

			<circle class="rotating-badge-surface" cx="100" cy="100" r="100" />

			<text class="rotating-badge-text">
				<textPath
					:href="`#${ringPathId}`"
					textLength="452"
					lengthAdjust="spacing"
					v-text="ringText"
				/>
			</text>
		</svg>

		<span class="rotating-badge-mark" :style="markStyle" />
	</div>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.rotating-badge {
	@apply relative grid aspect-square shrink-0 place-items-center select-none;
}

.rotating-badge-ring {
	@apply col-start-1 row-start-1 size-full overflow-visible;
}

.rotating-badge-surface {
	@apply fill-primary;
}

.rotating-badge-text {
	@apply fill-primary-foreground font-sans font-bold;
	font-size: 24px;
	white-space: pre;
}

.rotating-badge-mark {
	@apply col-start-1 row-start-1 size-[30%] bg-primary-foreground;
	mask: var(--rotating-badge-mark) center / contain no-repeat;
}
</style>
