import { TopBar } from "./top-bar";
import { Header } from "./header";
import { Footer } from "./footer";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1 bg-[#FAF8F5]">{children}</main>
      <Footer />
    </>
  );
}
