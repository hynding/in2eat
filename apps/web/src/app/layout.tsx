import type { Metadata, Viewport } from "next";
import { themes } from "@in2eat/design-tokens";
import { HeaderSearch } from "@/domains/search/components/HeaderSearch";
import { AccountSyncProvider } from "@/domains/settings/components/AccountSync";
import { SettingsProvider } from "@/domains/settings/components/SettingsProvider";
import { withBasePath } from "@/shared/lib/base-path";
import { ServiceWorkerRegistration } from "@/shared/pwa/ServiceWorkerRegistration";
import { themeBootstrapScript } from "@/shared/pwa/theme-script";
import { SiteHeader } from "@/shared/ui/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "In2Eat", template: "%s · In2Eat" },
  description: "Recipes to cook, takeout menus nearby, and delivery services that reach you.",
  applicationName: "In2Eat",
  icons: { icon: withBasePath("/icons/icon.svg"), apple: withBasePath("/icons/apple-touch-icon.png") },
  appleWebApp: { capable: true, title: "In2Eat", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themes.light.bg },
    { media: "(prefers-color-scheme: dark)", color: themes.dark.bg },
  ],
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        <SettingsProvider>
          <AccountSyncProvider>
            <a href="#main" className="skip-link">Skip to content</a>
            <SiteHeader search={<HeaderSearch />} />
            <main id="main" className="page">{children}</main>
            <footer className="site-footer">
              <div>
                In2Eat is open content. Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.
              </div>
            </footer>
          </AccountSyncProvider>
        </SettingsProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
