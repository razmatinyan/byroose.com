<script setup lang="ts">
import MediaPlaceholder from "@/components/shared/MediaPlaceholder.vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { appIcons } from "@/lib/icons";
import type { AboutMemberPortrait, AboutMemberSocial } from "./AboutTeamMember.vue";

const { bio, name, portrait, role, socials } = defineProps<{
	bio: readonly string[];
	name: string;
	portrait?: AboutMemberPortrait;
	role: string;
	socials: readonly AboutMemberSocial[];
}>();

const closeLabel = "Close";
const stillMotion =
	"motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none";
const contentClass = `max-h-[calc(100svh-2rem)] gap-0 overflow-hidden rounded-[clamp(1.5rem,3vw,3rem)] border-0 bg-brand-cream p-0 text-brand-cream-foreground shadow-2xl sm:max-w-[min(72rem,calc(100%-2rem))] ${stillMotion}`;

function focusDialog(event: Event) {
	event.preventDefault();
	if (event.target instanceof HTMLElement) {
		event.target.focus({ preventScroll: true });
	}
}
</script>

<template>
	<DialogContent
		:class="contentClass"
		:overlay-class="stillMotion"
		:show-close-button="false"
		@open-auto-focus="focusDialog"
	>
		<DialogClose as-child>
			<Button
				class="about-member-dialog-close"
				variant="yellow"
				size="cta-icon"
				:aria-label="closeLabel"
			>
				<template #icon>
					<ButtonIcon :icon="appIcons.close" />
				</template>
			</Button>
		</DialogClose>

		<div class="about-member-dialog-body" data-lenis-prevent>
			<div class="about-member-dialog-portrait">
				<NuxtImg
					v-if="portrait"
					class="about-member-dialog-image"
					:src="portrait.src"
					:alt="portrait.alt"
					:width="portrait.width"
					:height="portrait.height"
					sizes="sm:640px md:768px"
					densities="x1"
					loading="eager"
					draggable="false"
				/>
				<MediaPlaceholder v-else class="about-member-dialog-image" />
			</div>

			<div class="about-member-dialog-info">
				<DialogTitle class="about-member-dialog-name">
					<span
						v-for="word in name.split(' ')"
						:key="word"
						class="about-member-dialog-name-word"
					>
						{{ word }}
					</span>
				</DialogTitle>

				<div class="about-member-dialog-meta">
					<DialogDescription class="about-member-dialog-role">
						{{ role }}
					</DialogDescription>

					<ul class="about-member-dialog-socials">
						<li v-for="social in socials" :key="social.href">
							<a
								class="about-member-dialog-social"
								:href="social.href"
								target="_blank"
								rel="noopener noreferrer"
								:aria-label="`${name} on ${social.label}`"
							>
								<Icon
									class="about-member-dialog-social-icon"
									:name="social.icon"
									aria-hidden="true"
								/>
							</a>
						</li>
					</ul>
				</div>

				<div class="about-member-dialog-bio">
					<p v-for="paragraph in bio" :key="paragraph">{{ paragraph }}</p>
				</div>
			</div>
		</div>
	</DialogContent>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-member-dialog-close {
	@apply absolute top-4 right-4 z-10 md:top-6 md:right-6;
}

.about-member-dialog-body {
	@apply grid max-h-[inherit] auto-rows-max gap-10 overflow-y-auto overscroll-contain px-6 pt-20 pb-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16 md:px-14 md:py-16 lg:gap-24 lg:px-20 lg:py-20;
}

.about-member-dialog-portrait {
	@apply aspect-5/6 w-full self-start overflow-hidden rounded-2xl bg-muted;
}

.about-member-dialog-image {
	@apply size-full object-cover select-none;
}

.about-member-dialog-info {
	@apply flex min-w-0 flex-col md:pr-10;
}

.about-member-dialog-name {
	@apply m-0 text-5xl leading-[0.9] font-bold tracking-[-0.045em] md:text-6xl lg:text-7xl;
}

.about-member-dialog-name-word {
	@apply block;
}

.about-member-dialog-meta {
	@apply mt-8 flex items-center justify-between gap-4 md:mt-10;
}

.about-member-dialog-role {
	@apply m-0 text-lg leading-tight font-semibold tracking-[-0.03em] text-brand-cream-foreground md:text-xl;
}

.about-member-dialog-socials {
	@apply m-0 flex shrink-0 list-none gap-2 p-0;
}

.about-member-dialog-social {
	@apply grid size-10 place-items-center rounded-full bg-background text-foreground outline-none transition-colors hover:bg-foreground hover:text-background focus-visible:ring-3 focus-visible:ring-ring/50;
}

.about-member-dialog-social-icon {
	@apply size-4;
}

.about-member-dialog-bio {
	@apply mt-10 flex flex-col gap-5 text-lg leading-snug font-medium tracking-[-0.02em] md:mt-12 md:text-xl;
}

.about-member-dialog-bio p {
	@apply m-0;
}
</style>
