import { ReactNode } from "react"

export type PresetName = "valley" | "liquid" | "gloss"

export type RGBA = [number, number, number, number]

export interface ShadersmithProps {
    preset?: PresetName,
    colors?: [RGBA, RGBA, RGBA, RGBA, RGBA],
    amplitude?: number,
    animationSpeed?: number,
    grain?: number,
    className?: string,
    children?: ReactNode
}