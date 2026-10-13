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
						'byroose is a creative agency for AI content creation and web development. Visuals, video and reels, plus websites designed to convert.',
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
				name: 'Switzer',
				provider: 'fontshare',
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
				'lucide:align-center',
				'lucide:align-left',
				'lucide:align-right',
				'lucide:archive',
				'lucide:arrow-down',
				'lucide:arrow-left',
				'lucide:arrow-right',
				'lucide:arrow-up',
				'lucide:arrow-up-down',
				'lucide:arrow-up-right',
				'lucide:check',
				'lucide:chevron-down',
				'lucide:chevron-right',
				'lucide:circle',
				'lucide:columns-2',
				'lucide:columns-3',
				'lucide:eye',
				'lucide:eye-off',
				'lucide:github',
				'lucide:grip-vertical',
				'lucide:image',
				'lucide:instagram',
				'lucide:layout-grid',
				'lucide:linkedin',
				'lucide:minus',
				'lucide:plus',
				'lucide:save',
				'lucide:settings-2',
				'lucide:trash-2',
				'lucide:trending-up',
				'lucide:type',
				'lucide:undo-2',
				'lucide:upload',
				'lucide:video',
				'lucide:x',
			],
		},
	},

	runtimeConfig: {
		databaseUrl: '',
		r2: {
			accountId: '',
			accessKeyId: '',
			secretAccessKey: '',
			bucket: '',
		},
		public: {
			mediaBaseUrl: '',
		},
		session: {
			maxAge: 60 * 60 * 24 * 7,
		},
	},

	routeRules: {
		'/g': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
		'/work/new': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
		'/work/*/edit': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
		'/auth/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
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
				'three',
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
		'nuxt-auth-utils',
	],

	image: {
		provider: 'vercel',
		vercel: {
			formats: ['image/webp'],
			minimumCacheTTL: 86400,
		},
		none: {},
		screens: {
			'sm': 640,
			'md': 768,
			'lg': 1024,
			'xl': 1280,
			'2xl': 1536,
			'portrait': 448,
			'portrait-2x': 896,
		},
		// format: ['webp'],
		// ipx: {
		// 	modifiers: {
		// 		format: 'webp',
		// 	},
		// },
	},

	shadcn: {
		prefix: 'Ui',
		componentDir: '@/components/ui',
	},
})
