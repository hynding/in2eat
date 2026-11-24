import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCss } from "./to-css.js";

const outFile = join(dirname(fileURLToPath(import.meta.url)), "..", "css", "tokens.css");
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, buildCss());
console.log(`design-tokens: wrote ${outFile}`);
