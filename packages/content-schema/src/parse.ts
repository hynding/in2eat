import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { slugPattern } from "./common.js";
import { collections, type CollectionName, type Entry } from "./collections.js";

export type ParseResult<C extends CollectionName> =
  | { ok: true; entry: Entry<C> }
  | { ok: false; errors: string[] };

const formatIssues = (error: z.ZodError): string[] =>
  error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`);

/** Parses and validates one YAML document. Pure: usable in Node and the browser. */
export function parseEntry<C extends CollectionName>(
  collection: C,
  slug: string,
  source: string,
): ParseResult<C> {
  if (!slugPattern.test(slug)) {
    return { ok: false, errors: [`file name "${slug}" must be lowercase-kebab-case`] };
  }

  let raw: unknown;
  try {
    raw = parseYaml(source);
  } catch (error) {
    return { ok: false, errors: [`invalid YAML: ${(error as Error).message}`] };
  }

  const result = collections[collection].safeParse(raw);
  if (!result.success) return { ok: false, errors: formatIssues(result.error) };

  return { ok: true, entry: { ...(result.data as object), slug, collection } as Entry<C> };
}
