"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart, User, ShoppingBag, Menu, LayoutGrid, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { cn } from "@/lib/utils";
import { useAuthSession, type AuthSessionUser } from "@/hooks/use-auth";
import { buildAuthLoginUrl } from "@/lib/auth-intent";
import { useMounted } from "@/hooks/use-mounted";

const navLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/category/amigurumi", label: "Amigurumi" },
  { href: "/category/wearables", label: "Wearables" },
  { href: "/category/bags-totes", label: "Bags & Totes" },
  { href: "/category/home-decor", label: "Home Decor" },
  { href: "/category/baby-kids", label: "Baby & Kids" },
  { href: "/category/seasonal", label: "Seasonal" },
  { href: "/free-patterns", label: "Free Patterns" },
  { href: "/bundles", label: "Bundles" },
  { href: "/blog", label: "Blog" },
  { href: "/sale", label: "Sale", highlight: true },
];

const categoryLinks = navLinks.filter((l) => l.href.startsWith("/category"));

function IconAction({
  href,
  icon: Icon,
  label,
  count,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
}) {
  return (
    <Link href={href} className="flex flex-col items-center gap-0.5 px-2 py-1 hover:text-nca-green transition-colors group">
      <div className="relative">
        <Icon className="h-5 w-5 text-nca-charcoal group-hover:text-nca-green" />
        {count !== undefined && count > 0 && (
          <span className="absolute -top-2 -right-2 h-4 min-w-4 px-0.5 rounded-full bg-nca-green text-white text-[10px] font-bold flex items-center justify-center">
            {count}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium text-muted-foreground group-hover:text-nca-green hidden sm:block">
        {label}
      </span>
    </Link>
  );
}

function CartIconAction({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 px-2 py-1 hover:text-nca-green transition-colors group"
      aria-label="Open cart"
    >
      <div className="relative">
        <ShoppingBag className="h-5 w-5 text-nca-charcoal group-hover:text-nca-green" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 h-4 min-w-4 px-0.5 rounded-full bg-nca-green text-white text-[10px] font-bold flex items-center justify-center">
            {count}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium text-muted-foreground group-hover:text-nca-green hidden sm:block">
        Cart
      </span>
    </button>
  );
}

export function Header({ initialUser }: { initialUser?: AuthSessionUser }) {
  const pathname = usePathname();
  const mounted = useMounted();
  const { user, loading: authLoading, isAuthenticated } = useAuthSession(initialUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const cartCount = useCartStore((s) => s.getItemCount());
  const openDrawer = useCartStore((s) => s.openDrawer);
  const wishlistCount = useWishlistStore((s) => s.getItemCount());

  const displayCartCount = mounted ? cartCount : 0;
  const displayWishlistCount = mounted ? wishlistCount : 0;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[72px] gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/" className="font-serif text-3xl font-bold text-nca-green tracking-tight">
                NCA
              </Link>
              <button
                type="button"
                onClick={() => setCategoriesOpen(true)}
                className="hidden md:flex items-center gap-2 bg-nca-green hover:bg-nca-green-dark text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-md transition-colors"
              >
                <LayoutGrid className="h-4 w-4" />
                Categories
              </button>
            </div>

            <nav className="hidden xl:flex items-center gap-4 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap transition-colors hover:text-nca-green",
                    link.highlight ? "text-red-600 hover:text-red-700" : "text-nca-charcoal",
                    pathname === link.href && "text-nca-green"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 shrink-0">
              <IconAction href="/account/wishlist" icon={Heart} label="Wishlist" count={displayWishlistCount} />
              {!authLoading && isAuthenticated ? (
                <IconAction href="/account" icon={User} label="Account" />
              ) : (
                <IconAction
                  href={buildAuthLoginUrl({ returnTo: "/account" })}
                  icon={User}
                  label="Sign In"
                />
              )}
              <CartIconAction count={displayCartCount} onClick={openDrawer} />
              <button
                type="button"
                className="xl:hidden p-2 ml-1"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-serif text-xl font-bold text-nca-green">Menu</span>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    link.highlight ? "text-red-600" : "text-nca-charcoal hover:bg-nca-sage/50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Categories panel */}
      {categoriesOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCategoriesOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-serif text-xl font-bold text-nca-green">Categories</span>
              <button type="button" onClick={() => setCategoriesOpen(false)} aria-label="Close categories">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setCategoriesOpen(false)}
                  className="block px-3 py-3 rounded-lg text-sm font-medium text-nca-charcoal hover:bg-nca-sage/50"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/shop"
                onClick={() => setCategoriesOpen(false)}
                className="block px-3 py-3 rounded-lg text-sm font-semibold text-nca-green hover:bg-nca-sage/50"
              >
                Shop All Patterns →
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
