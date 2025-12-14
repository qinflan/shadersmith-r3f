uniform float uTime;
uniform float uAmplitude;
uniform float uAnimationSpeed;
varying float vHeight;

mat2 rotate2D(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

vec2 swirlTrails(vec2 uv, float time) {
    float flowX = sin(uv.y * 8.0 + time * 0.5) * 0.6;
    float flowY = cos(uv.x * 8.0 - time * 0.35) * 0.6;

    float trailX = sin(uv.y * 32.0 + time * 1.2) * 0.2;
    float trailY = cos(uv.x * 32.0 - time * 1.0) * 0.2;

    return vec2(flowX + trailX, flowY + trailY);
}

float sinenoise(vec4 x, vec2 uv, float uAmplitude, float uAnimationSpeed) {
  float n = 2.0;
  float a = 0.0;
  float d = -uTime * uAnimationSpeed;

  float r = length(uv) * 0.3;
  float phase = (position.x * 0.2 + position.y * 0.3) + r * 0.3;

  vec2 flow = swirlTrails(uv * 1.2, uTime);

  float ridgeCurvature = 1.0 + abs(a) * 0.5; 
  float swirlAngle = (flow.x * flow.y) * 2.5 * ridgeCurvature;
  uv = rotate2D(swirlAngle) * uv;

  for (float i = 0.0; i < n; i++) {
      a += cos(float(i) - d - a * position.x * 0.4 + phase);
      d += sin(float(i) * 0.5 + phase);
  }
  float displacement = cos(d + a) * uAmplitude;

  return displacement;
}

void main() {
    vec2 uv = position.xy;
    // bit hacky but amplitude is more sensitive on this shader preset so scaling it down works
    float displacement = sinenoise(vec4(position, uTime), uv, (uAmplitude * 0.004), uAnimationSpeed);

    vec3 newPosition = position;
    newPosition.z += displacement;
    vHeight = displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}