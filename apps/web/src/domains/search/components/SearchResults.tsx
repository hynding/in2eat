import type { SearchResult } from "@in2eat/search-index";
import { pluralize } from "@/shared/lib/format";
import { Card, CardGrid } from "@/shared/ui/Card";
import { Chip, ChipList } from "@/shared/ui/Chip";
import styles from "./Search.module.css";

const kindLabels: Record<string, { label: string; tone: "recipe" | "takeout" | "delivery" }> = {
  recipe: { label: "Recipe", tone: "recipe" },
  takeout: { label: "Takeout", tone: "takeout" },
  delivery: { label: "Delivery", tone: "delivery" },
};

export function SearchResults({ result, query }: { readonly result: SearchResult; readonly query: string }) {
  if (result.total === 0) {
    return <p className={styles.summary}>Nothing matches “{query}”. Try fewer words or clear a filter.</p>;
  }

  return (
    <>
      <p className={styles.summary}>
        {pluralize(result.total, "result")}
        {result.relaxed && " matching some of your words"}
      </p>
      <CardGrid>
        {result.hits.map(({ document }) => {
          const kind = kindLabels[document.kind] ?? { label: document.kind, tone: "recipe" as const };
          return (
            <Card
              key={document.id}
              href={document.url}
              title={document.title}
              accent={kind.tone}
              footer={<ChipList><Chip tone={kind.tone}>{kind.label}</Chip></ChipList>}
            >
              <p>{document.summary}</p>
            </Card>
          );
        })}
      </CardGrid>
    </>
  );
}
