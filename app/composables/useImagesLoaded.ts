import { onMounted, onScopeDispose, readonly, shallowRef, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

type ImageRoot = MaybeRefOrGetter<HTMLElement | null | undefined>;

export function whenImageLoaded(image: HTMLImageElement) {
   if (image.complete) return Promise.resolve(image.naturalWidth > 0);

   return new Promise<boolean>((resolve) => {
      image.addEventListener("load", () => resolve(true), { once: true });
      image.addEventListener("error", () => resolve(false), { once: true });
   });
}

export function useImagesLoaded(root: ImageRoot) {
   const loaded = shallowRef(false);
   let disposed = false;

   onMounted(async () => {
      const element = toValue(root);
      if (!element) return;

      const results = await Promise.all(
         Array.from(element.querySelectorAll("img"), whenImageLoaded),
      );
      if (disposed) return;

      loaded.value = results.every(Boolean);
   });

   onScopeDispose(() => {
      disposed = true;
   });

   return { loaded: readonly(loaded) };
}
