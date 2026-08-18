"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LayoutDashboard, Package, ShoppingBag, Tag, Users } from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 bg-[#2D4A3E] text-white shrink-0 hidden md:flex md:flex-col">
        <div className="p-6">
          <Link href="/admin" className="font-serif text-xl font-bold">
            NCA Admin
          </Link>
        </div>
        <nav className="px-3 space-y-1 flex-1">
          {adminNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white">
            ← Back to Store
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-[#2D4A3E] text-white px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="font-serif font-bold">
            NCA Admin
          </Link>
          <button type="button" onClick={() => setOpen(true)} aria-label="Open admin menu">
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-72 bg-[#2D4A3E] text-white p-4">
              <div className="flex justify-between items-center mb-6">
                <span className="font-serif font-bold">Menu</span>
                <button type="button" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {adminNav.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm hover:bg-white/10"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
                <Link href="/" onClick={() => setOpen(false)} className="block px-3 py-3 text-sm text-white/70">
                  ← Back to Store
                </Link>
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
