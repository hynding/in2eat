import type { Metadata } from "next";
import { SearchPage } from "@/domains/search/components/SearchPage";
import { PageHeader } from "@/shared/ui/PageHeader";

export const metadata: Metadata = { title: "Search" };

export default function Search() {
  return (
    <>
      <PageHeader title="Search" lead="Recipes, takeout menus and delivery services, all in one place. Works offline." />
      <SearchPage />
    </>
  );
}
