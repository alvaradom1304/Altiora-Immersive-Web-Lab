---
name: elite-web-experience-os
description: Production workflow, creative art direction, motion guidelines, performance budgets, and quality scorecard from Elite Web Experience OS. Use when designing, building, or auditing high-converting interactive web experiences.
---

# Elite Web Experience OS

Integrated system combining Art Direction, Motion Design, Conversion Growth, and Engineering Quality Assurance for flagship web experiences.

## 1. Creative & Art Direction (`creative/art-direction.md`)
- **Visual Signature**: Every section must have a clear focal point, intentional contrast, and cohesive color harmony.
- **Asset Production (`creative/asset-production.md`)**:
  - Hero and product imagery must share consistent lighting temperature, depth of field, and color grading.
  - Always pair high-resolution imagery with subtle overlays or gradient masks when placing typography over photos to guarantee WCAG AA/AAA contrast.

## 2. Motion Guidelines (`creative/motion-guidelines.md`)
- **Purposeful Motion**: Every animation must either guide attention, communicate spatial relationships, or confirm user action.
- **Timing & Easing**:
  - Micro-interactions (hover, toggle, button press): `150ms–220ms` with ease-out.
  - Component transitions (filtering, tab switching, modal/drawer reveal): `280ms–400ms` with spring or custom cubic-bezier(`0.16, 1, 0.3, 1`).
- **Performance**: Restrict animations to `transform` and `opacity`. Always respect `prefers-reduced-motion`.

## 3. Conversion & Retention (`growth/retention.md`)
- **Zero-Friction Path to Purchase**: Minimize clicks between product discovery and order completion (e.g., direct WhatsApp pre-filled order payload with exact items, weights, and total price).
- **Interactive Engagement**: Use interactive tools (tasting matchers, portion calculators, live bundle builders) to increase time-on-site and buyer confidence.

## 4. Quality Gate & Scorecard (`quality/definition-of-done.md` & `performance-budgets.md`)
- **Performance Budgets**:
  - Fast initial paint; hero image prioritized; zero layout shift (`CLS < 0.05`).
  - Responsive across `375px` (mobile), `768px` (tablet), and `1440px+` (desktop).
- **Definition of Done**:
  - All interactive states (`default`, `hover`, `focus-visible`, `active`, `disabled`, `empty`) implemented.
  - Real domain copy and accurate pricing/calculations verified.

## 5. Customer Value & Lead Capture Integration
- Cross-reference with [`customer-value-architect`](file:///C:/Users/Usuario/.gemini/config/skills/customer-value-architect/SKILL.md) to ensure every experience includes interactive value calculators, diagnostics, or sommelier tools that capture high-intent leads.

## 6. Matriz Obligatoria de Herramientas, Conectores y Librerías ([`references/06_matriz_herramientas_conectores.md`](file:///C:/Users/Usuario/.gemini/config/skills/elite-web-experience-os/references/06_matriz_herramientas_conectores.md))
- **A. No-Code / Low-Code Premium**: Framer, Webflow, Readymag, Spline (`@splinetool/runtime`).
- **B. Motor Frontend & Renderizado Custom**: Next.js (App Router) + TypeScript, Three.js + `@react-three/fiber` + `@react-three/drei`, Custom GLSL Shaders, Luma WebGL SDK / SparkJS (Gaussian Splatting).
- **C. Conectores de Movimiento, Físicas e Interacción**: GSAP + ScrollTrigger, Lenis (`@studio-freight/react-lenis`), Framer Motion, Interactive Image Comparison Slider (`clip-path` SVG/CSS o GLSL), Matter.js (físicas 2D).
- **D. Regla Obligatoria en Cada Solicitud**:
  1. **Declarar la "Ficha de Stack"**: Especificar siempre el trío tecnológico (**Framework base + Motor de animación + Motor 3D/Canvas**) antes de proponer arquitectura o código.
  2. **Justificar los conectores elegidos**: Explicar cómo reducen la latencia, aseguran **60–120 FPS estables** y elevan la percepción de valor.

