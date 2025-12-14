precision highp float;

uniform float uAmplitude;
uniform float uAnimationSpeed;
uniform float uTime;
uniform vec4 uColors[5];
uniform float uGrain;

varying vec2 vUv;

// noise function for grain
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main () {
    vec2 uv = (vUv - 0.5) * 2.0;

    float time = uTime * uAnimationSpeed;
    float d = -time * 0.4;
    float a = 0.0;

    for (float i = 0.0; i < 8.0; i++) {
        a += cos(i - d - a * uv.x);
        d += sin(uv.y * i + a);
    }

    d += uAnimationSpeed;

    // shader is sensitive to amplitude so scale it down, bit hacky and need to be refactored
    float minimizedAmplitude = uAmplitude * 0.02;
    float val = cos(a * 0.3 + d * minimizedAmplitude);

    // normalize intensity
    float t = (val + 1.0) * 0.5;

    vec4 color; 

    if (t < 0.25) {
        float f = t / 0.25;
        color = mix(uColors[0], uColors[1], f);
    } else if (t < 0.5) {
        float f = (t - 0.25) / 0.25;
        color = mix(uColors[1], uColors[2], f);
    } else if (t < 0.75) {
        float f = (t - 0.5) / 0.25;
        color = mix(uColors[2], uColors[3], f);
    } else {
        float f = (t - 0.75) / 0.25;
        color = mix(uColors[3], uColors[4], f);
    }

    vec2 grainUV = gl_FragCoord.xy;
    float g = rand(grainUV);

    float prob = clamp(uGrain * 0.02, 0.0, 1.0);

    // only some pixels get grain
    if (g < prob) {
        float grainAmount = (rand(grainUV + 1.0) - 0.5) * 0.05; // subtle intensity
        color.rgb += grainAmount;
    }

    gl_FragColor = color;

}