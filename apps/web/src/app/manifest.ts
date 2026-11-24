import type { MetadataRoute } from "next";
import { themes } from "@in2eat/design-tokens";
import { withBasePath } from "@/shared/lib/base-path";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "In2Eat",
    short_name: "In2Eat",
    description: "Recipes, takeout menus and delivery services.",
    start_url: withBasePath("/"),
    scope: withBasePath("/"),
    display: "standalone",
    background_color: themes.light.bg,
    theme_color: themes.light.accent,
    categories: ["food", "lifestyle"],
    icons: [
      { src: withBasePath("/icons/icon.svg"), sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: withBasePath("/icons/maskable.svg"), sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Recipes", url: withBasePath("/recipes/") },
      { name: "Takeout near me", url: withBasePath("/takeout/") },
      { name: "Search", url: withBasePath("/search/") },
    ],
  };
}
