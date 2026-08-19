"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { deleteCategory, type FormActionState } from "@/app/actions/admin";

const initialState: FormActionState = {};

export function DeleteCategoryButton({ categoryId, categoryName }: { categoryId: string; categoryName: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: FormActionState) => deleteCategory(categoryId),
    initialState
  );

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(`Delete category "${categoryName}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
      className="inline-block"
    >
      <Button type="submit" variant="outline" size="sm" disabled={pending} className="text-red-600 hover:text-red-700">
        {pending ? "Deleting..." : "Delete"}
      </Button>
      {state.error && <p className="text-xs text-red-600 mt-1 max-w-[200px]">{state.error}</p>}
    </form>
  );
}
