// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: false },

	app: {
		head: {
			title: 'byroose — Creative agency',
			htmlAttrs: { lang: 'en' },
			meta: [
				{
					name: 'description',
					content:
						'byroose is a creative agency for strategy, marketing, web and AI-assisted content.',
				},
			],
		},
	},

	css: ['~/assets/css/tailwind.css'],
	fonts: {
		families: [
			{
				name: 'Inter',
				provider: 'google',
				weights: [400, 500, 600, 700, 800],
				styles: ['normal'],
				subsets: ['latin'],
			},
		],
	},

	// Avoid Nitro's Windows/NTFS external tracing bottleneck and keep deployment self-contained.
	nitro: {
		noExternals: true,
	},

	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			include: [
				'@vue/devtools-core',
				'@vue/devtools-kit',
				'@vueuse/core',
				'zod',
				'clsx',
				'tailwind-merge',
				'gsap',
				'gsap/ScrollTrigger',
				'gsap/SplitText',
				'gsap/all',
				'class-variance-authority',
			],
		},
	},

	modules: ['@nuxt/fonts', '@nuxt/icon', '@vueuse/nuxt', 'shadcn-nuxt'],

	shadcn: {
		prefix: 'Ui',
		componentDir: '@/components/ui',
	},
})
