/** Validates content and writes the search index before Next.js builds. */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadContent } from "@in2eat/content-schema/node";
import { buildIndex } from "@in2eat/search-index";
import { contentToDocuments } from "@in2eat/search-index/content";
import { contentDir, publicDir } from "./paths.mjs";

const index = buildIndex(contentToDocuments(loadContent(contentDir)));
writeFileSync(join(publicDir, "search-index.json"), JSON.stringify(index));
console.log(`prebuild: indexed ${index.documents.length} documents, ${index.terms.length} terms`);
