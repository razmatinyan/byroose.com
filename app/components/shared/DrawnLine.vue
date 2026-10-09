<template>
	<svg class="drawn-line" data-drawn-line aria-hidden="true" focusable="false">
		<path class="drawn-line-path" data-drawn-line-path />
	</svg>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.drawn-line {
	@apply pointer-events-none absolute -z-10 select-none;
}

.drawn-line-path {
	fill: none;
	stroke: currentColor;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke-width: clamp(4.5rem, 13vw, 15rem);
	visibility: hidden;
}

@media (prefers-reduced-motion: reduce) {
	.drawn-line-path {
		visibility: visible;
	}
}

@media (max-width: 63.999rem) {
	.drawn-line {
		display: none;
	}
}
</style>
