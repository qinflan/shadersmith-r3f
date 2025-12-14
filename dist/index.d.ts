import * as react_jsx_runtime from 'react/jsx-runtime';

type PresetName = "valley" | "liquid" | "gloss";
type RGBA = [number, number, number, number];
interface ShadersmithProps {
    preset?: PresetName;
    colors?: [RGBA, RGBA, RGBA, RGBA, RGBA];
    amplitude?: number;
    animationSpeed?: number;
    grain?: number;
    className?: string;
}

declare const Shadersmith: ({ preset, colors, amplitude, animationSpeed, grain, className, }: ShadersmithProps) => react_jsx_runtime.JSX.Element;

export { Shadersmith, type ShadersmithProps };
