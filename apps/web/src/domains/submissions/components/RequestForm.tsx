"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { issueFormUrl } from "../lib/github";
import styles from "./Submit.module.css";

const kinds = [
  "Add a recipe",
  "Add a takeout place",
  "Add a delivery service",
  "Fix or update an existing entry",
  "Idea for the site",
] as const;

/** Collects a request and hands it to GitHub's issue form, prefilled. */
export function RequestForm() {
  const [kind, setKind] = useState<string>(kinds[0]);
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [link, setLink] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const page = document.referrer.startsWith(window.location.origin) ? document.referrer : "";
    const url = issueFormUrl("request.yml", { kind, subject, details, link, page }, `[Request] ${subject}`);
    window.open(url, "_blank", "noopener");
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label>
        <span>What would you like?</span>
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          {kinds.map((k) => <option key={k}>{k}</option>)}
        </select>
      </label>
      <label>
        <span>Name of the dish, place or service</span>
        <input required value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <label>
        <span>Details</span>
        <textarea required rows={4} value={details} onChange={(e) => setDetails(e.target.value)} />
      </label>
      <label>
        <span>Link (optional)</span>
        <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" />
      </label>
      <p className={styles.hint}>This opens a prefilled issue on GitHub. You'll need a free GitHub account to send it.</p>
      <Button type="submit">Continue on GitHub</Button>
    </form>
  );
}
