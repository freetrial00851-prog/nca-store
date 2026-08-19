import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getAdminCategories } from "@/app/actions/admin";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Categories</h1>
        <Link href="/admin/categories/new">
          <Button>Add Category</Button>
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-muted-foreground">No categories yet. Add your first one.</p>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Sort</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    {category.image_url ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image src={category.image_url} alt={category.name} fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted" />
                    )}
                  </td>
                  <td className="p-4 font-medium">{category.name}</td>
                  <td className="p-4 text-muted-foreground">{category.slug}</td>
                  <td className="p-4 text-muted-foreground">{category.sort_order}</td>
                  <td className="p-4">
                    <div className="flex gap-2 items-start">
                      <Link href={`/admin/categories/${category.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
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
