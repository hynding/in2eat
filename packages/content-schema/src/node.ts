import { readdirSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { collectionNames, type CollectionName, type ContentStore, type Entry } from "./collections.js";
import { parseEntry } from "./parse.js";

export interface ContentError {
  readonly file: string;
  readonly errors: string[];
}

export class ContentValidationError extends Error {
  constructor(readonly failures: ContentError[]) {
    super(
      `Content validation failed:\n${failures
        .map((f) => `  ${f.file}\n${f.errors.map((e) => `    - ${e}`).join("\n")}`)
        .join("\n")}`,
    );
  }
}

const isYaml = (file: string): boolean => [".yaml", ".yml"].includes(extname(file));

function listYamlFiles(dir: string): string[] {
  try {
    return readdirSync(dir).filter(isYaml).sort();
  } catch {
    return [];
  }
}

function loadCollection<C extends CollectionName>(
  contentDir: string,
  collection: C,
  failures: ContentError[],
): Entry<C>[] {
  const dir = join(contentDir, collection);
  return listYamlFiles(dir).flatMap((file) => {
    const slug = basename(file, extname(file));
    const result = parseEntry(collection, slug, readFileSync(join(dir, file), "utf8"));
    if (result.ok) return [result.entry];
    failures.push({ file: join(collection, file), errors: result.errors });
    return [];
  });
}

function crossReferenceErrors(store: ContentStore): ContentError[] {
  const deliverySlugs = new Set(store.delivery.map((d) => d.slug));
  return store.takeout.flatMap((place) => {
    const missing = place.deliveredBy.filter((slug) => !deliverySlugs.has(slug));
    return missing.length === 0
      ? []
      : [{ file: `takeout/${place.slug}.yaml`, errors: missing.map((s) => `deliveredBy: unknown delivery service "${s}"`) }];
  });
}

/** Reads and validates every collection. Throws one error listing every problem found. */
export function loadContent(contentDir: string): ContentStore {
  const failures: ContentError[] = [];
  const store = Object.fromEntries(
    collectionNames.map((name) => [name, loadCollection(contentDir, name, failures)]),
  ) as unknown as ContentStore;

  failures.push(...crossReferenceErrors(store));
  if (failures.length > 0) throw new ContentValidationError(failures);
  return store;
}
