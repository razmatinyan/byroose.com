// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: false },

	app: {
		head: {
			title: 'byroose | Creative agency',
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

	css: [
		'~/assets/css/tailwind.css',
		'lenis/dist/lenis.css',
		'~/assets/css/lenis.css',
	],
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
	icon: {
		mode: 'svg',
		provider: 'none',
		fallbackToApi: false,
		serverBundle: false,
		clientBundle: {
			scan: true,
			icons: [
				'lucide:arrow-down',
				'lucide:arrow-left',
				'lucide:arrow-right',
				'lucide:menu',
				'lucide:plus',
				'lucide:x',
			],
		},
	},

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
				'lenis',
				'class-variance-authority',
			],
		},
	},

	modules: [
		'@nuxt/fonts',
		'@nuxt/icon',
		'@nuxt/image',
		'@vueuse/nuxt',
		'shadcn-nuxt',
	],

	image: {
		provider: 'ipx',
		format: ['webp'],
		ipx: {
			modifiers: {
				format: 'webp',
			},
		},
	},

	shadcn: {
		prefix: 'Ui',
		componentDir: '@/components/ui',
	},
})
