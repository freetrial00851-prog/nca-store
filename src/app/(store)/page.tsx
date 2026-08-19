import Link from "next/link";
import Image from "next/image";
import {
  Download,
  Sparkles,
  Shield,
  Clock,
  Users,
  Star,
  Headphones,
  Gift,
  Package,
} from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { HeroSearch } from "@/components/home/hero-search";
import { SkillLevelSection } from "@/components/home/skill-level-section";
import { getFeaturedProducts, getBestsellers, getCategories, getProducts } from "@/lib/data/products";
import { getCategoryImage, HERO_IMAGE } from "@/lib/data/product-images";
import { getSiteSetting } from "@/app/actions/site-settings";

const benefits = [
  { icon: Download, title: "Instant Download", desc: "Get your pattern immediately after purchase" },
  { icon: Sparkles, title: "Beginner Friendly", desc: "Clear instructions for all skill levels" },
  { icon: Shield, title: "Premium Quality", desc: "Tested patterns with step-by-step photos" },
  { icon: Clock, title: "Lifetime Access", desc: "Download your patterns anytime, forever" },
  { icon: Users, title: "Tested Patterns", desc: "Every pattern is tested by our maker team" },
  { icon: Headphones, title: "Video Support", desc: "Helpful video tutorials for key techniques" },
];

const testimonials = [
  { name: "Sarah J.", rating: 5, text: "The bunny lovey pattern was so easy to follow! My niece absolutely loves it.", verified: true },
  { name: "Emily R.", rating: 5, text: "Best crochet patterns I've ever purchased. The photos make everything crystal clear.", verified: true },
  { name: "Maria L.", rating: 5, text: "I've made three projects from NCA patterns already. Can't wait to try more!", verified: true },
];

export default async function HomePage() {
  const [featured, bestsellers, categories, allProducts, customHeroImage] = await Promise.all([
    getFeaturedProducts(),
    getBestsellers(),
    getCategories(),
    getProducts(),
    getSiteSetting("hero_image_url"),
  ]);
  const heroImage = customHeroImage ?? HERO_IMAGE;

  const categoryCounts = Object.fromEntries(
    categories.map((cat) => [
      cat.slug,
      allProducts.filter((p) => p.category_id === cat.id).length,
    ])
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-nca-cream to-white py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-nca-charcoal leading-tight mb-4">
                Beautiful Crochet Patterns for Every Maker
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Premium digital patterns with step-by-step instructions. Instant download, lifetime access.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {benefits.slice(0, 4).map(({ icon: Icon, title }) => (
                  <div key={title} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-8 w-8 rounded-full bg-nca-sage flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-nca-green" />
                    </div>
                    {title}
                  </div>
                ))}
              </div>

              <HeroSearch />
            </div>

            <div className="relative hidden lg:flex justify-center">
              <div className="relative w-80 h-80 xl:w-96 xl:h-96">
                <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                  <Image src={heroImage} alt="Crochet maker" fill className="object-cover" priority />
                </div>
                <div className="absolute -bottom-2 -left-4 bg-white rounded-2xl shadow-lg px-5 py-3 border border-border/60">
                  <p className="font-serif text-xl font-bold text-nca-green">70,000+</p>
                  <p className="text-xs text-muted-foreground">Happy Makers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-10 bg-white border-y border-border/60">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {[
              { icon: Users, value: "70,000+", label: "Happy Customers" },
              { icon: Package, value: "500+", label: "Premium Patterns" },
              { icon: Star, value: "4.9/5", label: "Average Rating" },
              { icon: Download, value: "Instant", label: "Digital Download" },
              { icon: Headphones, value: "24/7", label: "Customer Support" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="h-6 w-6 text-nca-green" />
                <p className="font-serif text-2xl font-bold text-nca-charcoal">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 bg-nca-cream/50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="text-center group">
                <div className="relative aspect-square rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-nca-green transition-all shadow-md mx-auto max-w-[120px]">
                  <Image
                    src={getCategoryImage(cat.slug)}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="120px"
                  />
                </div>
                <p className="text-sm font-semibold group-hover:text-nca-green transition-colors">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{categoryCounts[cat.slug] ?? 0} patterns</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold">New Arrivals</h2>
            <Link href="/new-arrivals" className="text-sm font-medium text-nca-green hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 bg-nca-cream/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold">Bestsellers</h2>
            <Link href="/bestsellers" className="text-sm font-medium text-nca-green hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <SkillLevelSection products={allProducts} />

      {/* Promo Banners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/free-patterns" className="group relative rounded-2xl overflow-hidden bg-nca-sage p-8 min-h-[200px] flex flex-col justify-end hover:shadow-lg transition-shadow">
              <Gift className="h-10 w-10 text-nca-green mb-3" />
              <h3 className="font-serif text-2xl font-bold text-nca-charcoal">Free Patterns</h3>
              <p className="text-sm text-muted-foreground mt-1">Start creating today — no cost!</p>
            </Link>
            <Link href="/bundles" className="group relative rounded-2xl overflow-hidden bg-nca-green p-8 min-h-[200px] flex flex-col justify-end hover:shadow-lg transition-shadow">
              <span className="absolute top-4 right-4 bg-nca-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                Save up to 40%
              </span>
              <Package className="h-10 w-10 text-white/80 mb-3" />
              <h3 className="font-serif text-2xl font-bold text-white">Pattern Bundles</h3>
              <p className="text-sm text-white/70 mt-1">Curated collections at a great price</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Makers Love NCA */}
      <section className="py-16 bg-nca-cream/50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">Why Makers Love NCA</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 text-center border border-border/60 hover:shadow-md transition-shadow">
                <div className="h-14 w-14 rounded-full bg-nca-sage flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-nca-green" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works + Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-8">How It Works</h2>
              <ol className="space-y-6">
                {[
                  { step: "1", title: "Browse & Choose", desc: "Find the perfect pattern from our curated collection." },
                  { step: "2", title: "Instant Checkout", desc: "Secure payment and immediate access to your PDF." },
                  { step: "3", title: "Start Creating", desc: "Download and follow our step-by-step instructions." },
                ].map(({ step, title, desc }) => (
                  <li key={step} className="flex gap-4">
                    <span className="h-10 w-10 rounded-full bg-nca-green text-white font-bold flex items-center justify-center shrink-0">
                      {step}
                    </span>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-bold mb-8">What Our Makers Say</h2>
              <div className="space-y-4">
                {testimonials.map((t) => (
                  <div key={t.name} className="bg-nca-cream/50 rounded-2xl border border-border/60 p-5">
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-nca-gold text-nca-gold" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-nca-sage flex items-center justify-center text-xs font-bold text-nca-green">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        {t.verified && <p className="text-xs text-nca-green">Verified Buyer</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
