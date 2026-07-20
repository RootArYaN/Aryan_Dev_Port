# Portfolio Experience & Motion System

This redesign uses a visual language built around Aryan's real profile rather than a generic developer-template aesthetic.

## Core concept: the data refinery

The portfolio connects three parts of Aryan's background:

1. **Diamond and manufacturing operations** — represented by faceted geometry and precise grid structures.
2. **Analytics and enterprise data** — represented by moving data nodes, pipelines, metrics, and system layers.
3. **Robotics and autonomous systems** — represented by signal paths, control loops, and blueprint-style diagrams.

The result is deliberately calm and professional. Motion communicates relationships and progress; it is not used as decoration on every element.

## Public route map

```text
/                    Home and positioning
/work                Filterable project portfolio
/work/:slug          Individual system case study
/journey             Scroll-linked career timeline
/expertise           Capability map, stack, and principles
/lab                 Current learning and experiments
/contact             Professional contact flow
/admin                Private backend-powered administration
```

## Visual tokens

- **Base:** near-black blue (`#071018`) for a technical but less generic alternative to pure black.
- **Primary signal:** pale cyan for data flow, trust, and interaction states.
- **Secondary signal:** violet for system depth and experimentation.
- **Supporting signals:** emerald, amber, rose, and sky are used only inside project visualizations.
- **Surfaces:** low-opacity glass panels with clear borders, not heavy blur everywhere.
- **Typography:** large, editorial headlines paired with small monospaced system labels.
- **Geometry:** rounded rectangles for approachable software; sharp SVG facets for manufacturing and diamond context.

## Motion patterns

### 1. Scroll progress

`ScrollProgress.tsx` links page scroll to a one-pixel progress line. It gives orientation on long pages without adding another UI control.

### 2. Scroll-linked timelines

`JourneyPage.tsx` uses `useScroll` and `useTransform` to reveal the active timeline line as the reader moves through the content.

### 3. Shared layout states

The navigation and Work filters use `layoutId` so the selected state moves naturally between items instead of flashing on and off.

### 4. Enter and exit transitions

`AnimatePresence` is used for the rotating hero role and the mobile menu. Route content uses a lightweight `PageTransition` component.

### 5. Background scene

`BackgroundScene.tsx` combines:

- pointer-responsive movement through `useMotionValue` and `useSpring`,
- scroll-linked facet movement,
- SVG path drawing,
- animated data nodes,
- CSS blueprint grids and subtle noise.

It remains behind the content, ignores pointer events, and respects reduced-motion preferences.

### 6. Project system diagrams

`ProjectGlyph.tsx` creates reusable SVG visuals from project metadata. Each project gets a consistent system diagram with an individual accent rather than relying on stock images.

### 7. Cloud deployment trace

`CloudDeploymentStory.tsx` automatically steps through source, verification, API, database, and edge
delivery. Visitors can select a stage directly, and reduced-motion preferences disable automatic
cycling while preserving the complete architecture explanation.

## Accessibility rules

- Every continuous or large animation checks `useReducedMotion` or is disabled by the global reduced-motion stylesheet.
- Motion never hides required information.
- Interactive controls retain visible focus states and semantic HTML.
- Text contrast is strongest for decisions and headlines; secondary detail is intentionally quieter but remains readable.
- Mobile navigation is keyboard accessible and exposes `aria-expanded`.

## How to extend the design

### Add a new project

1. Add the project to `src/data/profile.ts` under `fallbackProjects`.
2. Add matching visual metadata in `projectMeta`.
3. The project automatically appears on `/work` and gains a `/work/:slug` case-study route.
4. Add only verified metrics and avoid confidential formulas, screenshots, database names, or operational identifiers.

### Add a new page

1. Create a page in `src/pages`.
2. Wrap the content in `PageTransition`.
3. Add the route using `React.lazy` in `App.tsx` so it remains code-split.
4. Add navigation only when the page is important enough to justify permanent space.

### Add motion safely

Before adding an animation, answer:

- What relationship or state does this clarify?
- Does it still work when motion is reduced?
- Does it animate transform or opacity instead of expensive layout properties?
- Does it delay the user's task?
- Does it remain smooth on a mid-range mobile device?

If the animation does not improve comprehension, remove it.
