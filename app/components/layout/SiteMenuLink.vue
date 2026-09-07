<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

const { href, label } = defineProps<{
	href: string
	label: string
}>()

const emit = defineEmits<{
	navigate: []
}>()
const link = useTemplateRef<HTMLAnchorElement>('link')
const characters = computed(() =>
	Array.from(label, (character, index) => ({
		id: `${index}-${character}`,
		value: character === ' ' ? '\u00a0' : character,
	})),
)

useMenuLinkMotion(link)

function handleNavigate() {
	emit('navigate')
}
</script>

<template>
	<a
		ref="link"
		class="site-menu-link"
		:href="href"
		:aria-label="label"
		@click="handleNavigate"
	>
		<span class="site-menu-link-label" aria-hidden="true">
			<span
				v-for="character in characters"
				:key="character.id"
				class="site-menu-character"
				data-menu-character
			>
				{{ character.value }}
			</span>
		</span>
	</a>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.site-menu-link {
	@apply block w-fit rounded-sm font-medium text-background transition-colors outline-none hover:text-background/45 focus-visible:text-background/45 focus-visible:ring-2 focus-visible:ring-background/70 motion-reduce:transition-none;
	font-size: clamp(2rem, 7vw, 2.75rem);
	line-height: 0.98;
	letter-spacing: -0.055em;
	perspective: 36rem;
}

.site-menu-link-label {
	@apply block py-0.5;
}

.site-menu-character {
	display: inline-block;
	transform-style: preserve-3d;
}

@media (min-width: 64rem) {
	.site-menu-link {
		font-size: 2.5rem;
	}
}
</style>
