import { CategoryForm } from "@/components/admin/category-form";
import { createCategory } from "@/app/actions/admin";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Add Category</h1>
      <CategoryForm action={createCategory} submitLabel="Create Category" />
    </div>
  );
}
