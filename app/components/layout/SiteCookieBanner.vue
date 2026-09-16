<script setup lang="ts">
import { Button } from '@/components/ui/button'

const consentMaxAge = 60 * 60 * 24 * 365

const consent = useCookie<'accepted' | null>('byroose-cookie-consent', {
	default: () => null,
	maxAge: consentMaxAge,
	path: '/',
	sameSite: 'lax',
})

const { enter, leave, prepare } = useCookieBannerMotion()

function acceptCookies() {
	consent.value = 'accepted'
}
</script>

<template>
	<Transition
		appear
		:css="false"
		@before-enter="prepare"
		@enter="enter"
		@leave="leave"
	>
		<aside
			v-if="consent !== 'accepted'"
			class="cookie-banner surface-card"
			aria-labelledby="cookie-banner-title"
		>
			<h2 id="cookie-banner-title" class="cookie-banner-title">
				We Use Cookies
			</h2>
			<div class="cookie-banner-row">
				<p class="cookie-banner-copy">
					They help us understand how this site is used so we can keep
					improving it.
				</p>
				<Button
					class="cookie-banner-action"
					size="cta-sm"
					variant="dark"
					@click="acceptCookies"
				>
					Accept
				</Button>
			</div>
		</aside>
	</Transition>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.cookie-banner {
	@apply fixed right-4 bottom-4 left-4 z-40 rounded-xl border border-border p-4 shadow-xl sm:left-auto sm:max-w-md;
}

.cookie-banner-title {
	@apply m-0 text-base font-semibold;
}

.cookie-banner-row {
	@apply mt-2 flex items-center gap-4;
}

.cookie-banner-copy {
	@apply m-0 text-sm leading-relaxed text-muted-foreground;
}

.cookie-banner-action {
	@apply shrink-0 gap-0 pr-4;
}
</style>
