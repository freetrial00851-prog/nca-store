import { AccountSidebar } from "@/components/account/account-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SettingsForm } from "@/components/account/settings-form";
import { getProfile } from "@/app/actions/profile";

export default async function SettingsPage() {
  const profile = await getProfile();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: "Account Settings" }]} className="mb-6" />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold mb-1">Account Settings</h1>
          <p className="text-muted-foreground mb-8">Update your account information and preferences.</p>
          <SettingsForm profile={profile} />
        </div>
      </div>
    </div>
  );
}
