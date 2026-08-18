"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useMounted } from "@/hooks/use-mounted";
import {
  ShoppingBag,
  Download,
  Heart,
  Star,
  Search,
  Gift,
  MapPin,
  MessageSquare,
} from "lucide-react";

interface Stats {
  totalOrders: number;
  totalDownloads: number;
  rewardPoints: number;
}

export function AccountDashboardClient({ stats }: { stats: Stats }) {
  const mounted = useMounted();
  const wishlistCount = useWishlistStore((s) => s.getItemCount());

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, href: "/account/orders" },
    { label: "Total Downloads", value: stats.totalDownloads, icon: Download, href: "/account/downloads" },
    { label: "Wishlist Items", value: mounted ? wishlistCount : "—", icon: Heart, href: "/account/wishlist" },
    { label: "Reward Points", value: stats.rewardPoints, icon: Star, href: "/account" },
  ];

  const quickLinks = [
    { label: "Browse Patterns", icon: Search, href: "/shop" },
    { label: "Free Patterns", icon: Gift, href: "/free-patterns" },
    { label: "My Downloads", icon: Download, href: "/account/downloads" },
    { label: "Edit Profile", icon: Star, href: "/account/settings" },
    { label: "Addresses", icon: MapPin, href: "/account/addresses" },
    { label: "Contact Support", icon: MessageSquare, href: "/contact" },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Icon className="h-5 w-5 text-nca-green mb-2" />
                <p className="font-serif text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-serif text-lg font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickLinks.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-nca-green hover:bg-nca-sage/30 transition-colors text-center"
              >
                <Icon className="h-5 w-5 text-nca-green" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
