import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

type PresetName = "valley" | "liquid" | "gloss";
type RGBA = [number, number, number, number];
interface ShadersmithProps {
    preset?: PresetName;
    colors?: [RGBA, RGBA, RGBA, RGBA, RGBA];
    amplitude?: number;
    animationSpeed?: number;
    grain?: number;
    className?: string;
    children?: ReactNode;
}

declare const Shadersmith: ({ preset, colors, amplitude, animationSpeed, grain, className, children, }: ShadersmithProps) => react_jsx_runtime.JSX.Element;

export { Shadersmith, type ShadersmithProps };
