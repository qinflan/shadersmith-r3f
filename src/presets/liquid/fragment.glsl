precision highp float;

uniform float uTime;
uniform float uMetalness;
uniform float uRoughness;
uniform vec3 uLightPos;
uniform vec3 uCameraPos;
uniform vec4 uColors[5];
uniform float uGrain;

varying float vHeight;

// noise function for grain
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float fresnel(vec3 viewDir, vec3 normal, float bias, float scale, float power) {
  return bias + scale * pow(1.0 - dot(viewDir, normal), power);
}

float specularStrength(vec3 lightDir, vec3 viewDir, vec3 normal, float shininess) {
  vec3 halfDir = normalize(lightDir + viewDir);
  return pow(max(dot(normal, halfDir), 0.0), shininess);
}

void main() {
  vec3 pos = vec3(gl_FragCoord.xy, vHeight);
  vec3 normal = normalize(cross(dFdx(pos), dFdy(pos)));

  vec3 lightDir = normalize(uLightPos);
  vec3 viewDir = normalize(uCameraPos - vec3(0.0, 0.0, vHeight));

  float shininess = mix(32.0, 64.0, 1.0 - uRoughness);
  float spec = specularStrength(lightDir, viewDir, normal, shininess);

  float t = smoothstep(-0.3, 0.3, vHeight);

  vec3 baseColor;
  if (t < 0.25) baseColor = mix(uColors[0].rgb, uColors[1].rgb, t * 4.0);
  else if (t < 0.5) baseColor = mix(uColors[1].rgb, uColors[2].rgb, (t - 0.25) * 4.0);
  else if (t < 0.75) baseColor = mix(uColors[2].rgb, uColors[3].rgb, (t - 0.5) * 4.0);
  else baseColor = mix(uColors[3].rgb, uColors[4].rgb, (t - 0.75) * 4.0);

  baseColor += 0.1 * sin(uTime + vHeight * 5.0);

  float metalness = clamp(uMetalness, 0.0, 1.0);
  float fres = fresnel(viewDir, normal, 0.02, 1.0, 5.0);

  vec2 grainUV = gl_FragCoord.xy;
  float g = rand(grainUV);
  float prob = clamp(uGrain * 0.02, 0.0, 1.0);
  float grainAmount = 0.0;

  // only some pixels get grain
  if (g < prob) {
      grainAmount = (rand(grainUV + 1.0) - 0.5) * 0.05;
  }

  vec3 color = baseColor * (0.7 + 0.3 * fres) + spec * 1.5;
  color = mix(baseColor, color, metalness);
  color.rgb += grainAmount;

  gl_FragColor = vec4(color, 1.0);
}
