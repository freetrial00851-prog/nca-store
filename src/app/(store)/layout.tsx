import { TopBar } from "@/components/layout/top-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DemoModeBanner } from "@/components/layout/demo-mode-banner";
import { StoreProviders } from "@/components/layout/store-providers";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import type { AuthSessionUser } from "@/hooks/use-auth";

async function getInitialUser(): Promise<AuthSessionUser> {
  if (isDemoMode()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? { id: user.id, email: user.email } : null;
}

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await getInitialUser();

  return (
    <>
      <DemoModeBanner />
      <TopBar />
      <Header initialUser={initialUser} />
      <main className="flex-1 bg-nca-cream">{children}</main>
      <Footer />
      <StoreProviders />
    </>
  );
}
