---
metadata:
  version: 1.0.0
name: vercel-react-best-practices
description: React and Next.js performance optimization and UI engineering guidelines from Vercel Engineering. Use when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance, zero waterfalls, bundle efficiency, and tactile web interfaces.
---

# Vercel React & Web Interface Best Practices

Comprehensive performance optimization and web interface engineering guide for React and Next.js applications, maintained by Vercel Engineering.

## 1. Web Interface Guidelines (Interaction, Motion & Polish)

### Interactions & Touch
- **Hit Targets**: Interactive controls must have a minimum hit area of `44x44px` on touch devices (`min-h-[44px] min-w-[44px]`).
- **Tactile Feedback**: Interactive buttons and cards must respond immediately to `:active` (`active:scale-[0.98]`) and `:hover` states.
- **No Layout Shift**: Never shift layout on hover, focus, or dynamic state transitions (reserve space for badges, loading spinners, and validation messages).
- **Focus Visibility**: Always provide clear `:focus-visible` rings (`focus-visible:ring-2 focus-visible:ring-offset-2`). Never suppress focus outlines without a visible replacement.
- **Scroll & Gestures**: Prevent accidental horizontal overflow (`overflow-x-hidden`). Ensure carousels and drawers respect `prefers-reduced-motion`.

### Typography & Optical Alignment
- **Tabular Numbers**: Always apply `tabular-nums` (`font-variant-numeric: tabular-nums`) to dynamic prices, counters, weights, and timers so digits never jitter during updates.
- **Balanced Headings**: Apply `text-wrap: balance` (`text-balance`) on hero titles and section headings, and `text-pretty` on body paragraphs.
- **Optical Sizing**: Keep line lengths under `65ch–75ch` for readability.

### Forms, Cart & Checkout UX
- **Inline Validation & Feedback**: Confirm state changes (adding to cart, changing weights/quantities) with immediate visual feedback.
- **Submit Protection**: Disable or show loading states on primary action buttons during async operations to prevent double submissions.

---

## 2. React & Next.js Performance Rules (Priority Order)

### Priority 1: Eliminating Waterfalls (CRITICAL)
- `async-cheap-condition-before-await`: Check cheap sync conditions before awaiting flags or remote values.
- `async-defer-await`: Move `await` into branches where the value is actually used.
- `async-parallel`: Use `Promise.all()` for independent async operations.
- `async-suspense-boundaries`: Use `<Suspense>` boundaries to stream dynamic content without blocking the shell.

### Priority 2: Bundle Size Optimization (CRITICAL)
- `bundle-barrel-imports`: Import directly from module paths; avoid heavy barrel files.
- `bundle-dynamic-imports`: Use `next/dynamic` (`ssr: false` when canvas/WebGL-only) for heavy 3D or interactive components below the fold.
- `bundle-preload`: Preload critical interactive assets on hover/focus for instant perceived speed.

### Priority 3: Rendering & Re-render Optimization (HIGH)
- **Isolate Client State**: Keep `'use client'` boundaries as low in the component tree as possible so static sections remain Server Components.
- **Derived State**: Compute derived totals, filtered lists, and formatted prices during render rather than syncing them with `useEffect`.
- **Stable Callbacks & Animations**: Use GPU-accelerated properties (`transform`, `opacity`) for all animations and transitions; avoid animating layout properties (`width`, `height`, `top`, `left`).

## Entregable

Resultado estructurado y verificable según las especificaciones del contrato de la skill.
