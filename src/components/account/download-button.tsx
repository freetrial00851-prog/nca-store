"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getSecureDownloadUrl } from "@/app/actions/downloads";
import { toast } from "sonner";

export function DownloadButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const result = await getSecureDownloadUrl(productId);
      if (result.error) {
        toast.error(result.error);
      } else if ("demo" in result && result.demo) {
        toast.success(`Demo download: ${result.title}. Connect Supabase storage for live PDFs.`);
      } else if (result.url) {
        window.open(result.url, "_blank");
        toast.success("Download started");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" onClick={handleDownload} disabled={loading}>
      {loading ? "Generating..." : "Download"}
    </Button>
  );
}
