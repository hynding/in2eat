import { Searcher, type SerializedIndex } from "@in2eat/search-index";
import { withBasePath } from "@/shared/lib/base-path";

let pending: Promise<Searcher> | undefined;

/** Fetches the prebuilt index once per page load. The service worker keeps it for offline use. */
export function loadSearcher(): Promise<Searcher> {
  pending ??= fetch(withBasePath("/search-index.json"))
    .then((response) => {
      if (!response.ok) throw new Error(`Search index unavailable (${response.status})`);
      return response.json() as Promise<SerializedIndex>;
    })
    .then((index) => new Searcher(index))
    .catch((error: unknown) => {
      pending = undefined;
      throw error;
    });
  return pending;
}
