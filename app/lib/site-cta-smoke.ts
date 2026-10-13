export const smokeNoiseTexture = "/images/smoke-noise.avif";

export const smokeTrail = {
   spriteCount: 100,
   spriteWidth: 55,
   spriteHeight: 57,
   spawnScale: 3.5,
   spawnOpacity: 0.5,
   spawnOffsetX: -0.9,
   spawnDistance: 1,
   rotationStep: 0.02,
   opacityDecay: 0.96,
   minOpacity: 0.002,
   scaleEase: 0.98,
   scaleGrowth: 0.45,
   timeStep: 0.04,
   trailResolution: 0.5,
   maxPixelRatio: 2,
} as const;

export const smokeField = {
   inkMix: 0.24,
   shadeStart: 0.26,
   shadeEnd: 0.62,
   trailPush: 0.35,
   trailGlow: 0.3,
   grain: 0.08,
   grainRate: 5,
} as const;

const fullUvVertex = `
varying vec2 vUv;

void main() {
   vUv = uv;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const smokeSpriteShader = {
   vertex: fullUvVertex,
   fragment: `
uniform sampler2D map;
uniform float opacity;
varying vec2 vUv;

void main() {
   float mask = smoothstep(0.5, 0.05, length(vUv - 0.5));
   float value = texture2D(map, vUv).r * mask;
   gl_FragColor = vec4(value, value, value, value * opacity);
}
`,
} as const;

export const smokeBackdropShader = {
   vertex: fullUvVertex,
   fragment: `
#define PI 3.14159265359

uniform float time;
uniform float inkMix;
uniform float shadeStart;
uniform float shadeEnd;
uniform float trailPush;
uniform float trailGlow;
uniform float grain;
uniform float grainRate;
uniform float pixelRatio;
uniform sampler2D trail;
uniform vec3 surfaceColor;
uniform vec3 inkColor;
varying vec2 vUv;

float random(vec2 point) {
   return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453123);
}

float valueNoise(vec2 point) {
   vec2 cell = floor(point);
   vec2 blend = fract(point);
   blend = blend * blend * (3.0 - 2.0 * blend);
   float result = mix(
      mix(random(cell), random(cell + vec2(1.0, 0.0)), blend.x),
      mix(random(cell + vec2(0.0, 1.0)), random(cell + vec2(1.0, 1.0)), blend.x),
      blend.y
   );
   return result * result;
}

void main() {
   float push = texture2D(trail, vUv).r;
   vec2 offset = vec2(sin(push * 2.0 * PI)) * push * trailPush;
   float centerDistance = distance(vUv, vec2(0.5));
   float cornerDistance = distance(vUv, vec2(0.0, 1.0));
   float smoke = valueNoise(vUv * centerDistance * 2.0 + vec2(time * 0.05, time * -0.05) + offset);
   smoke += valueNoise(vUv * cornerDistance * 2.5 + vec2(time * -0.075, time * 0.05) + offset);
   smoke = smoothstep(shadeStart, shadeEnd, smoke * 0.5);
   float light = clamp(smoke + push * trailGlow, 0.0, 1.0);
   vec3 color = mix(surfaceColor, inkColor, light * inkMix);
   vec2 grainCell = floor(gl_FragCoord.xy / pixelRatio);
   float grainSeed = fract(floor(time * grainRate) * 0.137);
   color += (random(grainCell * 0.01 + grainSeed) - 0.5) * grain;
   gl_FragColor = vec4(color, 1.0);
}
`,
} as const;
