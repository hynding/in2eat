import type { Metadata } from "next";
import { SettingsPanel } from "@/domains/settings/components/SettingsPanel";
import { PageHeader } from "@/shared/ui/PageHeader";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" lead="Make In2Eat yours. Sign in to keep your settings on every device." />
      <SettingsPanel />
    </>
  );
}
