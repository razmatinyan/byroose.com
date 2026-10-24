import { onMounted, onScopeDispose, readonly, shallowRef, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useEventListener } from "@vueuse/core";

type SectionScope = MaybeRefOrGetter<HTMLElement | null | undefined>;

const activationLine = 0.3;

export function useActiveSection(
   scope: SectionScope,
   sectionIds: MaybeRefOrGetter<readonly string[]>,
) {
   const activeId = shallowRef(toValue(sectionIds)[0] ?? "");
   let frame = 0;

   function findActiveId(root: HTMLElement, ids: readonly string[]) {
      const line = window.innerHeight * activationLine;
      let current = ids[0] ?? "";

      for (const id of ids) {
         const heading = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
         if (!heading) continue;
         if (heading.getBoundingClientRect().top > line) break;

         current = id;
      }

      return current;
   }

   function update() {
      frame = 0;
      const root = toValue(scope);
      if (!root) return;

      activeId.value = findActiveId(root, toValue(sectionIds));
   }

   function scheduleUpdate() {
      if (frame) return;
      frame = requestAnimationFrame(update);
   }

   useEventListener("scroll", scheduleUpdate, { passive: true });
   useEventListener("resize", scheduleUpdate, { passive: true });
   onMounted(update);

   onScopeDispose(() => {
      if (frame) cancelAnimationFrame(frame);
   });

   return { activeId: readonly(activeId) };
}
