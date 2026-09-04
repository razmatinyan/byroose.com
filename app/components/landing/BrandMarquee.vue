<script setup lang="ts">
const brands = [
	'Nova Dairy',
	'Kessler Tools',
	'Halden Clinics',
	'Marrow & Co',
	'Vestlund',
	'Piquant',
]
</script>

<template>
	<section class="brand-marquee">
		<div class="section-gutter">
			<h2 class="section-title brand-marquee-title">Brands we have worked with</h2>
		</div>
		<div class="brand-marquee-viewport">
			<div class="brand-marquee-track">
				<div v-for="copy in 2" :key="copy" class="brand-marquee-group" :aria-hidden="copy === 2">
					<span v-for="brand in brands" :key="brand">{{ brand }}</span>
				</div>
			</div>
		</div>
	</section>
</template>
