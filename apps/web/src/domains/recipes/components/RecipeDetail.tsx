import type { Entry } from "@in2eat/content-schema";
import { humanize } from "@/shared/lib/format";
import { Chip, ChipList } from "@/shared/ui/Chip";
import { PageHeader } from "@/shared/ui/PageHeader";
import { formatMinutes, totalMinutes } from "../lib/time";
import { Ingredients } from "./Ingredients";
import styles from "./RecipeDetail.module.css";

interface RecipeDetailProps {
  readonly recipe: Entry<"recipes">;
  /** Slot for page-level actions such as saving to favourites. */
  readonly actions?: React.ReactNode;
}

export function RecipeDetail({ recipe, actions }: RecipeDetailProps) {
  const facts = [
    ["Prep", formatMinutes(recipe.time.prep)],
    ["Cook", formatMinutes(recipe.time.cook)],
    ["Total", formatMinutes(totalMinutes(recipe.time))],
    ["Serves", String(recipe.servings)],
  ] as const;

  return (
    <article>
      <PageHeader eyebrow={humanize(recipe.course)} title={recipe.title} lead={recipe.summary}>
        {actions}
        <ChipList>
          {recipe.cuisine && <Chip>{humanize(recipe.cuisine)}</Chip>}
          {recipe.diet.map((d) => <Chip key={d} tone="recipe">{humanize(d)}</Chip>)}
          {recipe.tags.map((t) => <Chip key={t}>#{t}</Chip>)}
        </ChipList>
      </PageHeader>

      <dl className={styles.facts}>
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.layout}>
        <Ingredients groups={recipe.ingredients} servings={recipe.servings} />
        <section aria-labelledby="method-heading">
          <h2 id="method-heading">Method</h2>
          <ol className={styles.steps}>
            {recipe.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>
      </div>

      {recipe.source && (
        <p className={styles.source}>
          Source: {recipe.source.url ? <a href={recipe.source.url}>{recipe.source.name}</a> : recipe.source.name}
        </p>
      )}
    </article>
  );
}
