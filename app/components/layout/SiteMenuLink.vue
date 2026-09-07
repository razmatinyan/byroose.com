<script setup lang="ts">
import { useTemplateRef } from 'vue'

const { href, label } = defineProps<{
	href: string
	label: string
}>()

const emit = defineEmits<{
	navigate: []
}>()
const link = useTemplateRef<HTMLAnchorElement>('link')

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
		<span
			class="site-menu-link-texts"
			data-menu-texts
			aria-hidden="true"
		>
			<span
				class="site-menu-link-label"
				data-menu-label
			>
				{{ label }}
			</span>
			<span
				class="site-menu-link-label site-menu-link-label-copy"
				data-menu-label-copy
			>
				{{ label }}
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
}

.site-menu-link-texts {
	@apply grid overflow-hidden py-0.5 whitespace-nowrap;
}

.site-menu-link-label {
	@apply block;
	grid-area: 1 / 1;
	font-kerning: none;
	text-rendering: optimizeSpeed;
}

.site-menu-link-label-copy {
	visibility: hidden;
}

.site-menu-link-label :deep(.site-menu-character) {
	display: inline-block;
}

@media (min-width: 64rem) {
	.site-menu-link {
		font-size: 2.5rem;
	}
}
</style>
