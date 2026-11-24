import type { z } from "zod";
import { DeliverySchema, type Delivery } from "./delivery.js";
import { RecipeSchema, type Recipe } from "./recipe.js";
import { TakeoutSchema, type Takeout } from "./takeout.js";

/**
 * The registry of content collections. Adding a collection means adding a schema
 * and one entry here; the loader, validator CLI and search indexer pick it up.
 */
export const collections = {
  recipes: RecipeSchema,
  takeout: TakeoutSchema,
  delivery: DeliverySchema,
} as const satisfies Record<string, z.ZodType>;

export type CollectionName = keyof typeof collections;
export const collectionNames = Object.keys(collections) as CollectionName[];

export interface CollectionEntryMap {
  recipes: Recipe;
  takeout: Takeout;
  delivery: Delivery;
}

/** A validated entry with its identity, derived from the file name. */
export type Entry<C extends CollectionName = CollectionName> = CollectionEntryMap[C] & {
  readonly slug: string;
  readonly collection: C;
};

export type ContentStore = { [C in CollectionName]: Entry<C>[] };
