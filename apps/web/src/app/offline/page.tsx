import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/shared/ui/PageHeader";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <PageHeader title="You're offline" lead="This page hasn't been saved for offline use yet.">
      <p>Pages you've visited before still work. <Link href="/">Go home</Link></p>
    </PageHeader>
  );
}
