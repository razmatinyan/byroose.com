import { useMediaQuery, useMounted, useTimeoutFn } from "@vueuse/core";
import { computed, shallowRef } from "vue";

export type TrailingTooltipSize = "compact" | "default";

const closeDelay = 200;

export function useTrailingTooltip() {
	const active = shallowRef(false);
	const image = shallowRef("");
	const label = shallowRef<string>();
	const icon = shallowRef<string>();
	const size = shallowRef<TrailingTooltipSize>("default");
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

	function show(
		nextImage = "",
		nextLabel?: string,
		nextSize: TrailingTooltipSize = "default",
		nextIcon?: string,
	) {
		cancelClose();
		image.value = nextImage;
		label.value = nextLabel;
		icon.value = nextIcon;
		size.value = nextSize;
		active.value = true;
	}

	function hide() {
		scheduleClose();
	}

	return { active, hide, icon, image, label, shouldLoad, show, size };
}
