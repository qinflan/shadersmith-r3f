import { useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ShadersmithProps } from "../types";
import { createGradientMaterial } from "../materials/GradientMaterial";

// omit component/canvas props for creating mesh
type GradientMeshProps = Required<Omit<ShadersmithProps, "camera" | "className">>;

// default color palette, maybe adjust this to something more pleasant
const defaultColors: ShadersmithProps["colors"] = [
    [0.8,   0.8,   1,   1],
    [1,     0.788, 0.957, 1],
    [0,     0.929, 0.929, 1],
    [0.294, 0.294, 0.549, 1],
    [0.216, 0.216, 0.4,   1],
]

const GradientMesh = ({
    preset,
    colors,
    amplitude,
    animationSpeed,
    grain,
}: GradientMeshProps) => {

    const material = useMemo(
        () => createGradientMaterial({ preset, colors, amplitude, animationSpeed, grain }),
        [preset, colors, amplitude, animationSpeed, grain]
    );

    const { viewport } = useThree();

    useFrame((state) => {
        if (!material) return;
            material.uniforms.uTime.value = state.clock.elapsedTime;
    })

    return (
        <mesh>
            <planeGeometry args={[viewport.width, viewport.height, 200, 200]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
};

export const Shadersmith = ({
    preset = "valley",
    colors = defaultColors,
    amplitude = 20,
    animationSpeed = 0.5,
    grain = 25,
    camera,
    className,
}: ShadersmithProps) => {
    const camPosition = camera?.position ?? [0,0,50];
    const fov = camera?.fov ?? 50;

    return (
        <Canvas 
            className={className}
            style={{width: "100%", height: "100%"}}
            camera={{ position: camPosition, fov}}
        >
            <ambientLight intensity={1}/>
            <GradientMesh 
                preset={preset}
                colors={colors}
                amplitude={amplitude}
                animationSpeed={animationSpeed}
                grain={grain}
            />
        </Canvas>
    );
};
