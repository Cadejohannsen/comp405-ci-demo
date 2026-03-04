"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="border-2 border-black p-5">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal size={18} />
          <h2 className="font-heading text-lg font-bold uppercase tracking-tight">
            Filters
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={searchParams.get("priceMin") || ""}
                onBlur={(e) => updateFilter("priceMin", e.target.value)}
                className="w-full px-3 py-2 border border-black/20 text-sm focus:outline-none focus:border-black"
              />
              <input
                type="number"
                placeholder="Max"
                defaultValue={searchParams.get("priceMax") || ""}
                onBlur={(e) => updateFilter("priceMax", e.target.value)}
                className="w-full px-3 py-2 border border-black/20 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Max Mileage
            </label>
            <input
              type="number"
              placeholder="e.g. 50000"
              defaultValue={searchParams.get("maxMileage") || ""}
              onBlur={(e) => updateFilter("maxMileage", e.target.value)}
              className="w-full px-3 py-2 border border-black/20 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Sort By
            </label>
            <select
              defaultValue={searchParams.get("sort") || ""}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="w-full px-3 py-2 border border-black/20 text-sm bg-white focus:outline-none focus:border-black appearance-none cursor-pointer"
            >
              <option value="">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="mileage_asc">Mileage: Low to High</option>
              <option value="year_desc">Year: Newest</option>
              <option value="year_asc">Year: Oldest</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}
