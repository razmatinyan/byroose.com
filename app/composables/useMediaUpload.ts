import { shallowRef } from "vue";
import { isMediaContentType, mediaTypes } from "#shared/schemas/media";
import type { MediaAsset, MediaKind } from "#shared/schemas/media";

type MediaUploadStatus = "idle" | "uploading" | "error";

interface MediaDimensions {
   width: number;
   height: number;
   durationSeconds: number | null;
}

const transferShare = 0.95;

async function readImageDimensions(file: File): Promise<MediaDimensions> {
   const bitmap = await createImageBitmap(file);
   const dimensions = { width: bitmap.width, height: bitmap.height, durationSeconds: null };
   bitmap.close();
   return dimensions;
}

function readVideoDimensions(file: File): Promise<MediaDimensions> {
   return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const url = URL.createObjectURL(file);

      video.preload = "metadata";
      video.onloadedmetadata = () => {
         URL.revokeObjectURL(url);
         resolve({
            width: video.videoWidth,
            height: video.videoHeight,
            durationSeconds: Number.isFinite(video.duration) ? video.duration : null,
         });
      };
      video.onerror = () => {
         URL.revokeObjectURL(url);
         reject(new Error("This video could not be read."));
      };
      video.src = url;
   });
}

function readDimensions(file: File, kind: MediaKind) {
   return kind === "image" ? readImageDimensions(file) : readVideoDimensions(file);
}

function putFile(url: string, file: File, onProgress: (ratio: number) => void) {
   return new Promise<void>((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.open("PUT", url);
      request.setRequestHeader("Content-Type", file.type);
      request.upload.onprogress = (event) => {
         if (event.lengthComputable) onProgress(event.loaded / event.total);
      };
      request.onload = () => {
         if (request.status >= 200 && request.status < 300) resolve();
         else reject(new Error("The upload was rejected. Please try again."));
      };
      request.onerror = () => reject(new Error("The upload failed. Check your connection and try again."));
      request.send(file);
   });
}

function describeUploadError(error: unknown) {
   if (error instanceof Error && !("statusCode" in error)) return error.message;
   return "The upload failed. Please try again.";
}

function formatMegabytes(bytes: number) {
   return `${Math.round(bytes / (1024 * 1024))} MB`;
}

export function useMediaUpload() {
   const status = shallowRef<MediaUploadStatus>("idle");
   const progress = shallowRef(0);
   const errorMessage = shallowRef<string>();

   function fail(message: string) {
      status.value = "error";
      errorMessage.value = message;
      return null;
   }

   async function upload(
      file: File,
      kinds: readonly MediaKind[] = ["image", "video"],
   ): Promise<MediaAsset | null> {
      if (!isMediaContentType(file.type)) {
         return fail("Use a JPG, PNG, WebP, AVIF, or GIF image, or an MP4 or WebM video.");
      }

      const { kind, maxBytes } = mediaTypes[file.type];

      if (!kinds.includes(kind)) {
         return fail(kinds.includes("image") ? "Choose an image file." : "Choose a video file.");
      }

      if (file.size > maxBytes) {
         return fail(`This file is larger than the ${formatMegabytes(maxBytes)} limit.`);
      }

      status.value = "uploading";
      progress.value = 0;
      errorMessage.value = undefined;

      try {
         const dimensions = await readDimensions(file, kind);
         const { key, uploadUrl } = await $fetch("/api/admin/media/uploads", {
            method: "POST",
            body: { contentType: file.type, size: file.size },
         });

         await putFile(uploadUrl, file, (ratio) => {
            progress.value = ratio * transferShare;
         });

         const asset = await $fetch("/api/admin/media", {
            method: "POST",
            body: { key, ...dimensions },
         });

         progress.value = 1;
         status.value = "idle";
         return asset;
      } catch (error) {
         return fail(describeUploadError(error));
      }
   }

   return { errorMessage, progress, status, upload };
}
