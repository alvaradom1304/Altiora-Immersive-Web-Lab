# ALTIORA — Immersive Experience Quality Protocol v1

## Mission
Transform La Central del Queso into an artistic, cinematic, accessible and commercially useful web experience. Do not settle for generic low-poly environments, abrupt scroll scene switches, fake doors, broken videos or static product cards.

## Required story
1. Closed authentic wooden gate with 'Finca Doña Martha'; accessible skip-intro button.
2. Gates physically open, with credible hinges, shadows and sound optional.
3. Single continuous-feeling camera journey through lush Costa Rican mountain farmland; vegetation, clouds, atmospheric depth, organic imperfections.
4. Arrive at barn; second doors open into a dark transition.
5. Reveal artisanal cheese tasting table, product exploration, price/weight calculator and shopping cart.
6. Add-to-cart microinteraction: product moves toward cart or lightweight visual equivalent; respect reduced motion.

## First: audit, do not blindly rebuild
Inspect actual project source, assets, browser console, network requests, broken media, hydration errors, scroll triggers, mobile behavior and current deployment. Identify why cinematic sequence disappeared and why models/images vanish. Preserve working business logic and existing content.

## Rendering decision tree
- For long photorealistic travel shots, test compressed video or scroll-driven image sequences first.
- For interactive doors and products, use optimized 3D only where interaction adds value.
- If 3D looks synthetic, improve assets/materials/light/camera or replace noninteractive sections with high-quality photographic/cinematic media.
- If video stutters, benchmark image-sequence alternatives, preloading and responsive media.
- If scroll fails, isolate ScrollTrigger lifecycle, pinning, resizing and cleanup; test keyboard and touch.
- Never present a placeholder as finished.

## References and libraries to evaluate (check license and compatibility)
GSAP ScrollTrigger, Lenis, Three.js, React Three Fiber, drei, Theatre.js, glTF Transform, meshoptimizer, KTX2/Basis Universal, Playwright, Lighthouse CI. Avoid dependencies without demonstrable value.

## Autonomous iterative workflow
Discovery -> visual reference board -> technical diagnosis -> storyboard -> small proof-of-concept -> browser screenshot/video QA -> critique -> fix -> retest -> production optimization.
Each iteration must record: defect, hypothesis, action, measurable result, screenshot or test evidence. After two failed attempts with same technique, change technique, not merely prompt wording. Do not claim quality success without visual inspection.

## Acceptance gates
- Gates are recognizable and animated, not two flat blocks.
- Farm feels organic and photographic, not geometrically square.
- Travel feels continuous; no accidental black frames or abrupt jumps.
- Tasting scene remains visible while scrolling.
- Cart, calculator, products and CTA remain functional.
- No uncaught runtime errors or missing assets.
- Responsive mobile experience and reduced-motion fallback.
- Performance targets: LCP <= 2.5s, CLS <= 0.1, INP <= 200ms at 75th percentile when measurable; report actual device/network results rather than inventing them.
- Human art-direction approval for final visuals.

## Deliverables
Audit report; asset manifest; cinematic storyboard with camera path; implementation plan; tested code; screenshots; before/after comparison; issues log; performance report. Never deploy to production without authorization.
