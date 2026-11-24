import { z } from "zod";
import { EntryMeta, Url } from "./common.js";

export const Diet = z.enum([
  "vegetarian", "vegan", "pescatarian", "gluten-free", "dairy-free", "nut-free", "halal", "kosher",
]);

export const Course = z.enum(["breakfast", "starter", "main", "side", "dessert", "snack", "drink", "sauce"]);

export const Ingredient = z.object({
  name: z.string().trim().min(1),
  quantity: z.number().positive().optional(),
  unit: z.string().trim().optional(),
  note: z.string().trim().optional(),
});
export type Ingredient = z.infer<typeof Ingredient>;

export const IngredientGroup = z.object({
  group: z.string().trim().optional(),
  items: z.array(Ingredient).min(1),
});

export const RecipeSchema = z.object({
  ...EntryMeta,
  cuisine: z.string().trim().toLowerCase().optional(),
  course: Course,
  diet: z.array(Diet).default([]),
  servings: z.number().int().positive(),
  time: z.object({
    prep: z.number().int().nonnegative().describe("minutes"),
    cook: z.number().int().nonnegative().default(0).describe("minutes"),
  }),
  ingredients: z.array(IngredientGroup).min(1),
  steps: z.array(z.string().trim().min(1)).min(1),
  source: z.object({ name: z.string().trim(), url: Url.optional() }).optional(),
});
export type Recipe = z.infer<typeof RecipeSchema>;
