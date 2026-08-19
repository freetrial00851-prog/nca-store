"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin error]", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="font-serif text-2xl font-bold mb-2 text-red-600">Something went wrong</h1>
      <p className="text-sm text-muted-foreground mb-4">
        This is the real error message (visible only in the admin panel):
      </p>
      <pre className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 whitespace-pre-wrap break-words mb-6">
        {error.message}
        {error.digest ? `\n\ndigest: ${error.digest}` : ""}
      </pre>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
