import { DeliveryCard } from "@/domains/delivery/components/DeliveryCard";
import { getContent } from "@/domains/content/repository";
import { RecipeCard } from "@/domains/recipes/components/RecipeCard";
import { TakeoutCard } from "@/domains/takeout/components/TakeoutCard";
import { CardGrid } from "@/shared/ui/Card";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Section } from "@/shared/ui/Section";

const FEATURED = 3;

export default function HomePage() {
  const { recipes, takeout, delivery } = getContent();

  return (
    <>
      <PageHeader
        eyebrow="Cook, collect or get it delivered"
        title="What are you in to eat?"
        lead="Recipes for tonight, takeout menus near you, and the delivery services that reach your door."
      />
      <Section title="Recipes" moreHref="/recipes/">
        <CardGrid>{recipes.slice(0, FEATURED).map((r) => <RecipeCard key={r.slug} recipe={r} />)}</CardGrid>
      </Section>
      <Section title="Takeout" moreHref="/takeout/">
        <CardGrid>{takeout.slice(0, FEATURED).map((p) => <TakeoutCard key={p.slug} place={p} />)}</CardGrid>
      </Section>
      <Section title="Delivery" moreHref="/delivery/">
        <CardGrid>{delivery.slice(0, FEATURED).map((s) => <DeliveryCard key={s.slug} service={s} />)}</CardGrid>
      </Section>
    </>
  );
}
