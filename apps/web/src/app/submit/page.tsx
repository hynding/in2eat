import type { Metadata } from "next";
import { EntryForm } from "@/domains/submissions/components/EntryForm";
import { RequestForm } from "@/domains/submissions/components/RequestForm";
import styles from "@/domains/submissions/components/Submit.module.css";
import { PageHeader } from "@/shared/ui/PageHeader";

export const metadata: Metadata = { title: "Contribute" };

export default function SubmitPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contribute"
        title="Help fill the menu"
        lead="Ask for something to be added, or add it yourself. Everything is reviewed on GitHub before it appears."
      />
      <div className={styles.panels}>
        <section className={styles.panel} aria-labelledby="request-heading">
          <h2 id="request-heading">Make a request</h2>
          <p>Suggest a recipe, place or service, or tell us something is wrong. It becomes a GitHub issue.</p>
          <RequestForm />
        </section>
        <section className={styles.panel} aria-labelledby="entry-heading">
          <h2 id="entry-heading">Add an entry</h2>
          <p>Write the entry yourself. It's checked as you type and becomes a pull request.</p>
          <EntryForm />
        </section>
      </div>
    </>
  );
}
