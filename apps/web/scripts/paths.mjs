import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const webDir = join(dirname(fileURLToPath(import.meta.url)), "..");
export const repoRoot = join(webDir, "..", "..");
export const contentDir = join(repoRoot, "content");
export const publicDir = join(webDir, "public");
export const outDir = join(webDir, "out");
