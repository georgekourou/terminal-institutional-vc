# Incremental Refactor Plan

The plan preserves the deployed appearance and current behavior except for verified bugs explicitly named below. Each task should be a separate, reviewable change; do not combine phases into a rewrite.

## Phase 1 — Baseline and stabilization

| Task | Exact scope / likely files | Reason and expected benefit | Risk / dependencies | Validation | Behavior that must remain unchanged |
| --- | --- | --- | --- | --- | --- |
| 1.1 Fix the two TypeScript baseline errors | `artifacts/terminal-vc/src/App.tsx` toast effect; accessible label around `AdminDirectoryView.tsx` top-tier icon | Make `pnpm run typecheck` green without suppression or casts. | Low; none. | Full typecheck, root build where environment permits, visual check of admin badge/toast expiry. | Toast timing and badge appearance/text meaning. |
| 1.2 Make package-manager guard portable | Root `package.json`; a small script under `scripts/src` only if needed | Frozen install currently fails on Windows because `sh` is assumed. | Medium; decide supported OS and keep pnpm-only enforcement/minimum release age. | Clean-environment frozen install on supported OSes; typecheck. | pnpm remains mandatory; no dependency versions change. |
| 1.3 Resolve native platform override policy | `pnpm-workspace.yaml` overrides for esbuild/Rollup/Tailwind oxide | Current Windows Vite builds cannot load excluded native packages. | Medium; depends on supported deployment/development platforms; lockfile change may result and must be isolated. | Frozen install and builds on every supported OS; inspect lockfile diff. | Linux deployment output and supply-chain guardrails. |
| 1.4 Add minimal lint baseline | Root manifest/config and workspace source globs | No lint check exists. Add dependencies only with written justification. | Medium; tasks 1.1β€“1.3; initial violations must be fixed, not disabled. | New lint command, full typecheck/build. | Runtime and visuals; generated files excluded intentionally, not rewritten. |
| 1.5 Add test harness and smoke baseline | Root/product test config; smoke tests for initial render and view switching | Provides regression protection before structural changes. | Medium; dependency justification required. | New test command plus typecheck/build. | Initial dashboard content and navigation labels. |

## Phase 2 — Type safety and validation

| Task | Exact scope / likely files | Reason and expected benefit | Risk / dependencies | Validation | Behavior that must remain unchanged |
| --- | --- | --- | --- | --- | --- |
| 2.1 Type navigation identifiers | `App.tsx`, `Header.tsx`, `Sidebar.tsx`, view prop types; new small navigation type/helper | Replace free-form strings and fragile profile parsing with discriminated helpers. | Medium; Phase 1 tests. | Unit tests for view parse/format; typecheck; all navigation smoke tests. | Same in-memory views, no URL routing yet. |
| 2.2 Validate/version persisted state | New product storage schema/adapter; `App.tsx`; domain schemas near product types | Prevent structurally valid-but-wrong JSON from crashing the app. | Medium; define fallback/migration policy; Zod already present. | Tests for valid, malformed, stale, and partial storage; typecheck/build. | Existing keys, valid saved data, fixture fallback, favorites behavior. |
| 2.3 Replace sorter `any` with typed accessors | `ActiveRaisesView.tsx` plus a pure sorting helper | Remove explicit `any` and make each sort field's semantics reviewable. | Low; tests for every field. | Sort unit tests and UI smoke test. | Current ordering except separately approved `closesIn` bug fix. |
| 2.4 Validate create and investment inputs | Pure validators/schema; `AdminDirectoryView.tsx`, `ProfileView.tsx` | Reject non-finite/out-of-range values consistently and make errors testable. | Medium; product rules for allowed ranges may need confirmation. | Boundary tests; form/investment interaction tests; typecheck/build. | Valid submissions, default displayed values, simulated mutation/toasts. |

## Phase 3 — Data-access and business-logic boundaries

| Task | Exact scope / likely files | Reason and expected benefit | Risk / dependencies | Validation | Behavior that must remain unchanged |
| --- | --- | --- | --- | --- | --- |
| 3.1 Extract startup mutations | New pure domain module; mutation bodies from `App.tsx` | Test create/delete/status/investment/favorite rules without React. | Medium; Phase 2 schemas. | Pure unit tests plus existing interaction tests. | Status cycle, insertion order, investment totals, favorite removal on delete. |
| 3.2 Move storage behind a repository hook | Storage adapter from 2.2 plus a focused hook used by `App.tsx` | Separate persistence lifecycle from rendering/orchestration. | Medium; task 3.1. | Storage/hook tests; reload persistence smoke test. | Storage keys, write timing observable to users, initial fixtures. |
| 3.3 Extract query/format transformations | Pure modules for category matching, money variants, progress, Active Raises filtering | Remove repeated rules while documenting intentional output differences. | Medium; characterize current formatting first. | Table-driven unit tests and screenshots. | Exact strings, rounding, category results unless fixing an approved bug. |
| 3.4 Decide product/API boundary | Documentation/ADR only initially; inspect `lib/api-*`, `lib/db`, deployment settings | Avoid accidentally coupling the refactor to an unconfirmed backend migration. | Low implementation risk; needs product/deployment information. | Documentation review; no runtime change. | Product remains localStorage-backed until explicitly authorized. |

## Phase 4 — Component decomposition and reuse

| Task | Exact scope / likely files | Reason and expected benefit | Risk / dependencies | Validation | Behavior that must remain unchanged |
| --- | --- | --- | --- | --- | --- |
| 4.1 Isolate ticker and toast UI | New small hooks/components; `App.tsx`, `Header.tsx`, footer/toast markup | Stop one-second root rerenders and simplify App. | Medium; measure renders before/after. | Fake-timer tests, profiler/render count, screenshot. | Initial labels, one-second cadence, toast duration/position. |
| 4.2 Decompose Active Raises | Filter bar, table, pagination components after transformations are pure | Make verified search/pagination fixes and table behavior testable. | Medium; tasks 3.3 and 6.1 regression tests. | Filter/sort/pagination tests, keyboard checks, screenshots. | Columns, responsive overflow, row navigation, current visual styling. |
| 4.3 Decompose Admin Directory modal/table | Form state hook/schema, accessible dialog, directory table/actions | Reduce 522-line mixed component and fix modal/interactive semantics. | Medium-high visual/focus risk. | Keyboard/focus tests, CRUD/status tests, desktop/mobile screenshots. | Form fields/defaults, action results, modal appearance, simulated upload. |
| 4.4 Decompose Dashboard and Profile sections | One section per change in `DashboardView.tsx` and `ProfileView.tsx` | Improve local readability/reuse without redesign. | Medium; visual regression harness required. | Component tests and screenshots per extraction. | Content order, typography, data formatting, investment/favorite flows. |

## Phase 5 — Duplication and dead-code cleanup

| Task | Exact scope / likely files | Reason and expected benefit | Risk / dependencies | Validation | Behavior that must remain unchanged |
| --- | --- | --- | --- | --- | --- |
| 5.1 Build verified import/dependency inventory | Both artifacts, generated modules, aliases/config, package manifests | Distinguish unused code from dynamically generated/framework-owned code. | Low; must understand mockup plugin generation. | Static graph plus production bundle analysis; manual verification of dynamic entries. | No files removed in this inventory task. |
| 5.2 Remove one verified dead slice at a time | Candidates may include unwired page/UI modules or unused dependencies, only after 5.1 proof | Reduce maintenance/install/bundle surface safely. | Medium; generator and hidden config risk. | Frozen install, lint, typecheck, tests, builds, bundle comparison. | All product and sandbox behavior. |
| 5.3 Decide UI primitive sharing | `artifacts/*/src/components/ui`, sandbox generator/config | 50 byte-identical pairs can drift, but copying may be required. | Medium-high; depends on generator ownership. | Build both artifacts and preview representative primitives. | Product styling and sandbox discovery. |
| 5.4 Split domain fixtures from contracts | `artifacts/terminal-vc/src/types.ts` into types and fixture modules | Clarify ownership of the 410-line mixed file. | Low after import inventory. | Typecheck/tests; fixture snapshot/equality check. | Exact fixture values/order and exported public usage. |

## Phase 6 — Testing and regression protection

| Task | Exact scope / likely files | Reason and expected benefit | Risk / dependencies | Validation | Behavior that must remain unchanged |
| --- | --- | --- | --- | --- | --- |
| 6.1 Cover verified product bugs before fixes | Global search handoff, pagination/rows-per-page, empty deletion, featured draft | Make bug fixes intentional and prevent recurrence. | Low; Phase 1 harness. | Tests must fail before each fix and pass after it. | All behavior outside the named bug. |
| 6.2 Cover persistence and domain rules | Storage adapter, mutations, validation, transformations | Protect highest-value nonvisual logic. | Low after phases 2–3. | Unit/interaction suite with deterministic timers/random IDs. | Current valid-data behavior. |
| 6.3 Cover API and custom fetch | Health route and `custom-fetch.ts` success/error/body cases | Protect existing contract boundary before future adoption. | Medium; may need request/fetch test utilities with justification. | API/fetch tests, generated contract check, typecheck. | Health payload and fetch API surface. |
| 6.4 Add accessibility and visual regression checks | Main views at representative desktop/mobile sizes; admin dialog keyboard path | Protect appearance and operability during decomposition. | Medium; tooling/dependency decision. | Automated accessibility checks plus approved screenshots. | Current design; accessibility fixes may change semantics, not appearance. |

## Phase 7 — Final quality review

| Task | Exact scope / likely files | Reason and expected benefit | Risk / dependencies | Validation | Behavior that must remain unchanged |
| --- | --- | --- | --- | --- | --- |
| 7.1 Measure performance and bundle | Production artifacts, render profile, font/network and bundle reports | Confirm optimizations are evidence-based. | Low; green cross-platform build required. | Compare recorded baseline versus final metrics. | UI cadence, fonts, and visuals unless a measured change is separately approved. |
| 7.2 Security/deployment review | CORS/allowed hosts, CSP/origins, env documentation, Vercel/Replit settings | Bound external origins and prepare API expansion safely. | Medium; requires actual deployment settings/product threat model. | Header/config checks and health smoke test in target environment. | Existing reachable product and required third-party assets. |
| 7.3 Dependency and configuration review | All manifests, catalogs, overrides, tsconfigs, generated workflow | Remove only proven redundancy and document remaining exceptions. | Medium; do not upgrade packages as part of refactor cleanup. | Frozen install, lint, typecheck, tests, all builds/codegen consistency. | Resolved behavior and generated API surface. |
| 7.4 Documentation closeout | `README`/`replit.md`, `AGENTS.md`, all `docs` | Replace placeholders and make actual run/deploy/architecture state discoverable. | Low; depends on deployment answers. | Follow documented clean setup and validation from scratch. | Documentation only. |

## Recommended first implementation task

Start with **1.1: fix the two existing TypeScript errors** in a narrowly scoped change, then run the full typecheck. It is low risk, immediately restores signal to every later task, and requires no product or architecture decision. Do not bundle search, pagination, dependency, or component restructuring into that change.
