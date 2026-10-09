import type { MaybeRefOrGetter } from "vue";
import { workLine } from "@/lib/work-line-path";

export function useWorkLineMotion(
	scope: MaybeRefOrGetter<HTMLElement | null | undefined>,
) {
	useDrawnLineMotion(scope, workLine);
}
