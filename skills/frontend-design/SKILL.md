---
metadata:
  version: 1.0.0
name: frontend-design
description: Guidance for distinctive, intentional visual design and interactive UI craftsmanship when building new web experiences or reshaping existing ones. Helps with aesthetic direction, bespoke typography, choreographed motion, and avoiding generic AI-generated templates.
---

# Elite Frontend Design & Art Direction

Approach every interface as the Design Director at an elite digital studio known for crafting bespoke, unforgettable web experiences (Awwwards / Apple / Linear caliber). Never settle for generic, templated defaults.

## 1. Ground Designs in the Subject Matter & Vernacular
- Every industry and artisanal craft has physical textures, lighting, and cultural vernacular.
- For **artisanal food & heritage brands** (like *La Central del Queso*): evoke tactile warmth, natural morning market light, organic paper/wood grain textures, rich terracotta, deep foliage greens, and editorial serif typography paired with crisp geometric numerals.
- Build with real, specific product storytelling, authentic copy, and domain-accurate details (weights in grams/kilos, pairing notes, texture profiles, market locations).

## 2. Typography as Architecture
- Typography carries 80% of the personality of the page.
- Pair a high-contrast **editorial serif** for headlines with a clean, legible **humanist/geometric sans** for UI controls and `tabular-nums` for pricing/weights.
- Set a deliberate type scale with tight tracking on large display headings (`tracking-tight`) and generous breathing room on body copy (`leading-relaxed`).
- **Avoid AI clichés**:
  - Do not randomly italicize or color-highlight a single word in every headline.
  - Do not slap generic uppercase eyebrows above every single block unless it encodes real structural hierarchy.

## 3. Intentional, Choreographed Motion
- **Quality over scatter**: A single orchestrated hero reveal and deeply responsive interactive controls beat generic fade-up animations on every div.
- **Interactive Physics**: Motion that responds to a user's action (sliding a weight selector, flipping a tasting card, filtering cheese varieties, updating a live order basket) must feel physical, using spring physics or smooth cubic-bezier curves (`cubic-bezier(0.22, 1, 0.36, 1)`).
- **Micro-interactions**: Show *what* changed—animate price counters, highlight newly added items in the WhatsApp order summary, and provide tactile hover/press states.

## 4. Spatial Composition & Depth
- Combine editorial storytelling with interactive utility:
  - Asymmetric bento grids or tactile product cards with layered depth.
  - Subtle borders (`border-black/5` or warm stone borders), soft ambient shadows, and glassmorphic floating action bars (`backdrop-blur-md`) for persistent order summaries.
- Ensure every interactive element works effortlessly on both mobile viewports (thumb-friendly bottom sheets/bars) and desktop screens.

## Entregable

Resultado estructurado y verificable según las especificaciones del contrato de la skill.
