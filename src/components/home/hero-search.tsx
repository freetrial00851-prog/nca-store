"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const popularSearches = ["Bunny", "Bag", "Cardigan", "Coaster", "Flower", "Hat"];

const categories = [
  { value: "", label: "Category" },
  { value: "amigurumi", label: "Amigurumi" },
  { value: "wearables", label: "Wearables" },
  { value: "bags-totes", label: "Bags & Totes" },
  { value: "home-decor", label: "Home Decor" },
  { value: "baby-kids", label: "Baby & Kids" },
  { value: "seasonal", label: "Seasonal" },
];

const skillLevels = [
  { value: "", label: "Skill Level" },
  { value: "Beginner", label: "Beginner" },
  { value: "Easy", label: "Easy" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [skill, setSkill] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    if (skill) params.set("skill", skill);
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-lg border border-border/60 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
        <div className="sm:col-span-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patterns..."
            className="h-11 bg-nca-cream/50 border-border"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-md border border-input bg-nca-cream/50 px-3 text-sm"
        >
          {categories.map((c) => (
            <option key={c.value || "all"} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="h-11 rounded-md border border-input bg-nca-cream/50 px-3 text-sm"
        >
          {skillLevels.map((s) => (
            <option key={s.value || "all"} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" size="lg" className="h-11 px-8 bg-nca-green hover:bg-nca-green-dark sm:ml-auto">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="text-xs text-muted-foreground">Popular:</span>
        {popularSearches.map((term) => (
          <Link
            key={term}
            href={`/shop?q=${term}`}
            className="text-xs font-medium bg-nca-sage text-nca-green px-3 py-1.5 rounded-full hover:bg-nca-green hover:text-white transition-colors"
          >
            {term}
          </Link>
        ))}
      </div>
    </form>
  );
}
