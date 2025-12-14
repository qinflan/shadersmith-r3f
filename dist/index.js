// src/components/Shadersmith.tsx
import { useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

// src/materials/GradientMaterial.ts
import * as THREE from "three";

// src/presets/valley/vertex.glsl
var vertex_default = `uniform float uTime;
uniform float uAmplitude;
uniform float uAnimationSpeed;
varying float vHeight;

// Simplex 3D Noise
// Copyright (C) 2011 by Ashima Arts
// Copyright (C) 2011-2016 by Stefan Gustavson
// Credit to Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
// Source: https://github.com/stegu/webgl-noise
// Used under the MIT license
// Adapted for use in Shadersmith's "Valley" preset shader

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 10.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}


void main() {
    vec3 pos = position;

    // sample simplex noise using the vertex position and time
    float noise = snoise(vec3(pos.x * 0.1, pos.y * 0.1, uTime * uAnimationSpeed));

    // displace vertex position along z using noise
    pos.z += noise * uAmplitude;

    // set vertex height
    vHeight = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

// src/presets/valley/fragment.glsl
var fragment_default = "uniform vec4 uColors[5]; // array of colors\r\nuniform float uGrain;\r\n\r\nvarying float vHeight; // passed z displacement for vertices from vertex shader\r\n\r\n// noise function for grain\r\nfloat rand(vec2 co) {\r\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\r\n}\r\n\r\nvoid main() {\r\n    float t = (vHeight + 10.0) / 20.0;\r\n    t = clamp(t, 0.0, 1.0);\r\n    vec4 color;\r\n\r\n\r\n    if (t < 0.25) {\r\n        float f = t / 0.25;\r\n        color = mix(uColors[0], uColors[1], f);\r\n    } else if (t < 0.5) {\r\n        float f = (t - 0.25) / 0.25;\r\n        color = mix(uColors[1], uColors[2], f);\r\n    } else if (t < 0.75) {\r\n        float f = (t - 0.5) / 0.25;\r\n        color = mix(uColors[2], uColors[3], f);\r\n    } else {\r\n        float f = (t - 0.75) / 0.25;\r\n        color = mix(uColors[3], uColors[4], f);\r\n    }\r\n\r\n    vec2 grainUV = gl_FragCoord.xy;\r\n    float g = rand(grainUV);\r\n\r\n    float prob = clamp(uGrain * 0.02, 0.0, 1.0);\r\n\r\n    // only some pixels get grain\r\n    if (g < prob) {\r\n        float grainAmount = (rand(grainUV + 1.0) - 0.5) * 0.05; // subtle intensity\r\n        color.rgb += grainAmount;\r\n    }\r\n\r\n    gl_FragColor = color;\r\n}\r\n";

// src/presets/liquid/vertex.glsl
var vertex_default2 = "uniform float uTime;\nuniform float uAmplitude;\nuniform float uAnimationSpeed;\nvarying float vHeight;\n\nmat2 rotate2D(float angle) {\n    float s = sin(angle);\n    float c = cos(angle);\n    return mat2(c, -s, s, c);\n}\n\nvec2 swirlTrails(vec2 uv, float time) {\n    float flowX = sin(uv.y * 8.0 + time * 0.5) * 0.6;\n    float flowY = cos(uv.x * 8.0 - time * 0.35) * 0.6;\n\n    float trailX = sin(uv.y * 32.0 + time * 1.2) * 0.2;\n    float trailY = cos(uv.x * 32.0 - time * 1.0) * 0.2;\n\n    return vec2(flowX + trailX, flowY + trailY);\n}\n\nfloat sinenoise(vec4 x, vec2 uv, float uAmplitude, float uAnimationSpeed) {\n  float n = 2.0;\n  float a = 0.0;\n  float d = -uTime * uAnimationSpeed;\n\n  float r = length(uv) * 0.3;\n  float phase = (position.x * 0.2 + position.y * 0.3) + r * 0.3;\n\n  vec2 flow = swirlTrails(uv * 1.2, uTime);\n\n  float ridgeCurvature = 1.0 + abs(a) * 0.5; \n  float swirlAngle = (flow.x * flow.y) * 2.5 * ridgeCurvature;\n  uv = rotate2D(swirlAngle) * uv;\n\n  for (float i = 0.0; i < n; i++) {\n      a += cos(float(i) - d - a * position.x * 0.4 + phase);\n      d += sin(float(i) * 0.5 + phase);\n  }\n  float displacement = cos(d + a) * uAmplitude;\n\n  return displacement;\n}\n\nvoid main() {\n    vec2 uv = position.xy;\n    // bit hacky but amplitude is more sensitive on this shader preset so scaling it down works\n    float displacement = sinenoise(vec4(position, uTime), uv, (uAmplitude * 0.004), uAnimationSpeed);\n\n    vec3 newPosition = position;\n    newPosition.z += displacement;\n    vHeight = displacement;\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);\n}";

// src/presets/liquid/fragment.glsl
var fragment_default2 = "precision highp float;\n\nuniform float uTime;\nuniform float uMetalness;\nuniform float uRoughness;\nuniform vec3 uLightPos;\nuniform vec3 uCameraPos;\nuniform vec4 uColors[5];\nuniform float uGrain;\n\nvarying float vHeight;\n\n// noise function for grain\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\nfloat fresnel(vec3 viewDir, vec3 normal, float bias, float scale, float power) {\n  return bias + scale * pow(1.0 - dot(viewDir, normal), power);\n}\n\nfloat specularStrength(vec3 lightDir, vec3 viewDir, vec3 normal, float shininess) {\n  vec3 halfDir = normalize(lightDir + viewDir);\n  return pow(max(dot(normal, halfDir), 0.0), shininess);\n}\n\nvoid main() {\n  vec3 pos = vec3(gl_FragCoord.xy, vHeight);\n  vec3 normal = normalize(cross(dFdx(pos), dFdy(pos)));\n\n  vec3 lightDir = normalize(uLightPos);\n  vec3 viewDir = normalize(uCameraPos - vec3(0.0, 0.0, vHeight));\n\n  float shininess = mix(32.0, 64.0, 1.0 - uRoughness);\n  float spec = specularStrength(lightDir, viewDir, normal, shininess);\n\n  float t = smoothstep(-0.3, 0.3, vHeight);\n\n  vec3 baseColor;\n  if (t < 0.25) baseColor = mix(uColors[0].rgb, uColors[1].rgb, t * 4.0);\n  else if (t < 0.5) baseColor = mix(uColors[1].rgb, uColors[2].rgb, (t - 0.25) * 4.0);\n  else if (t < 0.75) baseColor = mix(uColors[2].rgb, uColors[3].rgb, (t - 0.5) * 4.0);\n  else baseColor = mix(uColors[3].rgb, uColors[4].rgb, (t - 0.75) * 4.0);\n\n  baseColor += 0.1 * sin(uTime + vHeight * 5.0);\n\n  float metalness = clamp(uMetalness, 0.0, 1.0);\n  float fres = fresnel(viewDir, normal, 0.02, 1.0, 5.0);\n\n  vec2 grainUV = gl_FragCoord.xy;\n  float g = rand(grainUV);\n  float prob = clamp(uGrain * 0.02, 0.0, 1.0);\n  float grainAmount = 0.0;\n\n  // only some pixels get grain\n  if (g < prob) {\n      grainAmount = (rand(grainUV + 1.0) - 0.5) * 0.05;\n  }\n\n  vec3 color = baseColor * (0.7 + 0.3 * fres) + spec * 1.5;\n  color = mix(baseColor, color, metalness);\n  color.rgb += grainAmount;\n\n  gl_FragColor = vec4(color, 1.0);\n}\n";

// src/presets/gloss/vertex.glsl
var vertex_default3 = "precision highp float;\n\nvarying vec2 vUv;\n\n// this shader does not use vertex deformation so very lightweight passing vUv to fragment \n// 2D !!!\n\nvoid main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";

// src/presets/gloss/fragment.glsl
var fragment_default3 = "precision highp float;\n\nuniform float uAmplitude;\nuniform float uAnimationSpeed;\nuniform float uTime;\nuniform vec4 uColors[5];\nuniform float uGrain;\n\nvarying vec2 vUv;\n\n// noise function for grain\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\nvoid main () {\n    vec2 uv = (vUv - 0.5) * 2.0;\n\n    float time = uTime * uAnimationSpeed;\n    float d = -time * 0.4;\n    float a = 0.0;\n\n    for (float i = 0.0; i < 8.0; i++) {\n        a += cos(i - d - a * uv.x);\n        d += sin(uv.y * i + a);\n    }\n\n    d += uAnimationSpeed;\n\n    // shader is sensitive to amplitude so scale it down, bit hacky and need to be refactored\n    float minimizedAmplitude = uAmplitude * 0.02;\n    float val = cos(a * 0.3 + d * minimizedAmplitude);\n\n    // normalize intensity\n    float t = (val + 1.0) * 0.5;\n\n    vec4 color; \n\n    if (t < 0.25) {\n        float f = t / 0.25;\n        color = mix(uColors[0], uColors[1], f);\n    } else if (t < 0.5) {\n        float f = (t - 0.25) / 0.25;\n        color = mix(uColors[1], uColors[2], f);\n    } else if (t < 0.75) {\n        float f = (t - 0.5) / 0.25;\n        color = mix(uColors[2], uColors[3], f);\n    } else {\n        float f = (t - 0.75) / 0.25;\n        color = mix(uColors[3], uColors[4], f);\n    }\n\n    vec2 grainUV = gl_FragCoord.xy;\n    float g = rand(grainUV);\n\n    float prob = clamp(uGrain * 0.02, 0.0, 1.0);\n\n    // only some pixels get grain\n    if (g < prob) {\n        float grainAmount = (rand(grainUV + 1.0) - 0.5) * 0.05; // subtle intensity\n        color.rgb += grainAmount;\n    }\n\n    gl_FragColor = color;\n\n}";

// src/presets/index.ts
var PRESETS = {
  valley: { vertex: vertex_default, fragment: fragment_default },
  liquid: { vertex: vertex_default2, fragment: fragment_default2 },
  gloss: { vertex: vertex_default3, fragment: fragment_default3 }
};

// src/materials/GradientMaterial.ts
var createGradientMaterial = ({
  preset,
  colors,
  amplitude,
  animationSpeed,
  grain
}) => {
  const colorVectors = colors.map(
    ([r, g, b, a]) => new THREE.Vector4(r, g, b, a)
  );
  const uniforms = {
    uTime: { value: 0 },
    uAmplitude: { value: amplitude },
    uAnimationSpeed: { value: animationSpeed },
    uColors: { value: colorVectors },
    uGrain: { value: grain }
  };
  const { vertex, fragment } = PRESETS[preset];
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms
  });
};

// src/components/Shadersmith.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var defaultColors = [
  [0.8, 0.8, 1, 1],
  [1, 0.788, 0.957, 1],
  [0, 0.929, 0.929, 1],
  [0.294, 0.294, 0.549, 1],
  [0.216, 0.216, 0.4, 1]
];
var GradientMesh = ({
  preset,
  colors,
  amplitude,
  animationSpeed,
  grain
}) => {
  const material = useMemo(
    () => createGradientMaterial({ preset, colors, amplitude, animationSpeed, grain }),
    [preset, colors, amplitude, animationSpeed, grain]
  );
  const { viewport } = useThree();
  useFrame((state) => {
    if (!material) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });
  const width = viewport.width + amplitude * 2;
  const height = viewport.height + amplitude * 2;
  return /* @__PURE__ */ jsxs("mesh", { children: [
    /* @__PURE__ */ jsx("planeGeometry", { args: [width, height, 400, 400] }),
    /* @__PURE__ */ jsx("primitive", { object: material, attach: "material" })
  ] });
};
var Shadersmith = ({
  preset = "valley",
  colors = defaultColors,
  amplitude = 20,
  animationSpeed = 0.5,
  grain = 25,
  className
}) => {
  const defaultCamPosition = preset === "liquid" ? [0, 0, 12] : preset === "valley" ? [0, 0, 12] : [0, 0, 50];
  const camPosition = defaultCamPosition;
  const fov = 50;
  return /* @__PURE__ */ jsxs(
    Canvas,
    {
      className,
      style: { width: "100%", height: "100%" },
      camera: { position: camPosition, fov },
      children: [
        /* @__PURE__ */ jsx("ambientLight", { intensity: 1 }),
        /* @__PURE__ */ jsx(
          GradientMesh,
          {
            preset,
            colors,
            amplitude,
            animationSpeed,
            grain
          }
        )
      ]
    }
  );
};
export {
  Shadersmith
};
/*!
 * Shadersmith-r3f v1.0.0
 * A package for animated gradient shaders in React using Three.js & @react-three/fiber
 * 
 * Copyright (c) 2025 Quinn Flanigan
 * Licensed under the MIT License.
 *
 * Includes adapted Simplex 3D noise function:
 *   - Original by Ian McEwan, Stefan Gustavson
 *   - Source: https://github.com/stegu/webgl-noise
 *   - Used under MIT license in the "Valley" preset vertex shader
 */
