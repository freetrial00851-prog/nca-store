"use client";

import Link from "next/link";
import { useState } from "react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { isClientDemoMode } from "@/lib/checkout-client";

export default function LogoutPage() {
  const [loading, setLoading] = useState(false);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  async function handleLogout() {
    setLoading(true);
    try {
      if (!isClientDemoMode()) {
        await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
      }
      clearWishlist();
      window.location.assign("/");
    } catch {
      window.location.assign("/");
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <LogOut className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-2">Log Out</h1>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to sign out?
        </p>
        <div className="space-y-3">
          <Button type="button" className="w-full" disabled={loading} onClick={handleLogout}>
            {loading ? "Signing out..." : "Log Out"}
          </Button>
          <Link href="/account">
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
