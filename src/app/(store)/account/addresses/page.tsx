import { AccountSidebar } from "@/components/account/account-sidebar";
import { AddressesManager } from "@/components/account/addresses-manager";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getAddresses } from "@/app/actions/addresses";

export default async function AddressesPage() {
  const addresses = await getAddresses();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "My Account", href: "/account" },
          { label: "Addresses" },
        ]}
        className="mb-6"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <AddressesManager initialAddresses={addresses} />
        </div>
      </div>
    </div>
  );
}
