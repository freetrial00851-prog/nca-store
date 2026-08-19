import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { getAdminCategories, updateCategory } from "@/app/actions/admin";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = await getAdminCategories();
  const category = categories.find((c) => c.id === id);

  if (!category) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Edit Category</h1>
      <CategoryForm category={category} action={updateCategory.bind(null, id)} submitLabel="Save Changes" />
    </div>
  );
}
