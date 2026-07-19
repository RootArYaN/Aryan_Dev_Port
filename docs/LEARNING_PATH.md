# Build-and-Learn Path

The repository is structured so that every visible feature teaches a transferable engineering skill. Do not only copy the implementation; trace it, modify it, break it in a branch, test it, and explain the trade-offs.

## Phase 1 — Read the system map

Start with these files in order:

1. `apps/web/src/App.tsx` — route-level architecture and lazy loading.
2. `apps/web/src/components/layout/PublicLayout.tsx` — shared visual shell.
3. `apps/web/src/data/profile.ts` — content as structured data.
4. `apps/web/src/pages/HomePage.tsx` — page composition.
5. `apps/api/app/main.py` and `apps/api/app/api/router.py` — backend entry and route composition.

Goal: explain how the frontend, backend, database, mail service, admin area, and GitHub deployment fit together without using AI.

## Phase 2 — React and component architecture

### Exercise 1: content-driven components

Add a seventh project only by changing `profile.ts` and `projectMeta`. Explain why data-driven rendering is easier to maintain than duplicating JSX.

### Exercise 2: route-level code splitting

Inspect the production build output after running:

```bash
cd apps/web
npm run build
```

Explain why each route produces a separate JavaScript chunk and when lazy loading is not worth the complexity.

### Exercise 3: reusable visual language

Study:

- `ProjectCard.tsx`
- `ProjectGlyph.tsx`
- `PageIntro.tsx`
- `SectionHeading.tsx`
- `Reveal.tsx`

Create one new reusable component without adding a new dependency.

## Phase 3 — Motion.dev skills

Study the motion components in this order:

1. `PageTransition.tsx` — entry and exit basics.
2. `Navbar.tsx` — shared layout animation with `layoutId`.
3. `Hero.tsx` — `AnimatePresence`, staged animation, and reduced motion.
4. `Workflow.tsx` — element-targeted `useScroll` and `useTransform`.
5. `BackgroundScene.tsx` — motion values, springs, pointer input, SVG paths, and scroll linkage.

For every animation, document:

- trigger,
- animated properties,
- accessibility fallback,
- performance risk,
- reason it improves the experience.

Do not add animation merely because a library makes it easy.

## Phase 4 — Responsive and accessible UI

1. Navigate the complete site using only the keyboard.
2. Test at 320 px, 768 px, 1024 px, and 1440 px widths.
3. Enable operating-system reduced motion and confirm the experience remains complete.
4. Test form errors, loading states, API failure, and mail fallback.
5. Run Lighthouse and document the three most important fixes rather than chasing a vanity score.

## Phase 5 — Backend mastery

Trace one contact request through:

1. `api.ts`,
2. FastAPI route,
3. Pydantic validation,
4. rate limiter,
5. encryption,
6. database persistence,
7. mail notification,
8. admin retrieval.

Then learn:

- async SQLAlchemy sessions and transactions,
- authentication and CSRF,
- password hashing and authorization,
- structured logging and request IDs,
- health/readiness checks,
- failure handling and retry boundaries.

## Phase 6 — Database and analytics depth

1. Inspect generated SQL and query plans.
2. Add indexes only after measuring slow queries.
3. Add one analytics table and one precomputed summary.
4. Compare live calculation versus cached/precomputed results.
5. Add a migration for every schema change.
6. Write tests that verify business calculations against known fixtures.

## Phase 7 — Deployment and operations

1. Build the frontend locally exactly as CI does.
2. Deploy GitHub Pages with the correct Vite base path.
3. Build and run the backend Docker image.
4. Configure a domain, HTTPS, secrets, logs, backups, and alerts.
5. Practise rollback in a pre-production environment.
6. Add a release checklist and record each production change.

## Phase 8 — Portfolio depth

The next major public project should be a sanitized manufacturing ERP demonstrator with dummy data:

- users, roles, and permissions,
- product and packet master data,
- production-stage movement,
- inventory positions,
- sales and pricing scenarios,
- audit history,
- analytics summaries,
- documented API,
- tests, containers, CI, and deployment notes.

Build the simplest credible vertical slice first. Do not attempt every ERP module at once.

## AI usage rule

Use AI for alternatives, code review, edge cases, tests, debugging, and documentation. Before merging AI-assisted code, explain:

- the data flow,
- the security impact,
- likely failure modes,
- test evidence,
- why the chosen design is simpler than the rejected alternatives.
