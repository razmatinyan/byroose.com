<script setup lang="ts">
import { Button } from '@/components/ui/button'

type CookieConsent = 'accepted' | 'declined'

const consentMaxAge = 60 * 60 * 24 * 365

const consent = useCookie<CookieConsent | null>('byroose-cookie-consent', {
	default: () => null,
	maxAge: consentMaxAge,
	path: '/',
	sameSite: 'lax',
})

const { enter, leave, prepare } = useCookieBannerMotion()

function answerCookies(answer: CookieConsent) {
	consent.value = answer
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
			v-if="consent === null"
			class="cookie-banner surface-card"
			aria-label="Cookie notice"
		>
			<p class="cookie-banner-copy">
				We use cookies to understand how this site is used so we can keep
				improving your experience.
			</p>
			<div class="cookie-banner-actions">
				<Button
					class="cookie-banner-action"
					size="sm"
					variant="outline"
					@click="answerCookies('declined')"
				>
					Decline all
				</Button>
				<Button
					class="cookie-banner-action"
					size="sm"
					variant="dark"
					@click="answerCookies('accepted')"
				>
					Accept all
				</Button>
			</div>
		</aside>
	</Transition>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.cookie-banner {
	@apply fixed right-4 bottom-4 left-4 z-40 rounded-xs border border-border shadow-xl sm:right-auto sm:max-w-sm;
}

.cookie-banner-copy {
	@apply m-0 px-4 py-3 text-sm leading-snug text-foreground;
}

.cookie-banner-actions {
	@apply flex justify-end gap-2 border-t border-border px-4 py-3;
}

.cookie-banner-action {
	@apply rounded-xs;
}
</style>
