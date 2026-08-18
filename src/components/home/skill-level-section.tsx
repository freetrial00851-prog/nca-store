"use client";

import { useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types/database";
import { cn } from "@/lib/utils";

const levels = ["Beginner", "Easy", "Intermediate", "Advanced"] as const;

interface Props {
  products: Product[];
}

export function SkillLevelSection({ products }: Props) {
  const [active, setActive] = useState<string>("Beginner");

  const filtered = products.filter((p) => p.skill_level === active).slice(0, 4);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl font-bold text-center mb-10">Browse by Skill Level</h2>
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="space-y-1">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setActive(level)}
                className={cn(
                  "w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all",
                  active === level
                    ? "bg-nca-sage text-nca-green border-l-4 border-nca-green shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {(filtered.length > 0 ? filtered : products.slice(0, 4)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
