import "server-only";
import { join } from "node:path";
import type { CollectionName, ContentStore, Entry } from "@in2eat/content-schema";
import { loadContent } from "@in2eat/content-schema/node";

/** Next.js runs the build from apps/web, so content sits two levels up. */
const contentDir = join(process.cwd(), "..", "..", "content");

let cache: ContentStore | undefined;

/** Loads and validates all content once per build process. Server components only. */
export function getContent(): ContentStore {
  cache ??= loadContent(contentDir);
  return cache;
}

export function listEntries<C extends CollectionName>(collection: C): Entry<C>[] {
  return getContent()[collection];
}

export function findEntry<C extends CollectionName>(collection: C, slug: string): Entry<C> | undefined {
  return listEntries(collection).find((entry) => entry.slug === slug);
}

export const slugParams = (collection: CollectionName) => () =>
  getContent()[collection].map(({ slug }) => ({ slug }));
