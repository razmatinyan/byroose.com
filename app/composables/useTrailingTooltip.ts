import { useMediaQuery, useMounted, useTimeoutFn } from "@vueuse/core";
import { computed, shallowRef } from "vue";

const closeDelay = 200;

export function useTrailingTooltip() {
	const active = shallowRef(false);
	const image = shallowRef("");
	const label = shallowRef<string>();
	const mounted = useMounted();
	const supportsFinePointer = useMediaQuery(
		"(hover: hover) and (pointer: fine)",
	);
	const shouldLoad = computed(
		() => mounted.value && supportsFinePointer.value,
	);
	const { start: scheduleClose, stop: cancelClose } = useTimeoutFn(
		() => {
			active.value = false;
		},
		closeDelay,
		{ immediate: false },
	);

	function show(nextImage: string, nextLabel?: string) {
		cancelClose();
		image.value = nextImage;
		label.value = nextLabel;
		active.value = true;
	}

	function hide() {
		scheduleClose();
	}

	return { active, hide, image, label, shouldLoad, show };
}
