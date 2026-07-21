# Repository guidance

## Project overview

TERMINAL is a pnpm/TypeScript workspace. The current user-facing product is the React 19 + Vite dashboard in `artifacts/terminal-vc`; it uses seeded startup data and browser `localStorage`. `artifacts/api-server` is an Express 5 health-check scaffold. The OpenAPI, generated client/Zod packages, and empty Drizzle/PostgreSQL package are not currently connected to the dashboard.

## Package manager and important paths

- Use pnpm 10 and the committed `pnpm-lock.yaml`; do not use npm or Yarn.
- `artifacts/terminal-vc/src`: product UI, domain fixtures, and client state.
- `artifacts/api-server/src`: Express application and `/api/healthz`.
- `lib/api-spec`: OpenAPI source and Orval configuration.
- `lib/api-client-react` and `lib/api-zod`: generated API artifacts plus the custom fetcher.
- `lib/db`: database entry point; schema is currently empty.
- `artifacts/mockup-sandbox`: separate generated-component preview tooling, not a product route.
- `docs`: current-state architecture, audit, and refactor plan.

## Validation

Run from the workspace root:

```sh
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run lint
pnpm run build
```

`pnpm run lint` checks maintained first-party JavaScript, TypeScript, and React code; generated and external outputs are excluded in `eslint.config.mjs`. There is currently no test command. Do not claim tests ran. Vite uses its default port and `/` base path when `PORT` and `BASE_PATH` are unset; supplied values still configure dev/preview and deployment builds. `DATABASE_URL` is required only when the database entry point or Drizzle command is executed. See `docs/CURRENT_STATE_AUDIT.md` for the verified validation baseline.

## Conventions and guardrails

- Follow the existing TypeScript, React function-component, named domain-type, Tailwind utility, and `@/` alias conventions.
- Keep generated files under `lib/api-client-react/src/generated` and `lib/api-zod/src/generated` generated from `lib/api-spec/openapi.yaml`; do not hand-edit them.
- Do not add new product features unless explicitly requested.
- Do not redesign the application unless explicitly requested.
- Preserve existing user-facing behavior and visual appearance; document an actual bug before changing it.
- Prefer small, reviewable changes. Do not rewrite the repository in one task.
- Do not add dependencies without documented justification.
- Do not suppress ESLint or TypeScript errors.
- Do not introduce `any` or unsafe casts as shortcuts.
- Do not modify unrelated files.
- Do not remove code until its lack of usage has been verified through imports, dynamic references, routes, configuration, and framework conventions.
- Keep data access, transformation logic, and presentation appropriately separated.
- Preserve the OpenAPI-to-Orval generation boundary and the product/mockup-sandbox boundary unless a scoped task explicitly changes them.
- Run the relevant validation commands after every implementation task and report unresolved failures honestly.

## Definition of Done

A change is complete only when its scope and behavior-preservation constraints are documented, `pnpm run lint` plus relevant typecheck/build/tests (when available) have been run, generated sources are in sync when contracts changed, accessibility and empty/error states affected by the change were checked, unrelated files remain untouched, and all failures or unvalidated environment-dependent behavior are reported.
