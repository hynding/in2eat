import type { ContentStore, Entry } from "@in2eat/content-schema";
import type { IndexableDocument } from "./types.js";

/** Maps validated content into search documents. The only place that knows both shapes. */

const join = (...parts: (string | undefined)[]): string => parts.filter(Boolean).join(" ");

function recipeDocument(recipe: Entry<"recipes">): IndexableDocument {
  const ingredients = recipe.ingredients.flatMap((g) => g.items.map((i) => i.name));
  return {
    id: `recipes/${recipe.slug}`,
    kind: "recipe",
    title: recipe.title,
    summary: recipe.summary,
    url: `/recipes/${recipe.slug}/`,
    text: {
      title: recipe.title,
      tags: join(...recipe.tags, ...recipe.diet, recipe.cuisine, recipe.course),
      summary: recipe.summary,
      body: join(...ingredients, ...recipe.steps),
    },
    facets: {
      kind: ["recipe"],
      course: [recipe.course],
      diet: recipe.diet,
      cuisine: recipe.cuisine ? [recipe.cuisine] : [],
    },
  };
}

function takeoutDocument(place: Entry<"takeout">): IndexableDocument {
  const dishes = place.menu.flatMap((s) => s.items.map((i) => join(i.name, i.description, ...i.tags)));
  return {
    id: `takeout/${place.slug}`,
    kind: "takeout",
    title: place.title,
    summary: place.summary,
    url: `/takeout/${place.slug}/`,
    text: {
      title: place.title,
      tags: join(...place.tags, ...place.cuisine, ...place.services),
      summary: join(place.summary, place.address.city),
      body: join(...place.menu.map((s) => s.section), ...dishes),
    },
    facets: { kind: ["takeout"], cuisine: place.cuisine, service: place.services, city: [place.address.city] },
    geo: place.location,
  };
}

function deliveryDocument(service: Entry<"delivery">): IndexableDocument {
  return {
    id: `delivery/${service.slug}`,
    kind: "delivery",
    title: service.title,
    summary: service.summary,
    url: `/delivery/${service.slug}/`,
    text: {
      title: service.title,
      tags: join(...service.tags, ...service.kinds),
      summary: service.summary,
      body: service.coverage.map((c) => c.label).join(" "),
    },
    facets: { kind: ["delivery"], offers: service.kinds },
  };
}

export function contentToDocuments(store: ContentStore): IndexableDocument[] {
  return [
    ...store.recipes.map(recipeDocument),
    ...store.takeout.map(takeoutDocument),
    ...store.delivery.map(deliveryDocument),
  ];
}
