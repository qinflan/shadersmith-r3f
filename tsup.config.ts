import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["./src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  loader: {
    ".glsl": "text", // treat shader files as raw text
  }
});