# Current Architecture

This document describes the repository as it exists on 2026-07-20. It does not describe a replacement architecture.

## Runtime units

1. **Product SPA — `artifacts/terminal-vc`.** React 19 mounts `App` from `src/main.tsx`. Vite/Tailwind build the static client. The deployed reference presents this interface.
2. **API server — `artifacts/api-server`.** Express mounts a health router at `/api`; the only route is `GET /api/healthz`. It is bundled independently with esbuild.
3. **Mockup sandbox — `artifacts/mockup-sandbox`.** A separate Vite application dynamically discovers generated preview modules. It is tooling, not a route in the product SPA.
4. **Workspace libraries.** OpenAPI is the health-contract source; Orval generates React Query and Zod packages. The API uses the Zod response schema. The product declares but does not import the React Query client. The Drizzle package has no tables and is not used by the health route.

## Product route/page structure

There is one HTML entry and no URL-backed router. `App.currentView` selects:

| View key | Rendered component | Entry points |
| --- | --- | --- |
| `dashboard` | `DashboardView` | initial state, header/sidebar Live |
| `active-raises` | `ActiveRaisesView` | header/sidebar, global search side effect |
| `admin-directory` | `AdminDirectoryView` | header/sidebar, settings/user controls |
| `profile-<startup id>` | `ProfileView` if the ID resolves | table/hero/favorite row selection |
| anything else | `DashboardView` | default fallback |

`src/pages/not-found.tsx` exists but is not wired into this view system. Browser refreshes do not encode or restore the selected view.

## Component hierarchy

```text
main.tsx
└── App
    ├── Sidebar
    ├── Header
    ├── main
    │   ├── DashboardView
    │   ├── ActiveRaisesView
    │   ├── AdminDirectoryView
    │   └── ProfileView
    ├── footer
    └── inline toast
```

The four view components render their sections/tables/forms directly. `components/ui` contains Radix/shadcn-style primitives, but the main product views mostly use direct HTML/Tailwind markup.

## Data flow and state ownership

`INITIAL_STARTUPS` and `INITIAL_RESEARCH_ITEMS` in `src/types.ts` are fixture sources. On first render, `App` reads startup/favorite JSON directly from browser storage or falls back to fixtures/default favorite IDs. Effects write changes back to `terminal_vc_startups` and `terminal_vc_favorites`.

`App` owns:

- startup collection and create/delete/status/investment mutations;
- favorites;
- current pseudo-route and selected startup;
- global search text;
- toast state;
- simulated TPS and UTC footer time.

Views receive data and callbacks. They own transient UI state:

- Dashboard: category filter.
- Active Raises: local query, filters, live-only flag, sort, page label, and rows-per-page selection.
- Admin: status filter, action menu, modal visibility, and every create-form field.
- Profile: active tab, investment input, and temporary success message.

Profile rendering resolves the current ID from the authoritative startup collection; the separate `selectedStartup` state is used only to synchronize mutation callbacks and is not the render source.

## Transformations and presentation

Filtering, sorting, money formatting, percentage calculation, and create-form parsing live inside view components. Similar formatting rules are implemented separately in Dashboard, Active Raises, and Profile. Most user actions are synchronous client-state changes or simulated toasts; research/social/document links are placeholders.

Styling uses Tailwind 4 utilities and CSS theme tokens in `src/index.css`. The app imports Cormorant Garamond, Inter, and Fira Code from Google Fonts; Inter is also linked in `index.html`. Seeded images are remote URLs. The product is desktop-first with selected mobile adaptations and a sidebar hidden below the `md` breakpoint.

## External integrations and environment

- Product runtime: browser `localStorage`, Google Fonts, and remote Google image assets. No product API request is made.
- API runtime: Express/Pino; unrestricted CORS; generated Zod health response.
- Database: `DATABASE_URL` is checked when `lib/db/src/index.ts` loads; no schema or query path exists.
- Build/dev: product and mockup Vite configs accept optional `PORT` and `BASE_PATH` values, otherwise using Vite's port and `/` base defaults; optional Replit plugins load in non-production Replit environments.
- Deployment: `.replit` describes Replit autoscale. The referenced Vercel deployment configuration is not present in the repository.

## Important boundaries

- `lib/api-spec/openapi.yaml` is the contract source; generated output should not be manually edited.
- The product SPA and API server are independently built and currently uncoupled.
- The mockup sandbox is a separate tooling artifact with dynamic generation conventions.
- Browser persistence is currently the product's data-access boundary, although it is implemented directly inside `App`.
- `Startup` is the shared product-domain shape, but it currently shares a file with fixtures.

## Known architectural weaknesses

- String-based navigation is not type-safe and has no URL/deep-link/404 semantics.
- Root orchestration combines persistence, mutations, navigation, global UI, and a one-second ticker.
- Large views mix domain rules and presentation.
- Storage and form inputs are not schema-validated.
- Search and pagination state are split in ways that leave controls nonfunctional.
- The API/client/database scaffolding adds conceptual and dependency surface without serving the product.
- Product and sandbox contain extensive duplicated UI primitives.
- There is no automated lint/test or visual regression boundary.

## Modest recommended improvements

These are incremental directions, not a target rewrite:

1. Restore green typecheck/build and add minimal lint/test baselines.
2. Introduce typed view identifiers and pure, tested transformation/mutation functions.
3. Put validated `localStorage` access behind a small adapter while retaining identical keys/data behavior.
4. Isolate the one-second ticker and toast lifecycle from domain/view orchestration.
5. Decompose one view section at a time after characterization tests/screenshots exist.
6. Decide whether URL routing, API persistence, and the database scaffold are real requirements before adopting or removing them.
7. Verify generator ownership before consolidating duplicated UI primitives.

See `REFACTOR_PLAN.md` for task-sized sequencing and `CURRENT_STATE_AUDIT.md` for evidence and severity.
