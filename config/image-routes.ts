import { readdirSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";
import { projects } from "../app/data/projects";
import { getProjectGallery } from "../app/lib/projects";

export const imageQuality = 80;
export const imageFormat = "webp";

const rootDirectory = join(import.meta.dirname, "..");
const publicDirectory = join(rootDirectory, "public");
const imagesDirectory = join(publicDirectory, "images");
const rasterExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const tooltipWidths = [448, 896];
const viewerWidths = [1024, 1536, 2560];

function imageRoute(src: string, width: number, height: number) {
   return `/_ipx/f_${imageFormat}&q_${imageQuality}&s_${width}x${height}${src}`;
}

function listRasterImages(directory: string): string[] {
   return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return listRasterImages(path);
      if (!rasterExtensions.has(extname(entry.name).toLowerCase())) return [];
      return [`/${relative(publicDirectory, path).split(sep).join("/")}`];
   });
}

function listTooltipRoutes() {
   return listRasterImages(imagesDirectory).flatMap((src) =>
      tooltipWidths.map((width) => imageRoute(src, width, width)),
   );
}

function listViewerRoutes() {
   return projects.flatMap((project) =>
      getProjectGallery(project)
         .filter((media) => media.kind === "image")
         .flatMap(({ src, width, height }) =>
            viewerWidths.map((viewerWidth) =>
               imageRoute(src, viewerWidth, Math.round((viewerWidth * height) / width)),
            ),
         ),
   );
}

export function listInteractiveImageRoutes() {
   return [...new Set([...listTooltipRoutes(), ...listViewerRoutes()])];
}
