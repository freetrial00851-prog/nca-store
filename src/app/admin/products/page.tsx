import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { getAdminProducts } from "@/lib/data/products";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>Add New Pattern</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground">No products yet. Add your first pattern.</p>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">PDF</th>
                <th className="p-4">Images</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{product.title}</td>
                  <td className="p-4 text-muted-foreground">
                    {product.category?.name ?? product.skill_level}
                  </td>
                  <td className="p-4">{formatPrice(product.sale_price ?? product.price)}</td>
                  <td className="p-4">
                    <Badge variant={product.file_url ? "success" : "outline"}>
                      {product.file_url ? "Uploaded" : "Missing"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={product.images?.length ? "success" : "outline"}>
                      {product.images?.length ? `${product.images.length}` : "Missing"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={product.is_active ? "success" : "outline"}>
                      {product.is_active ? "Active" : "Draft"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <DeleteProductButton productId={product.id} productTitle={product.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
