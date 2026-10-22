<script setup lang="ts">
import { useFullscreen, useMediaControls, useTimeoutFn } from "@vueuse/core";
import { computed, shallowRef, useTemplateRef } from "vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { appIcons } from "@/lib/icons";
import type { ProjectVideo } from "@/lib/projects";

const { video } = defineProps<{
   video: ProjectVideo;
}>();

const idleDelay = 2500;
const seekStep = 5;
const volumeStep = 0.1;
const restoredVolume = 0.5;

const root = useTemplateRef<HTMLElement>("root");
const media = useTemplateRef<HTMLVideoElement>("media");
const { currentTime, duration, muted, playing, volume, waiting } = useMediaControls(media);
const {
   isFullscreen,
   isSupported: canFullscreen,
   toggle: toggleFullscreen,
} = useFullscreen(root);
const pointerActive = shallowRef(true);
const { start: scheduleIdle } = useTimeoutFn(
   () => {
      pointerActive.value = false;
   },
   idleDelay,
   { immediate: false },
);

const controlsVisible = computed(() => !playing.value || pointerActive.value);
const progress = computed(() => [currentTime.value]);
const timeLabel = computed(() => `${formatTime(currentTime.value)} / ${formatTime(duration.value)}`);
const playLabel = computed(() => (playing.value ? "Pause" : "Play"));
const audible = computed(() => !muted.value && volume.value > 0);
const muteLabel = computed(() => (audible.value ? "Mute" : "Unmute"));
const volumeLevel = computed(() => [audible.value ? volume.value : 0]);
const volumeIcon = computed(() => {
   if (!audible.value) return appIcons.speakerMuted;
   return volume.value < 0.5 ? appIcons.speakerLow : appIcons.speakerHigh;
});
const fullscreenLabel = computed(() => (isFullscreen.value ? "Exit full screen" : "Full screen"));

function formatTime(seconds: number) {
   const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
   const minutes = Math.floor(total / 60);
   const rest = String(total % 60).padStart(2, "0");
   return `${minutes}:${rest}`;
}

function showControls() {
   pointerActive.value = true;
   scheduleIdle();
}

function hideControls() {
   pointerActive.value = false;
}

function togglePlay() {
   playing.value = !playing.value;
   showControls();
}

function toggleMute() {
   if (audible.value) {
      muted.value = true;
      return;
   }

   if (volume.value === 0) volume.value = restoredVolume;
   muted.value = false;
}

function setVolume(level: number) {
   const next = Math.min(1, Math.max(0, level));
   volume.value = next;
   muted.value = next === 0;
}

function changeVolume(value: number[] | undefined) {
   const next = value?.[0];
   if (next !== undefined) setVolume(next);
}

function seek(value: number[] | undefined) {
   const next = value?.[0];
   if (next !== undefined) currentTime.value = next;
}

function seekBy(offset: number) {
   currentTime.value = Math.min(duration.value, Math.max(0, currentTime.value + offset));
   showControls();
}

function isControl(target: EventTarget | null) {
   return target instanceof HTMLElement && Boolean(target.closest("button, [role='slider']"));
}

function handleKeydown(event: KeyboardEvent) {
   const key = event.key.toLowerCase();

   if ((key === " " || key === "k") && !isControl(event.target)) {
      event.preventDefault();
      togglePlay();
   }

   if (key === "m") toggleMute();
   if (key === "f" && canFullscreen.value) toggleFullscreen();

   if ((key === "arrowup" || key === "arrowdown") && !isControl(event.target)) {
      event.preventDefault();
      setVolume((audible.value ? volume.value : 0) + (key === "arrowup" ? volumeStep : -volumeStep));
      showControls();
   }

   if ((key === "arrowleft" || key === "arrowright") && !isControl(event.target)) {
      event.preventDefault();
      seekBy(key === "arrowright" ? seekStep : -seekStep);
   }
}
</script>

<template>
   <div
      ref="root"
      class="video-player"
      data-video-player
      :data-controls="controlsVisible || undefined"
      :data-fullscreen="isFullscreen || undefined"
      @pointermove="showControls"
      @pointerdown="showControls"
      @pointerleave="hideControls"
      @focusin="showControls"
      @keydown="handleKeydown"
   >
      <video
         ref="media"
         class="video-player-media"
         :src="video.src"
         :poster="video.poster"
         :width="video.width"
         :height="video.height"
         :aria-label="video.alt || undefined"
         preload="auto"
         autoplay
         playsinline
         @click="togglePlay"
      />

      <span v-if="waiting" class="video-player-center" aria-hidden="true">
         <Icon :name="appIcons.spinner" class="video-player-spinner" />
      </span>
      <span v-else-if="!playing" class="video-player-center">
         <Button
            class="video-player-play"
            variant="light"
            size="cta-icon"
            :bounce-on-hover="true"
            aria-label="Play"
            @click="togglePlay"
         >
            <template #icon>
               <ButtonIcon :icon="appIcons.play" />
            </template>
         </Button>
      </span>

      <div class="video-player-controls" data-video-player-controls>
         <Button variant="inverse" size="icon" :aria-label="playLabel" @click="togglePlay">
            <Icon :name="playing ? appIcons.pause : appIcons.play" class="size-5" />
         </Button>
         <span class="video-player-time">{{ timeLabel }}</span>
         <Slider
            class="video-player-progress"
            :model-value="progress"
            :min="0"
            :max="duration || 1"
            :step="0.1"
            thumb-label="Seek"
            @update:model-value="seek"
         />
         <div class="video-player-volume">
            <Button variant="inverse" size="icon" :aria-label="muteLabel" @click="toggleMute">
               <Icon :name="volumeIcon" class="size-5" />
            </Button>
            <span class="video-player-volume-popover">
               <Slider
                  class="video-player-volume-slider"
                  orientation="vertical"
                  :model-value="volumeLevel"
                  :min="0"
                  :max="1"
                  :step="0.05"
                  thumb-label="Volume"
                  @update:model-value="changeVolume"
               />
            </span>
         </div>
         <Button
            v-if="canFullscreen"
            variant="inverse"
            size="icon"
            :aria-label="fullscreenLabel"
            @click="toggleFullscreen"
         >
            <Icon :name="isFullscreen ? appIcons.exitFullscreen : appIcons.fullscreen" class="size-5" />
         </Button>
      </div>
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.video-player {
   @apply overflow-hidden bg-foreground;
}

.video-player:not([data-controls]) {
   cursor: none;
}

.video-player-media {
   @apply absolute inset-0 size-full cursor-pointer object-cover;
}

.video-player[data-fullscreen] .video-player-media {
   @apply object-contain;
}

.video-player-center {
   @apply pointer-events-none absolute inset-0 grid place-items-center;
}

.video-player-play {
   @apply pointer-events-auto;
}

.video-player-spinner {
   @apply size-10 animate-spin text-primary-foreground;
}

.video-player-controls {
   @apply absolute inset-x-0 bottom-0 flex items-center gap-1 bg-linear-to-t from-foreground/80 to-transparent px-2 pt-12 pb-2 text-primary-foreground sm:gap-2 sm:px-4 sm:pb-3;
   transition: opacity 0.3s ease-out;
}

.video-player:not([data-controls]) .video-player-controls {
   @apply pointer-events-none opacity-0;
}

.video-player-time {
   @apply px-1 text-sm font-semibold whitespace-nowrap tabular-nums sm:px-2;
}

.video-player-progress {
   @apply mx-2 min-w-0 flex-1 cursor-pointer;
}

.video-player-volume {
   @apply relative flex;
}

.video-player-volume-popover {
   @apply hidden;
}

.video-player-volume-slider {
   @apply h-24 cursor-pointer data-[orientation=vertical]:min-h-24;
}

@media (hover: hover) and (pointer: fine) {
   .video-player-volume-popover {
      @apply pointer-events-none absolute bottom-full left-1/2 mb-2 flex -translate-x-1/2 translate-y-2 justify-center rounded-action bg-foreground/80 px-2.5 py-3.5 opacity-0;
      transition:
         opacity 0.2s ease-out,
         translate 0.3s cubic-bezier(0.19, 1, 0.22, 1);
   }

   .video-player-volume-popover::after {
      @apply absolute inset-x-0 top-full h-2 content-[''];
   }

   .video-player-volume:hover .video-player-volume-popover,
   .video-player-volume:focus-within .video-player-volume-popover {
      @apply pointer-events-auto translate-y-0 opacity-100;
   }
}

@media (prefers-reduced-motion: reduce) {
   .video-player-controls,
   .video-player-volume-popover {
      transition: none;
   }

   .video-player-spinner {
      @apply animate-none;
   }
}
</style>
