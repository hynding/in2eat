"use client";

import { useMemo, useState } from "react";
import { collectionNames, parseEntry, type CollectionName } from "@in2eat/content-schema";
import { Button } from "@/shared/ui/Button";
import { MAX_URL_LENGTH, newFileUrl } from "../lib/github";
import { collectionLabels, entryTemplates, slugify } from "../lib/templates";
import styles from "./Submit.module.css";

/**
 * Data entry: the visitor edits YAML starting from a template, the shared
 * schema validates it live, and GitHub turns the new file into a pull request.
 */
export function EntryForm() {
  const [collection, setCollection] = useState<CollectionName>("recipes");
  const [source, setSource] = useState(entryTemplates.recipes);
  const [slugOverride, setSlugOverride] = useState("");
  const [notice, setNotice] = useState<string>();

  const titleSlug = slugify(/^title:\s*(.+)$/m.exec(source)?.[1] ?? "");
  const slug = slugOverride || titleSlug;
  const result = useMemo(() => parseEntry(collection, slug || "untitled", source), [collection, slug, source]);
  const path = `content/${collection}/${slug}.yaml`;

  function chooseCollection(next: CollectionName) {
    setCollection(next);
    setSource(entryTemplates[next]);
    setSlugOverride("");
    setNotice(undefined);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!result.ok || !slug) return;
    const message = `Add ${collectionLabels[collection].toLowerCase()}: ${slug}`;
    let url = newFileUrl(path, source, message);
    if (url.length > MAX_URL_LENGTH) {
      await navigator.clipboard.writeText(source);
      url = newFileUrl(path, undefined, message);
      setNotice("Your entry is too long for a link, so it's on your clipboard. Paste it into the file on GitHub.");
    }
    window.open(url, "_blank", "noopener");
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <fieldset className={styles.segmented}>
        <legend>What are you adding?</legend>
        {collectionNames.map((name) => (
          <label key={name}>
            <input type="radio" name="collection" checked={collection === name} onChange={() => chooseCollection(name)} />
            <span>{collectionLabels[name]}</span>
          </label>
        ))}
      </fieldset>

      <label>
        <span>Entry (YAML)</span>
        <textarea
          className={styles.code}
          rows={18}
          spellCheck={false}
          value={source}
          onChange={(e) => setSource(e.target.value)}
          aria-describedby="entry-status"
        />
      </label>

      <label>
        <span>File name</span>
        <input value={slug} onChange={(e) => setSlugOverride(slugify(e.target.value))} placeholder="from the title" />
      </label>

      <div id="entry-status" className={styles.validation} data-valid={result.ok} role="status">
        {result.ok ? (
          <p>Looks good. This will be saved as <code>{path}</code>.</p>
        ) : (
          <>
            <p>Fix these before sending:</p>
            <ul>{result.errors.map((e) => <li key={e}>{e}</li>)}</ul>
          </>
        )}
      </div>

      {notice && <p className={styles.hint} role="alert">{notice}</p>}
      <p className={styles.hint}>
        GitHub will copy the project to your account and open a pull request. A maintainer reviews it before it goes live.
      </p>
      <Button type="submit" disabled={!result.ok || !slug}>Propose on GitHub</Button>
    </form>
  );
}
