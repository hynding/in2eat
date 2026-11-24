#!/usr/bin/env node
import { resolve } from "node:path";
import { collectionNames } from "./collections.js";
import { ContentValidationError, loadContent } from "./node.js";

const contentDir = resolve(process.argv[2] ?? "content");

try {
  const store = loadContent(contentDir);
  const summary = collectionNames.map((name) => `${store[name].length} ${name}`).join(", ");
  console.log(`✓ content valid: ${summary}`);
} catch (error) {
  if (!(error instanceof ContentValidationError)) throw error;
  console.error(error.message);
  process.exitCode = 1;
}
