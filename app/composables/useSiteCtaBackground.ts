import { computed, onScopeDispose, shallowRef, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import {
   useEventListener,
   useIntersectionObserver,
   usePreferredReducedMotion,
   useResizeObserver,
} from "@vueuse/core";
import {
   smokeBackdropShader,
   smokeField,
   smokeNoiseTexture,
   smokeSpriteShader,
   smokeTrail,
} from "@/lib/site-cta-smoke";
import type { WebGLRenderer } from "three";

type ElementSource<T extends HTMLElement> = MaybeRefOrGetter<
   T | null | undefined
>;
type ThreeModule = typeof import("three");
type RgbColor = readonly [number, number, number];

interface SmokePalette {
   surface: RgbColor;
   ink: RgbColor;
}

interface SmokeScene {
   dispose: () => void;
   render: (deltaRatio: number) => void;
   resize: (width: number, height: number) => void;
   setPointer: (x: number, y: number) => void;
}

const fallbackPalette: SmokePalette = {
   surface: [0, 0, 0],
   ink: [1, 1, 1],
};

const viewportMargin = "25% 0px";

function readCssColor(value: string): RgbColor | null {
   const context = document
      .createElement("canvas")
      .getContext("2d", { willReadFrequently: true });
   if (!context) return null;

   context.fillStyle = value;
   context.fillRect(0, 0, 1, 1);
   const [red = 0, green = 0, blue = 0] = context.getImageData(0, 0, 1, 1).data;
   return [red / 255, green / 255, blue / 255];
}

function readPalette(section: HTMLElement): SmokePalette {
   const style = getComputedStyle(section);
   const surface = readCssColor(style.backgroundColor);
   const ink = readCssColor(style.color);
   if (!surface || !ink) return fallbackPalette;

   return { surface, ink };
}

function createRenderer(three: ThreeModule, canvas: HTMLCanvasElement) {
   try {
      return new three.WebGLRenderer({ alpha: false, antialias: false, canvas });
   } catch {
      return null;
   }
}

function createSmokeScene(
   three: ThreeModule,
   renderer: WebGLRenderer,
   palette: SmokePalette,
): SmokeScene {
   renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, smokeTrail.maxPixelRatio),
   );

   const camera = new three.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -100, 100);
   const trailTarget = new three.WebGLRenderTarget(1, 1);
   const noise = new three.TextureLoader().load(smokeNoiseTexture);

   const spriteScene = new three.Scene();
   const spriteGeometry = new three.PlaneGeometry(
      smokeTrail.spriteWidth,
      smokeTrail.spriteHeight,
   );
   const sprites = Array.from({ length: smokeTrail.spriteCount }, () => {
      const opacity = { value: 0 };
      const material = new three.ShaderMaterial({
         blending: three.AdditiveBlending,
         depthTest: false,
         depthWrite: false,
         fragmentShader: smokeSpriteShader.fragment,
         transparent: true,
         uniforms: { map: { value: noise }, opacity },
         vertexShader: smokeSpriteShader.vertex,
      });
      const mesh = new three.Mesh(spriteGeometry, material);
      mesh.visible = false;
      spriteScene.add(mesh);
      return { material, mesh, opacity };
   });

   const time = { value: 0 };
   const backdropScene = new three.Scene();
   const backdropGeometry = new three.PlaneGeometry(1, 1);
   const backdropMaterial = new three.ShaderMaterial({
      fragmentShader: smokeBackdropShader.fragment,
      uniforms: {
         inkColor: { value: new three.Vector3(...palette.ink) },
         grain: { value: smokeField.grain },
         inkMix: { value: smokeField.inkMix },
         shadeEnd: { value: smokeField.shadeEnd },
         shadeStart: { value: smokeField.shadeStart },
         surfaceColor: { value: new three.Vector3(...palette.surface) },
         time,
         trail: { value: trailTarget.texture },
         trailGlow: { value: smokeField.trailGlow },
         trailPush: { value: smokeField.trailPush },
      },
      vertexShader: smokeBackdropShader.vertex,
   });
   const backdrop = new three.Mesh(backdropGeometry, backdropMaterial);
   backdropScene.add(backdrop);

   const pointer = { x: 0, y: 0 };
   const spawnedAt = { x: 0, y: 0 };
   let nextSprite = 0;

   function spawnSprite() {
      nextSprite = (nextSprite + 1) % sprites.length;
      const sprite = sprites[nextSprite];
      if (!sprite) return;

      sprite.mesh.visible = true;
      sprite.mesh.scale.set(smokeTrail.spawnScale, smokeTrail.spawnScale, 1);
      sprite.mesh.rotation.z = Math.random() * Math.PI * 2;
      sprite.mesh.position.set(pointer.x + smokeTrail.spawnOffsetX, pointer.y, 0);
      sprite.opacity.value = smokeTrail.spawnOpacity;
   }

   function followPointer() {
      const travelX = Math.abs(pointer.x - spawnedAt.x);
      const travelY = Math.abs(pointer.y - spawnedAt.y);
      if (Math.max(travelX, travelY) >= smokeTrail.spawnDistance) spawnSprite();

      spawnedAt.x = pointer.x;
      spawnedAt.y = pointer.y;
   }

   function updateSprites(deltaRatio: number) {
      const opacityKeep = smokeTrail.opacityDecay ** deltaRatio;
      const scaleKeep = smokeTrail.scaleEase ** deltaRatio;
      const scaleGain =
         (smokeTrail.scaleGrowth * (1 - scaleKeep)) / (1 - smokeTrail.scaleEase);

      for (const sprite of sprites) {
         if (!sprite.mesh.visible) continue;

         sprite.opacity.value *= opacityKeep;
         if (sprite.opacity.value < smokeTrail.minOpacity) {
            sprite.mesh.visible = false;
            continue;
         }

         const scale = sprite.mesh.scale.x * scaleKeep + scaleGain;
         sprite.mesh.scale.set(scale, scale, 1);
         sprite.mesh.rotation.z += smokeTrail.rotationStep * deltaRatio;
      }
   }

   function render(deltaRatio: number) {
      time.value += smokeTrail.timeStep * deltaRatio;
      followPointer();
      updateSprites(deltaRatio);

      renderer.setRenderTarget(trailTarget);
      renderer.render(spriteScene, camera);
      renderer.setRenderTarget(null);
      renderer.render(backdropScene, camera);
   }

   function resize(width: number, height: number) {
      renderer.setSize(width, height, false);
      trailTarget.setSize(
         Math.ceil(width * smokeTrail.trailResolution),
         Math.ceil(height * smokeTrail.trailResolution),
      );
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      backdrop.scale.set(width, height, 1);
   }

   function setPointer(x: number, y: number) {
      pointer.x = x;
      pointer.y = y;
   }

   function dispose() {
      for (const sprite of sprites) sprite.material.dispose();
      spriteGeometry.dispose();
      backdropGeometry.dispose();
      backdropMaterial.dispose();
      noise.dispose();
      trailTarget.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
   }

   return { dispose, render, resize, setPointer };
}

export function useSiteCtaBackground(
   scope: ElementSource<HTMLElement>,
   canvas: ElementSource<HTMLCanvasElement>,
) {
   const { gsap } = useGsap();
   const { deferCleanup } = usePageTransition();
   const motionPreference = usePreferredReducedMotion();
   const ready = shallowRef(false);
   const nearViewport = shallowRef(false);
   const scene = shallowRef<SmokeScene | null>(null);
   const motionAllowed = computed(() => motionPreference.value !== "reduce");
   const animating = computed(
      () => ready.value && nearViewport.value && motionAllowed.value,
   );
   let disposed = false;
   let loading = false;

   function tick() {
      scene.value?.render(gsap.ticker.deltaRatio(60));
   }

   function measure(target: SmokeScene) {
      const root = toValue(scope);
      if (!root) return;

      target.resize(root.clientWidth, root.clientHeight);
      if (!animating.value) target.render(0);
   }

   async function load() {
      const root = toValue(scope);
      const target = toValue(canvas);
      if (!import.meta.client || loading || disposed || !root || !target)
         return;

      loading = true;
      const three = await import("three");
      if (disposed) return;

      const renderer = createRenderer(three, target);
      if (!renderer) return;

      const created = createSmokeScene(three, renderer, readPalette(root));
      scene.value = created;
      measure(created);
      ready.value = true;
   }

   function trackPointer(event: PointerEvent) {
      const root = toValue(scope);
      if (!root || !scene.value || !motionAllowed.value) return;

      const bounds = root.getBoundingClientRect();
      scene.value.setPointer(
         event.clientX - bounds.left - bounds.width / 2,
         bounds.height / 2 - (event.clientY - bounds.top),
      );
   }

   useIntersectionObserver(
      () => toValue(scope),
      (entries) => {
         nearViewport.value = entries.some((entry) => entry.isIntersecting);
      },
      { rootMargin: viewportMargin },
   );

   useResizeObserver(
      () => toValue(scope),
      () => {
         if (scene.value) measure(scene.value);
      },
   );

   useEventListener(() => toValue(scope), "pointermove", trackPointer, {
      passive: true,
   });

   watch(nearViewport, (near) => {
      if (near) return load();
   });

   watch(animating, (active) => {
      if (active) gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
   });

   onScopeDispose(() => {
      disposed = true;
      deferCleanup(() => {
         gsap.ticker.remove(tick);
         scene.value?.dispose();
         scene.value = null;
      });
   });

   return { ready };
}
