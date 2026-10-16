<script setup lang="ts">
import { onScopeDispose, watch } from "vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { appIcons } from "@/lib/icons";

const open = defineModel<boolean>("open", { required: true });

const title = "Message sent";
const description =
	"Thanks for writing to us. We'll read your idea and reply with clear next steps.";
const closeLabel = "Close";
const stillMotion =
	"motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none";
const contentClass = `gap-0 rounded-[clamp(1.5rem,3vw,2.5rem)] border-0 p-0 shadow-2xl sm:max-w-xl ${stillMotion}`;

const { lock } = useSmoothScroll();
let releaseScroll: (() => void) | null = null;

function unlockScroll() {
	releaseScroll?.();
	releaseScroll = null;
}

watch(open, (isOpen) => {
	if (!isOpen) return unlockScroll();
	releaseScroll ??= lock();
});

onScopeDispose(unlockScroll);
</script>

<template>
	<Dialog v-model:open="open">
		<DialogContent
			:class="contentClass"
			:overlay-class="stillMotion"
			:show-close-button="false"
		>
			<DialogClose as-child>
				<Button
					class="contact-sent-close"
					variant="yellow"
					size="cta-icon"
					:bounce-on-hover="true"
					:aria-label="closeLabel"
				>
					<template #icon>
						<ButtonIcon :icon="appIcons.close" />
					</template>
				</Button>
			</DialogClose>

			<div class="contact-sent-body">
				<span class="contact-sent-mark" aria-hidden="true">
					<Icon :name="appIcons.check" class="contact-sent-mark-icon" />
				</span>
				<DialogTitle class="contact-sent-title">{{ title }}</DialogTitle>
				<DialogDescription class="contact-sent-description">
					{{ description }}
				</DialogDescription>
			</div>
		</DialogContent>
	</Dialog>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.contact-sent-body {
	@apply grid justify-items-center gap-6 px-8 pt-20 pb-12 text-center md:px-12 md:pt-24 md:pb-16;
}

.contact-sent-mark {
	@apply grid size-14 place-items-center rounded-full bg-ribbon text-ribbon-foreground md:size-16;
}

.contact-sent-mark-icon {
	@apply size-7 md:size-8;
}

.contact-sent-title {
	@apply m-0 text-4xl leading-[0.95] font-bold tracking-[-0.045em] md:text-5xl;
}

.contact-sent-description {
	@apply m-0 max-w-[26em] text-lg leading-snug font-medium tracking-[-0.02em] text-pretty text-muted-foreground md:text-xl;
}

.contact-sent-close {
	@apply absolute top-4 right-4 z-10 md:top-6 md:right-6;
}
</style>
