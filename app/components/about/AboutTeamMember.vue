<script setup lang="ts">
import { onScopeDispose, shallowRef, watch } from "vue";
import MediaPlaceholder from "@/components/shared/MediaPlaceholder.vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AboutMediaFrame from "./AboutMediaFrame.vue";
import AboutMemberDialog from "./AboutMemberDialog.vue";

export interface AboutMemberPortrait {
	alt: string;
	height: number;
	src: string;
	width: number;
}

export interface AboutMemberSocial {
	href: string;
	icon: string;
	label: string;
}

const { bio, name, portrait, role, socials } = defineProps<{
	bio: readonly string[];
	name: string;
	portrait?: AboutMemberPortrait;
	role: string;
	socials: readonly AboutMemberSocial[];
}>();

const emit = defineEmits<{
	activate: [];
	deactivate: [];
}>();

const open = shallowRef(false);
const { lock } = useSmoothScroll();
let releaseScroll: (() => void) | null = null;

function unlockScroll() {
	releaseScroll?.();
	releaseScroll = null;
}

function openDetails() {
	open.value = true;
}

watch(open, (isOpen) => {
	if (!isOpen) return unlockScroll();

	emit("deactivate");
	releaseScroll ??= lock();
});

onScopeDispose(unlockScroll);
</script>

<template>
	<article
		class="about-member"
		@click="openDetails"
		@pointerenter="emit('activate')"
		@pointerleave="emit('deactivate')"
	>
		<Dialog v-model:open="open">
			<AboutMediaFrame class="about-member-portrait">
				<NuxtImg
					v-if="portrait"
					:src="portrait.src"
					:alt="portrait.alt"
					:width="portrait.width"
					:height="portrait.height"
					sizes="sm:1280px md:1024px lg:1280px xl:1536px"
					densities="x1"
					loading="lazy"
					draggable="false"
				/>
				<MediaPlaceholder v-else />
			</AboutMediaFrame>

			<div class="about-member-meta" data-about-rise-group>
				<div class="about-member-mask about-member-name" data-about-rise-mask>
					<h3 class="about-member-text" data-about-rise>{{ name }}</h3>
				</div>
				<div class="about-member-mask about-member-role" data-about-rise-mask>
					<p class="about-member-text" data-about-rise>{{ role }}</p>
				</div>
				<div class="about-member-action" data-about-rise-mask>
					<span class="about-member-action-rise" data-about-rise>
						<DialogTrigger as-child>
							<Button
								variant="ribbon"
								size="cta-icon"
								:aria-label="`More about ${name}`"
							>
								<template #icon>
									<ButtonIcon />
								</template>
							</Button>
						</DialogTrigger>
					</span>
				</div>
			</div>

			<AboutMemberDialog
				:bio="bio"
				:name="name"
				:portrait="portrait"
				:role="role"
				:socials="socials"
			/>
		</Dialog>
	</article>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.about-member {
	@apply flex w-full cursor-pointer flex-col gap-5 md:gap-6;
}

.about-member-portrait {
	@apply aspect-5/6 w-full;
}

.about-member-meta {
	@apply grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1;
}

.about-member-mask {
	@apply col-start-1;
	margin-block: -0.12em -0.2em;
	padding-block: 0.12em 0.2em;
}

.about-member-text {
	@apply m-0;
}

.about-member-name {
	@apply text-3xl leading-none font-bold tracking-[-0.045em] md:text-4xl xl:text-5xl;
}

.about-member-role {
	@apply text-lg leading-tight font-semibold tracking-[-0.03em] md:text-xl;
}

.about-member-action {
	@apply col-start-2 row-span-2 row-start-1;
}

.about-member-action-rise {
	@apply block;
}
</style>
