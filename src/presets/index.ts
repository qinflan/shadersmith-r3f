import valleyVertex from "./valley/vertex.glsl"
import valleyFragment from "./valley/fragment.glsl"

import liquidVertex from "./liquid/vertex.glsl"
import liquidFragment from "./liquid/fragment.glsl"

import glossVertex from "./gloss/vertex.glsl"
import glossFragment from "./gloss/fragment.glsl"

import { PresetName } from "../types"

// Map PresetName arg to correct shader strings
export const PRESETS: Record<PresetName, { vertex: string; fragment: string }> = {
  valley: { vertex: valleyVertex, fragment: valleyFragment },
  liquid: { vertex: liquidVertex, fragment: liquidFragment },
  gloss: { vertex: glossVertex, fragment: glossFragment },
};