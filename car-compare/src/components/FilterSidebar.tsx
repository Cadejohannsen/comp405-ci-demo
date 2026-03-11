"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const MAKES = [
  "Acura", "Audi", "BMW", "Cadillac", "Chevrolet", "Dodge", "Ford",
  "Genesis", "GMC", "Honda", "Hyundai", "Jeep", "Kia", "Lexus",
  "Lincoln", "Mazda", "Mercedes-Benz", "Nissan", "Ram", "Subaru",
  "Tesla", "Toyota", "Volkswagen", "Volvo",
];

const BODY_TYPES = [
  "Sedan", "SUV", "Truck", "Coupe", "Hatchback",
  "Convertible", "Minivan", "Wagon",
];

const YEARS = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + 1 - i).toString());

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

  const clearFilters = () => {
    router.push("/search");
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="border-2 border-black p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} />
            <h2 className="font-heading text-lg font-bold uppercase tracking-tight">
              Filters
            </h2>
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-black transition-colors uppercase tracking-wider"
            >
              <RotateCcw size={12} />
              Clear
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Make
            </label>
            <select
              value={searchParams.get("make") || ""}
              onChange={(e) => updateFilter("make", e.target.value)}
              className="w-full px-3 py-2 border border-black/20 text-sm bg-white focus:outline-none focus:border-black appearance-none cursor-pointer"
            >
              <option value="">All Makes</option>
              {MAKES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Model
            </label>
            <input
              type="text"
              placeholder="e.g. Camry, CR-V"
              defaultValue={searchParams.get("model") || ""}
              onBlur={(e) => updateFilter("model", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateFilter("model", (e.target as HTMLInputElement).value);
              }}
              className="w-full px-3 py-2 border border-black/20 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Year
            </label>
            <div className="flex gap-2">
              <select
                value={searchParams.get("yearMin") || ""}
                onChange={(e) => updateFilter("yearMin", e.target.value)}
                className="w-full px-3 py-2 border border-black/20 text-sm bg-white focus:outline-none focus:border-black appearance-none cursor-pointer"
              >
                <option value="">From</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={searchParams.get("yearMax") || ""}
                onChange={(e) => updateFilter("yearMax", e.target.value)}
                className="w-full px-3 py-2 border border-black/20 text-sm bg-white focus:outline-none focus:border-black appearance-none cursor-pointer"
              >
                <option value="">To</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Body Type
            </label>
            <select
              value={searchParams.get("bodyType") || ""}
              onChange={(e) => updateFilter("bodyType", e.target.value)}
              className="w-full px-3 py-2 border border-black/20 text-sm bg-white focus:outline-none focus:border-black appearance-none cursor-pointer"
            >
              <option value="">All Types</option>
              {BODY_TYPES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

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
