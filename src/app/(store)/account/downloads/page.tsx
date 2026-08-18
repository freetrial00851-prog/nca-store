import { AccountSidebar } from "@/components/account/account-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { DownloadButton } from "@/components/account/download-button";
import { ProductImage } from "@/components/products/product-image";
import { formatDate } from "@/lib/utils";
import { getUserDownloads } from "@/app/actions/downloads";

export default async function DownloadsPage() {
  const downloads = await getUserDownloads();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Downloads" },
        ]}
        className="mb-6"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold mb-6">My Downloads</h1>

          {downloads.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">No downloads yet. Purchase a pattern to get started!</p>
          ) : (
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                    <th className="p-4">Product</th>
                    <th className="p-4 hidden sm:table-cell">Date Purchased</th>
                    <th className="p-4 hidden md:table-cell">Downloads</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map(({ product, purchased_at, download_count }) => (
                    <tr key={product.id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0">
                            <ProductImage slug={product.slug} alt={product.title} sizes="40px" />
                          </div>
                          <span className="font-medium">{product.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden sm:table-cell">
                        {formatDate(purchased_at)}
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{download_count}×</td>
                      <td className="p-4">
                        <DownloadButton productId={product.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
