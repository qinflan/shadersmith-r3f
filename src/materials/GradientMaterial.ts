import * as THREE from "three"
import type { PresetName, RGBA, ShadersmithProps } from "../types"
import { PRESETS } from "../presets"

export interface GradientMaterialProps {
    preset: PresetName,
    colors: [RGBA, RGBA, RGBA, RGBA, RGBA]
    amplitude: number,
    animationSpeed: number,
    grain: number
}

export const createGradientMaterial = ({
    preset,
    colors,
    amplitude,
    animationSpeed,
    grain,
}: GradientMaterialProps) => {
    const 
    colorVectors = colors.map(
        ([r, g, b, a]) => new THREE.Vector4(r,g,b,a)
    );

    const uniforms = {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uAnimationSpeed: { value: animationSpeed },
        uColors: { value: colorVectors },
        uGrain: { value: grain },
    };

    const { vertex, fragment } = PRESETS[preset];

    return new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms,
    });
};