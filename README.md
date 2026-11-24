# In2Eat

A Progressive Web App for **recipes**, **takeout menus** and **food and drink delivery services**, generated as a static site from schema-validated YAML.

- `apps/web`: Next.js (App Router, static export) PWA
- `packages/content-schema`: Zod schemas, YAML loader and validator CLI
- `packages/search-index`: build-time search index and in-browser searcher
- `packages/design-tokens`: typed design tokens compiled to CSS custom properties
- `content/`: the data, one YAML file per entry

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the design and phased plan.

## Getting started

Requires Node 22+ and pnpm 10.

```sh
pnpm install
pnpm dev               # http://localhost:3000
pnpm build             # static site in apps/web/out
pnpm test              # unit tests
pnpm validate:content  # check every YAML file against its schema
```

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Path prefix when served from a sub-path, e.g. `/in2eat` on GitHub Pages |
| `NEXT_PUBLIC_GITHUB_REPO` | `owner/name` that submissions open issues and pull requests against (default `hynding/in2eat`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Enables Google sign-in and Drive settings sync |

## Contributing content

Add a YAML file under `content/<collection>/`, or use the **Contribute** page on the site, which validates your entry and opens a pull request for you. See [content/README.md](content/README.md).
