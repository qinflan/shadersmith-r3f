precision highp float;

varying vec2 vUv;

// this shader does not use vertex deformation so very lightweight passing vUv to fragment 
// 2D !!!

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
