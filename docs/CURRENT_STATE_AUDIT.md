# Current State Audit

Audit date: 2026-07-20. Baseline: clean `main` tracking `origin/main` before documentation changes. Deployed reference checked read-only at `https://terminal-institutional-vc.vercel.app/`.

## Executive assessment

The repository has a coherent visual prototype, a lockfile-enforced workspace, generated API boundaries, and a notably defensive custom fetcher. Installation, typechecking, and the root production build are green on Windows after the first stabilization tasks. The baseline now includes lint but still lacks a test workflow, and the dashboard mixes fixtures, persistence, navigation, transformation, and UI concerns. Several controls are simulated or incomplete, including global search and pagination.

## Current stack

- Workspace/runtime: pnpm 10.32.1, Node 24.13.0, TypeScript 5.9.3, ESLint 9.39.5 (flat config).
- Product UI: React/React DOM 19.1.0, Vite 7.3.5, Tailwind CSS 4.3.1, Lucide, Radix UI primitives, Recharts, Wouter and TanStack Query dependencies.
- API: Express 5.2.1, Pino, CORS, esbuild.
- Contracts: OpenAPI 3.1, Orval 8.18.0, Zod 3.25.76.
- Data package: PostgreSQL `pg` 8.22.0 and Drizzle ORM 0.45.2; no tables exist.
- Styling: Tailwind utilities with CSS theme tokens/custom classes in `artifacts/terminal-vc/src/index.css`; Google-hosted fonts and image URLs.
- Deployment metadata in the repository is Replit-oriented (`.replit`). No Vercel configuration is committed.

## Repository structure and architecture

- `artifacts/terminal-vc`: the deployed-style single-page dashboard. `App.tsx` owns startup records, favorites, pseudo-route state, global search, toast state, and live clock/TPS simulation.
- `artifacts/api-server`: independent Express server exposing only `GET /api/healthz`.
- `artifacts/mockup-sandbox`: development preview host that dynamically discovers mockup components; it is not imported by the product.
- `lib/api-spec`: source contract for the health endpoint.
- `lib/api-client-react`: generated React Query health client and a reusable fetch implementation.
- `lib/api-zod`: generated health schemas used by the server.
- `lib/db`: environment-gated Drizzle client and an empty schema.
- `scripts`: placeholder script package.

The product has no URL router despite declaring Wouter. `currentView` strings select dashboard, directory, admin, and `profile-<id>` views. Product data starts in `INITIAL_STARTUPS`, is read/written directly through `localStorage`, and never calls the generated API client. Child views own filter/form/tab state and call mutation callbacks supplied by `App`.

## Validation results

| Command/check | Result |
| --- | --- |
| `git branch --show-current`; `git status --short --branch` | `main`; clean and tracking `origin/main` before docs. |
| `pnpm install --frozen-lockfile` | Passed on Windows after replacing the shell-only guard and restoring host-selected optional native packages. |
| `pnpm run typecheck:libs` | Passed. |
| `pnpm run typecheck` | Passed for the API server, mockup sandbox, product frontend, and scripts. |
| `pnpm run build` | Passed on Windows without `PORT` or `BASE_PATH`; both Vite applications and the API server bundled successfully. |
| Clean temporary copy: frozen install and root build | Passed without copied `node_modules` or a local pnpm store. |
| `pnpm --filter @workspace/api-server run build` | Passed outside the sandbox after sandboxed esbuild spawning returned EPERM. |
| `pnpm run lint` | Passed across maintained `.js`, `.mjs`, `.cjs`, `.ts`, and `.tsx` files. |
| Tests | No test runner, test script, or test files found. |
| Deployed reference | Loaded dashboard/sidebar content; title was `TERMINAL - Solana Institutional VC`; no warning/error console entries were captured during the read-only check. |

The lint baseline uses root flat configuration with ESLint's recommended JavaScript rules, non-type-aware `typescript-eslint` rules, React/JSX and Hooks correctness rules, and dedicated unused-import detection. Type-aware linting is deferred because the existing TypeScript build already provides project-wide semantic checks and parser services would add configuration and runtime cost. `@eslint/js` supplies core rules; `typescript-eslint` parses and checks TypeScript; `eslint-plugin-react` and `eslint-plugin-react-hooks` cover React correctness; `eslint-plugin-unused-imports` reliably reports unused imports/variables; and `globals` defines browser and Node runtime names.

Initial linting reported 14 errors: two unnecessary runtime toast action maps were replaced by type-only declarations; six ternary handler expressions, two `cmdk-input-wrapper` attributes, and one literal quotation pair were retained through narrowly fitted rule options; and two explicit `any` sorter values remain deferred to task 2.3. Generated API/Zod output and the mockup preview's generated discovery module are excluded rather than edited.

## Strengths

- **Low — Verified.** Evidence: `pnpm-lock.yaml`, `pnpm-workspace.yaml`, root `preinstall`. Impact: one package-manager source of truth and minimum-release-age supply-chain control. Recommendation: retain the guard, but make its implementation cross-platform. Address now as part of baseline stabilization.
- **Low — Verified.** Evidence: `tsconfig.base.json` enables `noImplicitAny`, strict null checks, unknown catch variables, no implicit returns, and project references. Impact: a useful shared type-safety floor already exists. Recommendation: restore a green baseline before tightening additional options. Address now.
- **Low — Verified.** Evidence: `lib/api-spec/orval.config.ts`, generated packages, `artifacts/api-server/src/routes/health.ts`. Impact: contract generation and runtime response validation have clear source-of-truth boundaries. Recommendation: preserve generated-file discipline. Deferred until product/API integration is requested.
- **Low — Verified.** Evidence: `lib/api-client-react/src/custom-fetch.ts` handles base URLs, auth token injection, content negotiation, empty bodies, structured errors, and parse errors. Impact: stronger-than-average HTTP behavior is ready for future integration. Recommendation: add focused unit tests before product adoption. Deferred to testing phase.
- **Low — Verified.** Evidence: product components consistently use domain `Startup` props and theme tokens. Impact: the UI is understandable despite component size, and the deployed reference renders without captured console errors. Recommendation: decompose incrementally without visual changes. Deferred to component phase.

## Findings

“Verified” means demonstrated by code, command output, or the deployed check. “Hypothesis” means further runtime/product confirmation is required.

### Reliability and potential bugs

| Severity / status | Evidence | Impact | Recommended action | Timing |
| --- | --- | --- | --- | --- |
| **High — Resolved 2026-07-20** | `App.tsx` now explicitly handles the no-cleanup effect path; `AdminDirectoryView.tsx` uses an SVG `<title>` child supported by Lucide. | Full TypeScript validation is green. | Preserve these fixes and keep the full typecheck required. | Resolved. |
| **High — Resolved 2026-07-20** | Root `preinstall` now runs `scripts/enforce-pnpm.mjs`; native-package exclusion overrides were removed and the lockfile contains cross-platform optional packages. | Frozen installation and production builds pass on Windows without weakening pnpm enforcement or release-age controls. | Keep native packages optional and validate supported operating systems in CI when available. | Resolved on Windows; Linux/macOS execution remains a CI recommendation. |
| **Medium — Verified** | `Header.tsx` updates `searchQuery`; `App.tsx:131-135` only switches views; `ActiveRaisesView` receives no global query and initializes `localSearch` to empty. | Global search appears to work by navigating but does not filter results. | Pass a typed query into Active Raises or centralize directory filter state; add a regression test. | Address now as a documented bug, after baseline tests exist. |
| **Medium — Verified** | `ActiveRaisesView.tsx:263-307` maps every processed record; `rowsPerPage` and `currentPage` only affect controls/labels at lines 319-352; total pages is hardcoded to 5. | Pagination and rows-per-page controls are nonfunctional and misleading. | Derive total pages, clamp/reset page, and render a sliced page. | Address now as a documented bug. |
| **Medium — Verified** | `App.tsx:12-18` and `31-39` accept any valid JSON from `localStorage`; downstream code assumes `Startup[]`/`string[]`. | Structurally invalid or stale persisted data can cause crashes, `NaN`, or corrupt UI state. | Define Zod schemas/versioning and validate/migrate or fall back safely at the storage boundary. | Address in type-safety phase. |
| **Medium — Verified** | `DashboardView.tsx:32` falls back to `startups[0]` and immediately dereferences it; admin deletion can remove every startup. | Deleting the final record produces a deterministic dashboard crash. | Add an explicit empty state and define post-delete navigation/selection behavior. | Address now with a regression test. |
| **Medium — Verified** | `DashboardView.tsx:32` selects any `featured` record without checking `status`; the create form permits a featured draft. | A draft/archived record can be publicly featured in the dashboard. | Define and test featured eligibility; filter by published status while preserving current valid fixture behavior. | Address after baseline tests. |
| **Low — Verified** | `ActiveRaisesView.tsx:93` sorts `closesIn` display strings lexicographically. | Time ordering can be incorrect across mixed day/hour formats and `CLOSED`. | Model a sortable closing instant/status separately from the display label. | Deferred to data-model cleanup. |
| **Low — Verified** | `AdminDirectoryView.tsx:70` generates one of 9,000 random IDs without collision checking. | Duplicate React keys, favorites, and profile routes are possible over time. | Centralize collision-safe ID generation or let a future persistence layer assign IDs. | Deferred; low scale today. |
| **Low — Verified** | `AdminDirectoryView.tsx:79-81` uses `parseFloat(...) || default` and no finite/range checks. | Negative/infinite financial values may enter state; zero silently becomes a default. | Validate the complete form with typed constraints and visible field errors. | Address in validation phase. |

### Maintainability and separation of concerns

| Severity / status | Evidence | Impact | Recommended action | Timing |
| --- | --- | --- | --- | --- |
| **High — Partially resolved 2026-07-21** | Root ESLint 9 flat config and `pnpm run lint` now cover maintained workspace code; no test script/runner/files exist. | Static correctness and maintainability checks now protect the baseline, but behavioral regressions remain untested. | Preserve the lint command and add the separately planned test baseline before decomposition. | Lint resolved; tests remain task 1.5. |
| **Medium — Verified** | `AdminDirectoryView.tsx` 522 lines, `ProfileView.tsx` 513, `DashboardView.tsx` 441, `ActiveRaisesView.tsx` 365, `App.tsx` 245. | Presentation, transformations, validation, and control state are difficult to test/review independently. | Extract pure domain/storage helpers first, then small visual sections with characterization tests. | Deferred to phases 3–4; no big-bang rewrite. |
| **Medium — Verified** | Money/category/status formatting and filtering are repeated across the four view components. | Rules can drift (for example money precision and category matching already differ). | Inventory current outputs, add pure helpers with explicit variants, migrate one call site per change. | Deferred until tests exist. |
| **Medium — Verified** | `artifacts/terminal-vc/src/types.ts` combines interfaces and roughly 350 lines of fixtures; `App.tsx` directly reads/writes storage and owns domain mutations. | Domain contracts, sample content, persistence, and orchestration are coupled. | Split types, fixtures, validated storage adapter, and pure mutation functions without changing data. | Address incrementally in phases 2–3. |
| **Medium — Verified** | Product declares Wouter, TanStack Query, and generated client dependencies but imports none; `pages/not-found.tsx` has no static reference; API/database are not connected. | Architectural intent is unclear and dependency/build surface is larger than current behavior. | Document whether URL routing/API persistence are future requirements; verify runtime/build conventions before removing any package or file. | Investigation now; removals deferred. |
| **Low — Verified** | The product and mockup sandbox contain 55 same-named UI files; 50 pairs are byte-identical. | Boilerplate is duplicated and can drift, but sandbox generation conventions may require copies. | Determine generator ownership and import constraints before proposing consolidation. | Deferred; do not delete based on similarity alone. |
| **Low — Hypothesis** | Many product `components/ui` modules have no obvious static path from `main.tsx`; mockup discovery is dynamic. | Potential dead code/dependencies increase maintenance and bundle install surface. | Use an import-graph/bundle analysis that understands aliases and dynamic generation; remove only verified unreachable modules in isolated changes. | Deferred to dead-code phase. |

### Performance

| Severity / status | Evidence | Impact | Recommended action | Timing |
| --- | --- | --- | --- | --- |
| **Medium — Verified** | `App.tsx:67-75` updates both TPS and time every second at the root. | Every visible view receives a parent render each second, including large tables/forms. | Isolate the ticker in a small component/hook and measure before/after with React profiling. | Deferred to component phase; behavior must remain one-second updates. |
| **Low — Verified** | Inter is loaded in `index.html`, while `index.css` imports Google Fonts including Inter again. | Duplicate font requests/declarations and CSS `@import` can delay rendering. | Establish one nonduplicated font-loading path and compare screenshots/metrics. | Deferred; visual regression risk. |
| **Low — Hypothesis** | Large dependency/UI surface and many unused-looking primitives; no bundle report is configured. | Client bundle may contain avoidable code, though Vite tree-shaking may remove most modules. | Capture actual bundle sizes/import graph before dependency cleanup. | Deferred to final quality review. |

### Accessibility

| Severity / status | Evidence | Impact | Recommended action | Timing |
| --- | --- | --- | --- | --- |
| **Medium — Verified** | Sort headers are clickable `div`s (`ActiveRaisesView.tsx:214-259`); admin rows/status use click handlers on `tr`/`span`; logo/user blocks use clickable `div`s. | Keyboard users cannot reliably operate key interactions and semantics are absent. | Use buttons/links or add complete keyboard and ARIA semantics while preserving layout. | Address incrementally with component changes. |
| **Medium — Verified** | Admin create overlay (`AdminDirectoryView.tsx:308-518`) lacks dialog semantics, focus trapping/restoration, and Escape handling. | Keyboard/screen-reader modal interaction is fragile. | Adopt the existing Dialog primitive or implement equivalent accessible behavior with focused tests. | Address in component phase. |
| **Low — Verified** | Images frequently use generic alt text such as `Logo Asset`; icon-only actions depend on `title`; notification indicator has no textual state. | Screen-reader context is weak. | Add contextual accessible names and mark decorative icons appropriately. | Incremental, alongside touched components. |

### Security and external-data boundaries

| Severity / status | Evidence | Impact | Recommended action | Timing |
| --- | --- | --- | --- | --- |
| **Medium — Verified** | Browser storage is treated as trusted domain data; URL fields from stored/created records are rendered into images/links. | Local tampering or schema drift can inject unwanted remote requests/URLs and destabilize rendering. This is not currently a cross-user server compromise. | Validate and normalize persisted external data; restrict accepted URL schemes/fields. | Address in type-safety phase. |
| **Low — Verified** | `artifacts/api-server/src/app.ts` enables unrestricted `cors()`; Vite uses `allowedHosts: true`. | If the API gains sensitive endpoints or development server is exposed, broad origins/hosts increase attack surface. | Define deployment-specific allowlists before adding authenticated/data-changing endpoints. | Deferred while API is health-only; mandatory before expansion. |
| **Low — Verified** | Fonts and many seeded images load from Google-hosted origins; `referrerPolicy="no-referrer"` is set on inspected images. | Availability/privacy depends on third parties; no CSP is committed. | Inventory required origins and add deployment headers/CSP when hosting policy is known. | Deferred pending deployment configuration. |
| **Low — Hypothesis** | UI presents admin, ledger, investment, and “system secure” actions, but all are client-side simulations with no auth. | Users could mistake prototype affordances for secured/financial operations depending on product positioning. | Confirm product status and ensure simulated actions remain clearly communicated; do not invent authentication in a refactor. | Needs product clarification; deferred. |

## Testing gaps

Highest-value missing coverage is: storage parsing/migration; startup create/delete/status/favorite mutations; empty dataset; global/local search; category/platform/raise filters; typed sorting and pagination; featured eligibility; investment validation; pseudo-route/profile resolution; API health response; custom fetch success/error/body parsing; and basic keyboard/modal accessibility. Visual regression coverage is warranted before breaking apart the four large views.

## Unclear or risky areas

- The actual Vercel build/deployment settings are external; no committed Vercel config explains whether the API deploys or which optional `BASE_PATH` it supplies.
- The mockup sandbox and copied UI files may be generator-owned. Their lifecycle must be established before consolidation.
- It is unclear whether the generated API/database packages are deliberate future scaffolding or abandoned code.
- No environment example documents `PORT`, `BASE_PATH`, `DATABASE_URL`, or `LOG_LEVEL`; no secrets were inspected or modified.
