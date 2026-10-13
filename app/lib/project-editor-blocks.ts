import type {
   GridBlockColumns,
   ResultsBlockTone,
   TextBlockAlign,
} from "#shared/schemas/project-content";
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

export interface EditorResultItem {
   id: string;
   value: string;
   label: string;
}

export interface EditorResultsBlock {
   id: string;
   type: "results";
   tone: ResultsBlockTone;
   items: EditorResultItem[];
}

export type EditorBlock = EditorTextBlock | EditorMediaBlock | EditorGridBlock | EditorResultsBlock;

export type EditorBlockChoice = "text" | "image" | "grid" | "video" | "results";

export const editorBlockChoices: readonly {
   id: EditorBlockChoice;
   label: string;
   icon: string;
}[] = [
   { id: "text", label: "Text", icon: appIcons.type },
   { id: "image", label: "Image", icon: appIcons.image },
   { id: "grid", label: "Image grid", icon: appIcons.layoutGrid },
   { id: "video", label: "Video", icon: appIcons.video },
   { id: "results", label: "Results", icon: appIcons.trendingUp },
];

export const resultsToneOptions: readonly { id: ResultsBlockTone; label: string }[] = [
   { id: "primary", label: "Orange" },
   { id: "blue", label: "Blue" },
   { id: "green", label: "Green" },
   { id: "pink", label: "Pink" },
   { id: "yellow", label: "Yellow" },
   { id: "dark", label: "Dark" },
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
   if (choice === "results") return { id, type: "results", tone: "primary", items: [createResultItem()] };

   return { id, type: "media", kind: choice, asset: null, alt: "" };
}

export function createResultItem(): EditorResultItem {
   return { id: crypto.randomUUID(), value: "", label: "" };
}

export function isIncompleteBlock(block: EditorBlock) {
   if (block.type === "text") return !block.title.trim() && !block.body.trim();
   if (block.type === "media") return !block.asset;
   if (block.type === "grid") return block.items.length < 2;
   return block.items.some((item) => !item.value.trim() || !item.label.trim());
}

function shorten(text: string, length = 60) {
   const clean = text.trim().replace(/\s+/g, " ");
   return clean.length > length ? `${clean.slice(0, length).trimEnd()}...` : clean;
}

export function describeBlock(block: EditorBlock): { title: string; detail: string; icon: string } {
   if (block.type === "text") {
      return {
         title: "Text",
         detail: shorten(block.title) || shorten(block.body) || "Empty",
         icon: appIcons.type,
      };
   }

   if (block.type === "media") {
      const isImage = block.kind === "image";
      return {
         title: isImage ? "Image" : "Video",
         detail: block.asset ? shorten(block.alt) || "Uploaded" : "Not uploaded yet",
         icon: isImage ? appIcons.image : appIcons.video,
      };
   }

   if (block.type === "grid") {
      const count = block.items.length;
      return {
         title: "Image grid",
         detail: `${count} ${count === 1 ? "image" : "images"}, ${block.columns} columns`,
         icon: appIcons.layoutGrid,
      };
   }

   const count = block.items.length;
   return {
      title: "Results",
      detail: `${count} ${count === 1 ? "result" : "results"}`,
      icon: appIcons.trendingUp,
   };
}

export function createGridItem(asset: MediaAsset): EditorGridItem {
   return { id: crypto.randomUUID(), asset, alt: "" };
}
