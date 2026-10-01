import { computed, onScopeDispose } from "vue";

export type HeaderSurface = "dark" | "light";

export function useHeaderSurface() {
   const darkSurfaceCount = useState("header-dark-surface-count", () => 0);
   const surface = computed<HeaderSurface>(() =>
      darkSurfaceCount.value > 0 ? "dark" : "light",
   );
   let coversHeader = false;

   function setCoversHeader(covers: boolean) {
      if (covers === coversHeader) return;

      coversHeader = covers;
      darkSurfaceCount.value += covers ? 1 : -1;
   }

   onScopeDispose(() => {
      setCoversHeader(false);
   });

   return { setCoversHeader, surface };
}
