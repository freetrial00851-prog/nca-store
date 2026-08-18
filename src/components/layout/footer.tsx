import Link from "next/link";
import Image from "next/image";
import { Lock, Headphones, CheckCircle } from "lucide-react";
import { NEWSLETTER_IMAGE } from "@/lib/data/product-images";
import { NewsletterForm } from "@/components/layout/newsletter-form";

const shopLinks = [
  { href: "/shop", label: "All Patterns" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/bestsellers", label: "Bestsellers" },
  { href: "/bundles", label: "Pattern Bundles" },
  { href: "/sale", label: "Sale" },
  { href: "/free-patterns", label: "Free Patterns" },
];

const categoryLinks = [
  { href: "/category/amigurumi", label: "Amigurumi" },
  { href: "/category/wearables", label: "Wearables" },
  { href: "/category/bags-totes", label: "Bags & Totes" },
  { href: "/category/home-decor", label: "Home Decor" },
  { href: "/category/baby-kids", label: "Baby & Kids" },
];

const helpLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact Us" },
  { href: "/shipping", label: "Shipping Info" },
  { href: "/returns", label: "Returns" },
  { href: "/privacy", label: "Privacy Policy" },
];

const accountLinks = [
  { href: "/account", label: "My Account" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/downloads", label: "Downloads" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/settings", label: "Settings" },
];

export function Footer() {
  return (
    <footer className="bg-nca-cream border-t border-border mt-auto">
      {/* Newsletter */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col md:flex-row">
          <div className="relative w-full md:w-72 h-48 md:h-auto shrink-0">
            <Image src={NEWSLETTER_IMAGE} alt="Yarn basket" fill className="object-cover" />
          </div>
          <div className="p-8 flex-1 flex flex-col justify-center">
            <h3 className="font-serif text-2xl font-bold mb-2">Join Our Maker Community</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Get 10% off your next order and be the first to know about new patterns!
            </p>
            <NewsletterForm />
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-nca-green" />
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-3xl font-bold text-nca-green">
              NCA
            </Link>
            <p className="text-sm text-muted-foreground mt-3 mb-4 leading-relaxed">
              Premium crochet patterns for makers of all skill levels. Instant digital downloads.
            </p>
            <div className="flex gap-3 text-xs font-semibold text-muted-foreground">
              {["Instagram", "Pinterest", "TikTok", "Facebook", "YouTube"].map((s) => (
                <span key={s} className="hover:text-nca-green cursor-pointer transition-colors">{s.charAt(0)}</span>
              ))}
            </div>
          </div>

          {[
            { title: "Shop", links: shopLinks },
            { title: "Categories", links: categoryLinks },
            { title: "Help & Info", links: helpLinks },
            { title: "My Account", links: accountLinks },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-xs uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-nca-green transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-8 border-t border-border gap-6">
          <p className="text-xs text-muted-foreground">&copy; 2024 NCA. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-4 w-4 text-nca-green" />
              <div>
                <p className="font-semibold text-nca-charcoal">Secure Checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Headphones className="h-4 w-4 text-nca-green" />
              <div>
                <p className="font-semibold text-nca-charcoal">We&apos;re Here to Help</p>
                <p>support@nca.com · 24/7 Support</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs font-bold text-muted-foreground">
              {["Visa", "MC", "PayPal", "Apple", "Google"].map((p) => (
                <span key={p} className="px-2 py-1 border border-border rounded">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
