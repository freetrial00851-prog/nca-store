"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Download,
  Heart,
  Star,
  MapPin,
  Settings,
  Mail,
  LogOut,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { performLogout } from "@/lib/logout-client";

const navItems = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Downloads", href: "/account/downloads", icon: Download },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Reviews", href: "/account/reviews", icon: Star },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Account Settings", href: "/account/settings", icon: Settings },
  { label: "Newsletter", href: "/account/newsletter", icon: Mail },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await performLogout();
  }

  return (
    <aside className="space-y-4">
      <nav className="rounded-xl border border-border/60 bg-white p-2 shadow-sm">
        {navItems.map((item) => {
          const isActive =
            item.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#E8EFE9] text-[#2D4A3E]"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-muted/50 hover:text-red-700 disabled:opacity-60"
        >
          <LogOut className="size-4 shrink-0" />
          {loggingOut ? "Signing out..." : "Log Out"}
        </button>
      </nav>

      <div className="rounded-xl border border-[#E8EFE9] bg-[#E8EFE9]/40 p-5">
        <div className="flex items-center gap-2 text-[#2D4A3E]">
          <Headphones className="size-5" />
          <p className="font-medium">Need Help?</p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;re here for you!
        </p>
        <Link href="/contact" className="mt-4 block">
          <Button className="w-full bg-[#2D4A3E] hover:bg-[#23392E]">
            Contact Support
          </Button>
        </Link>
      </div>
    </aside>
  );
}
