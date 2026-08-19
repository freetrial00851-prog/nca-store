import { TopBar } from "@/components/layout/top-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DemoModeBanner } from "@/components/layout/demo-mode-banner";
import { StoreProviders } from "@/components/layout/store-providers";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoModeBanner />
      <TopBar />
      <Header />
      <main className="flex-1 bg-nca-cream">{children}</main>
      <Footer />
      <StoreProviders />
    </>
  );
}
