import type { Metadata } from "next";
import { listEntries } from "@/domains/content/repository";
import { RecipeCard } from "@/domains/recipes/components/RecipeCard";
import { CardGrid } from "@/shared/ui/Card";
import { PageHeader } from "@/shared/ui/PageHeader";

export const metadata: Metadata = { title: "Recipes" };

export default function RecipesPage() {
  const recipes = listEntries("recipes");
  return (
    <>
      <PageHeader eyebrow="Cook" title="Recipes" lead={`${recipes.length} recipes, from weeknight dinners to drinks.`} />
      <CardGrid>{recipes.map((r) => <RecipeCard key={r.slug} recipe={r} />)}</CardGrid>
    </>
  );
}
