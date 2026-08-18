import { AccountSidebar } from "@/components/account/account-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { NewsletterForm } from "@/components/account/newsletter-form";
import { getProfile } from "@/app/actions/profile";

export default async function NewsletterPage() {
  const profile = await getProfile();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Newsletter" },
        ]}
        className="mb-6"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1 max-w-lg">
          <h1 className="font-serif text-3xl font-bold mb-6">Newsletter Preferences</h1>
          <NewsletterForm profile={profile} />
        </div>
      </div>
    </div>
  );
}
