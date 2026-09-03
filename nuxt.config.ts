// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
 compatibilityDate: '2025-07-15',
 devtools: { enabled: true },

 vite: {
																																																																																plugins: [tailwindcss()],
																																																																																// optimizeDeps: {
																																																																																// 	include: [
																																																																																// 		'@vue/devtools-core',
																																																																																// 		'@vue/devtools-kit',
																																																																																// 		'@vueuse/core',
																																																																																// 		'reka-ui',
																																																																																// 		'zod',
																																																																																// 		'clsx',
																																																																																// 		'tailwind-merge',
																																																																																// 		'gsap',
																																																																																// 		'gsap/ScrollTrigger',
																																																																																// 		'gsap/SplitText',
																																																																																// 		'gsap/all',
																																																																																// 		'@lucide/vue',
																																																																																// 		'class-variance-authority',
																																																																																// 	],
																																																																																// },
																},

 modules: ['@nuxt/fonts', '@nuxt/icon', '@vueuse/nuxt'],
})