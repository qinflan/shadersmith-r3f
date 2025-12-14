import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["./src/index.ts"],
  format: ["esm"],
  dts: true,
  external: ["react", "react-dom", "@react-three/fiber", "three"],
  loader: {
    ".glsl": "text", // treat shader files as raw text
  }
});