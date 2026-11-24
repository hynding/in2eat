import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findEntry, slugParams } from "@/domains/content/repository";
import { RecipeDetail } from "@/domains/recipes/components/RecipeDetail";

type Props = { readonly params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = slugParams("recipes");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipe = findEntry("recipes", (await params).slug);
  return recipe ? { title: recipe.title, description: recipe.summary } : {};
}

export default async function RecipePage({ params }: Props) {
  const recipe = findEntry("recipes", (await params).slug);
  if (!recipe) notFound();
  return <RecipeDetail recipe={recipe} />;
}
