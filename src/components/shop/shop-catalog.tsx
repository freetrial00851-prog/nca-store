"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types/database";
import { cn } from "@/lib/utils";

const skillLevels = ["All", "Beginner", "Easy", "Intermediate", "Advanced"] as const;
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

interface Props {
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
  initialQuery?: string;
  initialCategory?: string;
  initialSkill?: string;
}

export function ShopCatalog({
  products,
  categories,
  initialQuery = "",
  initialCategory = "",
  initialSkill = "",
}: Props) {
  const categoryIdFromSlug =
    initialCategory && initialCategory !== "all"
      ? categories.find((c) => c.slug === initialCategory)?.id ?? "all"
      : "all";

  const [category, setCategory] = useState(categoryIdFromSlug);
  const [skill, setSkill] = useState(initialSkill || "All");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState(initialQuery);

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter((p) => p.category_id === category);
    }
    if (skill !== "All") {
      list = list.filter((p) => p.skill_level === skill);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
        break;
      case "price-desc":
        list.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
        break;
      case "rating":
        list.sort((a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0));
        break;
      default:
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }, [products, category, skill, sort, search]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-6">
      <aside className="lg:w-56 shrink-0">
        <div className="bg-white rounded-2xl border border-border/60 p-5 space-y-6 sticky top-24">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              Search
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pattern name..."
              className="w-full h-10 rounded-lg border border-input px-3 text-sm"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Category</p>
            <div className="space-y-1">
              <button
                onClick={() => setCategory("all")}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  category === "all" ? "bg-nca-sage text-nca-green font-medium" : "hover:bg-muted"
                )}
              >
                All Patterns
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    category === cat.id ? "bg-nca-sage text-nca-green font-medium" : "hover:bg-muted"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Skill Level</p>
            <div className="space-y-1">
              {skillLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSkill(level)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    skill === level ? "bg-nca-sage text-nca-green font-medium" : "hover:bg-muted"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{filtered.length} patterns</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-lg border border-input px-3 text-sm"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No patterns match your filters.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
