import Link from "next/link";
import { PageHeader } from "@/shared/ui/PageHeader";

export default function NotFound() {
  return (
    <PageHeader title="Nothing on the menu here" lead="That page doesn't exist.">
      <p><Link href="/search/">Search instead</Link></p>
    </PageHeader>
  );
}
