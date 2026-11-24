import type { Entry } from "@in2eat/content-schema";
import { humanize } from "@/shared/lib/format";
import { Card } from "@/shared/ui/Card";
import { Chip, ChipList } from "@/shared/ui/Chip";
import { formatMinutes, totalMinutes } from "../lib/time";

export function RecipeCard({ recipe }: { readonly recipe: Entry<"recipes"> }) {
  return (
    <Card
      href={`/recipes/${recipe.slug}/`}
      title={recipe.title}
      accent="recipe"
      eyebrow={`${humanize(recipe.course)} · ${formatMinutes(totalMinutes(recipe.time))}`}
      footer={
        recipe.diet.length > 0 && (
          <ChipList>{recipe.diet.map((d) => <Chip key={d} tone="recipe">{humanize(d)}</Chip>)}</ChipList>
        )
      }
    >
      <p>{recipe.summary}</p>
    </Card>
  );
}
