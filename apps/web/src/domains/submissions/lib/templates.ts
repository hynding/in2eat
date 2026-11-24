import type { CollectionName } from "@in2eat/content-schema";

export const collectionLabels: Readonly<Record<CollectionName, string>> = {
  recipes: "Recipe",
  takeout: "Takeout place",
  delivery: "Delivery service",
};

/** Starting YAML for each collection: every required field, with comments as guidance. */
export const entryTemplates: Readonly<Record<CollectionName, string>> = {
  recipes: `title: My recipe
summary: One or two sentences that make someone want to cook it.
cuisine: italian            # optional
course: main                # breakfast, starter, main, side, dessert, snack, drink, sauce
diet: [vegetarian]          # vegetarian, vegan, pescatarian, gluten-free, dairy-free, nut-free, halal, kosher
tags: [quick]
servings: 4
time: { prep: 10, cook: 20 } # minutes
ingredients:
  - items:
      - { name: olive oil, quantity: 2, unit: tbsp }
      - { name: onion, quantity: 1, note: diced }
steps:
  - First step.
  - Second step.
`,
  takeout: `title: Place name
summary: What they're known for, in a sentence.
cuisine: [thai]
tags: []
address: { street: 1 Main St, city: Portland, region: OR, postalCode: "97201", country: US }
location: { lat: 45.5152, lng: -122.6784 }   # right-click the place on openstreetmap.org → "Show address"
phone: "+1 503 555 0100"                     # optional
website: https://example.com                 # optional
services: [pickup]                           # pickup, dine-in, delivery, drive-thru
hours:
  - { days: [mon, tue, wed, thu, fri], open: "11:00", close: "21:00" }
currency: USD
deliveredBy: []                              # slugs of delivery services on In2Eat
menu:
  - section: Mains
    items:
      - { name: Dish name, description: "What's in it.", price: 12, tags: [] }
`,
  delivery: `title: Service name
summary: What they deliver and what makes them different.
kinds: [food]               # food, drink, grocery, alcohol, coffee
tags: []
website: https://example.com
coverage:
  - { label: City name, center: { lat: 45.5152, lng: -122.6784 }, radiusKm: 10 }
fees: { delivery: "$2.99", minimumOrder: "$15" }   # optional, free text
`,
};

/** "Lantern Noodle House" → "lantern-noodle-house" */
export const slugify = (text: string): string =>
  text
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
