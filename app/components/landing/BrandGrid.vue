<script setup lang="ts">
interface Brand {
	name: string
	mark: string
	logoClass: string
}

const brands: Brand[] = [
	{
		name: 'Nova Dairy',
		mark: 'ND',
		logoClass: 'rounded-full bg-primary text-primary-foreground',
	},
	{
		name: 'Kessler Tools',
		mark: 'KT',
		logoClass: 'rounded-md bg-foreground text-background',
	},
	{
		name: 'Halden Clinics',
		mark: 'HC',
		logoClass: 'rounded-tl-3xl rounded-br-3xl bg-brand-green text-brand-green-foreground',
	},
	{
		name: 'Marrow & Co',
		mark: 'MC',
		logoClass: 'rounded-full bg-brand-blue text-brand-blue-foreground',
	},
	{
		name: 'Vestlund',
		mark: 'V',
		logoClass: 'rounded-t-3xl bg-brand-violet text-brand-violet-foreground',
	},
	{
		name: 'Piquant',
		mark: 'P',
		logoClass: 'rounded-3xl bg-brand-pink text-brand-pink-foreground',
	},
]
</script>

<template>
	<section class="brand-grid section-gutter" aria-labelledby="brand-grid-title">
		<h2 id="brand-grid-title" class="section-title brand-grid-title">
			Brands we have worked with
		</h2>

		<ul class="brand-grid-list">
			<li v-for="brand in brands" :key="brand.name" class="brand-grid-item">
				<span class="brand-grid-logo" :class="brand.logoClass" aria-hidden="true">
					{{ brand.mark }}
				</span>
				<span class="brand-grid-name">{{ brand.name }}</span>
			</li>
		</ul>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.brand-grid {
	@apply w-full pb-section;
}

.brand-grid-title {
	@apply mx-auto max-w-[14ch] text-center;
}

.brand-grid-list {
	@apply mt-8 grid list-none grid-cols-2 border-t border-l border-foreground/15 p-0 sm:grid-cols-3 md:mt-10 xl:grid-cols-6;
}

.brand-grid-item {
	@apply flex min-h-40 flex-col items-center justify-center gap-5 border-r border-b border-foreground/15 bg-background p-5 text-center sm:min-h-44;
}

.brand-grid-logo {
	@apply grid size-16 place-items-center text-2xl font-bold tracking-[-0.08em];
}

.brand-grid-name {
	@apply text-base leading-tight font-semibold tracking-[-0.02em] text-brand-subtle sm:text-lg;
}
</style>
