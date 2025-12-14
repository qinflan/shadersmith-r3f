# shadersmith-r3f

**A modular animated gradient shader component for React Three Fiber.**

Check out the possibilities of this package by playing around in the web-app:
https://shadersmith.vercel.app/

*You can also get copy and pastable code snippets so you can customize your art in the web-app, then have it inside your react app in seconds!*

## Dependencies

This package uses a few peer dependencies, so you must install them before shadersmith-r3f in order to avoid errors or warnings.


## Installation

### 1. Install peer dependencies

Shadersmith relies on React Three Fiber and Three.js. Make sure these are installed first:

```bash
npm install react react-dom three @react-three/fiber
```

### 2. Install Shadersmith

```bash
npm install shadersmith-r3f
```

## Basic Usage

```tsx
import { Shadersmith } from "shadersmith-r3f";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Shadersmith
        preset="valley"
        amplitude={20}
        animationSpeed={0.5}
        grain={25}
        colors={[
            [0.8, 0.8, 1.0, 1.0],
            [1.0, 0.78, 0.96, 1.0],
            [0.0, 0.93, 0.93, 1.0],
            [0.29, 0.29, 0.55, 1.0],
            [0.22, 0.22, 0.4, 1.0],
        ]}
      />
    </div>
  );
}
```

> **NOTE:** The gradient component scales to full height and width of its parent, so if you are having issues seeing your component, ensure that its parent DOM element has explicit height and width.

## Arguments / Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `preset` | `"valley" \| "liquid" \| "gloss"` | `"valley"` | Shader preset, each has a unique visual style. |
| `amplitude` | `number (0-100)` | `20` | Intensity of the gradient. 0 = flat, 100 = extreme. |
| `animationSpeed` | `number (0-1)` | `0.5` | Controls how fast the gradient animates. |
| `colors` | `RGBA[5]` | Default palette | Array of 5 RGBA colors. Low amplitude may hide some colors. |
| `grain` | `number (0-100)` | `25` | Grain overlay for softer, distorted, or “film-like” effect. |

