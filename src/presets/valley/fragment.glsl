uniform vec4 uColors[5]; // array of colors
uniform float uGrain;

varying float vHeight; // passed z displacement for vertices from vertex shader

// noise function for grain
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    float t = (vHeight + 10.0) / 20.0;
    t = clamp(t, 0.0, 1.0);
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
