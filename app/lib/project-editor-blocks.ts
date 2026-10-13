import type { GridBlockColumns, TextBlockAlign } from "#shared/schemas/project-content";
import type { MediaAsset, MediaKind } from "#shared/schemas/media";
import { appIcons } from "@/lib/icons";

export interface EditorTextBlock {
   id: string;
   type: "text";
   title: string;
   body: string;
   align: TextBlockAlign;
}

export interface EditorMediaBlock {
   id: string;
   type: "media";
   kind: MediaKind;
   asset: MediaAsset | null;
   alt: string;
}

export interface EditorGridItem {
   id: string;
   asset: MediaAsset;
   alt: string;
}

export interface EditorGridBlock {
   id: string;
   type: "grid";
   columns: GridBlockColumns;
   items: EditorGridItem[];
}

export type EditorBlock = EditorTextBlock | EditorMediaBlock | EditorGridBlock;

export type EditorBlockChoice = "text" | "image" | "grid" | "video";

export const editorBlockChoices: readonly {
   id: EditorBlockChoice;
   label: string;
   icon: string;
}[] = [
   { id: "text", label: "Text", icon: appIcons.type },
   { id: "image", label: "Image", icon: appIcons.image },
   { id: "grid", label: "Image grid", icon: appIcons.layoutGrid },
   { id: "video", label: "Video", icon: appIcons.video },
];

export const textBlockAlignOptions: readonly {
   id: TextBlockAlign;
   label: string;
   icon: string;
}[] = [
   { id: "left", label: "Place on the left", icon: appIcons.alignLeft },
   { id: "center", label: "Place in the center", icon: appIcons.alignCenter },
   { id: "right", label: "Place on the right", icon: appIcons.alignRight },
];

export const gridColumnOptions: readonly {
   id: GridBlockColumns;
   label: string;
   icon: string;
}[] = [
   { id: 2, label: "Two columns", icon: appIcons.columnsTwo },
   { id: 3, label: "Three columns", icon: appIcons.columnsThree },
];

export const gridBlockMaxItems = 12;

export function createEditorBlock(choice: EditorBlockChoice): EditorBlock {
   const id = crypto.randomUUID();

   if (choice === "text") return { id, type: "text", title: "", body: "", align: "left" };
   if (choice === "grid") return { id, type: "grid", columns: 2, items: [] };

   return { id, type: "media", kind: choice, asset: null, alt: "" };
}

export function createGridItem(asset: MediaAsset): EditorGridItem {
   return { id: crypto.randomUUID(), asset, alt: "" };
}
