import { inject, provide, readonly, shallowRef } from "vue";
import type { InjectionKey, Ref } from "vue";

const previewKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol("project-editor-preview");

export function provideProjectEditorPreview(previewing: Ref<boolean>) {
   provide(previewKey, readonly(previewing));
}

export function useProjectEditorPreview() {
   return inject(previewKey, shallowRef(false));
}
