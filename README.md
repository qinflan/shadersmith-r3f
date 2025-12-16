# shadersmith-r3f
![optimized-liquid-bg](https://github.com/user-attachments/assets/7a8d141d-88da-4a65-beae-3598dc40c1a4)

**Modular/animated shader gradient components for React apps.**

**Check it out: 
https://shadersmith.vercel.app/**. *Customize your own art and drop into your app!*
<br>
<br>

## Dependencies
**react, three.js, @react-three/fiber are required to use this package.**
<br>
<br>
## Installation

### 1. Install Peer Dependencies (if you don't have them already!)
To avoid any errors or warnings you must ensure the following is installed in your React app:

```bash
npm install react react-dom three @react-three/fiber
```

### 2. Install Shadersmith

```bash
npm install shadersmith-r3f
```
</br>

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

