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
