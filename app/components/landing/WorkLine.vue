<template>
	<svg class="work-line" data-work-line aria-hidden="true" focusable="false">
		<path class="work-line-path" data-work-line-path />
	</svg>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.work-line {
	@apply pointer-events-none absolute top-0 -z-10 h-full overflow-visible opacity-3 select-none;
	left: calc(var(--spacing-page) * -1);
	width: calc(100% + var(--spacing-page) * 2);
}

.work-line-path {
	fill: none;
	stroke: var(--color-foreground);
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke-width: clamp(4.5rem, 13vw, 15rem);
	visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
	.work-line-path {
		visibility: visible;
	}
}

@media (max-width: 63.999rem) {
	.work-line {
		display: none;
	}
}
</style>
