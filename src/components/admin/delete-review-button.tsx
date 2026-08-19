"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { deleteReview, type FormActionState } from "@/app/actions/admin";

const initialState: FormActionState = {};

export function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: FormActionState) => deleteReview(reviewId),
    initialState
  );

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("Delete this review?")) e.preventDefault();
      }}
    >
      <Button type="submit" variant="outline" size="sm" disabled={pending} className="text-red-600 hover:text-red-700">
        {pending ? "Deleting..." : "Delete"}
      </Button>
      {state.error && <p className="text-xs text-red-600 mt-1">{state.error}</p>}
    </form>
  );
}
