"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const MAKES = [
  "Any Make",
  "Audi",
  "BMW",
  "Chevrolet",
  "Dodge",
  "Ford",
  "Honda",
  "Hyundai",
  "Jeep",
  "Kia",
  "Lexus",
  "Mercedes-Benz",
  "Nissan",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
];

const BODY_TYPES = [
  "Any Type",
  "Sedan",
  "SUV",
  "Truck",
  "Coupe",
  "Hatchback",
  "Convertible",
  "Van",
  "Wagon",
];

interface SearchBarProps {
  initialMake?: string;
  initialModel?: string;
  initialYearMin?: string;
  initialYearMax?: string;
  initialBodyType?: string;
}

export default function SearchBar({
  initialMake = "",
  initialModel = "",
  initialYearMin = "",
  initialYearMax = "",
  initialBodyType = "",
}: SearchBarProps) {
  const router = useRouter();
  const [make, setMake] = useState(initialMake);
  const [model, setModel] = useState(initialModel);
  const [yearMin, setYearMin] = useState(initialYearMin);
  const [yearMax, setYearMax] = useState(initialYearMax);
  const [bodyType, setBodyType] = useState(initialBodyType);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (make && make !== "Any Make") params.set("make", make);
    if (model) params.set("model", model);
    if (yearMin) params.set("yearMin", yearMin);
    if (yearMax) params.set("yearMax", yearMax);
    if (bodyType && bodyType !== "Any Type") params.set("bodyType", bodyType);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col md:flex-row gap-3">
        <select
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="flex-1 px-4 py-3 border-2 border-black bg-white text-sm font-medium uppercase tracking-wider appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {MAKES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="MODEL"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="flex-1 px-4 py-3 border-2 border-black text-sm font-medium uppercase tracking-wider placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />

        <select
          value={bodyType}
          onChange={(e) => setBodyType(e.target.value)}
          className="flex-1 px-4 py-3 border-2 border-black bg-white text-sm font-medium uppercase tracking-wider appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {BODY_TYPES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <input
            type="number"
            placeholder="YEAR MIN"
            value={yearMin}
            onChange={(e) => setYearMin(e.target.value)}
            className="w-28 px-4 py-3 border-2 border-black text-sm font-medium uppercase tracking-wider placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="number"
            placeholder="YEAR MAX"
            value={yearMax}
            onChange={(e) => setYearMax(e.target.value)}
            className="w-28 px-4 py-3 border-2 border-black text-sm font-medium uppercase tracking-wider placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
        >
          <Search size={16} />
          Search
        </button>
      </div>
    </form>
  );
}
