/**
 * Generates out/sw.js from the exported files: the service worker template
 * plus a precache list and a version derived from the build's content.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { outDir, webDir } from "./paths.mjs";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const precacheable = /\.(html|js|css|json|svg|png|webp|woff2|txt)$/;
const excluded = [/^sw\.js$/, /\.map$/, /^404\//];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(outDir)
  .map((file) => relative(outDir, file).split(sep).join("/"))
  .filter((file) => precacheable.test(file) && !excluded.some((re) => re.test(file)))
  .sort();

const hash = createHash("sha256");
for (const file of files) hash.update(file).update(readFileSync(join(outDir, file)));
const version = hash.digest("hex").slice(0, 12);

const toUrl = (file) => `${basePath}/${file.replace(/(^|\/)index\.html$/, "$1")}`;
const template = readFileSync(join(webDir, "scripts", "sw-template.js"), "utf8");
const sw = template
  .replace("__VERSION__", version)
  .replace("__BASE_PATH__", basePath)
  .replace("__PRECACHE__", JSON.stringify(files.map(toUrl)));

writeFileSync(join(outDir, "sw.js"), sw);
console.log(`postbuild: service worker ${version} precaches ${files.length} files`);
