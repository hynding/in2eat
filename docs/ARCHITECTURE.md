# In2Eat architecture and plan

In2Eat is a Progressive Web App that serves **recipes**, **takeout menus** and **food and drink delivery services**. It is a fully static site: every page is generated at build time from YAML content, search runs in the browser, and the few dynamic features (location, submissions, settings sync) talk directly to third-party APIs from the client.

## Goals and constraints

- Static output only (`next build` with `output: "export"`), hostable on any static host.
- Content is data: schema-validated YAML in `content/`, one file per entry.
- Search is built at build time and queried entirely in the browser.
- Works offline once visited (service worker + web app manifest).
- Themeable, fluid layouts with CSS3 custom properties driven by design tokens.
- Clean code: small modules, one responsibility each, domain-driven folders, typed boundaries, tests for pure logic.

## Monorepo layout (pnpm workspaces)

```
in2eat/
├── apps/
│   └── web/                     Next.js App Router, static export, PWA
│       ├── scripts/             prebuild (search index) and postbuild (service worker)
│       └── src/
│           ├── app/             routes only: thin files that compose domain components
│           ├── domains/
│           │   ├── content/     server-side access to validated content
│           │   ├── recipes/     cards, detail view, scaling and formatting
│           │   ├── takeout/     cards, menus, opening hours
│           │   ├── delivery/    cards, coverage checks
│           │   ├── location/    geolocation, distance, OpenStreetMap map, geocoding
│           │   ├── search/      index loading, search box, results, facet filters
│           │   ├── submissions/ GitHub issue and pull-request flows
│           │   └── settings/    preferences, theme, storage providers (local, Google Drive)
│           └── shared/          UI primitives and helpers with no domain knowledge
├── packages/
│   ├── content-schema/          Zod schemas, YAML parser, loader and `in2eat-validate` CLI
│   ├── search-index/            index builder, browser searcher, content→document adapter
│   └── design-tokens/           typed tokens → generated `tokens.css`
├── content/
│   ├── recipes/*.yaml
│   ├── takeout/*.yaml
│   └── delivery/*.yaml
└── docs/
```

Dependencies only point one way: `apps/web → packages/*`, and `search-index → content-schema`. Packages never import the app.

## Content model

Each folder in `content/` is a **collection**, registered once in `packages/content-schema/src/collections.ts`. The file name is the slug (`content/recipes/miso-ramen.yaml` → `/recipes/miso-ramen/`). The loader validates every file, checks cross references (a takeout place's `deliveredBy` must name real delivery services) and fails the build with one message listing every problem.

| Collection | Key fields |
| --- | --- |
| `recipes` | title, summary, cuisine, course, diet[], servings, time {prep, cook}, ingredients (grouped, with quantity/unit), steps[], source |
| `takeout` | title, summary, cuisine[], address, location {lat, lng}, services[], hours[], timeZone, currency, menu (sections → items with price and tags), deliveredBy[] |
| `delivery` | title, summary, kinds[] (food, drink, grocery, alcohol, coffee), website, apps, coverage[] (center + radiusKm), fees |

All entries share `title`, `summary`, `tags`, `updated` and `image`. The same schemas run in the browser to validate user submissions before they reach GitHub.

## Design tokens and theming

`packages/design-tokens` holds **primitives** (palette, spacing, radii, a fluid `clamp()` type scale, motion, layout widths) and **semantic themes** (`light`, `dark`, `garden`) typed against one `ColorTheme` interface. A build step writes `tokens.css`:

- scales on `:root`;
- the light theme by default, dark when the OS prefers it and no theme is pinned;
- every theme under `[data-theme="<name>"]`, set from user settings.

Components use CSS Modules and consume only semantic custom properties (`var(--color-surface)`, `var(--space-md)`). Layouts use CSS Grid with `auto-fill`/`minmax()`, container queries and logical properties, so cards and pages reflow without breakpoints in most places.

## Search

1. **Build time** (`apps/web/scripts/prebuild.mjs`): content → `IndexableDocument`s → `buildIndex()` → `public/search-index.json`. The index is an alphabetically sorted term list with parallel postings of `[documentIndex, weightedFrequency]`, plus display data per document. Field weights: title 6, tags 3, summary 2, body 1.
2. **Run time** (`Searcher`): the same tokenizer (lowercase, accent folding, stop words, light plural stemming) runs on the query. Each word matches exact terms, prefixes (always for the word being typed) and typos (one edit from 4 letters, two from 8, transpositions count as one). Documents must match every word; if none do, it relaxes to any word and says so. Facet filters (kind, course, diet, cuisine, service, offers) and facet counts come from the same pass. Results sort by score; takeout results can re-sort by distance when location is known.

The index is fetched lazily on first use and cached by the service worker.

## PWA

- `app/manifest.ts` produces the web app manifest; icons are SVG.
- `scripts/postbuild.mjs` writes `out/sw.js` with a precache list of every exported HTML page, the search index and static assets, versioned by build hash.
- Strategy: precache app shell and pages, network-first for navigations with cache fallback, cache-first for hashed `_next/static` assets, stale-while-revalidate for OpenStreetMap tiles (bounded).

## Location and maps

- `navigator.geolocation` behind a `useGeolocation` hook; nothing is requested until the user asks.
- A manual fallback geocodes a typed address with OpenStreetMap **Nominatim** (user-triggered only, debounced, one request at a time, per its usage policy).
- Distance uses the haversine formula. Takeout lists sort by distance; delivery services are filtered by whether the user falls inside any coverage circle.
- Maps use **Leaflet** with OpenStreetMap tiles and the required attribution, loaded client-side only via dynamic import.
- The chosen location is stored in settings so it syncs with them.

## Submissions (GitHub Issues and pull requests)

A static site cannot hold a GitHub token, so the default flow needs **no backend** and uses GitHub's own pages:

- **Requests** ("please add X", corrections) open `github.com/<repo>/issues/new?template=request.yml&...` with the issue form fields prefilled. The visitor reviews and submits on GitHub with their own account.
- **Data entry** uses an in-app form per collection. The form builds the YAML, validates it with the shared Zod schema in the browser, then opens `github.com/<repo>/new/main?filename=content/<collection>/<slug>.yaml&value=<yaml>`. GitHub forks the repo for the visitor and walks them into a pull request. If the YAML is too long for a URL, the app copies it to the clipboard and opens the empty new-file page.
- CI validates content on every pull request, so bad data cannot merge.

**Upgrade path (needs a decision and some cost):** a small serverless function (for example a Cloudflare Worker) holding a GitHub App installation token could create issues and PRs on behalf of anonymous visitors. That adds hosting, secrets and spam handling, so it is not built until it is wanted.

## Sign-in and settings sync

Settings (theme, units, default location, favourites) live behind a `SettingsStore` interface:

- `LocalSettingsStore` is always on and uses `localStorage`.
- `GoogleDriveSettingsStore` signs in with **Google Identity Services** (OAuth 2 token model, scope `drive.appdata`) entirely in the browser and saves `settings.json` in the user's hidden Drive **appDataFolder**. It needs only a public OAuth client ID (`NEXT_PUBLIC_GOOGLE_CLIENT_ID`); with none set, the Google option is hidden.

New providers implement the same interface. GitHub sign-in is not offered: its OAuth code exchange needs a server-side secret, which belongs with the optional backend above.

## Hosting and CI

- **GitHub Actions**: `ci.yml` runs install, content validation, type checks, tests and a full static build on pull requests.
- **Deploy**: `deploy.yml` publishes `apps/web/out` to **GitHub Pages** on pushes to `main`. `NEXT_PUBLIC_BASE_PATH` is `/in2eat` for the project page; setting the `CUSTOM_DOMAIN` repository variable serves from the root instead. Pages must be enabled once in the repo settings (Source: GitHub Actions).

## Phases

| Phase | Scope | Exit criteria |
| --- | --- | --- |
| 1. Foundation | monorepo, tokens and themes, schemas and validator CLI, sample content, list and detail pages, static export, manifest and service worker, CI | `pnpm build` exports a browsable, installable site; CI green |
| 2. Search | index builder, searcher, search page with facets, header search box | typo-tolerant, prefix search with filters, offline |
| 3. Location and maps | geolocation, geocoding fallback, distance sort, coverage filter, Leaflet maps on takeout and delivery pages | "near me" works with and without GPS |
| 4. Submissions | issue form templates, request flow, data-entry forms with in-browser validation, PR flow | a visitor can file a request or propose an entry end to end |
| 5. Sign-in and sync | settings model, local store, Google Drive appDataFolder store, settings page | settings round-trip through Drive when a client ID is configured |

## Decisions that need the owner

| Decision | Default chosen | Why it needs a yes |
| --- | --- | --- |
| Hosting | GitHub Pages | Free, but must be enabled in repo settings |
| Submission backend | None (GitHub prefilled URLs) | A proxy adds hosting cost, secrets and spam handling |
| Google OAuth client | Feature hidden until configured | Needs a Google Cloud project and an OAuth client ID registered to the site's origin |
