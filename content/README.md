# Content

All site data lives here as YAML, one file per entry. The file name (lowercase-kebab-case) is the entry's slug and URL.

| Folder      | Schema                                          | URL                  |
| ----------- | ----------------------------------------------- | -------------------- |
| `recipes/`  | `packages/content-schema/src/recipe.ts`         | `/recipes/<slug>/`   |
| `takeout/`  | `packages/content-schema/src/takeout.ts`        | `/takeout/<slug>/`   |
| `delivery/` | `packages/content-schema/src/delivery.ts`       | `/delivery/<slug>/`  |

Validate locally with `pnpm validate:content`. CI runs the same check on every pull request.

The entries shipped today are **fictional samples** used to exercise the schemas and UI.
